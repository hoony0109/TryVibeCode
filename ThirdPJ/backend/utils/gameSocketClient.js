
const net = require('net');
const mysql = require('mysql2/promise');

class GameSocketClient {
    constructor() {
        this.host = null;
        this.port = null;
        this.client = null;
        this.isConnected = false;
        this.requestQueue = [];
        this.isProcessing = false;
    }

    async initialize() {
        let connection;
        try {
            // Use a direct connection to avoid pool issues
            connection = await mysql.createConnection({
                host: process.env.SETDB_HOST,
                user: process.env.SETDB_USER,
                password: process.env.SETDB_PASSWORD,
                database: process.env.SETDB_NAME
            });

            const [rows] = await connection.execute(
                'SELECT address_pri_acceptor_ip, port_acceptor_admin FROM setting_global_logingatemanage LIMIT 1'
            );

            if (rows && rows.length > 0) {
                this.host = rows[0].address_pri_acceptor_ip;
                this.port = rows[0].port_acceptor_admin;
                console.log(`[GameSocket] Initialized with server address: ${this.host}:${this.port}`);
                this.connect();
            } else {
                throw new Error('Failed to get game server address from DB.');
            }
        } catch (error) {
            console.error('[GameSocket] Initialization failed:', error);
            setTimeout(() => this.initialize(), 10000); // Retry
        } finally {
            if (connection) await connection.end();
        }
    }

    connect() {
        if (this.isConnected) {
            return;
        }

        this.client = new net.Socket();
        this.client.setEncoding('utf8');

        this.client.connect(this.port, this.host, () => {
            console.log(`[GameSocket] Connected to ${this.host}:${this.port}`);
            this.isConnected = true;
            this.processQueue();
        });

        this.client.on('data', (data) => {
            // TODO: Implement proper packet parsing
            console.log('[GameSocket] Data received:', data);
        });

        this.client.on('close', () => {
            console.log('[GameSocket] Connection closed.');
            this.isConnected = false;
            // Implement reconnection logic
            setTimeout(() => this.connect(), 5000);
        });

        this.client.on('error', (err) => {
            console.error('[GameSocket] Connection error:', err);
            this.isConnected = false;
            this.client.destroy();
        });
    }

    send(messageId, body) {
        return new Promise((resolve, reject) => {
            if (!this.isConnected) {
                // If not connected, reject immediately instead of waiting forever.
                return reject(new Error('Game server is not connected.'));
            }
            const request = { messageId, body, resolve, reject };
            this.requestQueue.push(request);
            this.processQueue(); // No need to check isConnected again here
        });
    }

    processQueue() {
        if (this.isProcessing || this.requestQueue.length === 0) {
            return;
        }

        this.isProcessing = true;
        const { messageId, body, resolve } = this.requestQueue.shift();

        let packetBody;
        let bodySize;

        if (messageId === 10041) { // Notice message
            bodySize = 4; // Only noticeId (uint32_t)
            packetBody = Buffer.alloc(bodySize);

            let offset = 0;
            packetBody.writeUInt32LE(body.noticeId, offset); // noticeId (4 bytes)
        } else if (messageId === 11081) { // Content Access Control message
            bodySize = 4 + 4 + 1; // WorldID (4) + contentId (4) + isEnabled (1)
            packetBody = Buffer.alloc(bodySize);

            let offset = 0;
            packetBody.writeUInt32LE(body.WorldID, offset); // WorldID (4 bytes)
            offset += 4;
            packetBody.writeUInt32LE(body.contentId, offset); // contentId (4 bytes)
            offset += 4;
            packetBody.writeUInt8(body.isEnabled ? 1 : 0, offset); // isEnabled (1 byte, 0 or 1)
        } else if (messageId === 10053) { // Change Server State
            bodySize = 8 + 8; // starttime (BigInt) + endtime (BigInt)
            packetBody = Buffer.alloc(bodySize);

            let offset = 0;
            packetBody.writeBigUInt64LE(body.starttime, offset);
            offset += 8;
            packetBody.writeBigUInt64LE(body.endtime, offset);
        } else if (messageId === 10001) { // IP Block
            const ipBuffer = Buffer.alloc(16); // CHAR strIPAddress[16]
            Buffer.from(body.strIPAddress, 'ascii').copy(ipBuffer); // Assuming ASCII for IP

            bodySize = 8 + 4 + 4 + 16; // nRequestID (BigInt) + nReason (int) + nBlockHourTime (uint32) + strIPAddress[16]
            packetBody = Buffer.alloc(bodySize);

            let offset = 0;
            packetBody.writeBigUInt64LE(body.nRequestID, offset);
            offset += 8;
            packetBody.writeInt32LE(body.nReason, offset);
            offset += 4;
            packetBody.writeUInt32LE(body.nBlockHourTime, offset);
            offset += 4;
            ipBuffer.copy(packetBody, offset);
        } else if (messageId === 10003) { // Release IP Block
            const ipBuffer = Buffer.alloc(16); // CHAR strIPAddress[16]
            Buffer.from(body.strIPAddress, 'ascii').copy(ipBuffer); // Assuming ASCII for IP

            bodySize = 8 + 16; // nRequestID (BigInt) + strIPAddress[16]
            packetBody = Buffer.alloc(bodySize);

            let offset = 0;
            packetBody.writeBigUInt64LE(body.nRequestID, offset);
            offset += 8;
            ipBuffer.copy(packetBody, offset);
        } else {
            console.error(`[GameSocket] Unknown messageId: ${messageId}`);
            this.isProcessing = false;
            this.processQueue();
            return;
        }

        const header = Buffer.alloc(8);
        header.writeUInt32LE(8 + bodySize, 0); // Total packet length (header + body)
        header.writeUInt32LE(messageId, 4); // Message ID

        const packet = Buffer.concat([header, packetBody]);

        this.client.write(packet, 'binary', () => {
            console.log(`[GameSocket] Sent packet with messageId: ${messageId}`);
            // For now, resolve immediately. Later, this will be handled by the 'data' event handler.
            resolve({ status: 'success', message: 'Packet sent' }); 
            this.isProcessing = false;
            this.processQueue();
        });
    }

    async ping() {
        try {
            console.log('[GameSocket] Sending ping (MessageID: 11079)');
            const response = await this.send(11079, {});
            console.log('[GameSocket] Ping response:', response);
            return response;
        } catch (error) {
            console.error('[GameSocket] Ping failed:', error);
            return { status: 'error', message: error.message };
        }
    }
}

const gameSocketClient = new GameSocketClient();
// The initialize function will be called from the main application file (e.g., index.js)
// to ensure the database is ready.

module.exports = gameSocketClient;
