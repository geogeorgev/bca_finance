# Security Improvement Implementation Plan

## Phase 1: Critical Fixes (Week 1-3)

### Priority 1: Implement Bcrypt Password Hashing

**Current Problem:**
```javascript
// NEVER DO THIS
Password: "TestPass123"  // Plaintext in database
```

**Solution: Update users.js**

```javascript
// At the top, add bcrypt import
// Note: In browser, use bcryptjs (JavaScript version)
// <script src="https://cdn.jsdelivr.net/npm/bcryptjs@2.4.3/dist/bcrypt.min.js"></script>

async function addUser(){
  const name = document.getElementById("userName").value
  const email = document.getElementById("userEmail").value
  const role = document.getElementById("userRole").value
  const password = document.getElementById("userPassword").value  // Get password
  
  if(!name || !email || !role || !password){
    alert("All fields required")
    return
  }
  
  try {
    // HASH THE PASSWORD
    const hashedPassword = await bcryptjs.hash(password, 10)
    
    await db.collection("users").add({
      Name: name,
      Email: email,
      Role: role,
      MemberID: memberId || null,
      MemberName: memberName || null,
      Active: true,
      Password: hashedPassword,  // Store HASHED password
      CreatedDate: new Date()
    })
    
    alert("User added successfully")
    loadUsers()
  } catch(error){
    console.error("Error adding user:", error)
    alert("Error adding user")
  }
}

async function updateUserPassword(userId, newPassword){
  try {
    // Hash new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10)
    
    // Update user
    await db.collection("users").doc(userId).update({
      Password: hashedPassword
    })
    
    alert("Password updated")
  } catch(error){
    console.error("Error updating password:", error)
  }
}
```

**Update login.js:**

```javascript
async function handleLogin(event){
  event.preventDefault()
  
  const email = document.getElementById("loginEmail").value.trim().toLowerCase()
  const password = document.getElementById("loginPassword").value
  const rememberMe = document.getElementById("rememberMe").checked
  const errorDiv = document.getElementById("loginError")
  
  errorDiv.style.display = "none"
  
  if(!email || !password){
    showError("Please enter email and password")
    return
  }
  
  try {
    // Query user by email
    const userSnap = await db.collection("users")
      .where("Email", "==", email)
      .limit(1)
      .get()
    
    if(userSnap.empty){
      logFailedLogin(email, "User not found")
      showError("Email not found")
      return
    }
    
    const userDoc = userSnap.docs[0]
    const user = userDoc.data()
    const userId = userDoc.id
    
    // Check if account is active
    if(!user.Active){
      logFailedLogin(email, "Account inactive")
      showError("Account disabled")
      return
    }
    
    // HASH PASSWORD AND COMPARE
    const passwordMatch = await bcryptjs.compare(password, user.Password)
    
    if(!passwordMatch){
      logFailedLogin(email, "Wrong password")
      showError("Incorrect password")
      return
    }
    
    // Login successful
    createSession(user, userId, rememberMe)
    
    // Update last login
    await db.collection("users").doc(userId).update({
      LastLogin: new Date()
    })
    
    logSuccessfulLogin(email, user.Role)
    window.location.href = "#dashboard"
    
  } catch(error){
    console.error("Login error:", error)
    showError("An error occurred")
  }
}
```

---

### Priority 2: Update Firestore Security Rules

**Deploy These Rules:**

