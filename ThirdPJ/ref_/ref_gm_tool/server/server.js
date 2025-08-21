const config = require('../config');
const logger = require('./libs/logger')(config.log.dir,config.log.name,config.log.level);

// Express에서 node-cache 모듈 사용
const cache = require('./libs/cache');
cache.create();

const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

// express에 내장되어 있슴, Express v4.16.0 기준
// app.use(express.json());
/*
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
*/

const initialize = require('./initialize');
initialize(app);

app.listen(config.port);

logger.info('start server');

//const mongo = require('./models/mongo');
//mongo.getCollections(1,202008);
//mongo.findDocument(1,202008,'char_battlepower');