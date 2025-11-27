# Neonfolio - Hosting Setup Guide

## Quick Start - Upload to Your Hosting

### Files Included
```
neonfolio/
├── index.html              (Homepage - Main entry point)
├── pages/                  (All other pages)
│   ├── about.html
│   ├── contact.html
│   ├── login.html
│   ├── register.html
│   └── showcase.html
├── css/                    (Stylesheets - One per page)
│   ├── index.css
│   ├── about.css
│   ├── contact.css
│   ├── login.css
│   ├── register.css
│   └── showcase.css
├── js/                     (JavaScript files)
│   ├── nav-utils.js        (Shared utilities - loaded on all pages)
│   ├── index.js
│   ├── about.js
│   ├── contact.js
│   ├── login.js
│   ├── register.js
│   └── showcase.js
├── assets/                 (Images and SVG files)
├── .htaccess              (Apache configuration - optional)
├── robots.txt             (SEO configuration)
└── sitemap.xml            (SEO sitemap)
```

---

## Step 1: Extract the Archive
1. Download the `neonfolio.zip` file
2. Extract it using your preferred tool (WinRAR, 7-Zip, Built-in Windows extractor, etc.)
3. You should see a folder named `neonfolio`

---

## Step 2: Upload to Hosting
### Using FTP/SFTP (Most Common):
1. Open your FTP client (FileZilla, Cyberduck, WinSCP, etc.)
2. Connect to your hosting server using credentials from your hosting provider
3. Navigate to the public directory (usually `public_html`, `www`, or `httpdocs`)
4. Upload the entire `neonfolio` folder OR upload contents directly:
   - If uploading folder: Upload `neonfolio/` - Access via `yoursite.com/neonfolio`
   - If uploading contents: Upload all files/folders from inside `neonfolio/` - Access via `yoursite.com`

### Using File Manager (cPanel/Plesk):
1. Log in to your hosting control panel
2. Open File Manager
3. Navigate to public directory
4. Use "Upload" to upload the `neonfolio.zip` file
5. Right-click → "Extract" to decompress
6. Move files if needed (see upload options above)

---

## Step 3: Set Correct Permissions
- **Folders**: Set permissions to `755` (or allow read/write)
- **Files**: Set permissions to `644`
- **.htaccess**: Set to `644`

How to set:
- **FTP**: Right-click file/folder → Properties → Set permissions
- **File Manager**: Select → Permissions → Input values (755 for folders, 644 for files)

---

## Step 4: Test Your Website
1. Open your browser
2. Visit your domain (or `yoursite.com/neonfolio` if uploaded in subfolder)
3. Test all pages:
   - Home (index.html)
   - About (pages/about.html)
   - Showcase (pages/showcase.html)
   - Contact (pages/contact.html)
   - Login (pages/login.html)
   - Register (pages/register.html)

---

## Troubleshooting

### Issue: Pages show "404 Not Found"
- ✓ Check file paths are correct on your server
- ✓ Verify CSS and JS files are uploaded
- ✓ Check file permissions (should be 644)
- ✓ Try accessing via full URL: `yoursite.com/index.html`

### Issue: Styles not loading
- ✓ Check CSS file paths in browser DevTools (F12 → Network tab)
- ✓ Verify CSS files have correct permissions (644)
- ✓ Clear browser cache (Ctrl+Shift+Delete)
- ✓ Check that files are in `css/` folder

### Issue: JavaScript not working
- ✓ Open browser console (F12 → Console tab)
- ✓ Check for 404 errors on JS files
- ✓ Verify JS files uploaded to `js/` folder
- ✓ Check that nav-utils.js loads before page-specific JS files

### Issue: Forms not accepting input
- ✓ Data is stored in browser localStorage (demo functionality)
- ✓ This is normal - no backend is currently connected
- ✓ Refresh page - data persists within same browser
- ✓ To connect a backend, contact a developer

---

## Optional Configurations

### Setting index.html as Default
Most hosts automatically serve `index.html` as default. If not:
- Add to `.htaccess`: `DirectoryIndex index.html`
- Upload the `.htaccess` file included in the package

### Custom Domain
1. Update DNS settings to point to your hosting
2. Configure domain in hosting control panel
3. Update Open Graph URLs in HTML files (optional):
   - Replace `https://neonfolio.com` with your domain in `og:url` meta tags

### SSL Certificate (HTTPS)
1. Request SSL certificate from hosting provider (usually free)
2. Enable HTTPS in hosting control panel
3. Update canonical URLs to use `https://`

---

## Performance Optimization

### Already Included:
✓ Minified CSS and JavaScript  
✓ Lazy-loaded assets  
✓ Mobile-first responsive design  
✓ Optimized images  
✓ Browser caching headers  

### You Can Further Improve:
- Enable GZIP compression on server
- Use CDN for assets (optional)
- Minify remaining CSS/JS (optional)
- Optimize images further (TinyPNG, ImageOptim)

---

## Security

### Already Included:
✓ No external API calls  
✓ No database connections  
✓ Input validation on forms  
✓ robots.txt for SEO  

### Recommended:
- Keep `.htaccess` updated with latest rules
- Regularly back up your files
- Monitor server logs for errors
- Keep hosting software updated

---

## Common Hosting Providers & Instructions

### **Bluehost/SiteGround/Hostinger**
1. Use File Manager in cPanel
2. Upload ZIP → Extract
3. Set permissions 755 for folders, 644 for files
4. Done!

### **GoDaddy**
1. Use GoDaddy File Manager
2. Navigate to `/public_html`
3. Upload files via drag-and-drop
4. Extract if uploaded as ZIP

### **NameCheap/Hostgator**
1. FTP into `public_html` using provided credentials
2. Upload all files/folders
3. Set permissions (if FTP supports it)
4. Access via FTP client or File Manager

### **AWS/DigitalOcean (Advanced)**
1. Use SCP to upload: `scp -r neonfolio/* user@server:/var/www/`
2. Set permissions: `chmod 755 css/ js/ assets/`
3. Configure web server (Apache/Nginx)
4. Restart web server

---

## Database & Email Setup (Optional Future Enhancement)

To connect real authentication and email:
1. Create backend API (Node.js, PHP, Python, etc.)
2. Update form submission handlers in `js/` files
3. Set up database (MySQL, MongoDB, PostgreSQL)
4. Configure email service (SendGrid, Mailgun, etc.)

Contact a web developer for this integration.

---

## Support & Help

### Check Files Are Present:
```
✓ index.html present and 170+ lines
✓ pages/about.html, contact.html, login.html, register.html, showcase.html
✓ css/ folder with 5+ CSS files (index.css, about.css, etc.)
✓ js/ folder with 7+ JS files (nav-utils.js, index.js, etc.)
✓ assets/ folder with images
```

### Browser Console Errors?
- F12 → Console tab → Check for red errors
- Most common: 404 errors on CSS/JS files
- Solution: Re-upload files to correct folder

### Site Still Broken After Upload?
1. Force refresh browser: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. Clear browser cache completely
3. Try incognito/private mode
4. Contact your hosting provider support

---

## File Size Reference

- **Total package size**: ~2.5 MB (including images)
- **HTML files**: ~50 KB
- **CSS files**: ~45 KB
- **JavaScript files**: ~35 KB
- **Images/Assets**: ~2.4 MB

---

**Website Status**: ✅ Production Ready  
**Last Updated**: November 27, 2025  
**Framework**: Vanilla HTML5 + CSS3 + JavaScript (No dependencies)  
**Hosting**: Works on any standard web hosting (Apache/Nginx)
