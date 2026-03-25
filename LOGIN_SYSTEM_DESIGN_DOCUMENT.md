# Login & Access Control System - Design Document

## Overview

A role-based login and access control system that authenticates users against the Firebase `users` collection and grants application access based on assigned roles.

---

## System Architecture

### Login Flow

```
User Opens App
    ↓
Shows Login Screen
    ↓
User Enters Email & Password
    ↓
Validates Against users Collection
    ↓
IF Valid:
├─ Retrieve user data
├─ Check if Active
├─ Store user session
├─ Grant access based on role
└─ Redirect to Dashboard

IF Invalid:
├─ Show error message
└─ Request re-entry
```

---

## Database Schema

### users Collection (Authentication)

```javascript
{
  Name: "John Doe",
  Email: "john@church.org",
  Role: "Treasurer",
  MemberID: "mem_abc123",
  MemberName: "John Doe",
  Active: true,
  Password: "hashed_password",           // Hashed via bcrypt
  CreatedDate: Timestamp,
  LastLogin: Timestamp,
  PasswordResetRequired: false
}
```

---

## Available Roles

| Role | Level | Permissions |
|------|-------|-------------|
| **Superuser** | 10 | Full system access, user management, all features |
| **Admin** | 9 | Manage all features, members, budgets, events |
| **Treasurer** | 8 | Income, expenses, budget, financial reports |
| **Secretary** | 7 | Members, events, records, documentation |
| **Joint Secretary** | 6 | Secondary secretary, limited member edit |
| **Joint Treasurer** | 5 | Secondary treasurer, limited expense approval |

---

## Login Screen Components

### UI Elements

```
┌─────────────────────────────────────┐
│                                     │
│      BCA Finance Management        │
│                                     │
│  Email:     [_________________]    │
│                                     │
│  Password:  [_________________]    │
│                                     │
│  [Remember Me] ☐                    │
│                                     │
│  [    LOGIN    ] [RESET PASSWORD]  │
│                                     │
│                                     │
│  © 2026 Boston Christian Assembly  │
│                                     │
└─────────────────────────────────────┘
```

---

## Authentication Process

### Step 1: User Input
```javascript
Email: user@example.com
Password: ••••••••
```

### Step 2: Query users Collection
```javascript
const userSnap = await db.collection("users")
  .where("Email", "==", email)
  .limit(1)
  .get()
```

### Step 3: Verify Password
```javascript
IF userFound:
  ├─ Compare entered password with stored hash
  ├─ IF match:
  │  └─ Password correct ✓
  ├─ IF no match:
  │  └─ Invalid password ✗
ELSE:
  └─ User not found ✗
```

### Step 4: Check Status
```javascript
IF Active == true:
  └─ User can access app
IF Active == false:
  └─ Account disabled, show message
```

### Step 5: Create Session
```javascript
Store in localStorage/sessionStorage:
├─ userEmail: "john@church.org"
├─ userName: "John Doe"
├─ userRole: "Treasurer"
├─ userLevel: 8
├─ memberId: "mem_abc123"
├─ loginTime: timestamp
└─ sessionToken: generated_token
```

### Step 6: Redirect to Dashboard
```javascript
User redirected based on role:
├─ Superuser → Full Dashboard
├─ Admin → Admin Dashboard
├─ Treasurer → Finance Dashboard
├─ Secretary → Records Dashboard
└─ Joint roles → Limited Dashboard
```

---

## Access Control Matrix

### Feature Access by Role

| Feature | Superuser | Admin | Treasurer | Secretary | Joint Sec | Joint Treas |
|---------|-----------|-------|-----------|-----------|-----------|-------------|
| Dashboard | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Members | ✓ | ✓ | - | ✓ | ◐ | - |
| Income | ✓ | ✓ | ✓ | - | - | - |
| Expense | ✓ | ✓ | ✓ | - | - | ◐ |
| Budget | ✓ | ✓ | ✓ | - | - | - |
| Reports | ✓ | ✓ | ✓ | ◐ | - | - |
| Events | ✓ | ✓ | - | ✓ | ◐ | - |
| Users | ✓ | - | - | - | - | - |

