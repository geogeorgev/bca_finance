# Receipt Upload Troubleshooting Guide

## Error: "Failed to upload receipt. Expense will be saved without receipt."

### Quick Diagnosis

This error means Firebase Storage upload is failing. Here are the most common causes and solutions:

---

## Common Causes & Solutions

### 1. **Firebase Storage Rules Issue** (Most Common)

**Problem:** Firebase Storage Security Rules don't allow uploads

**Check:**
1. Go to Firebase Console
2. Select Project: `bcachurch-finance`
3. Go to **Storage** → **Rules**

**Current Rules Should Allow:**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /receipts/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**If Rules Are Different:**
1. Update rules to above
2. Click "Publish"
3. Try uploading again

---

### 2. **Firebase Storage Bucket Not Created**

**Problem:** Storage bucket doesn't exist in Firebase

**Check:**
1. Firebase Console → Storage
2. Should see bucket named: `bcachurch-finance.firebasestorage.app`

**If Not Visible:**
1. Click "Get Started"
2. Accept defaults
3. Create bucket

---

### 3. **Not Authenticated/Logged In**

**Problem:** User not authenticated to upload

**Check:**
1. Make sure you're logged in
2. Check browser console for auth errors
3. Try logging out and back in

---

### 4. **Browser Storage/Cache Issue**

**Problem:** Browser cache or storage quota

**Solution:**
1. Clear browser cache
2. Try different browser
3. Try incognito/private mode

---

## How to Debug

### Step 1: Open Browser Console
1. Press **F12** or **Ctrl+Shift+I**
2. Go to **Console** tab
3. Try uploading receipt
4. Look for error messages

### Step 2: Check for Specific Error Codes

Common error codes:
- **storage/unauthorized** → Rules problem (most common)
- **storage/quota-exceeded** → Storage full
- **storage/invalid-argument** → File format issue
- **storage/unknown** → General error

### Step 3: Check Firebase Console

1. Firebase Console → Storage
2. Check if receipts folder exists
3. Check if any files are there
4. Check Storage Quota usage

---

## Step-by-Step Fix

### Fix Option 1: Update Firebase Storage Rules (Recommended)

**Steps:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **bcachurch-finance**
3. Go to **Storage**
4. Click **Rules** tab
5. Clear existing rules
6. Paste this:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

7. Click **Publish**
8. Wait for confirmation
9. Try uploading receipt again

---

### Fix Option 2: Create Storage Bucket (If Not Exists)

**Steps:**
1. Firebase Console → Storage
2. If no bucket shown, click "Get Started"
3. Select "Start in production mode"
4. Choose location (us-central1)
5. Create bucket
6. Then update rules (see Fix Option 1)

---

### Fix Option 3: Reset Firebase Configuration

If nothing else works:

1. Delete browser cookies for the app
2. Log out completely
3. Clear browser cache
4. Restart browser
5. Log back in
6. Try uploading

---

## Test Receipt Upload

### Quick Test Process:

1. **Go to Expense Screen**
   - Click "Add Expense"

2. **Fill minimal form:**
   - Type: Member
   - Category: Any category
   - SubCategory: Any subcategory
   - Amount: $1.00
   - Payment Date: Today

3. **Upload receipt:**
   - Click "Choose File"
   - Select any image or PDF
   - Click "Save Expense"

4. **Check console:**
   - Press F12
   - Go to Console
   - Look for success or error message

### Expected Success Message:
```
"Receipt uploaded successfully: https://firebasestorage.googleapis.com/..."
```

### Expected Error Message:
```
"Error uploading receipt: [specific error]"
```

---

## What You'll See in Console

### Successful Upload:
```
Starting receipt upload: receipts/2026/1711270400000_receipt.pdf
Receipt uploaded successfully: https://firebasestorage.googleapis.com/v0/b/bcachurch-finance.firebasestorage.app/o/receipts%2F2026%2F...
```

### Failed Upload:
```
Error uploading receipt: [error message]
Error code: storage/unauthorized
Full error: Permission denied
```

---

## Verification Checklist

- [ ] Firebase project selected: bcachurch-finance
- [ ] Storage bucket exists: bcachurch-finance.firebasestorage.app
- [ ] Storage rules allow authenticated write access
- [ ] Browser has internet connection
- [ ] User is logged in
- [ ] File is JPG, PNG, or PDF
- [ ] File size is under 25MB
- [ ] Browser console shows no errors

---

## If All Else Fails

### Manual Setup Steps:

1. **Enable Storage in Firebase:**
   - Firebase Console → All Products
   - Find "Cloud Storage"
   - Click "Enable"
   - Create bucket with default settings

2. **Update Security Rules:**
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

3. **Clear Application Data:**
   - Ctrl+Shift+Delete
   - Select "Cookies and other site data"
   - Select site
   - Delete

4. **Test Again:**
   - Refresh page
   - Log in again
   - Try uploading

---

## Firebase Console Locations

### To Access Firebase Console:

1. Go to: https://console.firebase.google.com/
2. Sign in with your Google account
3. Select project: **bcachurch-finance**
4. Left menu → **Storage**

### In Storage:

- **Files** tab → See uploaded receipts
- **Rules** tab → Edit security rules
- **Quotas** tab → Check storage usage

---

## Expected Behavior After Fix

### When Upload Succeeds:

1. Receipt file uploaded to Firebase Storage
2. Path: `receipts/2026/[timestamp]_[filename]`
3. Download URL stored with expense
4. Success alert shows
5. Expense table shows receipt link

### Expense Table Shows:
```
Type | Member    | Category | Amount | Receipt
-----|-----------|----------|--------|----------
paid | John Doe  | Utility  | $250   | 📎 View
```

---

## Contact & Support

If you continue to have issues:

1. Check browser console (F12) for exact error
2. Take screenshot of error message
3. Check Firebase Console for storage bucket
4. Verify security rules are published

---

## Quick Reference

| Issue | Solution |
|-------|----------|
| storage/unauthorized | Update Security Rules |
| Storage not found | Create storage bucket |
| File upload hangs | Check internet connection |
| Rules not working | Click "Publish" after editing |
| Clear cache | Ctrl+Shift+Delete |

---

## Testing Commands

In browser console, test Firebase initialization:

```javascript
// Check if Firebase is loaded
console.log(firebase);

// Check if Storage is initialized
console.log(firebase.storage());

// Check storage bucket
console.log(firebase.app().options.storageBucket);
```

---

## Summary

**Most likely cause:** Firebase Storage Rules need to be updated

**Solution:**
1. Go to Firebase Console → Storage → Rules
2. Update rules to allow authenticated uploads
3. Click Publish
4. Try uploading receipt again

**If still not working:**
1. Check browser console (F12) for specific error code
2. Refer to error code in section above
3. Follow recommended fix for that error code

---

**Status:** Receipt upload is now more robust with better error messages. Check browser console for detailed troubleshooting info.

