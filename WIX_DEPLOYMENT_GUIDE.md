# BCA Finance App - Wix Website Integration Guide

## Your Setup
- **Website Platform:** Wix
- **Website URL:** https://www.bostonchristian.net/
- **Finance App URL:** https://finances.bostonchristian.net/

---

## What I Recommend for Wix

### **BEST APPROACH: Separate Subdomain (External Link)**

```
Your Wix Site: www.bostonchristian.net
        ↓
    [Finance Portal] link in Wix navigation
        ↓
Finance App: finances.bostonchristian.net
        ↓
Full professional app (not embedded)
```

**Why this is best for Wix:**
- ✅ Wix has limitations for external apps
- ✅ Finance app works best as standalone
- ✅ No Wix performance impact
- ✅ Easy to maintain separately
- ✅ Professional look

---

## Deployment Steps

### STEP 1: Create Production Firebase Project (15 min)

1. Go to: https://console.firebase.google.com/
2. Click "Create a project"
3. Name: `bca-finance-prod`
4. Click "Create project"
5. Wait for completion (~2 minutes)

---

### STEP 2: Deploy App to Firebase Hosting (15 min)

#### Install Firebase CLI:
```bash
npm install -g firebase-tools
```

#### Login:
```bash
firebase login
```

#### Navigate to project:
```bash
cd C:\Users\User\Learning\bca_finance
```

#### Initialize:
```bash
firebase init hosting
```

When prompted:
- Which project? → `bca-finance-prod`
- Public directory? → `.` (current)
- Single page app? → Yes
- Overwrite index.html? → No

#### Deploy:
```bash
firebase deploy --only hosting
```

**Your app is live at:** `https://bca-finance-prod.web.app`

---

### STEP 3: Update App Config (10 min)

**File:** `js/firebase.js`

Get production config from Firebase Console → Project Settings → Your apps

Replace with production config, then:
```bash
firebase deploy --only hosting
```

---

### STEP 4: Set Security Rules (10 min)

Firebase Console → Firestore → Rules

Replace with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Click "Publish"

---

### STEP 5: Set Up Wix Subdomain (30 min)

#### Check Your Domain Registrar

Where did you buy the domain `bostonchristian.net`?
- Wix itself? (most common)
- GoDaddy?
- Namecheap?
- Other?

#### If Domain is with Wix (Most Likely)

1. Log in to Wix
2. Go to: Dashboard → Domains (or Settings → Domains)
3. Click "Manage DNS"
4. Look for DNS settings
5. Add DNS Record:
   - **Type:** CNAME
   - **Name:** finances
   - **Value:** c.storage.googleapis.com
6. Save

#### If Domain is NOT with Wix

Go to your registrar (GoDaddy, Namecheap, etc.) and add CNAME record same as above.

---

### STEP 6: Add to Firebase Hosting (15 min)

1. Firebase Console → Hosting → Domains
2. Click "Add custom domain"
3. Enter: `finances.bostonchristian.net`
4. Verify DNS
5. Firebase creates SSL certificate (automatic)

**Wait 24-48 hours for DNS propagation**

---

### STEP 7: Add Link to Wix Navigation (10 min)

#### In Wix Editor:

1. Log in to Wix → Edit Website
2. Click on your **Navigation Menu**
3. Click the **Edit** button (pencil icon)
4. Click **Add Item**
5. Choose **Link** (not "Page")
6. Set:
   - **Label:** "💰 Finance Portal"
   - **URL:** `https://finances.bostonchristian.net`
7. Click **Add**
8. Drag to position in menu (or leave at bottom)
9. Click outside to close
10. Click **Publish** (top right)

**Done!** Link is now in your Wix navigation.

---

### STEP 8: Migrate Data (30 min)

#### Export from Personal Firebase:
- Firestore → Collections → Select → Export as JSON

**Export:**
- members
- budget
- income
- expense
- events
- users

#### Import to Production Firebase:
- Firestore → Import → Select JSON file

---

### STEP 9: Create User Accounts (20 min)

