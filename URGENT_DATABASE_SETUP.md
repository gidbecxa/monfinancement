# 🔧 URGENT: Database Functions Setup

## Problem
The application is calling RPC functions (`register_user`, `authenticate_user`) that don't exist in the database, causing registration to fail.

## Solution
You need to run the authentication functions migration in Supabase.

## Steps to Fix

### Option 1: Run via Supabase Dashboard (RECOMMENDED)

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project: `monfinancement`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and Paste the SQL**
   - Open file: `supabase/migrations/002_auth_functions.sql`
   - Copy ALL content
   - Paste into the SQL Editor

4. **Run the Migration**
   - Click "Run" button (or press Ctrl+Enter / Cmd+Enter)
   - Wait for confirmation message
   - You should see: "✅ Auth functions migration completed successfully!"

5. **Verify Functions Exist**
   ```sql
   SELECT routine_name 
   FROM information_schema.routines 
   WHERE routine_schema = 'public' 
   AND routine_name IN ('register_user', 'authenticate_user', 'generate_user_pin');
   ```
   - Should return 3 rows

### Option 2: Run via Supabase CLI

```bash
# Make sure you're in the project directory
cd c:\Users\HP\Documents\monfinancement

# Link to your Supabase project (if not already linked)
npx supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
npx supabase db push
```

## Testing After Setup

### Test 1: Register a User
```sql
SELECT * FROM register_user('+1234567890');
```

Expected output:
```
user_id: [UUID]
pin: [6-digit number like "123456"]
message: "User registered successfully. Please save your PIN securely."
```

### Test 2: Authenticate User  
```sql
-- Use the PIN from Test 1
SELECT * FROM authenticate_user('+1234567890', 'YOUR_PIN_HERE');
```

Expected output:
```
user_id: [UUID]
session_token: [base64 string]
expires_at: [timestamp]
pin_regenerated: false
new_pin: null
message: "Login successful."
```

## What These Functions Do

### `register_user(p_phone_number)`
- Creates a new user account
- Generates a random 6-digit PIN
- Stores hashed PIN securely
- Returns the PIN to display to user (they must save it)

### `authenticate_user(p_phone_number, p_pin)`  
- Validates phone number and PIN
- Creates session token
- Tracks PIN usage count
- Auto-regenerates PIN after 100 uses for security
- Returns session info

### `generate_user_pin()`
- Helper function to generate random 6-digit PINs
- Uses cryptographically secure random numbers

## Important Notes

⚠️ **Temporary Implementation**
The current implementation stores hashed PINs in the `users.first_name` column as a quick workaround. For production, consider:
- Creating a dedicated `user_auth` table for PINs and sessions
- Implementing proper session management
- Adding rate limiting for login attempts
- Adding 2FA options

✅ **Security Features Included**
- PINs are hashed using bcrypt (cannot be reversed)
- Session tokens are random 32-byte values
- Automatic PIN rotation after 100 uses
- RLS policies enabled for data protection

## Troubleshooting

**Error: "relation 'users' does not exist"**
- Run the initial schema migration first: `supabase/migrations/001_initial_schema.sql`

**Error: "function already exists"**
- Safe to ignore - functions use CREATE OR REPLACE
- Or run: `DROP FUNCTION IF EXISTS register_user CASCADE;`

**Error: "permission denied"**
- Make sure you're running as superuser in Supabase
- Check that RLS is properly configured

## Next Steps After Setup

1. ✅ Run the migration
2. ✅ Test registration in the app
3. ✅ Test login in the app
4. ✅ Verify PIN regeneration works (after 100 logins)
5. ✅ Check that users can access dashboard
6. 📝 Consider implementing proper auth table structure before production launch

---

**Created:** January 14, 2026  
**Status:** URGENT - Required for app functionality  
**Impact:** Registration and login completely broken without this
