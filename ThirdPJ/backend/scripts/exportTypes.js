// backend/scripts/exportTypes.js
// ENV or CLI:
//   MONGODB_URI or argv[2]
//   MONGODB_DB  or argv[3] (when DB missing in URI)
//   MONGO_COLLECTION or argv[4] (optional)
//   SAMPLE or argv[5] (default 1000)
//   MAX_DEPTH or argv[6] (default 12)

const mongoose = require('mongoose');

const cfg = {
  uri: process.env.MONGODB_URI || process.argv[2] || 'mongodb://localhost:27017/test',
  overrideDb: process.env.MONGODB_DB || process.argv[3] || '',
  targetColl: process.env.MONGO_COLLECTION || process.argv[4] || '',
  sample: parseInt(process.env.SAMPLE || process.argv[5] || '1000', 10),
  maxDepth: parseInt(process.env.MAX_DEPTH || process.argv[6] || '12', 10),
};

function detectBsonType(v) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  const t = typeof v;
  if (t === 'string' || t === 'number' || t === 'boolean') return t;
  if (v instanceof Date) return 'date';
  const bs = v && v._bsontype;
  if (bs) {
    const m = { ObjectId:'objectId', ObjectID:'objectId', Decimal128:'decimal128', Long:'int64', Int32:'int32', Double:'double', Binary:'binary', Timestamp:'timestamp', MinKey:'minKey', MaxKey:'maxKey', BSONRegExp:'regex', Code:'code', DBRef:'dbref' };
    return m[bs] || String(bs).toLowerCase();
  }
  if (t === 'object') return 'object';
  return t;
}

function addType(map, path, typ) {
  if (!map[path]) map[path] = { types: new Set(), count: 0 };
  map[path].types.add(typ);
  map[path].count++;
}

function walk(val, base, map, depthLeft) {
  const typ = detectBsonType(val);
  addType(map, base || '$', typ);
  if (depthLeft <= 0) return;
  if (typ === 'object') {
    for (const [k, v] of Object.entries(val)) walk(v, base ? `${base}.${k}` : k, map, depthLeft - 1);
  } else if (typ === 'array') {
    addType(map, (base ? `${base}` : '$') + '[]', 'array-item');
    for (const v of val) walk(v, (base ? `${base}` : '$') + '[]', map, depthLeft - 1);
  }
}

async function inferCollection(db, name, sample, maxDepth) {
  const out = { _docs: 0, fields: {} };
  const col = db.collection(name);
  const cursor = col.aggregate([{ $sample: { size: sample } }], { allowDiskUse: true });
  for await (const doc of cursor) {
    out._docs++;
    walk(doc, '', out.fields, maxDepth);
  }
  const fields = {};
  for (const [k, v] of Object.entries(out.fields)) fields[k] = { types: Array.from(v.types).sort(), count: v.count };
  return { _docs: out._docs, fields };
}

(async () => {
  const conn = await mongoose.createConnection(cfg.uri, { serverSelectionTimeoutMS: 15000 }).asPromise();
  const db = cfg.overrideDb ? conn.client.db(cfg.overrideDb) : conn.db;
  const filter = cfg.targetColl ? { name: cfg.targetColl } : {};
  const infos = await db.listCollections(filter, { nameOnly: true }).toArray();
  const result = { database: db.databaseName, sample: cfg.sample, collections: {} };
  for (const { name } of infos) result.collections[name] = await inferCollection(db, name, cfg.sample, cfg.maxDepth);
  console.log(JSON.stringify(result, null, 2));
  await conn.close();
})().catch(err => { console.error('[ERROR]', err && err.stack || err); process.exit(1); });