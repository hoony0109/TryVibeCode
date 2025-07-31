# Game Operation Tool PRD

## 1. Introduction
This Product Requirements Document (PRD) outlines the development roadmap for a Game Operation Tool designed to manage and monitor game services efficiently. The tool will support game administrators with features for authentication, player management, server operations, analytics, and more, ensuring seamless game operations.

## 2. Objectives
- Provide a robust and scalable tool for game administrators to manage game services.
- Enable real-time monitoring, player management, and operational control.
- Ensure secure authentication, role-based access, and comprehensive logging.
- Support integration with game servers and external services for real-time operations.

## 3. Scope
The tool will include features for environment setup, authentication, dashboard, player management, game service operations, analytics, and more, as detailed in the phases below.

## 4. Development Phases

### 4.1 Phase 1: Environment Setup and Technology Stack
**Objective**: Establish the foundational infrastructure for the operation tool.

- **Architecture**:
  - **Database**:
    - MySQL: Store game and operational data (e.g., admin accounts, coupons).
    - Redis: Manage cache and sessions.
    - MongoDB: Store logs and analytics data.
  - **Communication**: TCP sockets for real-time game server communication.
- **Frontend**:
  - Initialize React project using Create React App (CRA) or Vite.
  - Design folder structure and configure routing.
- **Backend**:
  - Create Node.js project with Express.
  - Set up ESLint and Prettier for code quality.
  - Define project directory structure.
- **Database Connections**:
  - MySQL: Set up dedicated database and tables (e.g., admin accounts, coupons). Configure read-only access for game server DB.
  - Redis: Configure for session storage or caching, test connection.
  - MongoDB: Set up for log and unstructured data storage using Mongoose.
- **Environment Variables**:
  - Create `.env` file to manage DB credentials, game server IP/port, and secret keys.
  - Initialize admin account with hashed password in MySQL.

### 4.2 Phase 2: Authentication and Authorization
**Objective**: Implement secure authentication and role-based access control.

- **Admin Login**:
  - Backend: Develop login API with bcrypt for password hashing and JWT or session-based authentication.
  - Frontend: Create login UI.
- **Admin Account Management**:
  - MySQL table for admin accounts (fields: ID, name, role, password hash).
  - Register default admin account.
- **Role-Based Access Control**:
  - Develop middleware to restrict menu access based on roles (stored in JWT claims or session).
  - Consider two-factor authentication (OTP) for sensitive menus.
- **Session Management**:
  - Store sessions in Redis for multi-server environments.
  - Implement session expiration and logout functionality.
- **Activity Logging**:
  - Log major admin actions (e.g., item distribution, account bans) in MySQL or MongoDB.
- **Game Server Communication**:
  - Develop Node.js TCP socket client for game server communication (e.g., using `net.Socket`).
  - Test connection with basic ping/pong or status queries.

### 4.3 Phase 3: Dashboard and UI Layout
**Objective**: Build the main UI layout and dashboard for operational insights.

- **Main Layout**:
  - Implement React-based sidebar and header components.
  - Configure routes for dashboard, player management, etc.
- **Dashboard**:
  - Display key performance indicators (KPIs) like CCU, DAU, new users, and revenue.
  - Use test data initially, later integrate real-time stats.
- **Server Status Panel**:
  - Show real-time server status (normal/maintenance/down) and CCU.
  - Fetch data via TCP requests or Redis updates.
- **Recent Approvals and Alerts**:
  - Create placeholder UI for recent admin actions and security alerts.
- **Chart Components**:
  - Use Chart.js or Recharts for visualizing metrics (e.g., CCU trends, revenue).
  - Provide both charts and tables for data clarity.

### 4.4 Phase 4: Player Management
**Objective**: Enable comprehensive player account and activity management.

- **Account Management**:
  - API to search and view player details (ID, nickname, status, last IP, ban status).
  - UI with search form, sortable/filterable table, and pagination.
- **Character Details**:
  - API to list characters (name, level, class, lock status) and detailed info (inventory, equipment, quests).
  - Display activity summaries (e.g., recent logins, items acquired).
- **Content Progress**:
  - Query game progress (e.g., dungeon clears, quest progress) and display in UI.
- **Player Relationships**:
  - API and UI to view friends and block lists.
- **Player Control**:
  - **Account Lock/Unlock**: API to update account status in MySQL, notify game server via TCP.
  - **Force Logout**: Optional TCP command to log out characters.
  - **Auth Updates**: Optional UI for resetting passwords or emails.
  - **Item Distribution/Removal**: API for granting or removing items/rewards, with two-person approval process considered for later phases.
- **UI Features**:
  - Search and filter UI, exportable results to CSV/Excel.
  - Implement pagination or infinite scroll for large datasets.
- **Performance**:
  - Cache frequent player queries in Redis with short TTL for data consistency.

### 4.5 Phase 5: Game Service Operations I – Notices, Content, and Server Settings
**Objective**: Manage game notices, content access, and server configurations.

