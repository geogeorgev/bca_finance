# Role-Based Access Control - Technical Implementation

## How the System Works (Code Level)

### 1. Role Level Definition (login.js)

```javascript
function getRoleLevel(role){
  const levels = {
    "Superuser": 10,
    "Admin": 9,
    "Treasurer": 8,
    "Secretary": 7,
    "Joint Secretary": 6,
    "Joint Treasurer": 5
  }
  return levels[role] || 0  // Returns 0 if role not found (NO ROLE)
}
```

**What This Does:**
- Converts role name to permission level (1-10)
- Returns 0 if role is undefined (NO ROLE)
- Used for permission comparison

---

### 2. Login Authentication (login.js)

```javascript
async function handleLogin(event){
  const email = document.getElementById("loginEmail").value
  const password = document.getElementById("loginPassword").value
  
  try {
    // Step 1: Firebase authenticates password
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password)
    
    // Step 2: Look for user role in database
    const userSnap = await db.collection("users")
      .where("Email", "==", email)
      .limit(1)
      .get()
    
    // Step 3: Check if user record exists
    if(userSnap.empty){
      // USER AUTHENTICATED but NO ROLE = LOCKED OUT
      showError("User role not configured")  // ← THIS IS THE ERROR
      return
    }
    
    const userData = userSnap.docs[0].data()
    
    // Step 4: Check if account is active
    if(!userData.Active){
      showError("Account is disabled")
      return
    }
    
    // Step 5: Create session with role info
    createSession({
      ...userData,
      firebaseUID: userCredential.user.uid
    }, userSnap.docs[0].id, rememberMe)
    
    window.location.reload()
    
  } catch(error){
    // Handle Firebase auth errors
    showError("Login failed: " + error.message)
  }
}
```

**Flow:**
```
Email+Password Valid? (Firebase)
        ↓
  YES → Look for role in database
        ↓
        ├─ Role found? → Check if Active
        │                 ↓
        │                 Active? → Create session → Login success ✅
        │                 ↓
        │                 Inactive? → "Account is disabled" ❌
        │
        └─ Role NOT found? → "User role not configured" ❌
```

---

### 3. Session Creation (login.js)

```javascript
function createSession(user, userId, rememberMe){
  const sessionData = {
    userId: userId,
    userEmail: user.Email,
    userName: user.Name,
    userRole: user.Role,        // ← Stores role name
    userLevel: getRoleLevel(user.Role),  // ← Stores permission level (1-10)
    memberID: user.MemberID || null,
    loginTime: new Date().getTime(),
    sessionExpiry: new Date().getTime() + (24 * 60 * 60 * 1000)
  }
  
  // Store session (local or session storage based on "Remember Me")
  if(rememberMe){
    localStorage.setItem("userSession", JSON.stringify(sessionData))
  } else {
    sessionStorage.setItem("userSession", JSON.stringify(sessionData))
  }
}
```

**Session Contains:**
- User identification (email, name, ID)
- **Role name** (e.g., "Treasurer")
- **Permission level** (e.g., 8)
- Login timestamp
- Expiry time (24 hours)

---

### 4. Permission Checking (login.js)

```javascript
function canAccess(requiredRole){
  const user = getCurrentUser()
  
  if(!user){
    return false  // Not logged in
  }
  
  const userLevel = user.userLevel         // Their level (e.g., 8)
  const requiredLevel = getRoleLevel(requiredRole)  // Level needed (e.g., 9)
  
  // PERMISSION CHECK: Higher or equal level allowed
  return userLevel >= requiredLevel
  
  // Examples:
  // Superuser (10) >= Admin (9) = true ✅
  // Treasurer (8) >= Admin (9) = false ❌
  // Treasurer (8) >= Treasurer (8) = true ✅
}
```

**Logic:**
```
User Level >= Required Level?
YES → Allow access
NO  → Deny access
```

---

### 5. Route Protection (login.js)

```javascript
function protectRoute(requiredRole = null){
  const user = getCurrentUser()
  
  // Check if logged in
  if(!user){
    showLoginScreen()
    return false
  }
  
  // Check if has required role
  if(requiredRole && !canAccess(requiredRole)){
    alert("You don't have permission to access this feature")
    return false
  }
  
  return true  // User can access
}
```

**Used Before Loading Features:**
```
if(!protectRoute("Treasurer")){
  return  // Don't load if not Treasurer level
}
// Load feature if we get here
```

---

### 6. Role Display in Members List (members.js)

```javascript
// Check if this member has an assigned role
const userSnap = await db.collection("users")
  .where("MemberID", "==", doc.id)
  .where("current_record", "==", true)
  .get()

let roleDisplay = '<span style="color: #ccc;">✗ No role assigned</span>'

if(!userSnap.empty){
  // Role found
  const linkedUser = userSnap.docs[0].data()
  const roleColor = {
    "Superuser": "#d32f2f",
    "Admin": "#f57c00",
    "Treasurer": "#388e3c",
    "Secretary": "#1976d2",
    // ... etc
  }[linkedUser.Role] || "#666"
  
  roleDisplay = `<span style="color: ${roleColor}; font-weight: bold;">✓ ${linkedUser.Role}</span>`
}

// Display shows:
// ✓ Treasurer (in green) - if role assigned
// ✗ No role assigned (in gray) - if NO role
```

