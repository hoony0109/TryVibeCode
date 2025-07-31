const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { query } = require('../config/mysql'); // MySQL 쿼리 함수 임포트

// 플레이어 목록 조회
router.get('/', auth, async (req, res) => {
    const { search } = req.query;
    let sql = `
        SELECT
            ui.user_idx AS id,
            ui.user_idx AS userIndex,
            ci.char_idx AS charIndex,
            ui.nick AS nickname,
            CASE
                WHEN ui.is_logon = 1 THEN 'Active'
                ELSE 'Inactive'
            END AS status,
            -- lastIp는 userinfo 테이블에 직접적인 필드가 없으므로, char_info에서 가져오거나 별도 로깅 테이블에서 가져와야 함
            -- 여기서는 임시로 'N/A' 또는 char_info의 last_logoff_date를 활용
            'N/A' AS lastIp, 
            'None' AS banStatus -- banStatus는 별도 테이블에서 관리될 가능성 높음
        FROM
            userinfo ui
        LEFT JOIN
            char_info ci ON ui.user_idx = ci.user_idx
        WHERE 1=1
    `;
    const params = [];

    if (search) {
        sql += ` AND (ui.nick LIKE ? OR ci.nickname LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
    }

    // 중복된 user_idx를 방지하기 위해 GROUP BY 또는 DISTINCT 사용
    sql += ` GROUP BY ui.user_idx`;

    try {
        const players = await query(sql, params);
        res.json(players);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 단일 플레이어 상세 정보 조회
router.get('/:id', auth, async (req, res) => {
    const { id } = req.params; // 여기서 id는 user_idx가 될 것입니다.
    const sql = `
        SELECT
            ui.user_idx AS id,
            ui.user_idx AS userIndex,
            ci.char_idx AS charIndex,
            ui.nick AS nickname,
            CASE
                WHEN ui.is_logon = 1 THEN 'Active'
                ELSE 'Inactive'
            END AS status,
            -- lastIp, banStatus, level, class, creationDate 등은 실제 DB 스키마에 따라 매핑
            'N/A' AS lastIp,
            'None' AS banStatus,
            ci.char_exp AS level, -- char_info의 경험치를 레벨로 임시 사용
            ci.char_type AS class, -- char_info의 char_type을 클래스로 임시 사용
            ui.reg_date AS creationDate
        FROM
            userinfo ui
        LEFT JOIN
            char_info ci ON ui.user_idx = ci.user_idx
        WHERE
            ui.user_idx = ?
        LIMIT 1 -- user_idx는 고유하므로 하나만 가져옴
    `;
    
    try {
        const player = await query(sql, [id]);
        if (player.length === 0) {
            return res.status(404).json({ msg: 'Player not found' });
        }
        res.json(player[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 플레이어 상태 업데이트 (계정 잠금/해제)
router.put('/:id/status', auth, async (req, res) => {
    const { id } = req.params; // user_idx
    const { status } = req.body;

    // 'Active'는 1, 'Locked'는 0으로 매핑 (is_logon 필드에 따라)
    let isLogonValue;
    if (status === 'Active') {
        isLogonValue = 1;
    } else if (status === 'Locked') {
        isLogonValue = 0;
    } else {
        return res.status(400).json({ msg: 'Invalid status provided. Use "Active" or "Locked".' });
    }

    const sql = `
        UPDATE userinfo
        SET is_logon = ?
        WHERE user_idx = ?
    `;

    try {
        const result = await query(sql, [isLogonValue, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Player not found or status already set.' });
        }

        // 업데이트된 플레이어 정보 다시 조회하여 반환 (프론트엔드 상태 업데이트용)
        const updatedPlayerSql = `
            SELECT
                user_idx AS id,
                user_idx AS userIndex,
                nick AS nickname,
                CASE
                    WHEN is_logon = 1 THEN 'Active'
                    ELSE 'Locked'
                END AS status,
                'N/A' AS lastIp,
                'None' AS banStatus,
                -- char_info에서 가져올 수 있는 추가 정보
                (SELECT char_exp FROM char_info WHERE user_idx = ui.user_idx LIMIT 1) AS level,
                (SELECT char_type FROM char_info WHERE user_idx = ui.user_idx LIMIT 1) AS class,
                reg_date AS creationDate
            FROM
                userinfo ui
            WHERE
                user_idx = ?
        `;
        const updatedPlayer = await gameDb.query(updatedPlayerSql, [id]);

        // 실제 게임 서버에 TCP 명령을 보내는 로직은 여기에 추가될 것입니다.
        console.log(`Player ${id} status updated to ${status} in DB.`);

        res.json({ msg: `Player ${id} status updated to ${status}`, player: updatedPlayer[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;