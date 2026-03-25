# Corrected: Users Collection (Roles Only) + Firebase Authentication (Passwords)

## Architecture - CORRECTED

### 1. `/users` Collection (Role Management)
```javascript
{
  Name: "John Doe",
  Email: "john@church.org",
  Role: "Treasurer",
  MemberID: "mem_123",
  Active: true,
  CreatedDate: Timestamp
  
  // NO PASSWORD - NOT STORED HERE ✅
}
```

### 2. Firebase Authentication (Password Management)
```
Separate from Firestore
├─ Email: john@church.org
├─ Password: (encrypted/hashed by Firebase)
└─ UID: firebase_unique_id
```

---

## How to Setup

### Step 1: Create User in /users Collection

**Via Your App:**
1. Open app
2. Click "👤 Users & Roles"
3. Click "Add User"
4. Fill in:
   - Name: John Doe
   - Email: john@church.org
   - Role: Superuser
   - Status: Active
5. Click "Save User (Role Only)"

**Result:** User added to `/users` collection with role info only

---

### Step 2: Create Firebase Authentication Account

**In Firebase Console:**

1. Go to: Firebase Console → bcachurch-finance → Authentication
2. Click "Create a new user"
3. Fill in:
   - Email: john@church.org (MUST match /users Email)
   - Password: YourSecurePassword123!
4. Click "Create"

**Result:** User can now log in with email/password

---

## Login Flow (Corrected)

```
1. User opens app
   ↓
2. Sees login screen
   ↓
3. Enters email + password
   ↓
4. Firebase Auth validates password
   ↓
5. IF valid:
   ├─ Get user from /users collection
   ├─ Check role and status
   ├─ Create session
   └─ Show dashboard
   ↓
6. IF invalid:
   └─ Show error message
```

---

## Key Differences

### ❌ BEFORE (Incorrect)
```
/users collection:
├─ Name: John Doe
├─ Email: john@church.org
├─ Role: Treasurer
├─ Password: "TestPass123" ❌ PLAINTEXT (INSECURE)
```

### ✅ AFTER (Correct)
```
/users collection:
├─ Name: John Doe
├─ Email: john@church.org
├─ Role: Treasurer
└─ (NO PASSWORD)

Firebase Authentication:
└─ john@church.org ← Password encrypted by Firebase
```

---

## Step-by-Step: First User Setup

### Step 1: Open App
- Refresh browser
- You're in bypass mode (temporary)

### Step 2: Go to Users & Roles
- Click "👤 Users & Roles" button

### Step 3: Add User (Role Only)
- Click "Add User"
- Name: Your Name
- Email: your@email.com
- Role: Superuser
- Status: Active
- Click "Save User (Role Only)"

### Step 4: Create Firebase Auth Account
- Go to Firebase Console
- Authentication tab
- Create new user with SAME email
- Set a password

### Step 5: Test Login
- Click "🔓 Logout/Login"
- Login screen shows
- Enter email + password you created
- Click LOGIN
- Should see dashboard ✅

---

## Firebase Authentication Setup

### Access Firebase Console

1. Go to: https://console.firebase.google.com/
2. Select project: **bcachurch-finance**
3. Click **Authentication** (left menu)
4. Click **Users** tab

### Create User

1. Click **Create a new user** (or + icon)
2. Fill in:
   - **Email:** john@church.org
   - **Password:** SecurePassword123!
3. Click **Create**

### Done!
User can now log in with their email/password

---

## Email Must Match!

⚠️ **IMPORTANT:**

The email in `/users` collection **MUST match** the email in Firebase Authentication!

```
✅ CORRECT:
/users → Email: john@church.org
Firebase Auth → Email: john@church.org
→ Login works!

❌ WRONG:
/users → Email: john@church.org
Firebase Auth → Email: john123@gmail.com
→ Login fails!
```

---

## Password Requirements

Firebase automatically enforces:
- ✅ Min 6 characters
- ✅ Stored securely (hashed)
- ✅ Never sent to browser
- ✅ Reset via email link

---

## Adding More Users

### For Each New User:

1. **Add to /users collection:**
   - Click "👤 Users & Roles"
   - Fill in name, email, role
   - Click "Save User (Role Only)"

2. **Create Firebase Auth account:**
   - Firebase Console → Authentication
   - Create new user with same email
   - Set temporary password

3. **User can log in:**
   - With email + password
   - Password reset link sent via email

---

## Managing Users

### Edit User Role
```
/users collection:
1. Click "Edit" on user
2. Change Role, Status, Member Link
3. Click "Update"
→ Changes take effect immediately
```

### Change User Password
```
Firebase Console → Authentication:
1. Find user
2. Click "Reset password" (or delete & recreate)
3. Send reset link
4. User sets new password
```

### Disable User
```
/users collection:
1. Click "Edit" on user
2. Set Status: Inactive
3. Click "Update"
→ User cannot log in
```

### Delete User
```
Two steps required:
1. Delete from /users collection
2. Delete from Firebase Authentication

OR just set Status: Inactive (recommended)
```

---

## Summary

**`/users` Collection:**
- ✅ Stores name, email, role, status
- ✅ Managed in your app
- ❌ NO passwords stored

**Firebase Authentication:**
- ✅ Stores email and encrypted password
- ✅ Handles login securely
- ✅ Manages password reset
- ✅ You control from Firebase Console

**Login System:**
- ✅ User enters email + password
- ✅ Firebase validates password
- ✅ Fetch role from `/users` collection
- ✅ Create session and show dashboard

---

**Status:** ✅ CORRECTED
**Ready to:** Create first user and test login
**Next:** Follow "Step-by-Step: First User Setup" above


