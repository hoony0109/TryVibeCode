const winston = require('winston');
require('winston-daily-rotate-file');
require('date-utils');

// logLevel : debug, info, error 
module.exports = function create(logFolder='./log', logName ='log', logLevel='debug') {
    return winston.createLogger({
        level: logLevel, 
        transports: [
            // 파일저장
            new winston.transports.DailyRotateFile({
                // 로그파일이름
                filename : `${logFolder}/${logName}.log`, 
                // 압축여부
                zippedArchive: true, 
                format: winston.format.printf(
                    info => `${new Date().toFormat('YYYY-MM-DD HH24:MI:SS')} [${info.level.toUpperCase()}] - ${info.message}`)
            }),
            // 콘솔 출력
            new winston.transports.Console({
                format: winston.format.printf(
                    info => `${new Date().toFormat('YYYY-MM-DD HH24:MI:SS')} [${info.level.toUpperCase()}] - ${info.message}`)
            })
        ]
    });
}