# Authentication & Profile Flows - Sprint 1

## Overview
Tài liệu mô tả các luồng authentication và profile management cho Sprint 1.

---

## 1. Register Flow (Đăng ký)

### Flow Diagram

```
[User] → [Frontend Form] → [API POST /api/auth/register] → [Backend]
                                                              ↓
[Backend] → Validate Input → Check Email Exists → Hash Password → Create Profile → Return Success
                                                              ↓
[Frontend] ← Success Response ← [Backend]
     ↓
Redirect to Login (or auto-login)
```

### Detailed Steps

1. **User opens register page** (`/register`)
2. **User fills form**:
   - Email (required, validated format)
   - Password (required, min 8 chars)
   - Confirm Password (must match)
   - Display Name (optional)
3. **Frontend validation**:
   - Email format check
   - Password strength check
   - Password match check
4. **Submit to API**: `POST /api/auth/register`
   ```json
   {
     "email": "user@example.com",
     "password": "password123",
     "display_name": "John Doe"
   }
   ```
5. **Backend processing**:
   - Validate email format
   - Check if email already exists (unique constraint)
   - Hash password với bcrypt (cost factor 10+)
   - Create record in `profiles` table
   - Return success response
6. **Response handling**:
   - Success: Show success message → Redirect to `/login`
   - Error: Show error message (email exists, validation failed, etc.)

### Error Cases

| Error | HTTP Status | Response | User Action |
|-------|-------------|----------|-------------|
| Email already exists | 409 Conflict | `{ error: "Email already registered" }` | Use different email or login |
| Invalid email format | 400 Bad Request | `{ error: "Invalid email format" }` | Fix email format |
| Weak password | 400 Bad Request | `{ error: "Password must be at least 8 characters" }` | Use stronger password |
| Server error | 500 Internal Server Error | `{ error: "Registration failed. Please try again." }` | Retry later |

### API Endpoint

**POST** `/api/auth/register`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "display_name": "John Doe" // optional
}
```

**Success Response** (201 Created):
```json
{
  "message": "Registration successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "display_name": "John Doe"
  }
}
```

**Error Response** (400/409):
```json
{
  "error": "Email already registered"
}
```

---

## 2. Login Flow (Đăng nhập)

### Flow Diagram

```
[User] → [Frontend Form] → [API POST /api/auth/login] → [Backend]
                                                              ↓
[Backend] → Validate Input → Find User by Email → Verify Password → Generate JWT → Return Token
                                                              ↓
[Frontend] ← JWT Token ← [Backend]
     ↓
Save Token (localStorage) → Redirect to Protected Route
```

### Detailed Steps

1. **User opens login page** (`/login`)
2. **User fills form**:
   - Email
   - Password
3. **Submit to API**: `POST /api/auth/login`
   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```
4. **Backend processing**:
   - Find user by email in `profiles` table
   - Compare password hash với bcrypt
   - Generate JWT token (contains `user_id`, `email`, `exp`)
   - Return token + user info
5. **Frontend processing**:
   - Save JWT token to `localStorage` (key: `token`)
   - Save user info to state/context
   - Redirect to `/profile` or `/dashboard`
6. **Protected routes**:
   - Check token exists in localStorage
   - Include token in Authorization header: `Bearer {token}`
   - If token invalid/expired → Redirect to `/login`

### Error Cases

| Error | HTTP Status | Response | User Action |
|-------|-------------|----------|-------------|
| Email not found | 401 Unauthorized | `{ error: "Invalid email or password" }` | Check email or register |
| Wrong password | 401 Unauthorized | `{ error: "Invalid email or password" }` | Check password |
| Token generation failed | 500 Internal Server Error | `{ error: "Login failed. Please try again." }` | Retry later |

### API Endpoint

**POST** `/api/auth/login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "display_name": "John Doe"
  }
}
```

**Error Response** (401):
```json
{
  "error": "Invalid email or password"
}
```

### JWT Token Structure

```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "iat": 1734364800,
  "exp": 1734969600  // 7 days from now
}
```

---

## 3. Profile Get/Update & Avatar Upload Flow

### Flow Diagram - Get Profile

```
[User] → [Frontend /profile] → [API GET /api/user/profile] → [Backend]
                                                              ↓
[Backend] → Verify JWT → Extract user_id → Query Profile → Return Profile Data
                                                              ↓
[Frontend] ← Profile Data ← [Backend]
     ↓
Display Form with Current Data
```

### Flow Diagram - Update Profile

```
[User] → [Frontend Form] → [Upload Avatar/Full-body] → [Supabase Storage]
                                                              ↓
[Frontend] ← Public URL ← [Supabase Storage]
     ↓
[Frontend] → [API PUT /api/user/profile] → [Backend]
                                                              ↓
[Backend] → Verify JWT → Validate Input → Update Profile → Return Success
                                                              ↓
[Frontend] ← Success Response ← [Backend]
     ↓
Update UI with New Data
```

### Detailed Steps - Get Profile

1. **User navigates to** `/profile` (protected route)
2. **Frontend checks**:
   - Token exists in localStorage
   - If not → Redirect to `/login`
