-- Migration: 003_insert_sample_data.sql
-- Description: Thêm dữ liệu mẫu cho bảng profiles (Sprint 1)
-- Created: 2025-12-16
-- Note: Password hash là bcrypt của "password123" (chỉ dùng cho development)

-- User mẫu 1: Đã đăng ký, chưa cập nhật profile đầy đủ
-- Password: password123
INSERT INTO profiles (email, password_hash, display_name)
VALUES (
  'user1@example.com',
  '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq',
  'Nguyễn Văn A'
)
ON CONFLICT (email) DO NOTHING;

-- User mẫu 2: Đã đăng ký và cập nhật đầy đủ profile (có avatar và full-body image)
-- Password: password123
-- Note: URLs là placeholder, cần thay bằng URLs thật từ Supabase Storage
INSERT INTO profiles (
  email, 
  password_hash, 
  display_name, 
  height_cm, 
  weight_kg, 
  avatar_url, 
  full_body_image_url
)
VALUES (
  'user2@example.com',
  '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq',
  'Trần Thị B',
  165,
  55.5,
  'https://your-project.supabase.co/storage/v1/object/public/avatars/user2-avatar.jpg',
  'https://your-project.supabase.co/storage/v1/object/public/full-body/user2-fullbody.jpg'
)
ON CONFLICT (email) DO NOTHING;

-- User mẫu 3: Admin user (cho Epic 2 - Quản lý kho hàng)
-- Password: admin123
INSERT INTO profiles (email, password_hash, display_name)
VALUES (
  'admin@tryon.com',
  '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq',
  'Admin Try-on'
)
ON CONFLICT (email) DO NOTHING;

-- Lưu ý:
-- 1. Password hash trên là placeholder, cần generate bằng bcrypt thật
-- 2. URLs avatar và full-body là placeholder, cần upload ảnh thật vào Storage
-- 3. Có thể thêm role column sau nếu cần phân quyền admin/user
