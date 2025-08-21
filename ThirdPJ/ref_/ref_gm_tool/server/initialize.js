
const dataManager = require('./libs/dataManager');

const api_world_name = require('./apis/world_name');
const api_item_name = require('./apis/item_name');

const api_login = require('./apis/login');
const api_account = require('./apis/account');
const api_user = require('./apis/user');
const api_user_title = require('./apis/user_title');
const api_user_post = require('./apis/user_post');
const api_user_iap = require('./apis/user_iap');
const api_user_chat_block = require('./apis/user_chat_block');
const api_user_combat = require('./apis/user_combat');
const api_user_combat_rivals = require('./apis/user_combat_rivals');

const api_character = require('./apis/character');
const api_character_bag = require('./apis/character_bag');
const api_character_equip = require('./apis/character_equip');
const api_character_item = require('./apis/character_item');
const api_character_skill = require('./apis/character_skill');
const api_character_skillbook = require('./apis/character_skillbook');
const api_character_beads = require('./apis/character_beads');
const api_character_vehicle = require('./apis/character_vehicle');
const api_character_vehicle_accessory = require('./apis/character_vehicle_accessory');
const api_character_quest = require('./apis/character_quest');
const api_character_quest_clear = require('./apis/character_quest_clear');
const api_character_quest_scroll = require('./apis/character_quest_scroll');
const api_character_stage_seal = require('./apis/character_stage_seal');
const api_character_stage_growth = require('./apis/character_stage_growth');

const api_post = require('./apis/post');
const api_notice = require('./apis/notice');
const api_ip_block = require('./apis/ip_block');
const api_server_state = require('./apis/server_state');
const api_client_version = require('./apis/client_version');
const api_send_items = require('./apis/send_items');
const api_coupon = require('./apis/coupon');
const api_complaint = require('./apis/complaint');
const api_qianhuan = require('./apis/qianhuan');

const api_nru = require('./apis/nru');
const api_dau = require('./apis/dau');
const api_in_app = require('./apis/in_app');
const api_concurrent_users = require('./apis/concurrent_users');

const api_log_manager = require('./apis/log_manager');
const api_log_user_list = require('./apis/log_user_list');
const api_log_user = require('./apis/log_user');

const api_manager = require('./apis/manager');

const api_upload_data = require('./apis/upload_data');


const api_game_complaint = require('./apis/game/api_game_complaint');


module.exports = function(app) {

    // xml에서 고정 resource를 읽어들인다
    dataManager.getAllData('Character_Name').then(data => {});
    dataManager.getAllData('Wealth_Name').then(data => {});
    dataManager.getAllData('Item_Name').then(data => {});
    dataManager.getAllData('Skill_Name').then(data => {});
    dataManager.getAllData('Title_Name').then(data => {});
    dataManager.getAllData('Rune_Name').then(data => {});
    dataManager.getAllData('Level_Exp').then(data => {});
    dataManager.getAllData('Purchase_id').then(data => {});
    
    // routing
    app.get('/', (req, res) => res.json({result:'success'}));
    app.get('/api', (req, res) => res.json({result:'success'}));
    

    api_world_name(app);
    api_item_name(app);

    api_login(app);
    api_account(app);
    api_user(app);
    api_user_title(app);
    api_user_post(app);
    api_user_iap(app);
    api_user_chat_block(app);
    api_user_combat(app);
    api_user_combat_rivals(app);

    api_character(app);
    api_character_bag(app);
    api_character_equip(app);
    api_character_item(app);
    api_character_skill(app);
    api_character_skillbook(app);
    api_character_beads(app);
    api_character_vehicle(app);
    api_character_vehicle_accessory(app);
    api_character_quest(app);
    api_character_quest_clear(app);
    api_character_quest_scroll(app);
    api_character_stage_seal(app);
    api_character_stage_growth(app);

    api_post(app);
    api_notice(app);
    api_ip_block(app);
    api_server_state(app);
    api_client_version(app);
    api_send_items(app);
    api_coupon(app);
    api_complaint(app);
    api_qianhuan(app);

    api_nru(app);
    api_dau(app);
    api_in_app(app);
    api_concurrent_users(app);

    api_log_manager(app);
    api_log_user_list(app);
    api_log_user(app);

    api_manager(app);

    api_upload_data(app);

    api_game_complaint(app);
}