**In Firebase Console:**
1. Authentication → Add user
2. Email: `john@bostonchristian.net`
3. Password: [strong password]
4. Create

**In App (Users & Roles):**
1. Users & Roles → Add User
2. Select member
3. Select role
4. Save

---

### STEP 10: Test Everything (30 min)

#### Test 1: Visit finance app
```
https://finances.bostonchristian.net
```
Should show login ✓

#### Test 2: Test login
- Email: (test user)
- Password: (test password)
Should show dashboard ✓

#### Test 3: Test Wix link
1. Go to: https://www.bostonchristian.net/
2. Click "Finance Portal" in menu
3. Should go to finances.bostonchristian.net ✓

#### Test 4: Mobile test
1. Visit Wix site on phone
2. Open mobile menu
3. Click Finance Portal
4. Should work ✓

---

## Wix-Specific Notes

### ✅ What Works Great
- External links in navigation ✓
- Custom subdomains ✓
- Different HTTPS domains ✓
- Analytics still work ✓
- No Wix interference ✓

### ⚠️ Limitations of Wix
- Can't embed full web app (Wix doesn't support iframes well)
- Can't integrate authentication (separate login needed)
- Can't style app to match Wix theme (separate app)
- Mobile menu might not show all links (depends on Wix menu type)

### ✅ Solutions
- External link approach (recommended) - works perfectly
- Opens in new tab or same tab (your choice)
- Fully professional and separate

---

## How Your Site Will Look

### Navigation Menu
```
Home | About | Services | 💰 Finance Portal | Contact
```

### On Mobile
```
☰ Menu
  Home
  About
  Services
  Finance Portal ← Add here
  Contact
```

### When User Clicks "Finance Portal"
```
Opens: https://finances.bostonchristian.net
Shows: Login page
User: Logs in
Access: Full finance app
```

---

## Adding to Wix - Visual Steps

### Step 1: Edit Navigation
```
Wix Dashboard
    ↓
Click "Edit" next to menu
    ↓
See menu items list
    ↓
Click "Add Item"
```

### Step 2: Add Link
```
Choose "Link" (not "Page")
    ↓
Enter Label: "Finance Portal"
    ↓
Enter URL: "https://finances.bostonchristian.net"
    ↓
Click "Add"
```

### Step 3: Save
```
Click outside menu editor
    ↓
Click "Publish"
    ↓
Changes go live
```

---

## Domain Configuration for Wix

### If Domain is with Wix (Most Common)

Wix Dashboard:
1. Settings → Domains
2. Click "Manage DNS"
3. Add Record:
   - Type: CNAME
   - Name: finances
   - Value: c.storage.googleapis.com
4. Save

### If Domain is Elsewhere

Your registrar settings:
1. Log in to registrar (GoDaddy, etc.)
2. Find DNS settings
3. Add CNAME record (same info as above)
4. Save

---

## Wix Menu Types

### Type 1: Standard Menu (Easiest)
- Shows all items in header
- Perfect for "Finance Portal" link
- Recommended

### Type 2: Hamburger Menu
- Mobile-friendly dropdown
- Finance link will be in dropdown
- Works great

### Type 3: Custom Menu
- Your menu design
- Can add Finance link anywhere
- You control placement

**Your link will work with ANY menu type!**

---

## Complete Timeline

### Week 1: Deployment
- **Monday:** Firebase setup + deploy (1 hour)
- **Tuesday:** Add DNS record (30 min)
- **Wednesday:** Add Wix link (10 min)
- **Thursday:** Migrate data (30 min)
- **Friday:** Create users & test (1 hour)

### Week 2: Launch
- **Monday:** Train team
- **Tuesday:** Go live
- **Wed-Fri:** Support

---

## Cost

**Monthly:**
- Firebase Hosting: $0 (free tier)
- Firestore: $0-15 (depends on usage)
- Firebase Auth: $0 (unlimited)
- Wix: You already pay for it
- Domain: Already with Wix

**Total: $0-20/month** (likely FREE)

---

## Wix-Specific Tips