- **Notice Management**:
  - UI for creating, editing, and deleting main and real-time notices (title, content, target server, duration).
  - MySQL table for notices (type, content, start/end time, author).
  - Backend to sync notices with game server via TCP or DB polling.
  - UI to show notice status (active/inactive, auto-expire past schedule).
- **Content Access Control**:
  - UI to toggle content (e.g., dungeons, events) on/off.
  - MySQL table for content status (ID, state, timestamp, author, reason).
  - Notify game server via TCP to restrict content access.
  - Log changes with reasons in MySQL.
- **Server Settings**:
  - UI to toggle server visibility (on/off) for maintenance or new server launches.
  - Set recommended servers via UI and update MySQL.
  - Manage IP allow/block lists in MySQL, sync with game server via TCP or Redis pub/sub.
  - Dashboard for server and IP restriction status.

### 4.6 Phase 6: Game Service Operations II – Push, Mail, Coupons
**Objective**: Implement push notifications, in-game mail, and coupon systems.

- **Push Notifications**:
  - UI for composing push messages (title, content, target, platform, schedule).
  - Backend scheduler (e.g., node-cron or Redis queue) for timed pushes.
  - Integrate with FCM/APNS or game server for in-app notifications.
  - Log push results in MySQL, provide UI for history.
- **In-Game Mail**:
  - UI for composing mail (recipients, title, content, attachments, schedule).
  - MySQL table for mail data (recipient, content, attachments, status).
  - Sync mail with game server via TCP, update status on delivery.
- **Coupon Management**:
  - UI for creating coupons (event name, rewards, validity, quantity).
  - Backend to generate unique coupon codes, store in MySQL (master and code tables).
  - UI for listing codes, exporting to Excel, and viewing usage logs.
  - API for game server to validate coupons and grant rewards.

### 4.7 Phase 7: Shop and Revenue Management
**Objective**: Monitor in-app purchases and in-game currency transactions.

- **Purchase History**:
  - UI to filter and display purchase records (order ID, user ID, product, amount, platform, time).
  - API to query MySQL transaction table, optionally verify with store APIs.
  - Display refund/cancellation status.
- **Revenue Analytics**:
  - Visualize revenue by hour/day/month using charts.
  - Cache results in Redis, invalidate on new transactions.
- **Currency Transactions**:
  - Query and display premium currency transactions (e.g., diamonds) from MySQL or MongoDB.
  - UI for filtering by period, user, or transaction type.
- **Test Purchases**:
  - Optional UI to view test purchases/items, filtered by test flags.

### 4.8 Phase 8: Marketplace Management
**Objective**: Monitor and manage in-game marketplace activities.

- **Marketplace Status**:
  - UI to display server-specific item listings (quantity, price range, status).
  - API to query MySQL for active listings, with pagination for large datasets.
- **Transaction Logs**:
  - UI to filter and view completed/canceled transactions (item, price, buyer/seller, time).
  - Detailed view for transaction history.
- **Fraud Detection**:
  - Define rules for suspicious transactions (e.g., high prices, repetitive trades).
  - Backend to flag suspicious trades, UI to display and act on them.
- **Test Transactions**:
  - UI for adding/removing test items in the marketplace (test environment only).
  - Store test transactions with flags for tracking.

### 4.9 Phase 9: Logs and Analytics
**Objective**: Provide tools for querying and analyzing game logs.

- **Game Logs**:
  - UI to search logs by user ID, log type, and period.
  - Store logs in MongoDB, optimize with indexes (e.g., user ID, time).
  - Display results in a table with pagination and Excel export.
- **Chat Logs**:
  - UI to filter chats by user, channel, keyword, or period.
  - Use MongoDB text indexes for efficient keyword searches.
  - Display chats in conversation or table format, truncating long messages.

## 5. Non-Functional Requirements
- **Performance**: Optimize database queries and cache frequent requests in Redis.
- **Security**: Use bcrypt for passwords, JWT or Redis for sessions, and role-based access control.
- **Scalability**: Support multi-server environments with Redis for session and cache management.
- **Reliability**: Implement error handling for game server communication and DB operations.

## 6. Future Considerations
- **Approval Workflows**: Integrate two-person approval for sensitive actions (e.g., item distribution, mass notifications).
- **Real-Time Updates**: Use WebSocket for marketplace and dashboard updates.
- **Analytics Enhancements**: Consider ELK Stack for advanced log analysis.

## 7. Assumptions
- Game server supports TCP socket communication for real-time updates.
- MySQL, Redis, and MongoDB are available and configured for use.
- External services (FCM/APNS) are accessible for push notifications.

## 8. Risks
- **Data Consistency**: Ensure Redis cache invalidation aligns with DB updates.
- **Game Server Integration**: Potential delays if game server APIs are unstable.
- **Scalability**: High log volumes may require MongoDB partitioning or alternative solutions.