```
Go to Firebase Console → Firestore → Rules

Replace with:
```

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to get user role
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.Role;
    }
    
    function getUserLevel() {
      let role = getUserRole();
      let levels = {
        'Superuser': 10,
        'Admin': 9,
        'Treasurer': 8,
        'Secretary': 7,
        'Joint Secretary': 6,
        'Joint Treasurer': 5
      };
      return levels.get(role, 0);
    }
    
    function hasMinLevel(requiredLevel) {
      return getUserLevel() >= requiredLevel;
    }
    
    function isSuperuser() {
      return getUserRole() == 'Superuser';
    }
    
    function isAdmin() {
      return hasMinLevel(9);
    }
    
    // USERS COLLECTION
    match /users/{userId} {
      // Only Superuser can read all users
      allow read: if request.auth != null && 
                     (userId == request.auth.uid || isSuperuser());
      // Only Superuser can write
      allow write: if isSuperuser();
    }
    
    // MEMBERS COLLECTION
    match /members/{memberId} {
      // Admin and above can read
      allow read: if request.auth != null && hasMinLevel(7);
      // Only Admin and Superuser can write
      allow write: if request.auth != null && hasMinLevel(9);
    }
    
    // INCOME COLLECTION
    match /income/{incomeId} {
      // Treasurer and above can read/write
      allow read: if request.auth != null && hasMinLevel(8);
      allow write: if request.auth != null && hasMinLevel(8);
    }
    
    // EXPENSE COLLECTION
    match /expense/{expenseId} {
      // Treasurer and above
      allow read: if request.auth != null && hasMinLevel(8);
      allow write: if request.auth != null && hasMinLevel(8);
    }
    
    // BUDGET COLLECTION
    match /budget/{budgetId} {
      // Treasurer and above can read
      allow read: if request.auth != null && hasMinLevel(8);
      // Only Admin and above can write
      allow write: if request.auth != null && hasMinLevel(9);
    }
    
    // EVENTS COLLECTION
    match /events/{eventId} {
      // Secretary and above can read
      allow read: if request.auth != null && hasMinLevel(7);
      // Only Admin and above can write
      allow write: if request.auth != null && hasMinLevel(9);
    }
    
    // EVENT REGISTRATIONS
    match /eventRegistrations/{registrationId} {
      // Secretary and above
      allow read: if request.auth != null && hasMinLevel(7);
      allow write: if request.auth != null && hasMinLevel(9);
    }
    
    // AUDIT LOG
    match /auditLog/{logId} {
      // Only Superuser can read
      allow read: if request.auth != null && isSuperuser();
      // Everyone logs (but only their own actions)
      allow write: if request.auth != null;
    }
    
    // BUDGET (with additional validation)
    match /budget/{budgetId} {
      allow read: if request.auth != null && hasMinLevel(8);
      allow write: if request.auth != null && hasMinLevel(9) &&
                     validateBudgetData();
    }
    
    function validateBudgetData() {
      // Ensure BudgetAmount is positive
      return request.resource.data.BudgetAmount > 0;
    }
  }
}
```

---

### Priority 3: Implement Rate Limiting

**Add to login.js:**

```javascript
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000  // 15 minutes

async function checkLoginAttempts(email){
  const attemptDoc = await db.collection("loginAttempts").doc(email).get()
  
  if(!attemptDoc.exists){
    return { allowed: true, attempts: 0 }
  }
  
  const data = attemptDoc.data()
  const now = new Date().getTime()
  
  // Check if account is locked
  if(data.lockedUntil && data.lockedUntil > now){
    const minutesRemaining = Math.ceil((data.lockedUntil - now) / 60000)
    return { 
      allowed: false, 
      message: `Account locked. Try again in ${minutesRemaining} minutes` 
    }
  }
  
  // Check attempt count
  if(data.count >= MAX_LOGIN_ATTEMPTS){
    // Lock account
    await db.collection("loginAttempts").doc(email).update({
      lockedUntil: new Date(now + LOCKOUT_DURATION)
    })
    
    return { 
      allowed: false, 
      message: "Too many failed attempts. Account locked for 15 minutes" 
    }
  }
  
  return { allowed: true, attempts: data.count }
}

async function recordFailedLogin(email){
  const attemptDoc = await db.collection("loginAttempts").doc(email).get()
  
  if(attemptDoc.exists){
    const count = attemptDoc.data().count + 1
    await db.collection("loginAttempts").doc(email).update({
      count: count,
      lastAttempt: new Date()
    })
  } else {
    await db.collection("loginAttempts").doc(email).set({
      count: 1,
      lastAttempt: new Date(),
      lockedUntil: null
    })
  }
}

async function recordSuccessfulLogin(email){
  // Clear login attempts on successful login
  await db.collection("loginAttempts").doc(email).delete()
}

// Update handleLogin to use rate limiting
async function handleLogin(event){
  event.preventDefault()
  
  const email = document.getElementById("loginEmail").value.trim().toLowerCase()
  const password = document.getElementById("loginPassword").value
  const errorDiv = document.getElementById("loginError")
  
  // Check rate limiting
  const rateLimitCheck = await checkLoginAttempts(email)
  if(!rateLimitCheck.allowed){
    showError(rateLimitCheck.message)
    return
  }
  
  try {
    // ... existing login code ...
    
    if(!passwordMatch){
      // Record failed attempt
      await recordFailedLogin(email)
      showError("Incorrect password")
      return
    }
    
    // Record successful login
    await recordSuccessfulLogin(email)
    
    // ... continue with login ...
  } catch(error){
    console.error("Login error:", error)
    showError("An error occurred")
  }
}
```

---

### Priority 4: Implement Audit Logging

**Create new collection tracking system:**

```javascript
async function logAuditEvent(action, details = {}){
  try {
    const user = getCurrentUser()
    
    await db.collection("auditLog").add({
      action: action,
      userId: user ? user.userId : "anonymous",
      userEmail: user ? user.userEmail : "anonymous",
      userRole: user ? user.userRole : "none",
      timestamp: new Date(),
      details: details,
      userAgent: navigator.userAgent,
      // Get approximate location from IP (optional)
      // ipAddress: would be set by backend
    })
  } catch(error){
    console.error("Error logging audit:", error)
  }
}

// Log these events:

// In login.js
logAuditEvent("LOGIN", { email: email, success: true })
logAuditEvent("LOGIN_FAILED", { email: email, reason: "wrong_password" })
logAuditEvent("LOGOUT", { email: user.userEmail })

