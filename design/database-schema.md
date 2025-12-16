# Database Schema Design - Sprint 1

## Overview
Database schema cho Sprint 1 tập trung vào authentication và user profile management.

## Tables

### 1. `profiles` Table

Bảng lưu thông tin hồ sơ người dùng, kết nối với authentication system.

#### Schema

```sql
CREATE TABLE profiles (
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
```

#### Columns Description

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier cho user |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email đăng nhập, phải unique |
| `password_hash` | VARCHAR(255) | NOT NULL | Mật khẩu đã hash (bcrypt) |
| `display_name` | VARCHAR(100) | NULL | Tên hiển thị (optional) |
| `height_cm` | INTEGER | CHECK (100-250) | Chiều cao tính bằng cm |
| `weight_kg` | DECIMAL(5,2) | CHECK (30-250) | Cân nặng tính bằng kg |
| `avatar_url` | TEXT | NULL | URL ảnh đại diện (từ Storage) |
| `full_body_image_url` | TEXT | NULL | URL ảnh toàn thân (từ Storage) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Thời gian tạo tài khoản |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Thời gian cập nhật cuối |

#### Indexes

```sql
-- Index cho email lookup (đã có unique constraint)
CREATE UNIQUE INDEX idx_profiles_email ON profiles(email);

-- Index cho created_at để query users mới
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);
```

#### Constraints

- **Unique Email**: Mỗi email chỉ được đăng ký một lần
- **Height Range**: 100-250 cm (hợp lý cho người)
- **Weight Range**: 30-250 kg (hợp lý cho người)
- **Password Hash**: Bắt buộc, không được NULL

#### Sample Data

```sql
-- User mẫu 1: Đã đăng ký, chưa cập nhật profile
INSERT INTO profiles (email, password_hash, display_name) 
VALUES ('user1@example.com', '$2a$10$example_hash_here', 'Nguyễn Văn A');

-- User mẫu 2: Đã đăng ký và cập nhật đầy đủ profile
INSERT INTO profiles (email, password_hash, display_name, height_cm, weight_kg, avatar_url, full_body_image_url)
VALUES (
  'user2@example.com',
  '$2a$10$example_hash_here',
  'Trần Thị B',
  165,
  55.5,
  'https://your-project.supabase.co/storage/v1/object/public/avatars/user2-avatar.jpg',
  'https://your-project.supabase.co/storage/v1/object/public/full-body/user2-fullbody.jpg'
);
```

## Storage Buckets (Supabase Storage)

### 1. `avatars` Bucket

Lưu trữ ảnh đại diện của user.

- **Public**: Yes (để hiển thị trên UI)
- **File size limit**: 2MB
- **Allowed MIME types**: image/jpeg, image/png, image/jpg
- **Path pattern**: `{user_id}/{timestamp}-avatar.{ext}`

### 2. `full-body` Bucket

Lưu trữ ảnh toàn thân của user để dùng cho try-on.

- **Public**: Yes (để hiển thị preview)
- **File size limit**: 5MB
- **Allowed MIME types**: image/jpeg, image/png, image/jpg
- **Path pattern**: `{user_id}/{timestamp}-fullbody.{ext}`
- **Recommended dimensions**: 
  - Ratio: 3:4 hoặc 9:16
  - Min dimension: 720px (chiều ngắn)

## Relationships

### Current Sprint 1
- `profiles` table là standalone, không có foreign keys

### Future Sprints (Epic 2, 3, 4)
- `profiles.id` sẽ liên kết với:
  - `orders` table (Epic 4)
  - `cart_items` table (Epic 4)
  - Try-on history (Epic 3)

## Security Considerations

1. **Password Hashing**: Luôn hash password bằng bcrypt (cost factor 10+) trước khi lưu
2. **Email Validation**: Validate format email ở cả client và server
3. **Storage Access**: 
   - Public buckets nhưng path có user_id để tránh conflict
   - Có thể thêm RLS (Row Level Security) sau nếu cần private
4. **JWT**: Token chứa `user_id` và `email`, không chứa password hash

## Migration Notes

- Migration scripts sẽ được tạo trong `/migrations` folder
- Mỗi migration có timestamp và description
- Có thể rollback nếu cần
