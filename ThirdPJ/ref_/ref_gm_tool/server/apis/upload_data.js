const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);

const fileUpload = require('../libs/fileUpload');
const multer = require('multer');

const dataManger = require('../libs/dataManager');

// api
// : datafile 올리기
module.exports = function(app) {
    app.route('/api/upload_data').post(update); 
}

var update =  function(req,res) {    
    console.log('/api/upload_data');
    // console.log(`get request file:${req.file.originalname} (save:${req.file.filename} size:${req.file.size})`);
    // logger.info(`get request file:${req.file.originalname} (save:${req.file.filename} size:${req.file.size})`);
    
    // 파일 업로드
    fileUpload(req, res, function(err) {

        if (err instanceof multer.MulterError) {
            console.log(`MulterError1 : ${err}`);
            return res.json({result:err});
        } else if (err) {
            console.log(`MulterError2 : ${err}`);
            return res.json({result:err});
        }

         // 데이터 리로드
        logger.info(`start reload file : (${req.file.originalname})`);
        let name = req.file.originalname.replace(".xml", '');
        dataManger.reloadAllData(name).then(data => {
            logger.info(`data reloaded(${name})`);
            return;
        }).catch(err =>{
            logger.error(`data reload fail(${name})`);
            return;
        });

        console.log(`MulterReturn : success`);
        return res.json({result:1,filename:req.file.originalname});
    });

}