Legend:
- ✓ = Full Access
- ◐ = Limited Access
- \- = No Access

---

## Password Security

### Password Requirements

```
Minimum 8 characters
At least 1 uppercase letter
At least 1 lowercase letter
At least 1 number
At least 1 special character (!@#$%^&*)
```

### Password Storage

```
Never store plaintext passwords
Always hash using bcrypt
Salt: 10 rounds
Format: $2b$10$salt_and_hash...
```

### Password Reset

```
User Click "Forgot Password"
  ↓
Receives password reset link via email
  ↓
Opens reset form
  ↓
Sets new password
  ↓
Password updated in database
  ↓
Can log in with new password
```

---

## Session Management

### Session Storage

```javascript
// localStorage - Persistent
localStorage.setItem("userEmail", "john@church.org")
localStorage.setItem("userName", "John Doe")
localStorage.setItem("userRole", "Treasurer")
localStorage.setItem("userLevel", 8)
localStorage.setItem("memberId", "mem_abc123")
localStorage.setItem("loginTime", timestamp)
localStorage.setItem("sessionToken", token)

// OR sessionStorage - Expires on tab close
sessionStorage.setItem(...)
```

### Session Validation

```javascript
// On page load/navigation
Check if session exists:
  ├─ IF exists and valid → Allow access
  ├─ IF exists but expired → Require re-login
  └─ IF not exists → Redirect to login

Check user status:
  ├─ IF Active == true → Allow
  └─ IF Active == false → Logout, show disabled message
```

### Session Timeout

```
Timeout: 24 hours (or configurable)
Warning: 5 minutes before timeout
On Timeout:
  ├─ Clear session
  ├─ Redirect to login
  └─ Show "Session expired" message
```

---

## Error Handling

### Login Errors

| Error | Message | Action |
|-------|---------|--------|
| User not found | "Email not found" | Show message, clear field |
| Wrong password | "Incorrect password" | Show message, keep email |
| Account inactive | "Account disabled by admin" | Show message, offer support |
| Too many attempts | "Too many failed attempts. Try again later" | Lock for 15 min |
| Network error | "Connection error. Try again" | Retry button |

---

## Security Features

### Features Implemented

```
✓ Password hashing (bcrypt)
✓ Email/password validation
✓ Active/inactive status check
✓ Session management
✓ Failed login attempts tracking
✓ Account lockout after 5 failed attempts
✓ Session timeout
✓ Secure password reset
✓ Role-based access control (RBAC)
✓ Audit logging
```

### Security Best Practices

```
✓ Never expose password hashes
✓ Use HTTPS only
✓ Validate on both client and server
✓ Implement rate limiting
✓ Clear session on logout
✓ Track login attempts
✓ Log all authentications
✓ Implement 2FA (future enhancement)
✓ Secure password reset tokens
✓ Regular security audits
```

---

## Role-Based Access Implementation

### In Application Code

```javascript
// Check if user can access feature
function canAccess(requiredRole) {
  const userRole = localStorage.getItem("userRole")
  const userLevel = parseInt(localStorage.getItem("userLevel"))
  
  const requiredLevel = getRoleLevel(requiredRole)
  
  return userLevel >= requiredLevel
}

// Redirect based on role
function getDashboardUrl(role) {
  const dashboards = {
    "Superuser": "/dashboard/superuser",
    "Admin": "/dashboard/admin",
    "Treasurer": "/dashboard/finance",
    "Secretary": "/dashboard/records",
    "Joint Secretary": "/dashboard/records-limited",
    "Joint Treasurer": "/dashboard/finance-limited"
  }
  
  return dashboards[role] || "/dashboard"
}

// Hide/show UI based on role
function showFeature(featureName) {
  const userLevel = parseInt(localStorage.getItem("userLevel"))
  const featureLevel = getFeatureLevel(featureName)
  
  if(userLevel >= featureLevel) {
    document.getElementById(featureName).style.display = "block"
  } else {
    document.getElementById(featureName).style.display = "none"
  }
}
```

---

## Login Form Implementation

### HTML

