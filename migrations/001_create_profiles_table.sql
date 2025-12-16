-- Migration: 001_create_profiles_table.sql
-- Description: Tạo bảng profiles cho Sprint 1 (Authentication & Profile)
-- Created: 2025-12-16

-- Tạo bảng profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  height_cm INTEGER CHECK (height_cm >= 100 AND height_cm <= 250),
  weight_kg DECIMAL(5,2) CHECK (weight_kg >= 30 AND weight_kg <= 250),
  avatar_url TEXT,
  full_body_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo index cho email (unique constraint đã tự động tạo index)
-- Nhưng có thể tạo thêm index cho performance nếu cần
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);

-- Tạo function để tự động update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tạo trigger để tự động update updated_at khi có thay đổi
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Thêm comment cho bảng và các cột quan trọng
COMMENT ON TABLE profiles IS 'Bảng lưu thông tin hồ sơ người dùng cho Sprint 1';
COMMENT ON COLUMN profiles.email IS 'Email đăng nhập, phải unique';
COMMENT ON COLUMN profiles.password_hash IS 'Mật khẩu đã hash bằng bcrypt';
COMMENT ON COLUMN profiles.height_cm IS 'Chiều cao tính bằng cm (100-250)';
COMMENT ON COLUMN profiles.weight_kg IS 'Cân nặng tính bằng kg (30-250)';
COMMENT ON COLUMN profiles.full_body_image_url IS 'URL ảnh toàn thân từ Supabase Storage';
