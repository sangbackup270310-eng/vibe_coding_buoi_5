-- Migration: 002_create_storage_buckets.sql
-- Description: Tạo Storage buckets cho avatars và full-body images
-- Created: 2025-12-16
-- Note: Script này cần chạy trong Supabase Dashboard > Storage hoặc qua API

-- Lưu ý: Supabase Storage buckets không thể tạo bằng SQL migration trực tiếp
-- Cần tạo qua Supabase Dashboard hoặc Management API
-- Script này là documentation và hướng dẫn

/*
HƯỚNG DẪN TẠO STORAGE BUCKETS:

1. Qua Supabase Dashboard:
   - Vào Storage > New bucket
   - Tạo bucket "avatars":
     * Name: avatars
     * Public: Yes
     * File size limit: 2MB
     * Allowed MIME types: image/jpeg, image/png, image/jpg
   
   - Tạo bucket "full-body":
     * Name: full-body
     * Public: Yes
     * File size limit: 5MB
     * Allowed MIME types: image/jpeg, image/png, image/jpg

2. Qua Supabase Management API (nếu có):
   POST https://api.supabase.com/v1/projects/{project_id}/storage/buckets
   {
     "name": "avatars",
     "public": true,
     "file_size_limit": 2097152,
     "allowed_mime_types": ["image/jpeg", "image/png", "image/jpg"]
   }

   POST https://api.supabase.com/v1/projects/{project_id}/storage/buckets
   {
     "name": "full-body",
     "public": true,
     "file_size_limit": 5242880,
     "allowed_mime_types": ["image/jpeg", "image/png", "image/jpg"]
   }

3. Storage Policies (RLS - Row Level Security):
   - Nếu cần private storage, có thể thêm policies sau
   - Hiện tại để public để dễ implement Sprint 1
*/

-- Storage Path Patterns:
-- avatars: {user_id}/{timestamp}-avatar.{ext}
-- full-body: {user_id}/{timestamp}-fullbody.{ext}

-- Example paths:
-- avatars/550e8400-e29b-41d4-a716-446655440000/1734364800-avatar.jpg
-- full-body/550e8400-e29b-41d4-a716-446655440000/1734364800-fullbody.jpg