```html
<div id="loginScreen">
  <div class="login-container">
    <div class="login-header">
      <h1>BCA Finance Management</h1>
      <p>Church Administration System</p>
    </div>
    
    <form onsubmit="handleLogin(event)">
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="loginEmail" required>
      </div>
      
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="loginPassword" required>
      </div>
      
      <div class="form-group">
        <input type="checkbox" id="rememberMe">
        <label>Remember Me</label>
      </div>
      
      <button type="submit" class="login-btn">LOGIN</button>
      
      <div class="login-links">
        <a href="#" onclick="showPasswordReset()">Forgot Password?</a>
      </div>
      
      <div id="loginError" class="error-message"></div>
    </form>
  </div>
</div>
```

---

## Login Functions

### handleLogin()
```javascript
1. Get email and password from form
2. Validate format
3. Query users collection
4. Verify password (bcrypt compare)
5. Check if Active
6. IF valid:
   ├─ Store session
   ├─ Log login
   ├─ Redirect to dashboard
7. IF invalid:
   ├─ Show error
   ├─ Track failed attempt
   ├─ Lock after 5 attempts
```

### handleLogout()
```javascript
1. Get user info for logging
2. Update LastLogin timestamp
3. Clear session storage
4. Clear localStorage
5. Redirect to login
6. Log logout event
```

### validateSession()
```javascript
1. Check if session exists
2. Check if user still active
3. Check if session expired
4. IF valid → allow access
5. IF invalid → force re-login
```

---

## User Experience Flow

### First Time Login

```
1. User opens app
2. Sees login screen
3. Enters email and password
4. Clicks LOGIN
5. System validates
6. IF correct:
   ├─ Shows "Logging in..."
   ├─ Redirects to dashboard
   ├─ Welcome message shows role
   └─ User can access features
7. IF incorrect:
   ├─ Shows error message
   └─ User tries again
```

### Session Management

```
User Logged In
  ↓
Uses app normally
  ↓
IF 24 hours pass:
  ├─ Warning: "Session expiring in 5 minutes"
  ├─ User can extend or logout
  └─ After 5 min: Auto-logout
  ↓
If user clicks logout:
  ├─ Confirmation dialog
  ├─ Clear session
  └─ Redirect to login
```

---

## API Functions Required

### Core Functions

```javascript
handleLogin(event)           // Process login form
handleLogout()              // Clear session and logout
validateSession()           // Check if session valid
verifyPassword(email, pwd)  // Compare password hashes
createSession(user)         // Store user session
checkUserActive(email)      // Verify account active
canAccess(feature)          // Check role permissions
getRoleName(level)          // Get role from level
getFeatureLevel(feature)    // Get required level
logLoginAttempt(email)      // Track login attempts
blockAccountAttempts(email) // Lock after failed tries
```

---

## Firebase Security Rules

### For users Collection

```
match /users/{document=**} {
  allow read: if request.auth != null && 
              (resource.data.email == request.auth.email || 
               request.auth.token.role == "Superuser");
  allow write: if request.auth != null && 
               request.auth.token.role == "Superuser";
}
```

---

## Testing Checklist

```
Login Tests:
□ Valid email/password → Login successful
□ Invalid password → Error message
□ Non-existent email → Error message
□ Account inactive → Disabled message
□ 5 failed attempts → Account locked
□ Correct role loaded → Session correct
□ Session persists → Page reload keeps session
□ Logout clears session → Redirects to login
□ Wrong role access → Feature hidden

Session Tests:
□ Session expires after 24 hours
□ Warning appears at 5 minutes
□ Can extend session
□ Invalid session redirects to login
□ User disabled mid-session → Logged out

Role Tests:
□ Superuser sees all features
□ Admin sees admin features
□ Treasurer sees finance features
□ Secretary sees record features
□ Joint roles see limited features
□ Non-authorized features hidden
```

---

## Summary

**Login & Access Control System:**

✅ Email/password authentication
✅ Password hashing (bcrypt)
✅ Role-based access control (6 roles)
✅ Session management with timeout
✅ Account security (lockout, inactive status)
✅ Feature-level access control
✅ Secure password reset
✅ Audit logging
✅ User-friendly interface
✅ Error handling

**Status:** Design ready for implementation

