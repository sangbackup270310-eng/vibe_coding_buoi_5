# Testing Guide - Sprint 1 Features

## Overview
This guide helps you test all the features implemented in Sprint 1.

## Prerequisites
- ✅ Backend running on http://localhost:3001
- ✅ Frontend running on http://localhost:3000
- ✅ Database migrations run (see `DATABASE_SETUP.md`)
- ✅ Supabase Storage buckets created

## Test Scenarios

### 1. Landing Page Test

**URL**: http://localhost:3000

**Expected Results**:
- ✅ Landing page loads with all sections
- ✅ Header with logo and navigation visible
- ✅ Hero section with gradient background
- ✅ Features section displays 3 feature cards
- ✅ "How it works" section shows 3 steps
- ✅ CTA section visible
- ✅ Footer with links visible
- ✅ Responsive on mobile/tablet (resize browser)

**Navigation Test**:
- ✅ Click "Đăng nhập" → Goes to `/login`
- ✅ Click "Thử đồ ngay" → Stays on page (button not linked yet)
- ✅ Click logo → Goes to `/` (home)

---

### 2. Registration Test

**URL**: http://localhost:3000/register

#### Test Case 2.1: Successful Registration

**Steps**:
1. Fill in form:
   - Email: `newuser@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
   - Display Name: `New User` (optional)
2. Click "Create Account"
3. Should see success message
4. Should redirect to `/login`

**Expected Results**:
- ✅ Form validation passes
- ✅ Success message appears
- ✅ Redirects to login page
- ✅ User created in Supabase `profiles` table

**Verify in Supabase**:
- Go to Table Editor → `profiles`
- Find user with email `newuser@example.com`
- Check `password_hash` is hashed (not plain text)
- Check `display_name` is saved

#### Test Case 2.2: Email Already Exists

**Steps**:
1. Try to register with same email again
2. Should see error: "Email already registered"

**Expected Results**:
- ✅ Error message displayed
- ✅ Form not submitted
- ✅ User stays on register page

#### Test Case 2.3: Invalid Email Format

**Steps**:
1. Enter invalid email: `notanemail`
2. Try to submit

**Expected Results**:
- ✅ Client-side validation shows error
- ✅ Form not submitted
- ✅ Error: "Invalid email format"

#### Test Case 2.4: Weak Password

**Steps**:
1. Enter password: `123` (less than 8 chars)
2. Try to submit

**Expected Results**:
- ✅ Client-side validation shows error
- ✅ Error: "Password must be at least 8 characters"

#### Test Case 2.5: Password Mismatch

**Steps**:
1. Enter password: `password123`
2. Enter confirm password: `different123`
3. Try to submit

**Expected Results**:
- ✅ Client-side validation shows error
- ✅ Error: "Passwords do not match"

---

### 3. Login Test

**URL**: http://localhost:3000/login

#### Test Case 3.1: Successful Login

**Steps**:
1. Enter email: `newuser@example.com`
2. Enter password: `password123`
3. Click "Sign In"

**Expected Results**:
- ✅ Form validation passes
- ✅ JWT token saved to localStorage
- ✅ Redirects to `/profile`
- ✅ User info displayed on profile page

**Verify**:
- Open browser DevTools → Application → Local Storage
- Check `token` exists
- Check `user` object exists

#### Test Case 3.2: Invalid Credentials

**Steps**:
1. Enter wrong email or password
2. Click "Sign In"

**Expected Results**:
- ✅ Error message: "Invalid email or password"
- ✅ User stays on login page
- ✅ No token saved

#### Test Case 3.3: Empty Fields

**Steps**:
1. Leave email or password empty
2. Try to submit

**Expected Results**:
- ✅ Client-side validation shows errors
- ✅ Form not submitted

---

### 4. Profile Page Test

**URL**: http://localhost:3000/profile (requires login)

#### Test Case 4.1: Access Without Login

**Steps**:
1. Logout (if logged in)
2. Try to access `/profile` directly

**Expected Results**:
- ✅ Redirects to `/login`
- ✅ Cannot access profile page

#### Test Case 4.2: View Profile

**Steps**:
1. Login successfully
2. Navigate to `/profile`

**Expected Results**:
- ✅ Profile page loads
- ✅ Email displayed (read-only)
- ✅ Current profile data displayed (if any)
- ✅ Form fields are editable

#### Test Case 4.3: Update Profile

**Steps**:
1. On profile page, update:
   - Display Name: `Updated Name`
   - Height: `175` cm
   - Weight: `70.5` kg
2. Click "Save Profile"

**Expected Results**:
- ✅ Success message appears
- ✅ Profile data updated in Supabase
- ✅ Form shows updated values

**Verify in Supabase**:
- Go to Table Editor → `profiles`
- Check `display_name`, `height_cm`, `weight_kg` are updated
- Check `updated_at` timestamp changed

#### Test Case 4.4: Invalid Height/Weight

**Steps**:
1. Enter height: `50` (below 100)
2. Enter weight: `500` (above 250)
3. Try to save

**Expected Results**:
- ✅ Backend validation returns error
- ✅ Error message displayed
- ✅ Profile not updated

#### Test Case 4.5: Logout

**Steps**:
1. On profile page, click "Logout"

**Expected Results**:
- ✅ Token removed from localStorage
- ✅ User info removed
- ✅ Redirects to landing page (`/`)
- ✅ Cannot access `/profile` anymore

---

### 5. Protected Routes Test

#### Test Case 5.1: Access Protected Route

**Steps**:
1. Logout
2. Try to access `/profile` directly via URL

**Expected Results**:
- ✅ `ProtectedRoute` component redirects to `/login`
- ✅ After login, redirects back to `/profile`

#### Test Case 5.2: Token Expiration

**Steps**:
1. Login successfully
2. Manually remove token from localStorage
3. Try to access `/profile`

**Expected Results**:
- ✅ Redirects to `/login`
- ✅ API calls return 401 if token invalid

---

### 6. API Endpoints Test

#### Test 6.1: Health Check

```bash
curl http://localhost:3001/api/health
```

**Expected**: `{"status":"ok","message":"Try-on API is running"}`

#### Test 6.2: Register Endpoint

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"apitest@example.com","password":"password123","display_name":"API Test"}'
```

