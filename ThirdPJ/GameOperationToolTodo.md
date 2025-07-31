# Game Operation Tool Development Todo List

## Phase 1: Environment Setup and Technology Stack

- [x] Define architecture: MySQL for game/operational data, Redis for cache/sessions, MongoDB for logs/analytics, TCP sockets for game server communication.
- [x] Initialize React frontend project:
  - [x] Choose CRA or Vite.
  - [x] Design folder structure.
  - [x] Configure routing.
- [x] Set up Node.js backend project:
  - [x] Use Express framework.
  - [x] Configure ESLint and Prettier.
  - [x] Define project directory structure.
- [x] Configure database connections:
  - [x] MySQL: Create dedicated database and tables (e.g., admin accounts, coupons). Set up read-only access for game server DB.
  - [x] Redis: Configure for session storage or caching, test connection.
  - [x] MongoDB: Set up for logs and unstructured data using Mongoose.
- [x] Set up environment variables:
  - [x] Create `.env` file for DB credentials, game server IP/port, and secret keys.
  - [x] Register initial admin account with hashed password in MySQL.

## Phase 2: Authentication and Authorization

- [ ] Implement admin login:
  - [ ] Backend: Develop login API with bcrypt for password hashing and JWT or session-based authentication.
  - [ ] Frontend: Create login UI.
- [ ] Set up admin account management:
  - [ ] Create MySQL table for admin accounts (ID, name, role, password hash).
  - [ ] Register default admin account.
- [ ] Develop role-based access control:
  - [ ] Create middleware to restrict menu access based on roles (JWT claims or session).
  - [ ] Evaluate two-factor authentication (OTP) for sensitive menus.
- [ ] Implement session management:
  - [ ] Store sessions in Redis for multi-server support.
  - [ ] Add session expiration and logout functionality.
- [ ] Set up activity logging:
  - [ ] Log major admin actions (e.g., item distribution, bans) in MySQL or MongoDB.
- [ ] Develop TCP socket client:
  - [ ] Create Node.js module for game server communication using `net.Socket`.
  - [ ] Test with basic ping/pong or status queries.

## Phase 3: Dashboard and UI Layout

- [ ] Build main UI layout:
  - [ ] Create React sidebar and header components.
  - [ ] Configure routes for dashboard, player management, etc.
- [ ] Develop dashboard:
  - [ ] Display KPIs (CCU, DAU, new users, revenue) using test data.
  - [ ] Plan for real-time stat integration.
- [ ] Create server status panel:
  - [ ] Show real-time server status and CCU via TCP or Redis updates.
- [ ] Add placeholder widgets:
  - [ ] Recent approvals and security alerts UI.
- [ ] Implement chart components:
  - [ ] Integrate Chart.js or Recharts for metrics (e.g., CCU, revenue trends).
  - [ ] Provide tables alongside charts.

## Phase 4: Player Management

- [ ] Implement account management:
  - [ ] Develop API for searching/viewing player details (ID, nickname, status, last IP, ban status).
  - [ ] Create UI with search form, sortable/filterable table, and pagination.
- [ ] Develop character details:
  - [ ] Create API for character lists (name, level, class, lock status) and details (inventory, equipment, quests).
  - [ ] Display activity summaries in UI.
- [ ] Add content progress tracking:
  - [ ] Query and display game progress (e.g., dungeon clears, quests).
- [ ] Implement player relationship views:
  - [ ] Create API and UI for friends and block lists.
- [ ] Develop player control features:
  - [ ] Account lock/unlock: API to update MySQL, notify game server via TCP.
  - [ ] Optional: Force logout via TCP command.
  - [ ] Optional: UI for resetting passwords/emails.
  - [ ] Item distribution/removal: API with two-person approval process (to be linked in Phase 10).
- [ ] Enhance UI:
  - [ ] Add search/filter, CSV/Excel export, pagination or infinite scroll.
