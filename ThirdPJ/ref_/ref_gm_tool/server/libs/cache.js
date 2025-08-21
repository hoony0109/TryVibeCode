const config = require('../../config');
const logger = require('./logger')(config.log.dir,config.log.name,config.log.level);

const nodeCache = require('node-cache');
var cache = null;

module.exports.create = function() {
    if (cache) {
        logger.error('already use cache!');
        return;
    }
    cache = new nodeCache();
    logger.info('success caching initialize.');
}

module.exports.instance = function() {
    return cache;
}