3. **API call**: `GET /api/user/profile`
   - Header: `Authorization: Bearer {token}`
4. **Backend processing**:
   - Verify JWT token
   - Extract `user_id` from token
   - Query `profiles` table by `id`
   - Return profile data
5. **Frontend displays** form với current data

### Detailed Steps - Update Profile

1. **User fills form**:
   - Display Name (optional)
   - Height (cm, 100-250)
   - Weight (kg, 30-250)
   - Upload Avatar (optional, image file)
   - Upload Full-body Image (optional, image file)
2. **Frontend validation**:
   - Height/Weight range check
   - Image file type check (jpg, jpeg, png)
   - Image size check (avatar ≤ 2MB, full-body ≤ 5MB)
   - Image dimensions check (full-body ratio 3:4 or 9:16)
3. **Upload images** (if provided):
   - Upload to Supabase Storage (`avatars` or `full-body` bucket)
   - Get public URL
   - Store URL for API call
4. **Submit to API**: `PUT /api/user/profile`
   ```json
   {
     "display_name": "John Doe",
     "height_cm": 175,
     "weight_kg": 70.5,
     "avatar_url": "https://...",
     "full_body_image_url": "https://..."
   }
   ```
5. **Backend processing**:
   - Verify JWT token
   - Extract `user_id` from token
   - Validate input (height/weight ranges)
   - Update `profiles` table
   - Return updated profile
6. **Frontend updates** UI với new data

### Error Cases

| Error | HTTP Status | Response | User Action |
|-------|-------------|----------|-------------|
| Not authenticated | 401 Unauthorized | `{ error: "Authentication required" }` | Login first |
| Invalid token | 401 Unauthorized | `{ error: "Invalid or expired token" }` | Login again |
| Invalid height/weight | 400 Bad Request | `{ error: "Height must be between 100-250 cm" }` | Fix input |
| Image upload failed | 500 Internal Server Error | `{ error: "Failed to upload image" }` | Retry upload |
| Profile update failed | 500 Internal Server Error | `{ error: "Failed to update profile" }` | Retry later |

### API Endpoints

**GET** `/api/user/profile`
- **Headers**: `Authorization: Bearer {token}`
- **Response** (200 OK):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "display_name": "John Doe",
  "height_cm": 175,
  "weight_kg": 70.5,
  "avatar_url": "https://...",
  "full_body_image_url": "https://...",
  "created_at": "2025-12-16T10:00:00Z",
  "updated_at": "2025-12-16T10:00:00Z"
}
```

**PUT** `/api/user/profile`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
```json
{
  "display_name": "John Doe",  // optional
  "height_cm": 175,              // optional
  "weight_kg": 70.5,             // optional
  "avatar_url": "https://...",   // optional
  "full_body_image_url": "https://..." // optional
}
```
- **Response** (200 OK): Same as GET response với updated data

---

## 4. Logout & Protected Routes Flow

### Flow Diagram - Logout

```
[User] → [Click Logout Button] → [Frontend]
     ↓
Clear localStorage (token, user info) → Redirect to Landing/Login
```

### Flow Diagram - Protected Routes

```
[User] → [Navigate to Protected Route] → [Frontend Route Guard]
     ↓
Check Token Exists?
  ├─ Yes → Verify Token Valid?
  │   ├─ Yes → Allow Access
  │   └─ No → Redirect to /login
  └─ No → Redirect to /login
```

### Detailed Steps - Logout

1. **User clicks logout button**
2. **Frontend processing**:
   - Remove `token` from localStorage
   - Clear user state/context
   - Redirect to `/` (landing page) or `/login`
3. **No API call needed** (stateless JWT)

### Detailed Steps - Protected Routes

1. **User navigates to protected route** (e.g., `/profile`)
2. **Route guard checks**:
   - Token exists in localStorage?
   - If not → Redirect to `/login`
3. **If token exists**:
   - Include token in API requests
   - Backend verifies token on each request
   - If token invalid/expired → Backend returns 401
   - Frontend catches 401 → Clear token → Redirect to `/login`

### Protected Routes List

- `/profile` - User profile page
- `/dashboard` - User dashboard (future)
- Any route requiring authentication

### Public Routes

- `/` - Landing page
- `/login` - Login page
- `/register` - Register page

### Implementation Example (React Router)

```javascript
// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Usage
<Route 
  path="/profile" 
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  } 
/>
```

### API Request with Token

```javascript
// Axios interceptor (already configured in frontend/src/config/api.js)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401 response, redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## Summary

### Flow Sequence Summary

1. **Register** → Create account → Redirect to login
2. **Login** → Get JWT token → Save token → Redirect to profile
3. **Access Profile** → Verify token → Get/Update profile data
4. **Logout** → Clear token → Redirect to landing

### Security Checklist

- ✅ Password hashed với bcrypt
- ✅ JWT token với expiration (7 days)
- ✅ Token verification on protected routes
- ✅ Email unique constraint
- ✅ Input validation (client + server)
- ✅ Error messages không leak sensitive info
- ✅ CORS configured correctly

### Next Steps

- Implement Task 5: Register API + UI
- Implement Task 6: Login API + UI
- Implement Task 7: Profile API + UI
