-- MySQL schema for PHP MVC App
-- Adjust database name as needed

CREATE DATABASE IF NOT EXISTS `php_mvc_app` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `php_mvc_app`;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','user') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  status ENUM('open','in_progress','done') NOT NULL DEFAULT 'open',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Seed default admin user
-- The following bcrypt hash corresponds to the password 'password'
-- Change it if you want a different default password. You can generate a hash using:
-- PHP: php -r "echo password_hash('yourpass', PASSWORD_BCRYPT), PHP_EOL;"
INSERT INTO users (username, password_hash, role) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- (Optional) Seed a couple of sample tasks for admin (user id 1)
INSERT INTO tasks (user_id, title, description, status) VALUES
(1, 'Welcome task', 'This is your first task. Feel free to edit or delete it.', 'open'),
(1, 'Second task', 'Tasks belong to the logged-in user only.', 'in_progress');