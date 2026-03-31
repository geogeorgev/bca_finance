# BCA Finance App - Website Integration Guide

## Your Current Setup
- ✅ Website hosted somewhere (need to know where)
- ✅ Domain: `bostonchristian.org` (or similar)
- ❌ Finance app not yet integrated
- ❌ Still using personal Firebase project

---

## Integration Options

### Option 1: Separate Subdomain (RECOMMENDED)
```
Your website: bostonchristian.org
Finance app: finances.bostonchristian.org
```

**Pros:**
- Simplest to set up
- Independent from main website
- Can scale separately
- Easy to manage

**Cons:**
- Different domain feels separate
- Can't share styling easily

**Setup Time:** 30 minutes

---

### Option 2: Path-Based (finances.bostonchristian.org/app)
```
Your website: bostonchristian.org
Finance app: bostonchristian.org/app
```

**Pros:**
- Unified domain
- Feels like one website
- Easier to navigate

**Cons:**
- Requires server configuration
- More complex setup
- Shared server resources

**Setup Time:** 1-2 hours

---

### Option 3: Embedded (Iframe)
```
Your website: bostonchristian.org
Finance app: Embedded in a webpage
```

**Pros:**
- Part of existing website
- Share header/footer/navigation

**Cons:**
- Limited mobile experience
- Can't share session/cookies
- Users feel confined

**Setup Time:** 15 minutes

---

## RECOMMENDED: Option 1 - Separate Subdomain

### Step 1: Add Subdomain to Your Domain

**Where:** Your domain registrar (GoDaddy, Namecheap, etc.)

