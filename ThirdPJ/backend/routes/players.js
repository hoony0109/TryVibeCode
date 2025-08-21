const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { operationDb, gameDb, getAvailableGameDbIds } = require('../config/mysql'); // MySQL 쿼리 함수 임포트
const { logAdminAction, ComponentType, ActionType } = require('../utils/adminLogger');

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
    const { search, searchType = 'nickname', dbId, page = 1, limit = 50, all } = req.query;

    if (!dbId) {
        return res.status(400).json({ msg: 'Game database ID (dbId) is required.' });
    }
    // Return empty if no search term is provided, to avoid loading all users by default.
    if (!search) {
        return res.json({ players: [], totalPlayers: 0, searchType });
    }

    const queryGameDb = gameDb.getQuery(dbId);
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const searchTerm = search; // Use search directly, not with % wildcards

    let countSql = '';
    let sql = '';
    let params = [];
    let countParams = [];

    let players = [];
    let totalPlayers = 0;

    try {
        switch (searchType) {
            case 'userId':
                // Check if searchTerm is a valid number
                const userId = parseInt(searchTerm);
                if (isNaN(userId)) {
                    return res.json({ players: [], totalPlayers: 0, searchType });
                }
                
                countSql = `SELECT COUNT(*) as total FROM userinfo WHERE user_idx = ?`;
                sql = `SELECT user_idx, is_logon, last_login_date, last_logoff_date, reg_date, cashA, cashA_free, awarehouse_buyslot, awarehouse_gold, iap_qty, iap_amount FROM userinfo WHERE user_idx = ?`;
                params = [userId];
                countParams = [userId];
                if (all !== 'true') {
                    sql += ` LIMIT ? OFFSET ?`;
                    params.push(parseInt(limit), offset);
                }

                const totalResultUser = await queryGameDb(countSql, countParams);
                totalPlayers = totalResultUser[0]?.total || 0;

                const users = await queryGameDb(sql, params);
                players = users.map(u => ({
                    id: u.user_idx,
                    userIndex: u.user_idx,
                    status: u.is_logon === 1 ? 'Active' : 'Inactive',
                    creationDate: u.reg_date,
                    lastLoginDate: u.last_login_date,
                    lastLogoffDate: u.last_logoff_date,
                    cashA: u.cashA,
                    cashAFree: u.cashA_free,
                    awarehouseBuyslot: u.awarehouse_buyslot,
                    awarehouseGold: u.awarehouse_gold,
                    iapQty: u.iap_qty,
                    iapAmount: u.iap_amount
                }));
                break;

            case 'charId':
            case 'nickname':
            default:
                const column = searchType === 'charId' ? 'char_idx' : 'nickname';
                const operator = searchType === 'charId' ? '=' : 'LIKE';
                const searchValue = searchType === 'charId' ? parseInt(searchTerm.replace(/%/g, '')) : `%${searchTerm}%`;
                
                countSql = `SELECT COUNT(*) as total FROM char_info WHERE ${column} ${operator} ?`;
                sql = `SELECT char_idx, user_idx, nickname, char_type, char_gold, char_exp, char_exp_high, char_stat_point, guild_point, guild_donation_count, guild_donation_last_update, max_inven_size, char_mileage, battle_power, reg_date, pk_point, disassemble_option, is_logon, last_logoff_date, deleted_date FROM char_info WHERE ${column} ${operator} ?`;
                params = [searchValue];
                countParams = [searchValue];
                if (all !== 'true') {
                    sql += ` LIMIT ? OFFSET ?`;
                    params.push(parseInt(limit), offset);
                }

                const totalResultChar = await queryGameDb(countSql, countParams);
                totalPlayers = totalResultChar[0]?.total || 0;

                const chars = await queryGameDb(sql, params);
                console.log('Raw database result for first player:', chars[0]);
                console.log('Specific fields check:', {
                    char_exp: chars[0]?.char_exp,
                    char_stat_point: chars[0]?.char_stat_point,
                    char_mileage: chars[0]?.char_mileage
                });
                players = chars.map(c => ({
                    id: c.user_idx, 
                    userIndex: c.user_idx,
                    charIndex: c.char_idx,
                    nickname: c.nickname,
                    status: c.is_logon === 1 ? 'Active' : 'Inactive', 
                    level: c.char_exp, // 경험치 값을 레벨로 사용 (실제로는 경험치->레벨 계산이 필요할 수 있음)
                    class: c.char_type,
                    creationDate: c.reg_date,
                    charGold: c.char_gold,
                    charExp: c.char_exp, // 원본 경험치 값 추가
                    charExpHigh: c.char_exp_high,
                    charStatPoint: c.char_stat_point,
                    guildPoint: c.guild_point,
                    guildDonationCount: c.guild_donation_count,
                    guildDonationLastUpdate: c.guild_donation_last_update,
                    maxInvenSize: c.max_inven_size,
                    charMileage: c.char_mileage,
                    battlePower: c.battle_power,
                    pkPoint: c.pk_point,
                    disassembleOption: c.disassemble_option,
                    lastLogoffDate: c.last_logoff_date,
                    deletedDate: c.deleted_date
                }));
                console.log('Mapped first player data:', players[0]);
                break;
        }

        console.log('Final players data to be sent:', JSON.stringify(players, null, 2));
        res.json({ players, totalPlayers, searchType });

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
        const updatedPlayer = await queryGameDb(updatedPlayerSql, [id]);

        // 실제 게임 서버에 TCP 명령을 보내는 로직은 여기에 추가될 것입니다。
        console.log(`Player ${id} status updated to ${status} in DB.`);

        if (updatedPlayer.length === 0) {
            return res.status(404).json({ msg: 'Could not retrieve updated player details.' });
        }

        // Log the action
        logAdminAction(
            req.admin.id,
            ComponentType.PLAYER_MANAGEMENT,
            ActionType.UPDATE_PLAYER_STATUS,
            { targetUserId: id, newStatus: status, dbId },
            req.ip
        );

        res.json({ msg: `Player ${id} status updated to ${status}`, player: updatedPlayer[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;