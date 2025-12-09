# 🚀 Quick Vercel Deployment Guide

## Step-by-Step Deployment

### 1️⃣ Prepare Supabase (5 minutes)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the content from `supabase/migrations/001_initial_schema.sql`
4. Click "Run" to execute the migration
5. Verify tables are created in Table Editor

### 2️⃣ Connect to Vercel (2 minutes)

**Option A: Via Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect Next.js

**Option B: Via CLI**
```bash
npm i -g vercel
vercel login
vercel
```

### 3️⃣ Configure Environment Variables (3 minutes)

In Vercel Dashboard → Your Project → Settings → Environment Variables

Add these 4 variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://monfinancement.co` | Production |
| `NEXT_PUBLIC_SITE_NAME` | `Monfinancement` | Production, Preview, Development |

**Where to find Supabase credentials:**
- Go to Supabase Dashboard
- Click on your project
- Go to Settings → API
- Copy "Project URL" and "anon public" key

### 4️⃣ Deploy (1 minute)

Click "Deploy" in Vercel dashboard or:

```bash
vercel --prod
```

### 5️⃣ Configure Custom Domain (5 minutes)

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add domain: `monfinancement.co`
3. Add domain: `www.monfinancement.co`
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

---

## 🔍 Verification Checklist

After deployment, verify:

- [ ] Site loads at Vercel URL (e.g., `your-project.vercel.app`)
- [ ] Homepage displays correctly
- [ ] Language switcher works
- [ ] Can navigate to `/fr`, `/en`, `/es`, `/de`, `/it`, `/pt`
- [ ] Registration page loads (`/auth/register`)
- [ ] Login page loads (`/auth/login`)
- [ ] No console errors in browser DevTools

---

## ⚠️ Common Issues & Solutions

### Issue: "Module not found" error
**Solution**: 
```bash
# Redeploy with fresh install
vercel --prod --force
```

### Issue: Environment variables not working
**Solution**:
1. Verify variables are set for "Production" environment
2. Redeploy after adding variables
3. Check variable names match exactly (case-sensitive)

### Issue: Supabase connection fails
**Solution**:
1. Verify SUPABASE_URL includes `https://`
2. Check SUPABASE_ANON_KEY is the "anon public" key, not service key
3. Ensure Supabase project is not paused

### Issue: 404 on all routes
**Solution**:
1. Check `middleware.ts` is present
2. Verify `i18n/routing.ts` configuration
3. Clear Vercel cache and redeploy

---

## 📊 Expected Build Output

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    137 B          87.2 kB
├ ○ /_not-found                          871 B          85.9 kB
└ ○ /[locale]                            137 B          87.2 kB
    ├ ○ /[locale]/auth/login             5.2 kB         92.4 kB
    └ ○ /[locale]/auth/register          5.8 kB         93.0 kB

○  (Static)  prerendered as static content
```

---

## 🎯 Quick Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]
```

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Vercel Support**: https://vercel.com/support

---

## ✅ Deployment Complete!

Once deployed successfully:

1. ✅ Test all features on production URL
2. ✅ Configure custom domain
3. ✅ Set up monitoring (Vercel Analytics)
4. ✅ Enable error tracking
5. ✅ Share with stakeholders

**Congratulations! Your app is live! 🎉**
