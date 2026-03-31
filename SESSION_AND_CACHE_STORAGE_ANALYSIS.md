# Session & Cache Storage Analysis

## Yes - This App DOES Store Values in Session & Cache

The application stores **user session data** in the browser's session and local storage for authentication and user tracking purposes.

---

## Storage Locations

### 1. **Session Storage** (Temporary - Cleared when browser closes)
**Key:** `userSession`
**Triggers:** When user logs in WITHOUT checking "Remember Me"
**Cleared:** When browser closes OR user logs out

### 2. **Local Storage** (Persistent - Survives browser restart)
**Key:** `userSession`
**Triggers:** When user logs in WITH "Remember Me" checked
**Cleared:** When user logs out OR manually clears browser storage
**Duration:** Persists until logout (24-hour expiry enforced by code)

---

## What Gets Stored

When user logs in successfully, this data is stored:

```javascript
{
  userId: "doc_id_abc123",           // Firestore document ID
  userEmail: "john@example.com",     // Email from /users collection
  userName: "John Doe",              // Name from /users collection
  userRole: "Treasurer",             // Role from /users collection
  userLevel: 3,                      // Role hierarchy (Superuser=5, Admin=4, Treasurer=3, etc.)
  memberID: "member_456",            // Linked member ID from /users
  memberName: "John Doe",            // Member name from /users
  loginTime: 1711722000000,          // Timestamp when logged in
  sessionExpiry: 1711808400000       // Timestamp when session expires (24 hours later)
}
```

---

## Storage Flow

### Login Flow with "Remember Me"

```
User enters Email/Password
        ↓
Click LOGIN
        ↓
Firebase Auth validates password
        ↓
Firestore query: Get user from /users collection
        ↓
User data retrieved (Email, Name, Role, MemberID)
        ↓
Check "Remember Me" checkbox?
        ├─ YES → Store in localStorage (persists)
        └─ NO → Store in sessionStorage (temporary)
        ↓
Reload page / Go to dashboard
        ↓
Session data available throughout app
```

### Logout Flow

```
User clicks LOGOUT
        ↓
System calls clearSession()
        ↓
Remove from sessionStorage
Remove from localStorage
        ↓
User returned to login page
        ↓
Session data completely cleared
```

---

## How It's Used in the App

### 1. **Authentication Check**
```javascript
function getCurrentUser() {
  // Try session storage first
  let session = sessionStorage.getItem("userSession")
  
  // Fall back to local storage
  if(!session) {
    session = localStorage.getItem("userSession")
  }
  
  if(!session) {
    return null  // No user logged in
  }
  
  const user = JSON.parse(session)
  
  // Check if expired (24 hours)
  if(new Date().getTime() > user.sessionExpiry) {
    clearSession()
    return null  // Session expired
  }
  
  return user  // User is still logged in
}
```

### 2. **Audit Trail Capture**
```javascript
const currentUser = getCurrentUser()
const auditEmail = currentUser.userEmail  // ← Gets from session

// Records who made the change
created_by: auditEmail  // john@example.com
```

### 3. **Access Verification**
When page loads:
```javascript
function initializeApp() {
  const user = getCurrentUser()
  
  if(!user) {
    showLoginScreen()  // Force login if no session
    return
  }
  
  treasurerDashboard()  // Load app if logged in
}
```

### 4. **User Info Display**
```javascript
const user = getCurrentUser()
// Can use: user.userName, user.userRole, user.userEmail anywhere in app
```

---

## Security Considerations

### ✅ What's Good:
- ✅ Session data is **JSON stringified** (not plaintext passwords)
- ✅ **24-hour expiry** enforced in code
- ✅ **Passwords never stored** locally or in session
- ✅ Only user INFO stored (email, name, role)
- ✅ **Cleared on logout** from both storages
- ✅ Uses browser's built-in secure storage

### ⚠️ What to Know:
- ⚠️ **Remember Me** stores unencrypted data in localStorage (accessible to browser extensions)
- ⚠️ Can be viewed in browser DevTools (F12 → Application → Storage)
- ⚠️ Sensitive operations should still validate on server (Firestore rules)
- ⚠️ XSS attacks could read session data (use HTTPS in production)

---

## Storage Details

### Session Storage
```
Browser Tab 1:  [userSession: {...}]
Browser Tab 2:  [userSession: {...}]  ← Different, independent sessions
Browser Restart: [CLEARED]
```

### Local Storage
```
Browser Tab 1:  [userSession: {...}]
Browser Tab 2:  [userSession: {...}]  ← SAME data across all tabs
Browser Restart: [PRESERVED] ← Still there after close/reopen
```

