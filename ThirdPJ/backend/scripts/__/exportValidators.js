// backend/scripts/exportValidators.js
// 입력: (우선순위) env -> CLI args
//   MONGODB_URI 또는 argv[2] (예: mongodb://localhost:27017/mydb)
//   MONGODB_DB  또는 argv[3] (URI에 DB가 없을 때만 지정)
//   MONGO_COLLECTION 또는 argv[4] (선택)

const mongoose = require('mongoose');

(async () => {
  const uri = process.env.MONGODB_URI || process.argv[2] || 'mongodb://localhost:27017/test';
  const overrideDb = process.env.MONGODB_DB || process.argv[3] || '';
  const targetColl = process.env.MONGO_COLLECTION || process.argv[4] || '';

  const conn = await mongoose.createConnection(uri, { serverSelectionTimeoutMS: 10000 }).asPromise();
  const db = overrideDb ? conn.client.db(overrideDb) : conn.db;

  const filter = targetColl ? { name: targetColl } : {};
  const infos = await db.listCollections(filter, { nameOnly: false }).toArray();

  const out = {};
  for (const info of infos) {
    const schema = info?.options?.validator?.$jsonSchema || null;
    if (targetColl) {
      out[info.name] = schema; // 단일 컬렉션이면 null도 그대로
    } else if (schema) {
      out[info.name] = schema; // 전체면 validator 있는 컬렉션만
    }
  }

  console.log(JSON.stringify({ database: db.databaseName, validators: out }, null, 2));
  await conn.close();
})().catch(err => {
  console.error('[ERROR]', err && err.stack || err);
  process.exit(1);
});