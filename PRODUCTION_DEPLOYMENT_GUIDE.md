# BCA Finance App - Production Deployment Guide

## Current Status
- ✅ App code complete and tested
- ✅ Firebase Firestore configured
- ✅ Authentication system working
- ✅ Audit trail implemented
- ❌ Not yet deployed for public/team use
- ❌ Still in personal Firebase project

---

## Deployment Options

### Option 1: Firebase Hosting (Recommended - Easiest)
**Best for:** Quick deployment, no server management
- **Cost:** Free tier available ($0-25/month typical)
- **Setup time:** 15-30 minutes
- **Requirements:** Firebase CLI, GitHub/Git repo
- **Features:** 
  - Global CDN
  - Free SSL/HTTPS
  - Custom domain support
  - Automatic backups
  - Real-time analytics

### Option 2: Integrate with Existing Website
**Best for:** Adding to existing website
- **Cost:** Varies (depends on current hosting)
- **Setup time:** 30 minutes - 1 hour
- **Requirements:** Web server access, domain already set up
- **Features:**
  - Use existing infrastructure
  - Unified domain (e.g., website.com/finance)
  - Shared hosting resources

### Option 3: Vercel/Netlify
**Best for:** Continuous deployment via Git
- **Cost:** Free tier available
- **Setup time:** 10-20 minutes
- **Requirements:** GitHub repo, CLI tools
- **Features:**
  - Automatic deploys on Git push
  - Preview deployments
  - Built-in analytics

### Option 4: Self-Hosted Server
**Best for:** Full control, offline capability
- **Cost:** $5-50+/month (VPS)
- **Setup time:** 1-2 hours
- **Requirements:** Server knowledge, Node.js/Apache/Nginx
- **Features:**
  - Full control
  - Can be offline-compatible
  - Custom backups

---

## RECOMMENDED: Firebase Hosting (Step-by-Step)

### Step 1: Set Up New Firebase Project for Production

**DO NOT use your personal Firebase project for production!**

1. Go to: https://console.firebase.google.com/
2. Click "Create a project"
3. Name it: `bca-finance-production`
4. Enable: Analytics (optional), Billing account (optional)
5. Wait for project creation (~2 minutes)

---

### Step 2: Set Up Firestore Database (Production)

1. In Firebase Console → Firestore Database → Create Database
2. Start in **Production Mode** (NOT test mode)
3. Choose region: **us-east1** (recommended for US-based church)
4. Click "Enable"
5. In Firestore Console:
   - Import all existing collections from your personal project
   - OR manually create the collections:
     - `members`
     - `budget`
     - `income`
     - `expense`
     - `events`
     - `eventRegistrations`
     - `receipts`
     - `users`
     - `auditLog` (if using)

---

### Step 3: Set Up Firebase Authentication (Production)

1. In Firebase Console → Authentication → Get Started
2. Enable Sign-in methods:
   - Email/Password ✅
   - (Optional) Google Sign-In
3. In Settings → Authorized domains:
   - Add your domain (e.g., `finances.bostonchristian.org`)
   - Add `localhost` (for testing)

---

### Step 4: Update Your App Configuration

Replace the Firebase config in your app with the production config:

**File: `js/firebase.js`**

```javascript
// PRODUCTION CONFIG (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxxxxx",              // Production API key
  authDomain: "bca-finance-prod.firebaseapp.com",
  projectId: "bca-finance-prod",
  storageBucket: "bca-finance-prod.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef1234567890"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
```

**To get production config:**
1. Firebase Console → Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" app or create new web app
4. Copy the config object

---

### Step 5: Set Up Firebase Hosting

#### Option A: Using Firebase CLI (Command Line)

1. Install Node.js from https://nodejs.org (if not already installed)

2. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

3. Login to Firebase:
```bash
firebase login
```

4. In your project directory, initialize Firebase Hosting:
```bash
firebase init hosting
```

5. When prompted:
   - Select project: `bca-finance-production`
   - Public directory: `.` (or `public` if you have one)
   - Single-page app: `Yes`
   - Overwrite index.html: `No`

6. Deploy:
```bash
firebase deploy --only hosting
```

#### Option B: Using Firebase Console (No CLI)

1. Firebase Console → Hosting → Get Started
2. Download Firebase CLI instructions
3. Follow steps 1-4 above, then deploy via console

---

### Step 6: Set Up Custom Domain

**Option A: Use Firebase Domain**
- Your app will be at: `bca-finance-prod.web.app`
- Automatic SSL, works immediately

**Option B: Use Your Own Domain**

1. In Firebase Hosting → Domains → Add Custom Domain
2. Enter your domain: `finances.bostonchristian.org`
3. Verify DNS records:
   - Add Firebase's DNS records to your domain registrar
   - Wait 24 hours for DNS propagation
