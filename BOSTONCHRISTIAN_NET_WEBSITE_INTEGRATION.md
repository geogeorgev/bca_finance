# bostonchristian.net Integration - Website Setup Guide

## Your Website Information
- **Domain:** bostonchristian.net
- **Website:** https://www.bostonchristian.net/
- **Finance App URL:** https://finances.bostonchristian.net/

---

## Integration Options for Your Site

### Option 1: Add Navigation Link (EASIEST - 5 minutes)
```html
<a href="https://finances.bostonchristian.net">Finance Portal</a>
```

**How it looks:**
- User clicks "Finance Portal" on your website
- Opens finance app in same tab
- Finance app at different subdomain

### Option 2: Add as Embedded Page (INTERMEDIATE - 15 minutes)
Create new page on your website that embeds the app:

```html
<iframe src="https://finances.bostonchristian.net" 
        width="100%" 
        height="800px">
</iframe>
```

### Option 3: Full Integration (ADVANCED - 1 hour)
Integrate styling with your website theme

---

## BEST: Add Navigation Link

### Step 1: Know Your Website Platform

What platform is bostonchristian.net built on?

- [ ] WordPress
- [ ] Wix
- [ ] Squarespace
- [ ] Custom HTML
- [ ] Other: ___________

### Step 2: Add Link Based on Your Platform

#### IF WORDPRESS:

1. Dashboard → Appearance → Menus
2. Click your main menu
3. Click "Add items"
4. Look for "Links" section
5. Enter:
   - URL: `https://finances.bostonchristian.net`
   - Label: `💰 Finance Portal`
6. Click "Add to Menu"
7. Click "Save Menu"

Done! Finance link now appears in navigation.

---

#### IF WIX:

1. Click "Edit" on your site
2. In top left, click "+ Add"
3. Look for "Button" or "Link"
4. Click and drag to menu area
5. Click on the element
6. Set:
   - Text: "Finance Portal"
   - Link: "https://finances.bostonchristian.net"
7. Click "Publish"

Done! Finance link now in navigation.

---

#### IF SQUARESPACE:

1. Click "Settings" gear
2. Scroll to "Website"
3. Click "Navigation"
4. Click "+ Add Page"
5. Look for "Link" option
6. Set:
   - Title: "Finance Portal"
   - URL: "https://finances.bostonchristian.net"
7. Click "Publish"

Done! Finance link now in navigation.

---

#### IF CUSTOM HTML:

Find your navigation section (usually `<nav>` or `<header>`)

Add this line:
```html
<a href="https://finances.bostonchristian.net">Finance Portal</a>
```

Or styled version:
```html
<a href="https://finances.bostonchristian.net" 
   class="nav-link">
  💰 Finance Portal
</a>
```

Save file. Done!

---

#### IF OTHER:

Tell me which platform and I'll provide exact instructions.

---

## Visual Placement Ideas

### In Navigation Menu
```
Home | About | Services | Finance Portal | Contact
```

### Dropdown Menu
```
Resources ▼
├─ Downloads
├─ Documents
└─ Finance Portal
```

### In Sidebar
```
Useful Links
├─ Members Directory
├─ Event Calendar
└─ Finance Portal
```

### As Button
```
┌─────────────────────┐
│ 💰 Finance Portal   │
└─────────────────────┘
```

---

## What Happens When User Clicks

```
User on www.bostonchristian.net/
         ↓
User sees "Finance Portal" link
         ↓
User clicks link
         ↓
Opens: https://finances.bostonchristian.net/
         ↓
Shows login page
         ↓
User logs in
         ↓
Uses finance app
         ↓
User can click back to main site
```

---

## Link Text Ideas

Choose what to display:

- **"Finance Portal"** - Professional
- **"Church Finance"** - Clear
- **"💰 Finance"** - With emoji
- **"Treasurer"** - Indicates purpose
- **"Reports"** - For financial reports
- **"Budget"** - For budget access
- **"Admin"** - For admin-only version

---

## Icon/Emoji Options

Add visual interest:
- 💰 Money bag
- 📊 Chart
- 📋 Clipboard
- 💼 Briefcase
- 🏦 Bank
- 📈 Trending up

Example:
```html
<a href="https://finances.bostonchristian.net">
  💰 Church Finance Portal
</a>
```

---

## Mobile Considerations