**Expected**: `{"message":"Registration successful","user":{...}}`

#### Test 6.3: Login Endpoint

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"apitest@example.com","password":"password123"}'
```

**Expected**: `{"token":"...","user":{...}}`

#### Test 6.4: Get Profile (Protected)

```bash
curl http://localhost:3001/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected**: Profile data JSON

#### Test 6.5: Update Profile (Protected)

```bash
curl -X PUT http://localhost:3001/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"height_cm":180,"weight_kg":75}'
```

**Expected**: Updated profile data JSON

---

## Test Checklist

### Frontend Tests
- [ ] Landing page displays correctly
- [ ] Register page form works
- [ ] Login page form works
- [ ] Profile page loads after login
- [ ] Profile update saves successfully
- [ ] Logout clears session
- [ ] Protected routes redirect when not logged in
- [ ] Error messages display correctly
- [ ] Success messages display correctly
- [ ] Responsive design works on mobile

### Backend Tests
- [ ] Health check endpoint works
- [ ] Register endpoint creates user
- [ ] Register endpoint validates email uniqueness
- [ ] Register endpoint hashes password
- [ ] Login endpoint verifies credentials
- [ ] Login endpoint generates JWT token
- [ ] Profile GET endpoint requires authentication
- [ ] Profile PUT endpoint updates data
- [ ] Profile PUT endpoint validates input
- [ ] Error handling returns appropriate status codes

### Integration Tests
- [ ] Register flow: Frontend → Backend → Database
- [ ] Login flow: Frontend → Backend → Database → Token storage
- [ ] Profile update flow: Frontend → Backend → Database
- [ ] Protected route: Frontend → Backend → Authentication check

---

## Common Issues & Solutions

### Issue: "Database not configured" error
**Solution**: Check `backend/.env` has correct Supabase credentials

### Issue: Registration returns 503
**Solution**: 
1. Verify Supabase connection
2. Check `profiles` table exists
3. Check backend logs

### Issue: Login returns 401
**Solution**:
1. Verify user exists in database
2. Check password is correct
3. Verify password hash in database

### Issue: Profile page shows 401
**Solution**:
1. Check token exists in localStorage
2. Verify token is valid (not expired)
3. Check Authorization header is sent

---

## Performance Testing

### Load Test Registration
- Register 10 users quickly
- Verify all users created
- Check database performance

### Concurrent Login
- Open multiple browser tabs
- Login with different users
- Verify no conflicts

---

## Security Testing

### Test Password Hashing
- Register a user
- Check database: password should be hashed (not plain text)
- Verify bcrypt hash format

### Test JWT Token
- Login and get token
- Decode token (use jwt.io)
- Verify token contains user_id and email
- Verify token expiration

### Test Input Validation
- Try SQL injection in email field
- Try XSS in display name
- Verify backend sanitizes input

---

## Next Steps After Testing

Once all tests pass:

1. ✅ Document any issues found
2. ✅ Fix bugs if any
3. ✅ Update documentation
4. 🚀 Ready for Sprint 2!
