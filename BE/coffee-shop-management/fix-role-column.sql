-- Chạy script này trong MySQL nếu vẫn báo lỗi "Data truncated" cho cột role
-- Mở MySQL Workbench hoặc command line: mysql -u root -p coffeeshop

USE coffeeshop;

-- Đổi cột role sang VARCHAR(20) để chấp nhận USER, STAFF, MANAGER, ADMIN
ALTER TABLE users MODIFY COLUMN role VARCHAR(20) NOT NULL;