### Desktop Navigation
```
Home | About | Finance | Contact
```

### Mobile Menu
```
☰ Menu
  Home
  About
  Finance Portal ← Add here
  Contact
```

Make sure link is accessible on mobile too!

---

## Testing the Link

After adding the link:

### Test 1: Desktop
1. Go to https://www.bostonchristian.net/
2. Look for "Finance Portal" link
3. Click it
4. Should go to https://finances.bostonchristian.net/ ✓

### Test 2: Mobile
1. Visit site on phone
2. Open mobile menu
3. Click "Finance Portal"
4. Should go to finance app ✓

### Test 3: Login
1. On finance app
2. Try to log in with test account
3. Should work ✓

---

## If You Want Embedded Version

Create new page that shows app inside your site:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Church Finance - Boston Christian Assembly</title>
  <style>
    body { margin: 0; padding: 0; }
    #app { width: 100%; height: 100vh; border: none; }
  </style>
</head>
<body>
  <!-- Your site header/nav here -->
  <div style="background: #333; color: white; padding: 20px;">
    <h1>Finance Portal</h1>
  </div>
  
  <!-- Finance app embedded -->
  <iframe id="app" 
          src="https://finances.bostonchristian.net">
  </iframe>
  
  <!-- Your site footer here -->
</body>
</html>
```

Save this as `finance.html` in your site, then link to it.

---

## Complete Example Setup

### For WordPress Site:

1. **WordPress Menu Setup:**
   - Dashboard → Appearance → Menus
   - Edit Main Menu
   - Add Link: `https://finances.bostonchristian.net` | "Finance Portal"
   - Save

2. **Website Navigation Now Shows:**
   ```
   Home | About | Services | Finance Portal | Contact
   ```

3. **When User Clicks "Finance Portal":**
   - Goes to: `https://finances.bostonchristian.net`
   - Logs in
   - Uses finance app
   - Can always navigate back to main site

---

## Security Note

✅ The link is safe:
- Pointing to HTTPS (secure)
- Separate subdomain (isolated)
- Requires login (protected)
- Only church members access

---

## Support for Team

After you set it up, send team this:

```
📱 Finance Portal is Now Live!

You can access it from:
1. Click "Finance Portal" on our website (www.bostonchristian.net)
2. Or go directly to: https://finances.bostonchristian.net

Login with your email and password.

Need help? Contact: [your email]
```

---

## What If You Don't Have Website Access?

If you can't edit the website yourself:

**Contact your web hosting provider:**
- Tell them: "Add link in navigation menu"
- Give them: "Finance Portal" → "https://finances.bostonchristian.net"
- They'll do it in 5 minutes

Most hosting provides FREE website updates!

---

## Timeline

### Today:
- [ ] Add link to website

### This Week:
- [ ] Deploy finance app (see DEPLOYMENT_FOR_BOSTONCHRISTIAN_NET.md)
- [ ] Test link works

### Next Week:
- [ ] Create user accounts
- [ ] Train team
- [ ] Go live

---

## Checklist

- [ ] Know what platform your website uses
- [ ] Have access to edit website (or contact provider)
- [ ] Know URL of finance app: `https://finances.bostonchristian.net`
- [ ] Decide link text: "Finance Portal" or other
- [ ] Add link to navigation
- [ ] Test link on desktop
- [ ] Test link on mobile
- [ ] Verify finance app login works

---

## Quick Commands

If you need to modify quickly via HTML/CSS:

```html
<!-- Add to your navigation -->
<li><a href="https://finances.bostonchristian.net">Finance Portal</a></li>

<!-- Or with styling -->
<li><a href="https://finances.bostonchristian.net" 
       style="color: #667eea; font-weight: bold;">
       💰 Finance Portal
</a></li>
```

---

## Done!

That's it! Your website now includes a link to the finance portal.

Users can:
1. Visit your main site
2. Click Finance Portal
3. Access the finance app
4. All integrated seamlessly

**Next:** Follow DEPLOYMENT_FOR_BOSTONCHRISTIAN_NET.md to actually deploy the app!

---

## Questions?

**Tell me:**
1. What platform is your website? (WordPress, Wix, etc.)
2. Can you edit the website yourself?
3. If not, do you have contact info for who maintains it?

Then I can give exact step-by-step for YOUR site!

