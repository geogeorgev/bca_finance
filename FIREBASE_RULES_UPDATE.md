# Firebase Security Rules - Complete Setup

## 1. FIRESTORE RULES (Update These)

Go to Firebase Console → Firestore → Rules and replace with:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow authenticated users full access
    // This is appropriate for internal church management app
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Specific collections (optional more restrictive rules)
    match /members/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    match /expense/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    match /income/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    match /budget/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    match /events/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    match /eventRegistrations/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 2. STORAGE RULES (Add These)

Go to Firebase Console → Storage → Rules and use:

```
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    // Allow authenticated users to read and write receipts
    match /receipts/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to access all storage
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## Implementation Steps

### Step 1: Update Firestore Rules

1. Go to: https://console.firebase.google.com/
2. Select project: **bcachurch-finance**
3. Left menu → **Firestore Database**
4. Click **Rules** tab
5. **Clear** all existing rules
6. **Paste** Firestore rules above
7. Click **Publish**
8. Wait for ✅ confirmation

### Step 2: Add Storage Rules

1. Same Firebase Console
2. Left menu → **Storage**
3. Click **Rules** tab
4. **Clear** all existing rules
5. **Paste** Storage rules above
6. Click **Publish**
7. Wait for ✅ confirmation

---

## Key Changes

### Before (Temporary)
```
- Expires April 11, 2026
- Generic allow all access
- No Storage rules
```

### After (Permanent)
```
- Permanent (no expiration)
- Requires authentication
- Covers all collections
- Includes Storage rules for receipts
```

---

## What Each Rule Does

### Firestore Rules
- ✅ Allows authenticated users to read/write all data
- ✅ No expiration date
- ✅ Covers: members, expense, income, budget, events, eventRegistrations
- ✅ Secure (requires login)

### Storage Rules
- ✅ Allows authenticated users to upload receipts
- ✅ Files organized in `/receipts/` folder
- ✅ Supports all file types
- ✅ Secure (requires login)

---

## Verification Checklist

After updating rules:

- [ ] Go to Firestore → Rules
- [ ] Confirm new rules are showing
- [ ] Check "Publish" button is gone (means published)
- [ ] Go to Storage → Rules
- [ ] Confirm Storage rules are showing
- [ ] Check "Publish" button is gone (means published)
- [ ] Refresh app page
- [ ] Try uploading receipt
- [ ] Check browser console for success

---

## Testing Receipt Upload After Rules Update

1. **Add Expense**
2. Fill form
3. **Upload Receipt** → Choose file
4. Click **Save Expense**
5. **Check Console** (F12):
   - Should see: `Receipt uploaded successfully: https://...`
   - Or specific error if it fails

---

## Security Notes

These rules are appropriate because:
- ✅ Internal church management app
- ✅ Only authenticated users can access
- ✅ All users have same permissions (admin-managed)
- ✅ Not public facing

If you want more restrictive rules later:
- Can add role-based access
- Can restrict certain users from editing
- Can add audit logging

---

## Why Receipt Upload Failed Before

**Old rules:**
- Only had Firestore rules
- No Storage rules defined
- Temporary rules set to expire

**New rules:**
- Include Storage rules for file uploads
- Permanent (no expiration)
- Proper authentication checks

---

## After Publishing Rules

### You can immediately:
✅ Upload receipts to expenses
✅ Access all Firestore data
✅ Download receipts from table
✅ No more expiration warnings

### Expected behavior:
- Receipt uploads complete successfully
- Files stored in Firebase Storage
- Download links work in expense table
- All data accessible to authenticated users