1. Log in to your domain registrar
2. Find DNS/Domain Settings
3. Add new DNS record:
   - **Type:** A
   - **Name:** finances
   - **Value:** `35.199.3.19` (Firebase's IP - will be replaced)

**Alternative:** Point to Firebase Hosting
   - **Type:** CNAME
   - **Name:** finances
   - **Value:** `c.storage.googleapis.com` (Firebase will give exact value)

Wait 24-48 hours for DNS to propagate.

### Step 2: Deploy App to Firebase Hosting

Follow the "Firebase Hosting" section in PRODUCTION_DEPLOYMENT_GUIDE.md

### Step 3: Add Custom Domain in Firebase

1. Firebase Console → Hosting → Domains
2. Click "Add Custom Domain"
3. Enter: `finances.bostonchristian.org`
4. Follow Firebase's verification steps
5. Firebase automatically creates SSL certificate

### Step 4: Test Access

Visit: `https://finances.bostonchristian.org`

Should show your app with HTTPS enabled.

---

## ADVANCED: Option 2 - Path-Based Integration

**This is more complex - requires server configuration**

### Prerequisites
- Access to your web hosting control panel
- Knowledge of .htaccess (Apache) or nginx config
- OR willing to contact hosting provider for help

### Setup (If Using Apache/htaccess)

**File:** `.htaccess` in root directory

```apache
# Proxy Finance App
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Route /app requests to Firebase Hosting
  RewriteRule ^app/(.*)$ https://bca-finance-prod.web.app/$1 [P,L]
</IfModule>
```

**Issue:** Cookies/sessions won't work properly across domains

### Better Approach: Reverse Proxy

Ask your hosting provider to set up reverse proxy:
```
bostonchristian.org/app → https://finances.bostonchristian.org
```

This way:
- URL stays as `/app`
- Session/cookies work
- Transparent to users

**Estimated Cost:** Free (most hosting includes) to $50/month

---

## SIMPLE: Option 3 - Embedded (Iframe)

### On Your Website

Add to your website page (e.g., `/finance.html`):

```html
<!DOCTYPE html>
<html>
<head>
  <title>Church Finance Portal</title>
  <style>
    body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
    #app-container { 
      width: 100%; 
      height: 100vh; 
      border: none;
    }
  </style>
</head>
<body>
  <!-- Your website header here (optional) -->
  <div style="background: #333; color: white; padding: 20px; text-align: center;">
    <h1>Boston Christian Assembly</h1>
    <h2>Church Finance Portal</h2>
  </div>
  
  <!-- Finance App Embedded -->
  <iframe id="app-container" 
          src="https://finances.bostonchristian.org"
          frameborder="0"
          scrolling="auto">
  </iframe>
  
  <!-- Your website footer here (optional) -->
  <script>
    // Auto-adjust iframe height
    window.addEventListener('load', function() {
      const iframe = document.getElementById('app-container');
      iframe.style.height = (window.innerHeight - 100) + 'px';
    });
  </script>
</body>
</html>
```

Link from your main website:
```html
<a href="/finance.html">Access Finance Portal</a>
```

**Limitations:**
- Mobile experience not ideal
- Can't share header/navigation
- Limited styling customization

---

## RECOMMENDED PATH

### Week 1:
1. Create production Firebase project
2. Deploy app to Firebase Hosting at `finances.bostonchristian.org`
3. Test access

### Week 2:
1. Migrate data
2. Create user accounts
3. Share with team

### Week 3:
1. Gather feedback
2. Make adjustments if needed
3. Go live to all users

---

## Website Menu Integration

Add to your website navigation:

```html
<!-- In your website nav -->
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/events">Events</a>
  <a href="https://finances.bostonchristian.org">💰 Finance Portal</a>
</nav>
```

### On Mobile
```html
<!-- Mobile menu -->
<a href="https://finances.bostonchristian.org" 
   class="mobile-menu-link">
  Finance Portal
</a>
```

### Styled Link
```html
<a href="https://finances.bostonchristian.org" 
   style="background: #667eea; 
          color: white; 
          padding: 10px 20px; 
          border-radius: 4px; 
          text-decoration: none; 
          font-weight: bold;">
  Access Finance Portal
</a>
```

---

## Current Website Questions

To help you better, please answer:

1. **Current Website:**
   - URL: `bostonchristian.org`?
   - Hosted where: Wix, WordPress, custom server, etc.?
   - Have you access to domain registrar?
   
2. **Preferred Integration:**
   - Separate subdomain: `finances.bostonchristian.org`?
   - Path-based: `bostonchristian.org/app`?
   - Embedded in page?
   
3. **Immediate Needs:**
   - Go live date?
   - Number of users?
   - Admin who manages users?

---

## Checklist for Website Integration

- [ ] Decide integration type (subdomain recommended)
- [ ] Check domain registrar access
- [ ] Create production Firebase project
- [ ] Deploy app to Firebase Hosting
- [ ] Configure custom domain
- [ ] Add subdomain to website navigation
- [ ] Create user accounts
- [ ] Test access from website
- [ ] Test access from mobile
- [ ] Share with team
- [ ] Get feedback
- [ ] Go live

---

## Domain Configuration Examples

### Example 1: GoDaddy
1. Log in → Domains
2. Click your domain → DNS
3. Add Record:
   - Type: A
   - Name: finances
   - Value: [Firebase will provide]
4. Save

### Example 2: Namecheap
1. Log in → Domain List
2. Manage Domain → Advanced DNS
3. Add New Record:
   - Type: A
   - Host: finances
   - Value: [Firebase will provide]
4. Save

### Example 3: Google Domains
1. Log in → My Domains
2. Click domain → DNS
3. Add Custom Record:
   - Name: finances
   - Type: A
   - Value: [Firebase will provide]
4. Save

---

## DNS Propagation

After adding DNS records:
- Usually 1-6 hours
- Sometimes up to 24-48 hours
- Check status: `https://dnschecker.org`
- Search: `finances.bostonchristian.org`

---

## Timeline & Effort

| Task | Time | Effort |
|------|------|--------|
| Set up Firebase project | 15 min | Low |
| Deploy to Hosting | 15 min | Low |
| Configure domain | 10 min | Low |
| Wait for DNS | 24-48 hrs | None |
| Migrate data | 30 min | Low |
| Test everything | 30 min | Low |
| Create user accounts | 30 min | Low |
| **Total Active Time** | **2.5 hours** | **Low** |

---

## Next Steps

1. **Answer the questions above** about your current setup
2. **Choose integration type** (subdomain recommended)
3. **Create production Firebase project** (see PRODUCTION_DEPLOYMENT_GUIDE.md)
4. **Deploy app to Firebase Hosting**
5. **Configure domain**
6. **Test and go live!**

Would you like me to create a specific step-by-step guide for your exact setup once you provide answers?

