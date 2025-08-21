CREATE DATABASE game_operation_db COLLATE DEFAULT;

USE game_operation_db;

-- Create the 'admins' table if it doesn't exist
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Create the 'notices' table for managing game notices
CREATE TABLE IF NOT EXISTS notices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL DEFAULT 'normal', -- e.g., 'normal', 'urgent', 'scrolling'
    title VARCHAR(255) NOT NULL,
    content VARCHAR(512) NOT NULL,
    author VARCHAR(255),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    world_id INT NULL DEFAULT 0,
    is_repeating BOOLEAN NOT NULL DEFAULT FALSE,
    repeat_cycle INT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the 'coupons' master table
CREATE TABLE IF NOT EXISTS coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    reward_items JSON NOT NULL,
    quantity INT NOT NULL,
    usage_limit_per_user INT NOT NULL DEFAULT 1,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    author VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'coupon_codes' table for individual codes
CREATE TABLE IF NOT EXISTS coupon_codes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    coupon_id INT NOT NULL,
    code VARCHAR(255) NOT NULL UNIQUE,
    is_used BOOLEAN DEFAULT FALSE,
    used_by_user_id VARCHAR(255),
    used_at DATETIME,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `content_access_control` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content_name` varchar(255) NOT NULL,
  `is_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `last_updated_by` varchar(255) DEFAULT NULL,
  `last_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `content_name` (`content_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- Create the 'admin_logs' table for logging admin actions
CREATE TABLE IF NOT EXISTS admin_logs (
  -- 기본 식별자
  admin_id       INT            NOT NULL,                          -- 관리자 ID (JOIN으로 사용자명 조회)
  idx            INT            NOT NULL,                          -- 관리자별 로그 인덱스

  -- 로그 정보
  component_type INT            NOT NULL,                          -- 컴포넌트 타입 (예: 1=회원, 2=상품 등)
  action_type    VARCHAR(100)   NOT NULL,                          -- 액션 타입 (예: CREATE, UPDATE, DELETE 등)
  target_data    JSON,                                             -- 액션의 상세 데이터

  -- 메타 정보
  ip_address     VARCHAR(45),                                      -- 액션 수행 IP 주소 (IPv6까지 지원)
  created_at     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,         -- 로그 생성 시각

  -- 복합 기본 키
  PRIMARY KEY (admin_id, idx)
);
