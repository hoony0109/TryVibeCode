const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path'); // 오류 수정을 위해 이 라인을 추가했습니다.

// --- 사용자 설정 ---
// 아래의 mongodbUri를 실제 MongoDB 연결 문자열로 변경해주세요.
// 예: 'mongodb://username:password@host:port/database_name'
const mongodbUri = 'mongodb://localhost:27017/UserGameLog_TCP_202502';
// --- ---

// 결과를 저장할 파일 경로 (프로젝트 루트에 저장됩니다)
const outputFilePath = path.join(__dirname, '../../mongodb_collections_schema.json');
// --- ---

async function getCollectionsInfo() {
  try {
    await mongoose.connect(mongodbUri);

    console.log('MongoDB에 성공적으로 연결되었습니다.');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    if (collections.length === 0) {
      console.log('데이터베이스에 컬렉션이 없습니다.');
      return;
    }

    const allCollectionsInfo = {};
    console.log('컬렉션 정보를 수집하는 중입니다...');

    for (const collection of collections) {
      const collectionName = collection.name;
      if (collectionName.startsWith('system.') || collectionName === 'sessions') {
        continue;
      }

      const currentCollection = db.collection(collectionName);
      const firstDoc = await currentCollection.findOne();

      if (firstDoc) {
        allCollectionsInfo[collectionName] = Object.keys(firstDoc);
      } else {
        allCollectionsInfo[collectionName] = '문서가 없어 스키마를 추론할 수 없습니다.';
      }
    }

    // 결과를 JSON 파일로 저장
    fs.writeFileSync(outputFilePath, JSON.stringify(allCollectionsInfo, null, 2), 'utf8');

    console.log(`\n✅ 컬렉션 정보가 다음 파일에 성공적으로 저장되었습니다:\n ${outputFilePath}\n`);

  } catch (error) {
    console.error('스크립트 실행 중 오류가 발생했습니다:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB 연결이 종료되었습니다.');
  }
}

getCollectionsInfo();