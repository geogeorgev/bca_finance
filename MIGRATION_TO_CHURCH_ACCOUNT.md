# Complete Migration Guide: Move to Church Gmail Account

## Overview
This guide will help you move:
1. ✅ GitHub repository (code)
2. ✅ Firebase project (Firestore database)
From your personal account to your church's Gmail account

---

## STEP 1: Prepare the Church Gmail Account

### 1.1 Create/Access Church Gmail
- Go to **gmail.com**
- Create new account or use existing church email
- Example: `bostonchristian.assembly@gmail.com`
- Enable 2-factor authentication (recommended)

### 1.2 Create GitHub Account for Church
- Go to **github.com**
- Click "Sign up"
- Use church email: `bostonchristian.assembly@gmail.com`
- Create username: `boston-christian-assembly` or similar
- Verify email

### 1.3 Create Firebase Account for Church
- Go to **console.firebase.google.com**
- Sign in with church Gmail
- Click "Create a project"
- Project name: "BCA Finance"
- Select region: US
- Click "Create project"

---

## STEP 2: Export Data from Current Firestore

### 2.1 Backup Current Database

**In Firebase Console (personal account):**

1. Go to **firebase.google.com**
2. Sign in with your personal account
3. Select your current project (e.g., "bcachurch-finance")
4. Left sidebar → **Firestore Database**
5. Click **More options (three dots)**
6. Select **Export collections**

### 2.2 Download Backup File
- Select all collections to export:
  - assets
  - budget
  - contributions
  - events
  - eventRegistrations
  - expense
  - income
  - members
  - notifications
  - roles
  - users
- Click **Export**
- Save file: `bca_finance_backup.json`
- Note the download location

---

## STEP 3: Create New Firebase Project for Church

### 3.1 Set Up Church Firebase Project

**In Firebase Console (church account):**

1. Sign in with church Gmail
2. Go to **console.firebase.google.com**
3. Click **Create a project**
4. Project name: `bca_finance_church`
5. Region: **United States**
6. Click **Create project**
7. Wait for project creation (2-3 minutes)

### 3.2 Set Up Firestore Database

1. Click **Create database** in Firestore
2. Security rules:
   - Start in **test mode** (for initial setup)
   - Click **Create**
3. Wait for Firestore initialization

### 3.3 Enable Authentication

1. Left sidebar → **Authentication**
2. Click **Get started**
3. Enable **Email/Password** provider
4. Click **Save**

### 3.4 Get Firebase Configuration

1. Click **Project settings** (gear icon)
2. Go to **Service accounts** tab
3. Copy this configuration block:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

**Save this! You'll need it in Step 5.**

---

## STEP 4: Import Data to Church Firestore

### 4.1 Import Backup Data

**In New Church Firebase Console:**

1. Go to **Firestore Database**
2. Click **Start Collection**
3. Collection ID: `assets` (first collection)
4. Click **Create**

**Alternative: Use Firestore Import Tool**

1. Go to **Firestore Database**
2. Click **More options (three dots)**
3. Select **Import collections**
4. Upload the `bca_finance_backup.json` file
5. Click **Import**
6. Wait for import to complete (may take several minutes)

### 4.2 Verify Data Import

1. Check each collection exists:
   - assets
   - budget
   - contributions
   - events
   - expense
   - income
   - members
   - users
   - roles

2. Click each collection to verify data

---

## STEP 5: Update Firebase Config in Code

### 5.1 Update js/firebase.js

**File:** `js/firebase.js`

**Replace the entire firebase configuration:**

```javascript
// Initialize Firebase
const firebaseConfig = {
  apiKey: "YOUR_CHURCH_API_KEY",
  authDomain: "YOUR_CHURCH_AUTH_DOMAIN",
  projectId: "YOUR_CHURCH_PROJECT_ID",
  storageBucket: "YOUR_CHURCH_STORAGE_BUCKET",
  messagingSenderId: "YOUR_CHURCH_MESSAGING_SENDER_ID",
  appId: "YOUR_CHURCH_APP_ID"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
```

**Where to get values:**
1. Go to church Firebase Console
2. Project settings (gear icon)
3. Copy entire config object
4. Paste into js/firebase.js

---

## STEP 6: Move GitHub Repository

### 6.1 Create New Repository on Church GitHub

**On Church GitHub Account (church email):**

1. Sign in to **github.com** with church account
2. Click **+** → **New repository**
3. Repository name: `bca-finance`
4. Description: "Church Finance Management System"
5. Select **Private** (recommended for security)
6. Click **Create repository**

### 6.2 Push Code to Church Repository

**On your computer (in project folder):**