---

## Example: What Gets Shown in DevTools

**Press F12 → Application → Local Storage / Session Storage**

```
Key: userSession
Value: {
  "userId": "abc123def456",
  "userEmail": "john@example.com",
  "userName": "John Doe",
  "userRole": "Treasurer",
  "userLevel": 3,
  "memberID": "member_123",
  "memberName": "John Doe",
  "loginTime": 1711722000000,
  "sessionExpiry": 1711808400000
}
```

---

## Data Lifecycle

### Timeline:

| Event | Storage Status |
|-------|---|
| User opens app | Empty |
| User enters email/password | Empty |
| Click LOGIN | Empty |
| Firebase Auth successful | Empty |
| Create Session called | **STORED** |
| Navigate dashboard | Session read |
| Click button (e.g., Add User) | Session used for audit trail |
| 24 hours pass | Session expired (checked on reload) |
| Click Logout | **CLEARED** |

---

## Code Locations

### Where Session is Created:
**File:** login.js, line 139
```javascript
function createSession(user, userId, rememberMe) { ... }
```

### Where Session is Retrieved:
**File:** login.js, line 163
```javascript
function getCurrentUser() { ... }
```

### Where Session is Cleared:
**File:** login.js, line 198
```javascript
function clearSession() { ... }
```

### Where Session is Used:
- **users.js** - Audit trail captures `currentUser.userEmail`
- **members.js** - Audit trail captures `currentUser.userEmail`
- **login.js** - Access control (logged in or not)
- **index.html** - Initialization check

---

## Browser Storage Limits

| Storage Type | Size Limit | Duration |
|---|---|---|
| sessionStorage | ~5-10MB | Until browser closes |
| localStorage | ~5-10MB | Until cleared by user |

**Note:** User session data is only ~500 bytes - very small

---

## Privacy Implications

### What's NOT Stored:
- ❌ Passwords (never stored anywhere)
- ❌ Credit card info
- ❌ Social security numbers
- ❌ Sensitive member data (addresses, phone numbers)

### What IS Stored (Session Only):
- ✅ User email (public identifier)
- ✅ User name (public identifier)
- ✅ User role (public identifier)
- ✅ Login timestamp (session tracking)
- ✅ Session expiry (security measure)

---

## Testing: See Storage in Action

### Test 1: Session Storage (Temporary)
1. Open app
2. Log in WITHOUT checking "Remember Me"
3. Press F12 → Application → Session Storage
4. See `userSession` key with user data
5. Close browser tab
6. Open app again
7. **User is logged OUT** (session cleared)

### Test 2: Local Storage (Persistent)
1. Open app
2. Log in WITH "Remember Me" checked
3. Press F12 → Application → Local Storage
4. See `userSession` key with user data
5. Close browser completely
6. Open browser again
7. **User is still LOGGED IN** (session persisted)

### Test 3: Logout
1. Any login method
2. Click LOGOUT button
3. Press F12 → Storage
4. **`userSession` is GONE** from both storages
5. Try navigating to dashboard
6. **Redirected to login page**

---

## Best Practices Being Followed

✅ **Session storage for temporary logins** - Security best practice
✅ **LocalStorage for "Remember Me"** - Standard pattern
✅ **24-hour expiry** - Prevents stale sessions
✅ **Clear on logout** - Prevents unauthorized access
✅ **No sensitive data stored** - Only public identifiers
✅ **Session verified on every page load** - Access control

---

## Recommendations

### If You Want to Improve:

1. **Encrypt localStorage data** (if Remember Me available)
   ```javascript
   // Before storing
   const encrypted = encryptData(sessionData)
   localStorage.setItem("userSession", encrypted)
   ```

2. **Add HTTPS in production** - Prevents man-in-the-middle
   
3. **Reduce stored data** - Only store `userId` and fetch rest from Firestore
   
4. **Add Content Security Policy** - Prevents XSS attacks

5. **Use httpOnly cookies** (if backend available) - Better than localStorage

---

## Summary

| Aspect | Details |
|--------|---------|
| **What's Stored?** | User session info (email, name, role) |
| **Where?** | sessionStorage (temp) or localStorage (persistent) |
| **When?** | After successful login |
| **How Long?** | 24 hours or until logout |
| **Cleared When?** | Browser close (sessionStorage) or logout (both) |
| **Accessible By?** | Frontend JavaScript, Browser DevTools |
| **Contains Passwords?** | ❌ NO (never) |
| **Secure?** | ✅ YES (no sensitive data, 24-hr expiry) |

The app stores **ONLY session authentication data** - no sensitive information is cached! ✅

