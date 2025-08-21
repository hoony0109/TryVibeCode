import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 한국어 번역
const ko = {
  translation: {
    // 공통
    common: {
      loading: '로딩 중...',
      error: '오류가 발생했습니다',
      success: '성공',
      cancel: '취소',
      save: '저장',
      delete: '삭제',
      edit: '편집',
      add: '추가',
      search: '검색',
      logout: '로그아웃',
      login: '로그인',
      username: '사용자명',
      password: '비밀번호',
      confirm: '확인',
      back: '뒤로',
      next: '다음',
      previous: '이전',
      close: '닫기',
    },
    
    // 로그인
    login: {
      title: '관리자 로그인',
      username: '사용자명',
      password: '비밀번호',
      loginButton: '로그인',
      invalidCredentials: '잘못된 인증 정보입니다',
      loginSuccess: '로그인 성공',
      loginFailed: '로그인 실패',
    },
    
    // 사이드바
    sidebar: {
      title: '게임 관리자',
      dashboard: '대시보드',
      playerManagement: '플레이어 관리',
      noticeManagement: '공지사항 관리',
      couponManagement: '쿠폰 관리',
      logout: '로그아웃',
    },
    
    // 대시보드
    dashboard: {
      title: '대시보드',
      totalPlayers: '전체 플레이어',
      onlinePlayers: '온라인 플레이어',
      totalServers: '전체 서버',
      activeServers: '활성 서버',
      serverStatus: '서버 상태',
      online: '온라인',
      offline: '오프라인',
      maintenance: '점검 중',
    },
    
    // 플레이어 관리
    playerManagement: {
      title: '플레이어 관리',
      search: '플레이어 검색',
      userIndex: '사용자 인덱스',
      charIndex: '캐릭터 인덱스',
      nickname: '닉네임',
      status: '상태',
      lastIP: '마지막 IP',
      banStatus: '밴 상태',
      actions: '작업',
      viewDetails: '상세보기',
      ban: '밴',
      unban: '밴 해제',
      kick: '킥',
      downloadData: '데이터 다운로드',
      noPlayersFound: '플레이어를 찾을 수 없습니다',
    },
    
    // 공지사항 관리
    noticeManagement: {
      title: '공지사항 관리',
      addNotice: '공지사항 추가',
      editNotice: '공지사항 편집',
      deleteNotice: '공지사항 삭제',
      title: '제목',
      content: '내용',
      startDate: '시작 날짜',
      endDate: '종료 날짜',
      status: '상태',
      active: '활성',
      inactive: '비활성',
      saveNotice: '공지사항 저장',
      noticeSaved: '공지사항이 저장되었습니다',
      noticeDeleted: '공지사항이 삭제되었습니다',
      confirmDelete: '정말 삭제하시겠습니까?',
    },
    
    // 쿠폰 관리
    couponManagement: {
      title: '쿠폰 관리',
      addCoupon: '쿠폰 추가',
      editCoupon: '쿠폰 편집',
      deleteCoupon: '쿠폰 삭제',
      couponCode: '쿠폰 코드',
      description: '설명',
      reward: '보상',
      startDate: '시작 날짜',
      endDate: '종료 날짜',
      usageLimit: '사용 제한',
      usedCount: '사용 횟수',
      status: '상태',
      active: '활성',
      inactive: '비활성',
      saveCoupon: '쿠폰 저장',
      couponSaved: '쿠폰이 저장되었습니다',
      couponDeleted: '쿠폰이 삭제되었습니다',
      selectItems: '아이템 선택',
      searchItems: '아이템 검색',
    },
    
    // 헤더
    header: {
      admin: '관리자',
      userRole: '관리자',
    },
    
    // 모달
    modal: {
      close: '닫기',
      confirm: '확인',
      cancel: '취소',
    },
    
    // 페이지네이션
    pagination: {
      first: '처음',
      last: '마지막',
      previous: '이전',
      next: '다음',
      page: '페이지',
      of: '/',
      showing: '보여지는 항목',
      to: '~',
      of: '총',
      entries: '개 항목',
    },
  },
};

// 영어 번역
const en = {
  translation: {
    // Common
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      logout: 'Logout',
      login: 'Login',
      username: 'Username',
      password: 'Password',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
    },
    
    // Login
    login: {
      title: 'Admin Login',
      username: 'Username',
      password: 'Password',
      loginButton: 'Login',
      invalidCredentials: 'Invalid credentials',
      loginSuccess: 'Login successful',
      loginFailed: 'Login failed',
    },
    
    // Sidebar
    sidebar: {
      title: 'Game Admin',
      dashboard: 'Dashboard',
      playerManagement: 'Player Management',
      noticeManagement: 'Notice Management',
      couponManagement: 'Coupon Management',
      logout: 'Logout',
    },
    
    // Dashboard
    dashboard: {
      title: 'Dashboard',
      totalPlayers: 'Total Players',
      onlinePlayers: 'Online Players',
      totalServers: 'Total Servers',
      activeServers: 'Active Servers',
      serverStatus: 'Server Status',
      online: 'Online',
      offline: 'Offline',
      maintenance: 'Maintenance',
    },
    
    // Player Management
    playerManagement: {
      title: 'Player Management',
      search: 'Search Players',
      userIndex: 'User Index',
      charIndex: 'Char Index',
      nickname: 'Nickname',
      status: 'Status',
      lastIP: 'Last IP',
      banStatus: 'Ban Status',
      actions: 'Actions',
      viewDetails: 'View Details',
      ban: 'Ban',
      unban: 'Unban',
      kick: 'Kick',
      downloadData: 'Download Data',
      noPlayersFound: 'No players found',
    },
    
    // Notice Management
    noticeManagement: {
      title: 'Notice Management',
      addNotice: 'Add Notice',
      editNotice: 'Edit Notice',
      deleteNotice: 'Delete Notice',
      title: 'Title',
      content: 'Content',
      startDate: 'Start Date',
      endDate: 'End Date',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      saveNotice: 'Save Notice',
      noticeSaved: 'Notice saved successfully',
      noticeDeleted: 'Notice deleted successfully',
      confirmDelete: 'Are you sure you want to delete?',
    },
    
    // Coupon Management
    couponManagement: {
      title: 'Coupon Management',
      addCoupon: 'Add Coupon',
      editCoupon: 'Edit Coupon',
      deleteCoupon: 'Delete Coupon',
      couponCode: 'Coupon Code',
      description: 'Description',
      reward: 'Reward',
      startDate: 'Start Date',
      endDate: 'End Date',
      usageLimit: 'Usage Limit',
      usedCount: 'Used Count',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      saveCoupon: 'Save Coupon',
      couponSaved: 'Coupon saved successfully',
      couponDeleted: 'Coupon deleted successfully',
      selectItems: 'Select Items',
      searchItems: 'Search Items',
    },
    
    // Header
    header: {
      admin: 'Admin',
      userRole: 'Administrator',
    },
    
    // Modal
    modal: {
      close: 'Close',
      confirm: 'Confirm',
      cancel: 'Cancel',
    },
    
    // Pagination
    pagination: {
      first: 'First',
      last: 'Last',
      previous: 'Previous',
      next: 'Next',
      page: 'Page',
      of: '/',
      showing: 'Showing',
      to: 'to',
      of: 'of',
      entries: 'entries',
    },
  },
};

