# Resend Email Integration Setup

## Overview
This replaces Supabase's built-in email auth with Resend for better control, reliability, and no rate limits.

---

## Step 1: Resend Account & API Key

1. Go to https://resend.com
2. Sign up (free 100 emails/day for testing)
3. Get your API key from https://resend.com/api-keys
4. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

---

## Step 2: Update `.env.local`

Copy from `.env.local.example` and fill in:

```bash
# Existing
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

# New for Resend
RESEND_API_KEY=re_xxxxxxxxxxxxx
ADMIN_EMAIL=admin@blanked.com
SUPABASE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx (generate a random string)
NEXT_PUBLIC_SITE_URL=http://localhost:3000 (or your production URL)
```

---

## Step 3: No Webhook Configuration Needed!

Emails are sent directly from the signup endpoint when a user creates an account. No webhook setup required! 🎉

The signup flow:
1. User submits form → Supabase creates account
2. Signup page sends confirmation email via `/api/email/confirmation`
3. Signup page sends admin notification via `/api/email/admin-notification`
4. User sees "Check your email" message

All handled automatically. Nice and clean!

---

## Step 4: Verify Setup

1. Go to http://localhost:3000/signup?type=chef
2. Fill form with test email
3. Click "Create Account"
4. Check:
   - ✅ Your inbox for confirmation email from Resend
   - ✅ Admin inbox (admin@blanked.com) for signup notification
   - ✅ Console/logs for any errors

---

## Email Templates

### Confirmation Email
- Sent to: User's email
- From: noreply@blanked.com
- Contains: Confirmation link + instructions

### Admin Notification
- Sent to: `ADMIN_EMAIL` env var
- From: noreply@blanked.com
- Contains: User name, type (chef/landlord/customer), email, business name, phone, address

---

## Production Notes

1. **Domain Verification:** Resend requires you to verify your sending domain
   - Go to Resend dashboard → Domains → Add domain
   - Add DNS records (DKIM, SPF, DMARC)
   - This improves deliverability

2. **Paid Plan:** Free tier = 100 emails/day
   - Upgrade for unlimited emails ($20/month)
   - Pay as you go option also available

3. **Email From Address:** Update `noreply@blanked.com` to your actual domain
   - Must match your verified domain in Resend

4. **Production URL:** Update `NEXT_PUBLIC_SITE_URL` to your production domain

---

## Troubleshooting

### "email rate limit exceeded" error
- You're still using Supabase's built-in email auth
- Check that `RESEND_API_KEY` is set in `.env.local`
- Restart dev server

### Webhook not firing
- Check Supabase Webhooks logs in dashboard
- Verify URL is correct: `http://localhost:3000/api/webhooks/auth`
- For local testing, use ngrok to expose to internet

### Emails not arriving
- Check Resend dashboard → Logs for failed sends
- Verify email from address matches verified domain
- Check spam folder
- On free tier, some providers may rate-limit Resend

### Admin not getting notifications
- Check `ADMIN_EMAIL` env var is set
- Verify email address is correct
- Check Resend logs for failures

---

## Files Modified

- `src/lib/email.ts` — Email sending functions
- `src/app/api/webhooks/auth/route.ts` — Webhook handler
- `.env.local.example` — New env vars documented
- `src/app/signup/page.tsx` — (Already updated to remove photo uploads)

---

## What's Next

After setup, you can add Resend for:
- Password reset emails
- Booking confirmation emails
- Event reminder emails
- Admin alerts

All through one consistent system!
