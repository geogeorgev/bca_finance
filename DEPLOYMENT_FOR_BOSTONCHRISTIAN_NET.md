# BCA Finance App - Deployment for bostonchristian.net

## Your Website: https://www.bostonchristian.net/

This guide is customized for your exact domain and website.

---

## Recommended Approach for Your Site

### **BEST OPTION: Subdomain**
```
Your Website: www.bostonchristian.net/
Finance App:  finances.bostonchristian.net/
```

**Advantages:**
- ✅ Separate app, independent from main site
- ✅ Can be updated without affecting website
- ✅ Professional appearance
- ✅ Easy to manage
- ✅ Fastest setup

**URLs:**
- Main site: `https://www.bostonchristian.net/`
- Finance app: `https://finances.bostonchristian.net/`
- Can also use: `https://finance.bostonchristian.net/` or `https://admin.bostonchristian.net/`

---

## Step-by-Step Deployment (3 Hours)

### STEP 1: Create Production Firebase Project (15 min)

1. Go to: https://console.firebase.google.com/
2. Click **"Create a project"**
3. Name it: `bca-finance-prod`
4. Enable Analytics: Optional
5. Click **"Create project"**
6. Wait for completion (~2 minutes)

---

### STEP 2: Deploy App to Firebase Hosting (15 min)

#### Install Firebase CLI:
```bash
npm install -g firebase-tools
```

#### Login to Firebase:
```bash
firebase login
```
Browser opens - log in with Google account

#### Navigate to Your Project:
```bash
cd C:\Users\User\Learning\bca_finance
```

#### Initialize Firebase Hosting:
```bash
firebase init hosting
```

When prompted:
```
Which project? → Select "bca-finance-prod"
Public directory? → Type: . (current directory)
Single page app? → Yes
Overwrite index.html? → No
```

#### Deploy App:
```bash
firebase deploy --only hosting
```

**Output will show:**
```
✓ Deploy complete!
Hosting URL: https://bca-finance-prod.web.app
```

Your app is now live at: `https://bca-finance-prod.web.app`

---

### STEP 3: Update App with Production Config (10 min)

#### Get Production Firebase Config:

1. Firebase Console → **Project Settings** (gear icon)
2. Scroll down → **"Your apps"**
3. Click **Web** app (create if needed)
4. Copy the entire config object

#### Update Your App:

**File:** `js/firebase.js`

Replace OLD config:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_OLD_KEY",
  authDomain: "YOUR_OLD_DOMAIN",
  projectId: "YOUR_OLD_PROJECT",
  // ... old config ...
};
```

With NEW config (from Firebase Console):
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxxxxx",
  authDomain: "bca-finance-prod.firebaseapp.com",
  projectId: "bca-finance-prod",
  storageBucket: "bca-finance-prod.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef1234567890"
};
```

#### Deploy Updated Config:
```bash
firebase deploy --only hosting
```

---

### STEP 4: Set Up Security Rules (10 min)

**Go to:** Firebase Console → Firestore → **Rules**

**Replace everything with:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can access
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Click **"Publish"**

---

### STEP 5: Add Custom Domain to Your Website (30 min)

#### Find Your Domain Registrar

Where did you buy `bostonchristian.net`?
- GoDaddy?
- Namecheap?
- Google Domains?
- Your web hosting provider?

**Log in there** and go to **DNS Settings**

#### Add DNS Record for Subdomain

**Type:** CNAME (or A record)

**For GoDaddy:**
1. Domains → Your domain → DNS
2. Add Record
   - Type: CNAME
   - Name: finances
   - Value: c.storage.googleapis.com
3. Save

**For Namecheap:**
1. Dashboard → Domain List → Manage
2. Advanced DNS
3. Add New Record
   - Type: CNAME
   - Host: finances
   - Value: c.storage.googleapis.com
4. Save

**For Google Domains:**
1. My Domains → Your domain → DNS
2. Add Custom Record
   - Name: finances
   - Type: CNAME
   - Value: c.storage.googleapis.com