---

## Database Structure

### Users Collection

```javascript
{
  Name: "John Smith",
  Email: "john@example.com",
  Role: "Treasurer",        // ← Determines permission level
  MemberID: "member_123",
  MemberName: "John Smith",
  Active: true,             // ← If false, account disabled
  current_record: true,
  // ... other fields
}
```

**What Each Field Does:**
- `Role`: Text name of role → Converted to level (1-10)
- `Active`: Boolean → Must be true to login
- `current_record`: Boolean → Marks current active record
- `Email`: Used to find user during login
- `MemberID`: Links user to member record

---

## Permission Levels Explained

```javascript
// When comparing permissions:

const userLevel = 8          // Treasurer
const requiredLevel = 9      // Admin

if(userLevel >= requiredLevel){
  // Can access (8 >= 9 = FALSE)
  // User CANNOT access ❌
} else {
  // Cannot access
}

// Another example:
const userLevel = 10         // Superuser
const requiredLevel = 8      // Treasurer

if(userLevel >= requiredLevel){
  // Can access (10 >= 8 = TRUE)
  // User CAN access ✅
}
```

**Hierarchy:**
```
10 >= 9 >= 8 >= 7 >= 6 >= 5 >= 0
↑                              ↑
Superuser            No Role (LOCKED OUT)
```

---

## What Happens During Login

### Scenario 1: User WITH Role

```
Input: email, password
  ↓
Firebase auth: email/password valid? → YES
  ↓
Database query: find user by email → FOUND
  ↓
Check role field → "Treasurer" FOUND
  ↓
Check Active field → true
  ↓
getRoleLevel("Treasurer") → 8
  ↓
Create session with:
  - userRole: "Treasurer"
  - userLevel: 8
  ↓
Login success ✅
User can now access features
```

### Scenario 2: User WITHOUT Role

```
Input: email, password
  ↓
Firebase auth: email/password valid? → YES
  ↓
Database query: find user by email → FOUND
  ↓
Check role field → NOT FOUND (or null/undefined)
  ↓
getRoleLevel(undefined) → 0
  ↓
Alert: "User role not configured"
  ↓
Login denied ❌
User locked out
```

### Scenario 3: User with Disabled Account

```
Input: email, password
  ↓
Firebase auth: email/password valid? → YES
  ↓
Database query: find user by email → FOUND
  ↓
Check Active field → false
  ↓
Alert: "Account is disabled"
  ↓
Login denied ❌
User locked out
```

---

## Feature Access Control

```javascript
// Example: Income feature requires Treasurer level

function loadIncome(){
  // Protect the route
  if(!protectRoute("Treasurer")){
    return  // User doesn't have Treasurer level
  }
  
  // If we reach here, user HAS Treasurer or higher
  // Load income management interface
  show(incomePage)
}

// Access check for different roles:
// Superuser (10) >= Treasurer (8) = ✅ CAN ACCESS
// Admin (9) >= Treasurer (8) = ✅ CAN ACCESS
// Treasurer (8) >= Treasurer (8) = ✅ CAN ACCESS
// Secretary (7) >= Treasurer (8) = ❌ CANNOT ACCESS
// No Role (0) >= Treasurer (8) = ❌ CANNOT ACCESS
```

---

## Role Assignment Flow

```javascript
// Only Superuser can assign roles (they have level 10)

async function assignRoleToMember(memberId, memberName, memberEmail){
  // Check: Is current user a Superuser?
  const user = getCurrentUser()
  if(user.userLevel !== 10){
    alert("Only Superuser can assign roles")
    return
  }
  
  // If we get here, they ARE Superuser
  // Show role selection dialog
  // User selects role
  // Save to database:
  await db.collection("users").doc(userId).update({
    Role: selectedRole  // ← Now user can login
  })
}
```

---

## Summary: How No Role Causes Lockout

```
1. getRoleLevel(undefined) returns 0
2. Session NOT created with undefined role
3. Login fails with "User role not configured"
4. No session data stored
5. getCurrentUser() returns null
6. validateSession() returns false
7. User cannot access any protected routes
8. User is completely locked out

FIX:
1. Superuser assigns role
2. getRoleLevel now returns 1-10
3. Session created successfully
4. User can login
5. getCurrentUser() returns user data
6. validateSession() returns true
7. User can access features matching their role
```

---

**For complete reference, see main documentation:**
- ROLE_BASED_ACCESS_CONTROL_COMPLETE.md
- ROLE_ACCESS_QUICK_REFERENCE.md
- ROLE_ACCESS_FINAL_SUMMARY.md

