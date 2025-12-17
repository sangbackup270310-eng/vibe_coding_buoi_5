# Database Setup Guide

## Overview
This guide will help you set up the Supabase database for the Try-on application.

## Prerequisites
- ✅ Supabase project created
- ✅ Supabase credentials added to `backend/.env`
- ✅ Backend server running

## Step 1: Run Database Migration

### Option A: Using Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run Migration Script**
   - Copy the contents of `migrations/001_create_profiles_table.sql`
   - Paste into the SQL Editor
   - Click "Run" (or press Ctrl+Enter)
   - You should see: "Success. No rows returned"

4. **Verify Table Created**
   - Go to "Table Editor" in the left sidebar
   - You should see the `profiles` table listed

### Option B: Using Supabase CLI (Advanced)

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migration
supabase db push
```

## Step 2: Create Storage Buckets

### Create `avatars` Bucket

1. **Go to Storage**
   - Click "Storage" in the left sidebar
   - Click "New bucket"

2. **Configure Bucket**
   - **Name**: `avatars`
   - **Public bucket**: ✅ Check this (Yes)
   - **File size limit**: 2 MB
   - **Allowed MIME types**: 
     - `image/jpeg`
     - `image/png`
     - `image/jpg`
   - Click "Create bucket"

### Create `full-body` Bucket

1. **Create Another Bucket**
   - Click "New bucket" again

2. **Configure Bucket**
   - **Name**: `full-body`
   - **Public bucket**: ✅ Check this (Yes)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: 
     - `image/jpeg`
     - `image/png`
     - `image/jpg`
   - Click "Create bucket"

## Step 3: (Optional) Insert Sample Data

If you want to test with sample users:

1. **Open SQL Editor**
   - Go to SQL Editor
   - Click "New query"

2. **Run Sample Data Script**
   - Copy the contents of `migrations/003_insert_sample_data.sql`
   - **Important**: Update the password hashes with real bcrypt hashes
   - Paste and run

   **Note**: The password hashes in the sample file are placeholders. To generate real hashes:
   ```javascript
   // In Node.js console or backend
   const bcrypt = require('bcryptjs');
   bcrypt.hash('password123', 10).then(hash => console.log(hash));
   ```

## Step 4: Verify Setup

### Test Database Connection

1. **Check Backend Logs**
   - Look for: `✅ Supabase connected successfully`
   - If you see warnings, check your `.env` file

2. **Test API Endpoints**
   - Health check: http://localhost:3001/api/health
   - Should return: `{"status":"ok","message":"Try-on API is running"}`

### Test Registration

1. **Open Frontend**: http://localhost:3000/register
2. **Fill Form**:
   - Email: `test@example.com`
   - Password: `password123` (min 8 chars)
   - Confirm Password: `password123`
   - Display Name: `Test User` (optional)
3. **Submit**
4. **Check Supabase**:
   - Go to Table Editor → `profiles`
   - You should see the new user record

### Test Login

1. **Open Frontend**: http://localhost:3000/login
2. **Login** with the credentials you just created
3. **Should redirect** to `/profile` page

## Troubleshooting

### Error: "relation 'profiles' does not exist"
- **Solution**: Run the migration script `001_create_profiles_table.sql`

### Error: "Invalid supabaseUrl"
- **Solution**: Check your `backend/.env` file has correct `SUPABASE_URL`

### Error: "new row violates row-level security policy"
- **Solution**: This shouldn't happen with our setup, but if it does, check RLS policies in Supabase

### Registration fails with 503 error
- **Solution**: 
  1. Verify Supabase credentials in `.env`
  2. Check backend logs for connection errors
  3. Ensure `profiles` table exists

### Storage upload fails
- **Solution**: 
  1. Verify buckets are created
  2. Check buckets are set to "Public"
  3. Verify file size limits

## Database Schema Reference

### `profiles` Table Structure

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Auto-generated user ID |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User email (login) |
| `password_hash` | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| `display_name` | VARCHAR(100) | NULL | Optional display name |
| `height_cm` | INTEGER | CHECK (100-250) | Height in cm |
| `weight_kg` | DECIMAL(5,2) | CHECK (30-250) | Weight in kg |
| `avatar_url` | TEXT | NULL | URL to avatar image |
| `full_body_image_url` | TEXT | NULL | URL to full-body image |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Account creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time |

## Next Steps

Once the database is set up:

1. ✅ Test registration flow
2. ✅ Test login flow
3. ✅ Test profile update
4. ✅ Test avatar upload (when implemented)
5. 🚀 Ready for Sprint 2 features!

## Quick Reference

- **Supabase Dashboard**: https://supabase.com/dashboard
- **SQL Editor**: Dashboard → SQL Editor
- **Table Editor**: Dashboard → Table Editor
- **Storage**: Dashboard → Storage
- **API Docs**: Dashboard → API → REST API
