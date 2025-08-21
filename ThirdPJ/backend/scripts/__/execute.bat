 REM 방법 A) 환경변수 사용
  set "MONGODB_URI=mongodb://localhost:27017/game_logs_db"
  node "C:\Work\LaghaimServer\VibeCodeProject\GameManagingTool\backend\scripts\exportValidators.js" 1>"C:\Work\LaghaimServer\Servers_2\DBScript\MongoDB\validators.json"

  REM 방법 B) CLI 인자 사용(환경변수 불필요)
  node "C:\Work\LaghaimServer\VibeCodeProject\GameManagingTool\backend\scripts\exportValidators.js" "mongodb://localhost:27017/mydb" 1>"C:\Work\LaghaimServer\Servers_2\DBScript\MongoDB\validators.json"