const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { operationDb, gameDb, getAvailableGameDbIds } = require('../config/mysql'); // MySQL 쿼리 함수 임포트

// 사용 가능한 게임 DB ID 목록 조회
router.get('/db-ids', auth, (req, res) => {
    try {
        const dbIds = getAvailableGameDbIds();
        res.json(dbIds);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 플레이어 목록 조회
router.get('/', auth, async (req, res) => {
    const { search, dbId, page = 1, limit = 50, all } = req.query; // all 파라미터 추가

    if (!dbId) {
        return res.status(400).json({ msg: 'Game database ID (dbId) is required.' });
    }

    const queryGameDb = gameDb.getQuery(dbId);

    const offset = (parseInt(page) - 1) * parseInt(limit);

    let countSql = `SELECT COUNT(DISTINCT ui.user_idx) AS total FROM userinfo ui`;
    let sql = `
        SELECT
            ui.user_idx AS id,
            ui.user_idx AS userIndex,
            ui.base_char_idx AS charIndex,
            ui.nick AS nickname,
            CASE
                WHEN ui.is_logon = 1 THEN 'Active'
                ELSE 'Inactive'
            END AS status,
            'N/A' AS lastIp, 
            'None' AS banStatus
        FROM
            userinfo ui
        WHERE 1=1
    `;
    const params = [];
    const countParams = [];

    if (search) {
        sql += ` AND (ui.nick LIKE ? OR ui.base_char_idx LIKE ?)`;
        countSql += ` WHERE (ui.nick LIKE ? OR ui.base_char_idx LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
        countParams.push(`%${search}%`, `%${search}%`);
    }

    if (all !== 'true') { // all 파라미터가 'true'가 아니면 페이지네이션 적용
        sql += ` GROUP BY ui.user_idx LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), offset);
    } else {
        sql += ` GROUP BY ui.user_idx`; // all 파라미터가 'true'이면 모든 데이터 가져옴
    }

    try {
        const totalResult = await queryGameDb(countSql, countParams);
        const totalPlayers = totalResult[0].total;

        const players = await queryGameDb(sql, params);
        res.json({ players, totalPlayers });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 단일 플레이어 상세 정보 조회
router.get('/:id', auth, async (req, res) => {
    const { id } = req.params; // 여기서 id는 user_idx가 될 것입니다。
    const { dbId } = req.query; // dbId 추가

    if (!dbId) {
        return res.status(400).json({ msg: 'Game database ID (dbId) is required.' });
    }

    const queryGameDb = gameDb.getQuery(dbId); // 특정 게임 DB 쿼리 함수 가져오기

    const sql = `
        SELECT
            ui.user_idx AS id,
            ui.user_idx AS userIndex,
            ui.base_char_idx AS charIndex,
            ui.nick AS nickname,
            CASE
                WHEN ui.is_logon = 1 THEN 'Active'
                ELSE 'Inactive'
            END AS status,
            'N/A' AS lastIp,
            'None' AS banStatus,
            (SELECT char_exp FROM char_info WHERE char_idx = ui.base_char_idx LIMIT 1) AS level, -- Use base_char_idx
            (SELECT char_type FROM char_info WHERE char_idx = ui.base_char_idx LIMIT 1) AS class, -- Use base_char_idx
            ui.reg_date AS creationDate
        FROM
            userinfo ui
        WHERE
            ui.user_idx = ?
        LIMIT 1
    `;
    
    try {
        const player = await queryGameDb(sql, [id]);
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
    const { status, dbId } = req.body; // dbId 추가

    if (!dbId) {
        return res.status(400).json({ msg: 'Game database ID (dbId) is required.' });
    }

    const queryGameDb = gameDb.getQuery(dbId); // 특정 게임 DB 쿼리 함수 가져오기

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
        const result = await queryGameDb(sql, [isLogonValue, id]);

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
                (SELECT char_exp FROM char_info WHERE char_idx = ui.base_char_idx LIMIT 1) AS level,
                (SELECT char_type FROM char_info WHERE char_idx = ui.base_char_idx LIMIT 1) AS class,
                reg_date AS creationDate
            FROM
                userinfo ui
            WHERE
                user_idx = ?
        `;
        const updatedPlayer = await gameDb.query(updatedPlayerSql, [id]);

        // 실제 게임 서버에 TCP 명령을 보내는 로직은 여기에 추가될 것입니다。
        console.log(`Player ${id} status updated to ${status} in DB.`);

        res.json({ msg: `Player ${id} status updated to ${status}`, player: updatedPlayer[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;