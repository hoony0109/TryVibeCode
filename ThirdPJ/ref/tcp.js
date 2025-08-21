const config = require('../../config');
const logger = require('../libs/logger')(config.log.dir,config.log.name,config.log.level);

const net = require('net');
const e = require('cors');

function request(packet,recvCallback){

	var client = new net.Socket();

	client.setTimeout(config.tcp.timeout);
	
	client.connect(config.tcp.port, config.tcp.ip, function() {
		logger.debug('socket send data (length : ' + packet.length + ')');
		client.write(packet);
	});

	client.on('data', function(data) {
		//logger.debug('socket recv size : ' + data.length + ' data : ' + data.toString());
		logger.debug(`socket recv size : ${data.length}`);
		let length = data.readUInt32LE(0);
		let cmd = data.readUInt32LE(4);
		let request = 1;
		let result = 0;
		let state = 0;
		//logger.debug('response length : '+ length +' cmd : ' + cmd + ' result : ' + result);
		logger.debug(`response length : ${length} cmd : ${cmd} result : ${result}`);

		// ip block
		if(cmd === 10002){	
			request = data.readBigUInt64LE(8);
			result = data.readUInt16LE(16);
			recvCallback(result);
		}
		// release ip block
		else if(cmd === 10004){
			request = data.readBigUInt64LE(8);
			result = data.readUInt16LE(16);
			recvCallback(result);
		}
		// account logoff
		else if(cmd === 10012){
			request = data.readBigUInt64LE(8);
			result = data.readUInt16LE(16);
			recvCallback(result);
		}
		// account block
		else if(cmd === 10022){
			request = data.readBigUInt64LE(8);
			result = data.readUInt16LE(16);
			recvCallback(result);
		}
		// release account block
		else if(cmd === 10024){
			request = data.readBigUInt64LE(8);
			result = data.readUInt16LE(16);
			recvCallback(result);
		}
		// user chat block
		else if(cmd === 10032){
			request = data.readBigUInt64LE(8);
			result = data.readUInt16LE(16);
			recvCallback(result);
		}
		// release user chat block
		else if(cmd === 10034){
			request = data.readBigUInt64LE(8);
			result = data.readUInt16LE(16);
			recvCallback(result);
		}
		// notice 
		else if(cmd === 10042){
			result = data.readUInt16LE(8);
			recvCallback(result);
		}
		// check server state 
		else if(cmd === 10052){
			result = data.readUInt16LE(8);
			let starttime = data.readBigUInt64LE(10);
			let endtime = data.readBigUInt64LE(18);
			logger.debug('check server state => starttime : '+ starttime +' endtime : ' + endtime);
			recvCallback(result,starttime,endtime);
		}
		//  change server state 
		else if(cmd === 10054){
			result = data.readUInt16LE(8);
			let starttime = data.readBigUInt64LE(10);
			let endtime = data.readBigUInt64LE(18);
			logger.debug('change server state => starttime : '+ starttime +' endtime : ' + endtime);
			recvCallback(result,starttime,endtime);
		}
		// check client version 
		else if(cmd === 10062){
			result = data.readUInt16LE(8);
			let clientVersionLength = data.readInt16LE(10);
			let clientVersion =  data.toString('utf16le',12);
			recvCallback(result,clientVersion);
		}
		// change client version 
		else if(cmd === 10064){
			result = data.readUInt16LE(8);
			let clientVersionLength = data.readInt16LE(10);
			let clientVersion =  data.toString('utf16le',12);
			recvCallback(result,clientVersion);
		}
		// concurrent users
		else if(cmd === 10102){
			result = data.readUInt16LE(8);
			let concurrentUsersLength = data.readInt16LE(10);
			let concurrentUsers = data.toString('utf16le',12);
			recvCallback(result,concurrentUsers);
		}		
		else{
			logger.error('recv unknown packet');
		}
		client.destroy();
	});

	client.on('end', function() {
		logger.debug('socket disconnected');
	});

	client.on('error', function(err) {
		logger.error('socket error : ', err);
	});

	client.on('timeout', function() {
		logger.error('socket timed out');
	});

	client.on('close', function() {
		logger.debug('socket closed');
	});
}	

module.exports.sendNotice = function(worldIdx,msg,recvCallback){
	// content
	let worldIdx_ = Buffer.alloc(4);
	worldIdx_.writeUInt32LE(Number(worldIdx),0);
	let msgCnt_ = Buffer.alloc(2);
	msgCnt_.writeInt16LE(msg.length+1);
	let msg_ =  Buffer.from(msg,'utf16le');
	let msgEnd_ =  Buffer.alloc(2,0x00);

	// legnth = header_length(8) + content_length
	let length = 8 + 4 + 2 + msg_.length + 2;

	// header
	let length_ = Buffer.alloc(4);
	length_.writeUInt32LE(length,0);
	let cmd_ = Buffer.alloc(4);
	cmd_.writeUInt32LE(10041,0);
	
	// packet
	let packet = Buffer.concat([length_,cmd_,worldIdx_,msgCnt_,msg_,msgEnd_],length);
	
	logger.debug('tcp sendNotice(cmd:10041) => msg : ' + msg);
	request(packet,recvCallback);
	
}

