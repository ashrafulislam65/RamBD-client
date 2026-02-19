# How to Deploy to cPanel (Standalone Mode)

This guide explains how to deploy your Next.js application to cPanel using the optimized **Standalone Mode**.

## Prerequisites
- **Node.js**: Ensure cPanel has Node.js (recommended version 18 or 20).
- **Domain/Subdomain**: Have your domain or subdomain ready in cPanel.

## Step 1: Prepare Files Locally
Make sure you have run the build command:
```bash
npm run build
```

## Step 2: Files to Upload
Upload the following files and folders from your project root to your cPanel application root (usually `public_html` or a subdirectory):

1.  **`.next/`** folder (specifically `.next/standalone` and `.next/static`)
2.  **`public/`** folder
3.  **`server.js`** (Root file)
4.  **`.htaccess`** (Root file)
5.  **`package.json`** (Root file)
6.  **`.env`** (If you have environment variables)

> [!IMPORTANT]
> To save upload time and ensure performance, follow these structure rules after uploading:
> - Move the contents of `.next/static` to `.next/standalone/.next/static`
> - Move the contents of `public` to `.next/standalone/public`

## Step 3: Configure cPanel Node.js Selector
1. Log in to **cPanel**.
2. Go to **Setup Node.js App**.
3. Click **Create Application**.
4. Set:
   - **Node.js version**: 18.x or 20.x
   - **Application mode**: `production`
   - **Application root**: Path to your files (e.g., `public_html`)
   - **Application URL**: Your domain
   - **Application startup file**: `server.js`
5. Click **Create**.
6. Click **Run JS Install** (if needed, but standalone doesn't strictly need it if you upload the `.next/standalone` dependencies).

## Step 4: Final Verification
Visit your website URL. If you see your app, it's successful!

---

### Why Standalone Mode?
- **Faster Start**: Doesn't need `node_modules` at the root.
- **Smaller Size**: Only bundles necessary code.
- **Stable**: Optimized for production environments like cPanel.