4. Firebase automatically provisions SSL certificate

---

### Step 7: Set Up Firestore Security Rules

**⚠️ CRITICAL: Set proper security rules for production**

In Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Only authenticated users can access
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // More restrictive rules (recommended):
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if false; // Created via app logic only
    }
    
    match /members/{memberId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /budget/{budgetId} {
      allow read, write: if request.auth != null;
    }
    
    match /income/{incomeId} {
      allow read, write: if request.auth != null;
    }
    
    match /expense/{expenseId} {
      allow read, write: if request.auth != null;
    }
    
    match /events/{eventId} {
      allow read, write: if request.auth != null;
    }
    
    match /receipts/{receiptId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**⚠️ Replace the temporary rules:**
```javascript
// Current (INSECURE - only for development)
match /{document=**} {
  allow read, write: if request.time < timestamp.date(2026, 4, 30);
}
```

---

### Step 8: Migrate Data from Personal to Production

#### Option A: Export/Import via Console

1. **Export from personal project:**
   - Firestore → Collections → Select collection
   - Export as JSON file
   
2. **Import to production project:**
   - Firestore → Collections → Import collection
   - Upload JSON file

#### Option B: Copy Data via Script

```javascript
// Script to copy from personal to production
async function migrateData() {
  const sourceCollections = [
    'members', 'budget', 'income', 'expense', 'events', 'users'
  ];
  
  for (const collection of sourceCollections) {
    const snapshot = await personalDb.collection(collection).get();
    console.log(`Migrating ${collection}: ${snapshot.size} documents`);
    
    snapshot.forEach(doc => {
      productionDb.collection(collection).doc(doc.id).set(doc.data());
    });
  }
  
  console.log("Migration complete!");
}
```

---

## Data Migration Checklist

- [ ] Create production Firebase project
- [ ] Set up Firestore collections in production
- [ ] Export data from personal project
- [ ] Import data to production project
- [ ] Create Firebase Auth users in production
- [ ] Update app config with production credentials
- [ ] Test login with production users
- [ ] Set proper security rules
- [ ] Set up custom domain
- [ ] Deploy to Firebase Hosting
- [ ] Test all features in production
- [ ] Backup personal project (keep for reference)

---

## Sharing with Team Members

### Step 1: Invite Users to Firebase Project

1. Firebase Console → Project Settings → Members
2. Click "Add Member"
3. Enter email: `treasurer@bostonchristian.org`
4. Set role: **Editor** (can manage everything)
5. Repeat for other admins

**Role Options:**
- **Owner:** Full control, can delete project
- **Editor:** Can edit everything
- **Viewer:** Read-only access

### Step 2: Create App Users

1. App login page → Not yet available
2. Someone must manually create users:
   - **Option A:** Using Firebase Console → Authentication
   - **Option B:** Using Firebase Admin SDK
   - **Option C:** App admin creates via "Users & Roles" screen

**For each user, create:**
1. **Firebase Auth account** (email + password)
   - Go to: Firebase Console → Authentication → Users
   - Click "Add user"
   - Email: `john@bostonchristian.org`
   - Password: Generate secure password
   
2. **Firestore /users document** (role assignment)
   - Go to: App → Users & Roles → Add User
   - Link to member
   - Select role

### Step 3: Share URL with Team

Send team members:
```
Login URL: https://finances.bostonchristian.org
Username: john@bostonchristian.org
Password: [shared securely]
First login: Change password
```

---

## Setting Up Your Website Integration

If you want to add to existing website:

### Option A: Iframe Embedding
```html
<!-- In your website -->
<iframe src="https://finances.bostonchristian.org" 
        width="100%" 
        height="600px"
        style="border:none; border-radius:4px;">
</iframe>
```

### Option B: Link to Subdomain
```html
<!-- In your website nav -->
<a href="https://finances.bostonchristian.org">Church Finance Portal</a>
```

### Option C: Path-based (finances.bostonchristian.org/app)
Requires server configuration (ask hosting provider)

---

## Security Best Practices for Production

✅ **Do This:**
- [ ] Enable 2FA for Firebase project
- [ ] Use strong passwords (min 12 characters)
- [ ] Regularly backup data
- [ ] Monitor Firebase usage/costs
- [ ] Set up email alerts for suspicious activity
- [ ] Keep passwords secure (use password manager)
- [ ] Use HTTPS (Firebase does this automatically)
- [ ] Enable audit logging
- [ ] Review user access monthly

❌ **Don't Do This:**
- Share Firebase API keys publicly
- Use weak passwords
- Store passwords in documents
- Use personal project for production
- Disable authentication
- Leave admin credentials lying around
- Skip security rules

---

## Cost Estimation (Monthly)

| Service | Free Tier | Typical |
|---------|---|---|
| Firebase Hosting | 1GB storage, 10GB bandwidth | $5-15 |
| Firestore | 50K reads, 20K writes, 1GB storage | $10-30 |
| Firebase Auth | Up to 100 auth users | Free |
| **Total** | **Free-$10/month** | **$15-45/month** |

---

## Monitoring & Maintenance

### Weekly:
- Check Firebase Console for errors
- Monitor database usage
- Verify backups

### Monthly:
- Review user access logs
- Check for inactive accounts
- Review security rules
- Check storage quota

### Quarterly:
- Full data backup
- Security audit
- Performance review
- Cost optimization

---

## Backup & Recovery

### Automatic Backups
Firebase Firestore automatically backs up data.

### Manual Backups
```bash
# Export all data
firebase firestore:export ./backups/backup-2026-03-29
```

### Recovery
```bash
# Restore from backup
firebase firestore:import ./backups/backup-2026-03-29
```

---

## Support & Maintenance

### Who Does What:
- **Firebase Team:** Manages infrastructure, security, backups
- **Your Team:** Manages users, data, app features
- **You:** Handle deployment, updates, user management

### Troubleshooting:
- **Login issues:** Check Firebase Authentication
- **Missing data:** Check Firestore database
- **Performance:** Check Firebase Console analytics
- **Cost spike:** Review database usage patterns

---

## Next Steps (Immediate)

1. **This Week:**
   - [ ] Create production Firebase project
   - [ ] Get production Firebase config
   - [ ] Update app with production config
   - [ ] Set up security rules

2. **Next Week:**
   - [ ] Migrate data from personal to production
   - [ ] Deploy to Firebase Hosting
   - [ ] Set up custom domain
   - [ ] Test all features

3. **Week After:**
   - [ ] Create production user accounts
   - [ ] Share with team members
   - [ ] Train users on system
   - [ ] Go live!

---

## Questions to Answer First

Before deploying, decide:

1. **Domain:**
   - Subdomain: `finances.bostonchristian.org`?
   - Or: `bostonchristian.org/finance`?

2. **Users:**
   - How many users initially?
   - How many admins?
   - Who manages access?

3. **Data:**
   - Migrate all existing data?
   - Start fresh?
   - Keep personal project as backup?

4. **Budget:**
   - Acceptable monthly cost?
   - Prefer free tier or paid features?

5. **Backups:**
   - Who handles backups?
   - How often?
   - Recovery procedure?

---

## Estimated Timeline

| Phase | Time | Effort |
|-------|------|--------|
| Setup Production Project | 15 min | Low |
| Configure Firebase | 30 min | Low |
| Migrate Data | 30 min - 2 hrs | Medium |
| Update App Config | 10 min | Low |
| Deploy to Hosting | 15 min | Low |
| Set Custom Domain | 10 min + 24h DNS | Low |
| Create User Accounts | 30 min | Low |
| Test & Verification | 1-2 hrs | Medium |
| **Total** | **3-5 hours** | **Low-Medium** |

---

## Success Criteria

✅ App is live at: `https://finances.bostonchristian.org`
✅ Team members can log in
✅ All data migrated successfully
✅ Users can access features without errors
✅ Backups are working
✅ Security rules are in place
✅ Domain is custom (not .web.app)
✅ HTTPS is enabled (automatic)
✅ Analytics show user activity
✅ Team is trained and comfortable

---

## Troubleshooting Common Issues

### Issue: "User role not configured"
**Cause:** User in Firebase Auth but not in Firestore /users
**Fix:** Create user document in /users collection

### Issue: "Unauthorized" errors
**Cause:** Security rules too strict
**Fix:** Review and update security rules

### Issue: "Page not found" at domain
**Cause:** DNS not propagated yet
**Fix:** Wait 24-48 hours for DNS update

### Issue: "Firebase config missing"
**Cause:** Old config still in app
**Fix:** Update with production config from Firebase Console

---

## Support Resources

- **Firebase Docs:** https://firebase.google.com/docs
- **Firebase Hosting:** https://firebase.google.com/docs/hosting
- **Firestore Security Rules:** https://firebase.google.com/docs/firestore/security
- **Firebase Console:** https://console.firebase.google.com

---

## Summary

The app is ready to deploy! Here's the quick path:

1. **Create production Firebase project** (5 min)
2. **Update app config** (5 min)
3. **Deploy to Firebase Hosting** (10 min)
4. **Set custom domain** (10 min + 24h DNS)
5. **Create user accounts** (30 min)
6. **Share with team** (5 min)
7. **Go live!** ✅

**Estimated Total Time:** 3-5 hours spread over 1-2 weeks (mostly waiting for DNS)

Would you like me to create step-by-step guides for any specific part?

