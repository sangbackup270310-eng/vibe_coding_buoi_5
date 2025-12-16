# Storage Design - Supabase Storage

## Overview
Thiết kế Storage buckets cho Sprint 1: lưu trữ avatar và ảnh toàn thân của user.

## Storage Buckets

### 1. `avatars` Bucket

**Mục đích**: Lưu trữ ảnh đại diện của user.

**Cấu hình**:
- **Name**: `avatars`
- **Public**: Yes (để hiển thị trên UI)
- **File size limit**: 2MB
- **Allowed MIME types**: 
  - `image/jpeg`
  - `image/png`
  - `image/jpg`

**Path Pattern**:
```
{user_id}/{timestamp}-avatar.{ext}
```

**Example**:
```
avatars/550e8400-e29b-41d4-a716-446655440000/1734364800-avatar.jpg
```

**Usage**:
- Upload khi user cập nhật avatar
- Mỗi user chỉ có 1 avatar (upload mới sẽ replace cũ)
- URL được lưu trong `profiles.avatar_url`

---

### 2. `full-body` Bucket

**Mục đích**: Lưu trữ ảnh toàn thân của user để dùng cho try-on feature.

**Cấu hình**:
- **Name**: `full-body`
- **Public**: Yes (để hiển thị preview)
- **File size limit**: 5MB
- **Allowed MIME types**: 
  - `image/jpeg`
  - `image/png`
  - `image/jpg`

**Path Pattern**:
```
{user_id}/{timestamp}-fullbody.{ext}
```

**Example**:
```
full-body/550e8400-e29b-41d4-a716-446655440000/1734364800-fullbody.jpg
```

**Recommended Image Specifications**:
- **Ratio**: 3:4 hoặc 9:16 (portrait)
- **Min dimension**: ≥ 720px (chiều ngắn)
- **Max dimension**: Không giới hạn nhưng nên ≤ 2000px để tối ưu performance
- **Format**: JPEG hoặc PNG

**Usage**:
- Upload khi user cập nhật profile (US-02)
- Mỗi user chỉ có 1 full-body image (upload mới sẽ replace cũ)
- URL được lưu trong `profiles.full_body_image_url`
- Ảnh này sẽ được dùng làm input cho AI try-on (Epic 3)

---

## Storage Access Patterns

### Upload Flow

1. **Client** → Validate file (type, size, dimensions)
2. **Client** → Generate unique filename: `{user_id}/{timestamp}-{type}.{ext}`
3. **Client** → Upload to Supabase Storage via API
4. **Server** → Get public URL from Storage
5. **Server** → Update `profiles.avatar_url` or `profiles.full_body_image_url`
6. **Server** → (Optional) Delete old image if exists

### Download Flow

1. **Client** → Get URL from `profiles` table
2. **Client** → Display image directly (public bucket)

---

## Security Considerations

### Current Implementation (Sprint 1)
- **Public buckets**: Dễ implement, phù hợp cho MVP
- **Path includes user_id**: Tránh conflict giữa users
- **File validation**: Client + Server side

### Future Enhancements
- **Private buckets**: Nếu cần bảo mật ảnh
- **Signed URLs**: Nếu cần time-limited access
- **RLS Policies**: Row Level Security cho fine-grained access control

---

## API Integration

### Supabase Storage Client (Frontend)

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Upload avatar
const uploadAvatar = async (file, userId) => {
  const timestamp = Date.now();
  const ext = file.name.split('.').pop();
  const fileName = `${userId}/${timestamp}-avatar.${ext}`;
  
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });
  
  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);
  
  return publicUrl;
};
```

### Backend API Endpoint

```javascript
// PUT /api/user/profile
// Body: { avatar_url, full_body_image_url, ... }
// Upload được xử lý ở frontend, backend chỉ lưu URL
```

---

## Migration Steps

1. **Create buckets** trong Supabase Dashboard:
   - Storage → New bucket → `avatars`
   - Storage → New bucket → `full-body`

2. **Configure bucket settings**:
   - Set public = true
   - Set file size limits
   - Set allowed MIME types

3. **Test upload**:
   - Upload test image
   - Verify public URL works
   - Test với frontend integration

---

## File Naming Convention

- **Format**: `{user_id}/{timestamp}-{type}.{ext}`
- **user_id**: UUID từ `profiles.id`
- **timestamp**: Unix timestamp (milliseconds)
- **type**: `avatar` hoặc `fullbody`
- **ext**: `jpg`, `jpeg`, hoặc `png`

**Benefits**:
- Unique filenames (timestamp ensures uniqueness)
- Easy to identify owner (user_id in path)
- Easy to clean up old files if needed
- Sortable by upload time

---

## Cleanup Strategy

### Current (Sprint 1)
- Upload mới sẽ replace file cũ (upsert)
- Không cần cleanup manual

### Future
- Implement cleanup job để xóa ảnh cũ khi user upload mới
- Hoặc giữ history nếu cần (thêm versioning)
