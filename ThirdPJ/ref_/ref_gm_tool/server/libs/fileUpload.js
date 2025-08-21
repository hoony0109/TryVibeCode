const config = require('../../config');
const logger = require('./logger')(config.log.dir,config.log.name,config.log.level);

const multer = require('multer');
const moment = require('moment');

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        // 파일이 저장되는 경로
        //callback(null, '../data');
        callback(null, './server/data');
    },
    filename : function(req, file, callback) {
        // 저장되는 파일명
        //cb(null, moment().format('YYYYMMDDHHmmss') + "_" + file.originalname);
        console.log(`ori : ${file.originalname}`);
        //console.log(`save : ${file.filename}`);
//        console.log(`size : ${file.size}`);

        callback(null, file.originalname);
    }
});

// 하나의 파일 업로드
const upload = multer({storage: storage}).single("file");

/*
const upload = multer({ storage });

app.post("/upload/single", upload.single("file"), (req, res) => {
  res.json({ file: req.file });
});
app.post("/upload/multiple", upload.array("file", 4), (req, res) => {
  res.json({ files: req.files });
});
*/

module.exports = upload;