// 일본어 번역
const ja = {
  translation: {
    // 共通
    common: {
      loading: '読み込み中...',
      error: 'エラーが発生しました',
      success: '成功',
      cancel: 'キャンセル',
      save: '保存',
      delete: '削除',
      edit: '編集',
      add: '追加',
      search: '検索',
      logout: 'ログアウト',
      login: 'ログイン',
      username: 'ユーザー名',
      password: 'パスワード',
      confirm: '確認',
      back: '戻る',
      next: '次へ',
      previous: '前へ',
      close: '閉じる',
    },
    
    // ログイン
    login: {
      title: '管理者ログイン',
      username: 'ユーザー名',
      password: 'パスワード',
      loginButton: 'ログイン',
      invalidCredentials: '認証情報が無効です',
      loginSuccess: 'ログイン成功',
      loginFailed: 'ログイン失敗',
    },
    
    // サイドバー
    sidebar: {
      title: 'ゲーム管理者',
      dashboard: 'ダッシュボード',
      playerManagement: 'プレイヤー管理',
      noticeManagement: 'お知らせ管理',
      couponManagement: 'クーポン管理',
      logout: 'ログアウト',
    },
    
    // ダッシュボード
    dashboard: {
      title: 'ダッシュボード',
      totalPlayers: '総プレイヤー数',
      onlinePlayers: 'オンラインプレイヤー',
      totalServers: '総サーバー数',
      activeServers: 'アクティブサーバー',
      serverStatus: 'サーバー状態',
      online: 'オンライン',
      offline: 'オフライン',
      maintenance: 'メンテナンス中',
    },
    
    // プレイヤー管理
    playerManagement: {
      title: 'プレイヤー管理',
      search: 'プレイヤー検索',
      userIndex: 'ユーザーインデックス',
      charIndex: 'キャラクターインデックス',
      nickname: 'ニックネーム',
      status: '状態',
      lastIP: '最終IP',
      banStatus: 'BAN状態',
      actions: '操作',
      viewDetails: '詳細表示',
      ban: 'BAN',
      unban: 'BAN解除',
      kick: 'キック',
      downloadData: 'データダウンロード',
      noPlayersFound: 'プレイヤーが見つかりません',
    },
    
    // お知らせ管理
    noticeManagement: {
      title: 'お知らせ管理',
      addNotice: 'お知らせ追加',
      editNotice: 'お知らせ編集',
      deleteNotice: 'お知らせ削除',
      title: 'タイトル',
      content: '内容',
      startDate: '開始日',
      endDate: '終了日',
      status: '状態',
      active: '有効',
      inactive: '無効',
      saveNotice: 'お知らせ保存',
      noticeSaved: 'お知らせが保存されました',
      noticeDeleted: 'お知らせが削除されました',
      confirmDelete: '本当に削除しますか？',
    },
    
    // クーポン管理
    couponManagement: {
      title: 'クーポン管理',
      addCoupon: 'クーポン追加',
      editCoupon: 'クーポン編集',
      deleteCoupon: 'クーポン削除',
      couponCode: 'クーポンコード',
      description: '説明',
      reward: '報酬',
      startDate: '開始日',
      endDate: '終了日',
      usageLimit: '使用制限',
      usedCount: '使用回数',
      status: '状態',
      active: '有効',
      inactive: '無効',
      saveCoupon: 'クーポン保存',
      couponSaved: 'クーポンが保存されました',
      couponDeleted: 'クーポンが削除されました',
      selectItems: 'アイテム選択',
      searchItems: 'アイテム検索',
    },
    
    // ヘッダー
    header: {
      admin: '管理者',
      userRole: '管理者',
    },
    
    // モーダル
    modal: {
      close: '閉じる',
      confirm: '確認',
      cancel: 'キャンセル',
    },
    
    // ページネーション
    pagination: {
      first: '最初',
      last: '最後',
      previous: '前へ',
      next: '次へ',
      page: 'ページ',
      of: '/',
      showing: '表示中',
      to: '～',
      of: '全',
      entries: '件',
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ko: ko,
      en: en,
      ja: ja,
    },
    fallbackLng: 'ko',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n; 