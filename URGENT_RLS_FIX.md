# 🚨 URGENT: Fix RLS Policies for Application Creation

## Problem
Users cannot create funding applications. Error:
```
"new row violates row-level security policy for table \"funding_applications\""
```

**Root Cause:** The existing RLS policies use `auth.uid()` from Supabase Auth, but we're using custom phone+PIN authentication. Since `auth.uid()` is always NULL, all database operations are blocked.

## Solution
Run the new migration `003_fix_rls_policies.sql` to update RLS policies for custom authentication.

## Deployment Steps

### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase Dashboard → **SQL Editor**
2. Copy the entire content of `supabase/migrations/003_fix_rls_policies.sql`
3. Paste into the SQL Editor
4. Click **Run**
5. Verify success message appears

### Option 2: Supabase CLI
```bash
supabase db push
```

## What This Migration Does

1. **Drops old RLS policies** that relied on Supabase Auth (`auth.uid()`)
2. **Creates new public policies** that allow access for custom auth system
3. **Updates all tables:**
   - `users`
   - `funding_applications`
   - `application_documents`
   - `admin_users`
   - `contact_preferences`
   - `site_configuration`

## Verification

After running the migration, test:

1. **Create Application:**
   - Login to the application
   - Navigate to `/application/new`
   - Enter funding amount
   - Should create successfully without RLS errors

2. **SQL Verification:**
```sql
-- Check policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'funding_applications', 'application_documents');
```

Expected output should show policies like:
- `Allow public select on applications`
- `Allow public insert on applications`
- `Allow public update on applications`

## Security Considerations

**Current Approach:**
- Public RLS policies (necessary for custom auth)
- Security managed at application level via session tokens in localStorage
- Client validates session expiry before operations

**Production Recommendations:**
1. Implement server-side session validation
2. Create a `session_tokens` table in database
3. Update RLS policies to check against valid sessions:
   ```sql
   CREATE POLICY "Users can insert with valid session"
   ON funding_applications FOR INSERT
   WITH CHECK (
     EXISTS (
       SELECT 1 FROM session_tokens st
       WHERE st.token_hash = encode(digest(current_setting('request.headers')::json->>'session-token', 'sha256'), 'hex')
       AND st.user_id = funding_applications.user_id
       AND st.expires_at > NOW()
     )
   );
   ```

## Troubleshooting

### Error: "permission denied for table funding_applications"
- Ensure you're running the SQL as the database owner or superuser
- In Supabase dashboard, you should have admin access by default

### Error: "policy already exists"
- The migration script includes `DROP POLICY IF EXISTS` statements
- If you still see this error, manually drop the conflicting policy first

### Application still can't insert
1. Check browser console for exact error
2. Verify migration ran successfully
3. Check if session token exists in localStorage:
   ```javascript
   console.log(localStorage.getItem('session_token'))
   console.log(localStorage.getItem('user_id'))
   ```

## Testing Checklist

- [ ] Migration runs without errors
- [ ] User can login successfully
- [ ] User can navigate to `/application/new`
- [ ] User can enter funding amount and proceed
- [ ] Application record created in `funding_applications` table
- [ ] No RLS violation errors in console

## Next Steps After Fix

Once the RLS policies are updated:
1. Test complete application flow (all 4 steps)
2. Verify document uploads work
3. Test application submission
4. Verify dashboard displays applications correctly