module.exports.accountLogoff = function(acountIdx,recvCallback){
	// content
	let request_ = Buffer.alloc(8);
	request_.writeBigUInt64LE(0n,0);
	let acountIdx_ = Buffer.alloc(8);
	acountIdx_.writeBigUInt64LE(BigInt(acountIdx),0);

	// legnth = header_length(8) + content_length
	let length = 8 + 8 + 8;

	// header
	let length_ = Buffer.alloc(4);
	length_.writeUInt32LE(length,0);
	let cmd_ = Buffer.alloc(4);
	cmd_.writeUInt32LE(Number(10011),0);
	
	// packet
	let packet = Buffer.concat([length_,cmd_,request_,acountIdx_],length);
	
	logger.debug('tcp accountLogoff(cmd:10011) => acountIdx : ' + BigInt(acountIdx));
	request(packet,recvCallback);
}

module.exports.accountBlock = function(acountIdx,blockHours,recvCallback){
	// content
	let request_ = Buffer.alloc(8);
	request_.writeBigUInt64LE(0n,0);
	let acountIdx_ = Buffer.alloc(8);
	acountIdx_.writeBigUInt64LE(BigInt(acountIdx),0);
	let reason_ = Buffer.alloc(4);
	reason_.writeInt32LE(0,0);
	let blockHours_ = Buffer.alloc(4);
	blockHours_.writeUInt32LE(Number(blockHours),0);

	// legnth = header_length(8) + content_length
	let length = 8 + 8 + 8 + 4 + 4;

	// header
	let length_ = Buffer.alloc(4);
	length_.writeUInt32LE(length,0);
	let cmd_ = Buffer.alloc(4);
	cmd_.writeUInt32LE(10021,0);
	
	// packet
	let packet = Buffer.concat([length_,cmd_,request_,acountIdx_,reason_,blockHours_],length);

	logger.debug('tcp accountBlock(cmd:10021) => acountIdx : ' + acountIdx);
	request(packet,recvCallback);
}

module.exports.releaseAcountBlock = function(acountIdx,recvCallback){
	// content
	let request_ = Buffer.alloc(8);
	request_.writeBigUInt64LE(0n,0);
	let acountIdx_ = Buffer.alloc(8);
	acountIdx_.writeBigUInt64LE(BigInt(acountIdx),0);

	// legnth = header_length(8) + content_length
	let length = 8 + 8 + 8;

	// header
	let length_ = Buffer.alloc(4);
	length_.writeUInt32LE(length,0);
	let cmd_ = Buffer.alloc(4);
	cmd_.writeUInt32LE(10023,0);
	
	// packet
	let packet = Buffer.concat([length_,cmd_,request_,acountIdx_],length);

	logger.debug('tcp releaseAcountBlock(cmd:10023) => acountIdx : ' + acountIdx);
	request(packet,recvCallback);
}

module.exports.userChatBlock = function(worldIdx,userIdx,blockMins,recvCallback){					
	// content
	let request_ = Buffer.alloc(8);
	request_.writeBigUInt64LE(0n,0);
	let worldIdx_ = Buffer.alloc(4);
	worldIdx_.writeUInt32LE(worldIdx,0);
	let userIdx_ = Buffer.alloc(8);
	userIdx_.writeBigUInt64LE(BigInt(userIdx),0);
	let blockMins_ = Buffer.alloc(4);
	blockMins_.writeUInt32LE(Number(blockMins),0);

	// legnth = header_length(8) + content_length
	let length = 8 + 8 + 4 + 8 + 4;

	// header
	let length_ = Buffer.alloc(4);
	length_.writeUInt32LE(length,0);
	let cmd_ = Buffer.alloc(4);
	cmd_.writeUInt32LE(10031,0);
	
	// packet
	let packet = Buffer.concat([length_,cmd_,request_,worldIdx_,userIdx_,blockMins_],length);

	logger.debug('tcp userChatBlock(cmd:10031) => worldIdx : ' + worldIdx + ' userIdx : ' + userIdx);
	request(packet,recvCallback);
}

module.exports.releaseUserChatBlock = function(worldIdx,userIdx,recvCallback){
	// content
	let request_ = Buffer.alloc(8);
	request_.writeBigUInt64LE(0n,0);
	let worldIdx_ = Buffer.alloc(4);
	worldIdx_.writeUInt32LE(worldIdx,0);
	let userIdx_ = Buffer.alloc(8);
	userIdx_.writeBigUInt64LE(BigInt(userIdx),0);
	
	// legnth = header_length(8) + content_length
	let length = 8 + 8 + 4 + 8;

	// header
	let length_ = Buffer.alloc(4);
	length_.writeUInt32LE(length,0);
	let cmd_ = Buffer.alloc(4);
	cmd_.writeUInt32LE(10033,0);
	
	// packet
	let packet = Buffer.concat([length_,cmd_,request_,worldIdx_,userIdx_],length);

	logger.debug('tcp releaseUserChatBlock(cmd:10033) => worldIdx : ' + worldIdx + ' userIdx : ' + userIdx);
	request(packet,recvCallback);
}