3. Save

#### Add Domain to Firebase

1. Firebase Console → **Hosting** → **Domains**
2. Click **"Add custom domain"**
3. Enter: `finances.bostonchristian.net`
4. Firebase verifies DNS
5. Firebase creates SSL certificate (automatic)

**Wait 24-48 hours for DNS to propagate**

---

### STEP 6: Set Up Website Navigation (15 min)

Where is your website hosted? (WordPress, Wix, custom, etc.)

#### If WordPress:
1. Dashboard → Menus
2. Add Link
   - URL: `https://finances.bostonchristian.net`
   - Label: "Finance Portal" or "💰 Finance"
3. Save

#### If Custom HTML:
Add to your navigation:
```html
<a href="https://finances.bostonchristian.net">Finance Portal</a>
```

#### If Wix:
1. Edit Site
2. Add Button or Link
3. URL: `https://finances.bostonchristian.net`
4. Text: "Finance Portal"
5. Publish

---

### STEP 7: Migrate Your Data (30 min)

#### Export from Personal Project:
1. Firebase Console (personal) → Firestore
2. Select collection (e.g., "members")
3. Click menu → Export
4. Save JSON file

**Export these collections:**
- members
- budget
- income
- expense
- events
- eventRegistrations
- users (if any)

#### Import to Production Project:
1. Firebase Console (bca-finance-prod) → Firestore
2. Click menu → Import
3. Select JSON file
4. Choose collection name
5. Click "Import"

Repeat for all collections

---

### STEP 8: Create Firebase Authentication Users (20 min)

#### For Each User, Create:

**In Firebase Authentication:**
1. Firebase Console → Authentication → Users
2. Click "Add user"
3. Email: `john@bostonchristian.net`
4. Password: [Generate strong password]
5. Click "Create user"

**In Firestore /users (using app):**
1. Go to: `https://finances.bostonchristian.net`
2. Can't log in yet? That's OK - we'll create users first
3. Actually, do this:
   - Go to Firefox/Chrome Dev Tools
   - Console
   - Manually create first admin user via script (see below)

**OR easier: Do it later when app is running**

---

### STEP 9: Test Everything (30 min)

#### Test 1: Visit your app
```
https://finances.bostonchristian.net
```
Should show login screen ✓

#### Test 2: Test login
- Email: (one you created)
- Password: (the one you set)
Should see dashboard ✓

#### Test 3: Test features
- Create member ✓
- Add budget ✓
- Record income ✓
- View reports ✓

#### Test 4: Test from website
- Go to: `https://www.bostonchristian.net/`
- Click Finance Portal link
- Should go to `https://finances.bostonchristian.net/` ✓

#### Test 5: Mobile test
- Visit on phone
- Click Finance link
- Should work on mobile ✓

---

## Quick Checklist

### Pre-Deployment
- [ ] Have access to domain registrar (bostonchristian.net)
- [ ] Have updated Firebase config
- [ ] Have app code ready to deploy

### Deployment Day
- [ ] Step 1: Create Firebase project (15 min)
- [ ] Step 2: Deploy to Firebase Hosting (15 min)
- [ ] Step 3: Update app config (10 min)
- [ ] Step 4: Set security rules (10 min)
- [ ] Step 5: Add DNS record (30 min)
- [ ] Step 6: Add website navigation (15 min)
- [ ] Step 7: Migrate data (30 min)
- [ ] Step 8: Create user accounts (20 min)
- [ ] Step 9: Test everything (30 min)

### Total Time: 3 hours (plus 24-48 hours waiting for DNS)

---

## DNS Propagation

After adding DNS record for `finances.bostonchristian.net`:

**Check status:**
https://dnschecker.org
- Search: `finances.bostonchristian.net`
- Should show propagated (green checkmarks)

**Typical timeline:**
- Immediately: Your registrar updated
- 1-6 hours: Most ISPs updated
- 24-48 hours: Full global propagation