### Tip 1: Menu Item Text
Use clear text:
- "Finance Portal" ✓
- "💰 Finance" ✓
- "Church Finance" ✓
- "Treasurer" ✗ (unclear)

### Tip 2: Menu Position
Add near end of menu:
```
Home | About | Services | Contact | Finance Portal
                                   ← Add here
```

Or in Resources section if you have one.

### Tip 3: Mobile Menu
Make sure Finance link shows on:
- Desktop menu ✓
- Mobile dropdown menu ✓
- Tablet view ✓

### Tip 4: Open Method
When link is clicked:
- Same window (user leaves site, can go back)
- New tab (user keeps your site open)

Wix default is same window - that's fine!

---

## Testing Checklist

- [ ] Firebase deployed to web.app URL
- [ ] Firebase config updated
- [ ] DNS record added for finances.bostonchristian.net
- [ ] Firebase Hosting domain verified
- [ ] Wix navigation updated with Finance link
- [ ] Data migrated to production Firebase
- [ ] User accounts created
- [ ] Login works on finance app
- [ ] Wix link goes to finance app
- [ ] Works on desktop
- [ ] Works on mobile
- [ ] HTTPS enabled (lock icon)
- [ ] No console errors (F12)

---

## Troubleshooting

### Finance link on Wix not working
**Problem:** Link saved incorrectly
**Fix:** Re-edit menu → check URL is exactly: `https://finances.bostonchristian.net`

### finances.bostonchristian.net shows error
**Problem:** DNS not propagated
**Fix:** Wait 24-48 hours, check https://dnschecker.org

### Login doesn't work
**Problem:** User not in Firebase Auth
**Fix:** Create user in Firebase Console → Authentication

### Data missing after migration
**Problem:** Import didn't complete
**Fix:** Re-import collections, ensure JSON format correct

---

## What Makes Wix Different

✅ **Advantages of using External Link:**
- Firebase runs separately
- No Wix limitations
- Full control of app
- Easy updates
- No conflicts

❌ **Why NOT to embed in Wix:**
- Wix blocks most iframes
- Can't share authentication
- Performance issues
- Limited customization
- Not recommended

**External link is the professional approach!**

---

## Your Setup Advantage

Since you're on Wix:
✅ Easy to add external links
✅ No server configuration needed
✅ Clean separation of concerns
✅ Professional appearance
✅ Scalable solution

---

## Next Steps

1. **Follow:** DEPLOYMENT_FOR_BOSTONCHRISTIAN_NET.md
   - Covers Steps 1-6 (Firebase + domain setup)

2. **Then:** Follow Section "STEP 7" above
   - Add link to Wix navigation (10 minutes)

3. **Then:** Continue with Steps 8-10
   - Migrate data, create users, test

---

## Quick Command Reference

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize hosting
firebase init hosting

# Deploy
firebase deploy --only hosting

# Check deployment
firebase hosting:list
```

---

## Support

**Wix Help:**
- Wix Support Center: https://www.wix.com/en-US/support
- Search: "Add link to menu" or "Edit navigation"

**Firebase Help:**
- Firebase Docs: https://firebase.google.com/docs
- Hosting Guide: https://firebase.google.com/docs/hosting

---

## Success!

When you're done:

✅ Wix site at: www.bostonchristian.net
✅ Finance link in Wix navigation
✅ Finance app at: finances.bostonchristian.net
✅ Team can access and use daily
✅ All secure and professional

---

## Your Wix Deployment Checklist

- [ ] Create production Firebase project
- [ ] Deploy app to Firebase Hosting
- [ ] Update app config with production settings
- [ ] Set Firestore security rules
- [ ] Add DNS record in Wix (CNAME for finances)
- [ ] Verify domain in Firebase
- [ ] Add "Finance Portal" link to Wix menu
- [ ] Publish Wix changes
- [ ] Migrate data to production
- [ ] Create user accounts
- [ ] Test everything works
- [ ] Share with team

**Ready to deploy? Follow the guides!** 🚀