- [ ] Optimize performance:
  - [ ] Cache frequent queries in Redis with short TTL.

## Phase 5: Game Service Operations I – Notices, Content, Server Settings

- [ ] Implement notice management:
  - [ ] Create UI for writing, editing, deleting notices (title, content, target, duration).
  - [ ] Design MySQL notice table (type, content, start/end time, author).
  - [ ] Sync notices with game server via TCP or DB polling.
  - [ ] Show notice status in UI (active/inactive, auto-expire).
- [ ] Develop content access control:
  - [ ] Create UI for toggling content (e.g., dungeons, events).
  - [ ] Design MySQL table for content status (ID, state, timestamp, author, reason).
  - [ ] Notify game server via TCP to restrict content.
  - [ ] Log changes in MySQL.
- [ ] Implement server settings:
  - [ ] Create UI for server visibility toggles and recommended server flags.
  - [ ] Manage IP allow/block lists in MySQL, sync via TCP or Redis pub/sub.
  - [ ] Build dashboard for server and IP status.

## Phase 6: Game Service Operations II – Push, Mail, Coupons

- [ ] Implement push notifications:
  - [ ] Create UI for composing push messages (title, content, target, platform, schedule).
  - [ ] Develop backend scheduler (node-cron or Redis queue).
  - [ ] Integrate with FCM/APNS or game server for in-app notifications.
  - [ ] Log results in MySQL, provide history UI.
- [ ] Develop in-game mail:
  - [ ] Create UI for composing mail (recipients, title, content, attachments, schedule).
  - [ ] Design MySQL mail table (recipient, content, attachments, status).
  - [ ] Sync with game server via TCP, update delivery status.
- [ ] Implement coupon management:
  - [ ] Create UI for generating coupons (event name, rewards, validity, quantity).
  - [ ] Develop backend for unique code generation, store in MySQL.
  - [ ] Provide UI for listing codes, exporting to Excel, viewing usage logs.
  - [ ] Create API for game server to validate coupons.

## Phase 7: Shop and Revenue Management

- [ ] Implement purchase history:
  - [ ] Create UI for filtering/displaying purchases (order ID, user ID, product, amount, platform, time).
  - [ ] Develop API to query MySQL, optionally verify with store APIs.
  - [ ] Show refund/cancellation status.
- [ ] Develop revenue analytics:
  - [ ] Visualize revenue by hour/day/month with charts.
  - [ ] Cache results in Redis, invalidate on new transactions.
- [ ] Implement currency transaction tracking:
  - [ ] Query and display premium currency logs from MySQL/MongoDB.
  - [ ] Create UI for filtering by period, user, or type.
- [ ] Optional: Add test purchase/item tracking:
  - [ ] Create UI for viewing test purchases, filtered by test flags.

## Phase 8: Marketplace Management

- [ ] Implement marketplace status:
  - [ ] Create UI for server-specific item listings (quantity, price range, status).
  - [ ] Develop API to query MySQL with pagination.
- [ ] Develop transaction logs:
  - [ ] Create UI for filtering completed/canceled transactions.
  - [ ] Provide detailed transaction history view.
- [ ] Implement fraud detection:
  - [ ] Define rules for suspicious transactions (e.g., high prices, repetitive trades).
  - [ ] Develop backend to flag suspicious trades, UI to display/act.
- [ ] Implement test transaction tools:
  - [ ] Create UI for adding/removing test items (test environment).
  - [ ] Store test transactions with flags.

## Phase 9: Logs and Analytics

- [ ] Implement game log queries:
  - [ ] Create UI for searching logs by user ID, type, and period.
  - [ ] Store logs in MongoDB, optimize with indexes.
  - [ ] Display results in table with pagination and Excel export.
- [ ] Develop chat log queries:
  - [ ] Create UI for filtering chats by user, channel, keyword, or period.
  - [ ] Use MongoDB text indexes for keyword searches.
  - [ ] Display chats in conversation or table format, truncate long messages.