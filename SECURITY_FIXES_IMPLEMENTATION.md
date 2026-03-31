# Security Fixes - Implementation Guide

## Critical Fixes Required Before QA (45 minutes total)

---

## FIX #1: Update Firebase Security Rules (20 minutes)

### Current (Too Permissive):
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

### New (Secure):

**Step 1:** Go to Firebase Console
- Firebase Console → Select your project
- Firestore Database → Rules tab

**Step 2:** Delete all existing rules

**Step 3:** Paste new rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to get user role
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.Role;
    }
    
    function hasRole(roles) {
      return getUserRole() in roles;
    }
    
    // Members - All auth users can read, only Treasure/Admin can write
    match /members/{memberId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && hasRole(['Admin', 'Treasurer', 'Secretary']);
    }
    
    // Budget - All auth users can read, only Treasurer/Admin can write
    match /budget/{budgetId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && hasRole(['Admin', 'Treasurer']);
    }
    
    // Income - All auth users can read, only Treasurer/Admin can write
    match /income/{incomeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && hasRole(['Admin', 'Treasurer']);
    }
    
    // Expense - All auth users can read, only Treasurer/Admin can write
    match /expense/{expenseId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && hasRole(['Admin', 'Treasurer']);
    }
    
    // Events - All auth users can read, only Admin can write
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && hasRole(['Admin']);
    }
    
    match /eventRegistrations/{registrationId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && hasRole(['Admin']);
    }
    
    // Users - Only Admin/Superuser can read/write
    match /users/{userId} {
      allow read: if request.auth != null && hasRole(['Admin', 'Superuser']);
      allow write: if request.auth != null && hasRole(['Admin', 'Superuser']);
    }
    
    // Receipts - Only Treasurer/Admin can access
    match /receipts/{receiptId} {
      allow read: if request.auth != null && hasRole(['Admin', 'Treasurer']);
      allow write: if request.auth != null && hasRole(['Admin', 'Treasurer']);
    }
    
    // Audit logs - Read only, no writes
    match /auditLog/{logId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

**Step 4:** Review the rules
- Check for syntax errors
- Verify all collections covered
- Ensure auth check included

**Step 5:** Click "Publish"
- Confirm you want to update rules
- Wait for deployment (1-2 seconds)

**Step 6:** Test
- Go to your app
- Try to access data (should work if logged in)
- Test with different roles
- Check Firestore Rules simulator if issue

---

## FIX #2: Restrict API Key (15 minutes)

### Problem:
Your API key is visible in code and unrestricted.

### Solution - Step by step:

**Step 1:** Go to Google Cloud Console
- Firebase Console → Project Settings (gear icon)
- Click "Project settings"
- Go to "Service Accounts" tab
- Copy Project ID (you'll need this)
- Go to "APIs & Services"

**Step 2:** Create/restrict API key
- Google Cloud Console → APIs & Services → Credentials
- Find your Firebase API key (starts with AIzaSy...)
- Click on it to edit

**Step 3:** Set Application Restrictions
1. Under "Application restrictions"
2. Choose "HTTP referrers (websites)"
3. Add your domains:
   ```
   https://www.bostonchristian.net/*
   https://bostonchristian.net/*
   https://finances.bostonchristian.net/*
   http://localhost/*
   https://localhost/*
   ```
4. Click "Add website"

**Step 4:** Set API Restrictions
1. Under "API restrictions"
2. Select "Restrict key"
3. Choose these APIs ONLY:
   - Cloud Firestore API ✓
   - Firebase Authentication API ✓
   - Unchecked all others
4. Click "Save"

**Step 5:** Regenerate Key (Optional but recommended)
1. Click "Regenerate key"
2. Confirm
3. Copy new key
4. Update in `js/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_NEW_KEY_HERE",  // Replace with new key
  authDomain: "bcachurch-finance.firebaseapp.com",
  projectId: "bcachurch-finance",
  // ... rest stays same
};
```

5. Deploy app with new key

---

## FIX #3: Enable Firestore Backups (5 minutes)

### Step 1: Go to Firebase Console
- Firebase Console → Firestore Database
- Click menu (three dots) → "Backups"

### Step 2: Create Backup Schedule
- Click "Create Schedule"
- Backup schedule: Daily (or as needed)
- Retention period: 30 days (or longer)
- Location: US (or your region)
- Click "Create"

### Step 3: Verify
- Should show backup schedule created
- Backups will run automatically
- You can restore from backups if needed

---

## FIX #4: Clean Up Test Accounts (10 minutes)

### Step 1: Find Firebase Console
- Firebase Console → Authentication

### Step 2: Review all users
- Look for test accounts
- Look for duplicate accounts
- Look for inactive users

### Step 3: Delete test accounts
- Click on user to expand
- Click "Delete" button
- Confirm

### Step 4: Verify Active Users
- List should only have real users
- Note which users are Admins (will need for future)

---

## FIX #5: Enable Monitoring (10 minutes)

### Cloud Logging:

**Step 1:** Firebase Console
- Project settings → Integrations → Cloud Logging
- Enable Cloud Logging

**Step 2:** Set Alerts (Optional)
- Google Cloud Console → Logging → Logs-based Metrics
- Create alert for failed logins:
  - Query: `resource.type="cloud_function"` AND `severity="ERROR"`
  - Notification: Email

---

## Testing After Security Fixes

### Test #1: Verify Rules Work
1. Login to app
2. Go to Members
3. Verify you can see members
4. Go to Users & Roles
5. Verify only shows if you're Admin

### Test #2: Verify API Key Restrictions
1. Try to access app from different domain
2. Should get permission error (expected)
3. Try from your domain
4. Should work normally

### Test #3: Verify Backups Exist
1. Firebase Console → Firestore → Backups
2. Check schedule is active
3. Verify backups are running

### Test #4: Verify Backups Work
1. Make small test data entry
2. Check backup was created
3. Delete test entry
4. Restore from backup
5. Verify test entry returns

---

## Before Sharing with QA

### Final Checklist:
- [ ] Security Rules updated and published
- [ ] API Key restricted to your domains
- [ ] API Key regenerated (optional)
- [ ] Test accounts deleted
- [ ] Backups enabled
- [ ] Monitoring set up
- [ ] Rules tested and working
- [ ] API key restrictions tested
- [ ] All apps still working after changes
- [ ] No console errors

---

## If Something Breaks After Fixes

### Security Rules Too Strict:
1. Check Firebase Console → Firestore → Rules Simulator
2. Enter your email in "Authenticated User"
3. Try operation that's failing
4. See exact error message
5. Adjust rules accordingly

### App Not Connecting:
1. Check browser console (F12)
2. Look for error messages
3. Likely causes:
   - API key still restricted incorrectly
   - Domain not in referrer list
   - Rules preventing read/write

### Users Can't Login:
1. Check if Firebase Auth still enabled
2. Verify users still exist
3. Check rules allow user query
4. Test with known good account

---

## Time Estimate

| Task | Time |
|------|------|
| Update Rules | 20 min |
| Restrict API Key | 15 min |
| Enable Backups | 5 min |
| Clean Accounts | 10 min |
| Enable Monitoring | 10 min |
| Testing | 15 min |
| **Total** | **75 minutes** |

---

## Questions During Implementation?

For each step:
- Firebase error messages are usually descriptive
- Google Cloud docs: https://cloud.google.com/docs
- Firebase Firestore Rules: https://firebase.google.com/docs/firestore/security
- Check Rules Simulator for debugging

---

## Once Complete

**You can then:**
1. Share app with QA team
2. Provide security testing checklist (in main audit report)
3. Monitor for issues
4. Address findings
5. Go live!

---

**Start with Fix #1 (Security Rules) - that's the most important! 🔐**