```bash
# Navigate to project
cd C:\Users\User\Learning\bca_finance

# Remove old remote (personal account)
git remote remove origin

# Add new remote (church account)
git remote add origin https://github.com/boston-christian-assembly/bca-finance.git

# Push all code to church account
git branch -M main
git push -u origin main
```

**If git is not set up:**

1. Install Git: https://git-scm.com/download/win
2. Configure:
```bash
git config --global user.email "your_church_email@gmail.com"
git config --global user.name "Church Name"
```
3. Then run push commands above

### 6.3 Verify Repository

1. Go to **github.com**
2. Sign in with church account
3. Go to church repository
4. Verify all files are there

---

## STEP 7: Deploy Updated App

### 7.1 Test Locally First

1. Open `index.html` in browser
2. Try to login with test account
3. Test adding an asset
4. Verify data saves to church Firestore

### 7.2 Deploy to Hosting

**Option A: Firebase Hosting**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login with church account
firebase login

# Initialize Firebase hosting in your project
firebase init hosting

# Deploy
firebase deploy --only hosting
```

**Option B: GitHub Pages**

1. Go to church repository settings
2. Scroll to **Pages**
3. Select **main** branch as source
4. Click **Save**
5. App will be available at: `https://boston-christian-assembly.github.io/bca-finance/`

**Option C: Other Hosting (Netlify, Vercel)**

1. Connect church GitHub repository
2. Deploy automatically
3. Follow hosting provider instructions

---

## STEP 8: Create Church Admin Users

### 8.1 Add Admin Users to New System

**In deployed app:**

1. Login with first admin account
2. Go to **Users & Roles**
3. Create admin account for church treasurer
4. Create admin account for pastor
5. Set roles to "Admin"

### 8.2 Share Login Credentials

Securely share with:
- Church Treasurer
- Pastor
- Any other church admins

Use password manager or secure method

---

## STEP 9: Deactivate Personal Account Access

### 9.1 Delete Personal Firebase Project (Optional)

1. Sign in with personal Gmail
2. Go to Firebase Console
3. Select personal project
4. Click **Project settings**
5. Scroll down → **Delete this project**
6. Confirm deletion
7. **Wait 30 days before permanent deletion**

### 9.2 Archive Personal GitHub Repository

1. Sign in with personal GitHub
2. Go to personal repository
3. Settings → **Danger Zone**
4. Click **Archive this repository**
5. Confirm

---

## Step 10: Update Documentation

### 10.1 Create Church Admin Guide

Create file: `CHURCH_ADMIN_SETUP.md`

```markdown
# BCA Finance - Church Admin Setup

## Login Information
- **Email**: bostonchristian.assembly@gmail.com
- **URL**: [Your deployed URL]

## Admin Accounts
- Treasurer: [Email]
- Pastor: [Email]

## First Time Setup
1. Login
2. Go to Users & Roles
3. Create user accounts
4. Assign roles
5. Share credentials securely

## Backup Instructions
- Monthly export from Firestore
- Keep backup file secure
- Store in church drive
```

### 10.2 Update START_HERE.md

Replace personal references with church information

---

## Troubleshooting

### Issue: Firebase Config Error
**Solution:**
- Verify all config values from church Firebase Console
- Check for typos in `js/firebase.js`
- Clear browser cache

### Issue: Authentication Fails
**Solution:**
- Enable Email/Password in church Firebase Auth
- Create test user in Firebase Console
- Try logging in

### Issue: Data Not Showing
**Solution:**
- Verify import completed successfully
- Check Firestore collections exist
- Check browser console for errors (F12)

### Issue: GitHub Push Fails
**Solution:**
- Verify remote URL: `git remote -v`
- Check Git credentials
- Install Git Credential Manager

---

## Security Checklist

✅ Church Gmail is secure with 2FA
✅ GitHub repository is PRIVATE
✅ Firebase rules are in place
✅ Sensitive data backed up
✅ Test accounts created
✅ Admin accounts assigned
✅ Old personal projects archived
✅ Credentials shared securely

---

## Summary

### What You've Done:
1. ✅ Created church Firebase project
2. ✅ Exported data from personal Firestore
3. ✅ Imported data to church Firestore
4. ✅ Updated Firebase config in code
5. ✅ Created church GitHub repository
6. ✅ Pushed code to church account
7. ✅ Deployed app
8. ✅ Created church admin users
9. ✅ Archived personal projects

### What Church Has Now:
- ✅ Own Firebase project
- ✅ Own GitHub repository
- ✅ Own deployment
- ✅ All data transferred
- ✅ Admin accounts ready
- ✅ Full ownership and control

### Next Steps:
1. Train church team on using app
2. Set up regular backups
3. Create data backup procedures
4. Document user roles and permissions
5. Schedule monthly admin meetings

---

**Important:** Keep the Firebase config and GitHub credentials secure. Share only with authorized church administrators.