**Until DNS propagates:**
- `https://bca-finance-prod.web.app` works
- `https://finances.bostonchristian.net` may not work yet
- Be patient!

---

## User Accounts Setup

### Initial Setup (Do First)

Create 3-5 admin accounts first:

**Firebase Auth (Firebase Console):**
1. treasurer@bostonchristian.net
2. secretary@bostonchristian.net
3. admin@bostonchristian.net

**Firestore /users (Using app once running):**
1. Users & Roles → Add User
2. Link to member
3. Select role (Treasurer, Secretary, Admin)
4. Save

### Then Expand

Once admins are trained, they can add more users:
1. App → Users & Roles → Add User
2. Select member
3. Select role
4. Save
5. New user logs in with their email

---

## Sending to Your Team

Once live, send team members:

```
📱 BCA Finance Portal is Live!

URL: https://finances.bostonchristian.net

Login:
- Email: john@bostonchristian.net
- Password: [shared securely]

First Time:
1. Go to: https://finances.bostonchristian.net
2. Enter email and password
3. Click LOGIN
4. Dashboard loads
5. You're in!

Features:
- Members management
- Budget planning
- Income/Expense tracking
- Financial reports
- Event management
- And more!

Questions? Contact: [your email]
```

---

## What Your Website Looks Like After

```
www.bostonchristian.net/
├─ [Home]
├─ [About]
├─ [Services]
├─ [Finance Portal] ← NEW!
│   └─ Goes to: finances.bostonchristian.net/
├─ [Events]
└─ [Contact]
```

---

## Cost

### Monthly Costs
- Firebase Hosting: $0 (free tier 10GB/month)
- Firestore: $0-20 (depends on usage)
- Firebase Auth: $0 (unlimited users)
- Domain: $0 (you already have bostonchristian.net)

**Total: $0-25/month** (probably free if <20 users)

---

## Troubleshooting

### "Page Not Found" at finances.bostonchristian.net
**Problem:** DNS not propagated yet
**Fix:** Wait 24-48 hours, check at https://dnschecker.org

### "User role not configured"
**Problem:** User in Firebase Auth but not in Firestore
**Fix:** Go to app → Users & Roles → Add User → Create role

### "Email not found"
**Problem:** User not in Firebase Auth
**Fix:** Create in Firebase Console → Authentication

### HTTPS not working
**Problem:** Certificate not issued yet
**Fix:** Firebase takes 24-48 hours, patience!

---

## Next Steps

### This Week:
1. [ ] Steps 1-4 (Firebase setup) - 1 hour
2. [ ] Step 5 (Add DNS) - 30 min
3. [ ] Wait for DNS - 24-48 hours
4. [ ] Step 6 (Website nav) - 15 min
5. [ ] Step 7 (Migrate data) - 30 min
6. [ ] Step 8 (Create users) - 20 min
7. [ ] Step 9 (Test) - 30 min

### Next Week:
1. Train team members
2. Gather feedback
3. Go live to all users

### Two Weeks After:
1. Monitor usage
2. All team using daily
3. Success! 🎉

---

## Success Criteria

When you're done:
- ✅ `https://finances.bostonchristian.net` works
- ✅ Login works with test account
- ✅ All features work
- ✅ Team can access
- ✅ HTTPS (lock icon)
- ✅ Works on mobile
- ✅ No console errors
- ✅ Website navigation includes Finance Portal

---

## Your Domain Details

- **Main Website:** https://www.bostonchristian.net/
- **Finance App:** https://finances.bostonchristian.net/
- **Registrar:** [You need to tell me where - GoDaddy, Namecheap, etc.]
- **DNS Access:** [Do you have this?]

---

## Questions?

**Before you start, tell me:**
1. Who hosts bostonchristian.net? (GoDaddy, Namecheap, custom server, etc.)
2. Can you access the domain registrar/DNS settings?
3. When do you want to go live? (This week, next week, etc.)
4. How many initial users? (3-5 admin, or more?)

Then follow the steps above!

**You're ready to go live! 🚀**

