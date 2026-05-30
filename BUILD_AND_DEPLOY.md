# IGO Agri Estates — Build & Deploy to Hostinger

## Step 1: Build the project on your Windows PC

Open a terminal (Command Prompt or PowerShell) in this folder and run:

```
npm run build
```

This creates/updates the `dist/` folder with all pages including the admin panel.

---

## Step 2: Confirm the `.htaccess` file is in `dist/`

After building, check that `dist/.htaccess` exists. If not, copy it manually:

```
copy public\.htaccess dist\.htaccess
```

(Vite automatically copies everything in `public/` into `dist/` during build — so this should happen automatically.)

---

## Step 3: Upload to Hostinger

1. Log in to Hostinger hPanel → **File Manager** (or use FTP)
2. Navigate to `public_html` (your domain's root folder)
3. **Delete all old files** in `public_html`
4. Upload **all files inside `dist/`** (not the dist folder itself, but its contents)

After upload, your `public_html` should look like:
```
public_html/
  .htaccess          ← CRITICAL — must be here
  index.html
  favicon.svg
  icons.svg
  assets/
    index-xxxx.js
    index-xxxx.css
  images/
  videos/
```

---

## Step 4: Test all routes

After upload, test these URLs in your browser:

| URL | Expected |
|-----|----------|
| `igoagriestate.com/` | Home page |
| `igoagriestate.com/admin` | Admin login page |
| `igoagriestate.com/admin/dashboard` | Redirects to admin login |
| `igoagriestate.com/listings` | Property listings |
| `igoagriestate.com/contact` | 404 page (contact is a section on Home, not a standalone page) |

---

## Admin Login

URL: `https://igoagriestate.com/admin`

Default password: `Admin@123`

**Change your password immediately after first login:**
1. Go to Admin Dashboard → Settings tab
2. Change the Admin Password field
3. Click Save Settings

---

## Common Hostinger Issues

**If `.htaccess` is not working:**
- Go to Hostinger hPanel → Advanced → `.htaccess Editor`
- Paste this content:
```
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ /index.html [QSA,L]
```

**If you see "500 Internal Server Error":**
- The `.htaccess` syntax is wrong or mod_rewrite is not enabled
- Contact Hostinger support to enable `mod_rewrite`

---

## Lead Management

All customer inquiries (site visit requests, WhatsApp clicks, contact forms, post requirements) are automatically:
1. Saved to your Supabase database (cloud)
2. If cloud fails → saved locally in the browser's admin session

To view leads: `igoagriestate.com/admin` → Login → Click **Leads** tab