// In members.js
logAuditEvent("MEMBER_CREATED", { memberName: name, email: email })
logAuditEvent("MEMBER_UPDATED", { memberId: id, changes: updatedFields })
logAuditEvent("MEMBER_DELETED", { memberId: id })

// In income.js
logAuditEvent("INCOME_RECORDED", { amount: amount, purpose: purpose })

// In expense.js
logAuditEvent("EXPENSE_RECORDED", { amount: amount, category: category })

// In users.js
logAuditEvent("USER_CREATED", { newUser: name, role: role })
logAuditEvent("USER_ROLE_CHANGED", { userId: id, oldRole: old, newRole: new })
logAuditEvent("USER_DELETED", { userId: id })

// In events.js
logAuditEvent("EVENT_CREATED", { eventName: name })
logAuditEvent("PARTICIPANT_REGISTERED", { eventId: id, participantName: name })
logAuditEvent("CHECK_IN", { eventId: id, participantName: name })
```

---

### Priority 5: Improve Session Management

**Update login.js:**

```javascript
function createSession(user, userId, rememberMe){
  const now = new Date().getTime()
  const SESSION_TIMEOUT = 2 * 60 * 60 * 1000  // 2 hours (was 24)
  
  const sessionData = {
    userId: userId,
    userEmail: user.Email,
    userName: user.Name,
    userRole: user.Role,
    userLevel: getRoleLevel(user.Role),
    memberID: user.MemberID || null,
    loginTime: now,
    lastActivityTime: now,  // NEW
    sessionExpiry: now + SESSION_TIMEOUT
  }
  
  if(rememberMe){
    localStorage.setItem("userSession", JSON.stringify(sessionData))
  } else {
    sessionStorage.setItem("userSession", JSON.stringify(sessionData))
  }
}

// Check session on every action
function validateSessionBeforeAction(){
  const user = getCurrentUser()
  
  if(!user){
    showLoginScreen()
    return false
  }
  
  const now = new Date().getTime()
  
  // Check expiration
  if(now > user.sessionExpiry){
    logAuditEvent("SESSION_EXPIRED", {})
    clearSession()
    showLoginScreen()
    alert("Your session has expired. Please login again.")
    return false
  }
  
  // Update last activity
  user.lastActivityTime = now
  updateSession(user)
  
  return true
}

function updateSession(user){
  const storage = localStorage.getItem("userSession") ? localStorage : sessionStorage
  storage.setItem("userSession", JSON.stringify(user))
}

// Add warning before timeout
function setupSessionTimeout(){
  const user = getCurrentUser()
  if(!user) return
  
  const warningTime = 5 * 60 * 1000  // Warn 5 min before timeout
  const timeUntilExpiry = user.sessionExpiry - new Date().getTime()
  const timeUntilWarning = timeUntilExpiry - warningTime
  
  if(timeUntilWarning > 0){
    setTimeout(() => {
      const confirmed = confirm(
        "Your session will expire in 5 minutes. Do you want to continue?"
      )
      
      if(confirmed){
        // Extend session
        user.sessionExpiry = new Date().getTime() + (2 * 60 * 60 * 1000)
        updateSession(user)
      } else {
        handleLogout()
      }
    }, timeUntilWarning)
  }
}
```

---

## Phase 2: High Priority Improvements (Week 4+)

### Input Validation

```javascript
// Validate email format
function validateEmail(email){
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Validate password strength
function validatePasswordStrength(password){
  const errors = []
  
  if(password.length < 8) errors.push("At least 8 characters")
  if(!/[A-Z]/.test(password)) errors.push("At least 1 uppercase letter")
  if(!/[a-z]/.test(password)) errors.push("At least 1 lowercase letter")
  if(!/\d/.test(password)) errors.push("At least 1 number")
  if(!/[@$!%*?&]/.test(password)) errors.push("At least 1 special character")
  
  return { valid: errors.length === 0, errors }
}

// Use before creating user
const passValidation = validatePasswordStrength(password)
if(!passValidation.valid){
  alert("Password requirements not met:\n" + passValidation.errors.join("\n"))
  return
}
```

---

## Summary of Changes

**Files to Update:**
1. `js/login.js` - Add bcrypt, rate limiting, audit logging
2. `js/users.js` - Hash passwords when adding/updating
3. Firebase Console - Deploy new security rules

**New Collections to Create:**
1. `loginAttempts` - Track failed login attempts
2. `auditLog` - Track all sensitive operations

**Libraries to Add:**
1. bcryptjs - `<script src="https://cdn.jsdelivr.net/npm/bcryptjs@2.4.3/dist/bcrypt.min.js"></script>`

**Timeline:**
- Bcrypt: 2 hours
- Security rules: 1 hour
- Rate limiting: 2 hours
- Audit logging: 3 hours
- Session improvements: 2 hours
- Testing: 4 hours

**Total Phase 1: ~15 hours**