module.exports.ipBlock = function(ip,blockHours,recvCallback){
	// content
	let request_ = Buffer.alloc(8);
	request_.writeBigUInt64LE(0n,0);
	let reason_ = Buffer.alloc(4);
	reason_.writeInt32LE(0,0);
	let blockHours_ = Buffer.alloc(4);
	blockHours_.writeUInt32LE(Number(blockHours),0);
	var ip_ = new Buffer.from(ip,0.16);

	// legnth = header_length(8) + content_length
	let length = 8 + 8 + 4 + 4 + 16;

	// header
	let length_ = Buffer.alloc(4);
	length_.writeUInt32LE(length,0);
	let cmd_ = Buffer.alloc(4);
	cmd_.writeUInt32LE(10001,0);
	
	// packet
	let packet = Buffer.concat([length_,cmd_,request_,reason_,blockHours_,ip_],length);
	
	logger.debug('tcp ipBlock(cmd:10001) => ip : ' + ip);
	request(packet,recvCallback);
}

module.exports.releaseIpBlock = function(ip,recvCallback){
	// content
	let request_ = Buffer.alloc(8);
	request_.writeBigUInt64LE(0n,0);
	var ip_ = new Buffer.from(ip,0,16);

	// legnth = header_length(8) + content_length
	let length = 8 + 8 + 16;

	// header
	let length_ = Buffer.alloc(4);
	length_.writeUInt32LE(length,0);
	let cmd_ = Buffer.alloc(4);
	cmd_.writeUInt32LE(10003,0);
	
	// packet
	let packet = Buffer.concat([length_,cmd_,request_,ip_],length);

	logger.debug('tcp releaseIpBlock(cmd:10003) => ip : ' + ip);
	request(packet,recvCallback);
}

module.exports.checkServerState = function(recvCallback){
	
	// legnth = header_length(8)
	let length = 8;

	// header
	let length_ = Buffer.alloc(4);
	length_.writeUInt32LE(length,0);
	let cmd_ = Buffer.alloc(4);
	cmd_.writeUInt32LE(10051,0);
	
	// packet
	let packet = Buffer.concat([length_,cmd_],length);
	
	logger.debug('tcp checkServerState(cmd:10051)');
	request(packet,recvCallback);
}

module.exports.changeServerState = function(starttime,endtime,recvCallback){
	// content
	let starttime_ = Buffer.alloc(8);
	starttime_.writeBigUInt64LE(BigInt(starttime),0);
	let endtime_ = Buffer.alloc(8);
	endtime_.writeBigUInt64LE(BigInt(endtime),0);

	// legnth = header_length(8) + content_length
	let length = 8 + 8 + 8;

	// header
	let length_ = Buffer.alloc(4);
	length_.writeUInt32LE(length,0);
	let cmd_ = Buffer.alloc(4);
	cmd_.writeUInt32LE(10053,0);
	
	// packet
	let packet = Buffer.concat([length_,cmd_,starttime_,endtime_],length);
	
	logger.debug('tcp changeServerState(cmd:10053) => starttime : ' + starttime + ' endtime : ' + endtime);
	request(packet,recvCallback);
}

module.exports.checkClientVersion = function(recvCallback){
	
	// legnth = header_length(8)
	let length = 8;

	// header
	let length_ = Buffer.alloc(4);
	length_.writeUInt32LE(length,0);
	let cmd_ = Buffer.alloc(4);
	cmd_.writeUInt32LE(10061,0);
	
	// packet
	let packet = Buffer.concat([length_,cmd_],length);
	
	logger.debug('tcp checkClientVersion(cmd:10061)');
	request(packet,recvCallback);
}

module.exports.changeClientVersion = function(clientVersion,recvCallback){
	// content
	let clientVersionLen_ = Buffer.alloc(2);
	clientVersionLen_.writeInt16LE(clientVersion.length+1);
	let clientVersion_ =  Buffer.from(clientVersion,'utf16le');
	let clientVersionEnd_ =  Buffer.alloc(2,0x00);

	// legnth = header_length(8) + content_length
	let length = 8 + 8 + 2 + clientVersion.length + 1 + 2;

	// header
	let length_ = Buffer.alloc(4);
	length_.writeUInt32LE(length,0);
	let cmd_ = Buffer.alloc(4);
	cmd_.writeUInt32LE(10063,0);
	
	// packet
	let packet = Buffer.concat([length_,cmd_,clientVersionLen_,clientVersion_,clientVersionEnd_],length);
	
	logger.debug('tcp changeClentVersion(cmd:10063) => clientVersion : ' + clientVersion);
	request(packet,recvCallback);
}

module.exports.getConcurrentUsers = function(recvCallback){
	// legnth = header_length(8)
	let length = 8;

	// header
	let length_ = Buffer.alloc(4);
	length_.writeUInt32LE(length,0);
	let cmd_ = Buffer.alloc(4);
	cmd_.writeUInt32LE(10101,0);
	
	// packet
	let packet = Buffer.concat([length_,cmd_],length);
	
	logger.debug('tcp getConcurrentUsers(cmd:10101)');
	request(packet,recvCallback);
}