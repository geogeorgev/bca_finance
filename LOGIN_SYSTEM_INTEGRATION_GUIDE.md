# Login System Integration Guide

## Overview

This guide shows how to integrate the login system into your BCA Finance application.

---

## Step 1: Update users Collection

Before login works, you must add a Password field to your existing users.

### Add Password to Existing Users

**In Firebase Console:**

1. Go to Firestore Database
2. Open `users` collection
3. For each user document, add field:
   - Field name: `Password`
   - Type: String
   - Value: Temporary password (in production, use bcrypt hash)

**Or via Console Code:**

```javascript
// Add password to all users
const usersSnap = await db.collection("users").get()

usersSnap.forEach(async (doc) => {
  await doc.ref.update({
    Password: "defaultPassword123"  // Temporary, user should reset
  })
})
```

---

## Step 2: Update index.html

### Add login.js script

```html
<!DOCTYPE html>
<html>
<head>
  <title>BCA Finance</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

<!-- Firebase -->
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js"></script>

<!-- Config -->
<script src="js/firebase.js"></script>

<!-- Login System (NEW) -->
<script src="js/login.js"></script>

<!-- Other Scripts -->
<script src="js/utils.js"></script>
<script src="js/dashboard.js"></script>
<script src="js/members.js"></script>
<script src="js/income.js"></script>
<script src="js/expense.js"></script>
<script src="js/budget.js"></script>
<script src="js/reports.js"></script>
<script src="js/events.js"></script>
<script src="js/users.js"></script>

<!-- Initialize App (NEW) -->
<script>
  // On page load, check login and initialize
  window.addEventListener("load", function(){
    initializeApp()
  })
</script>

</body>
</html>
```

---

## Step 3: Protect Routes

### Update Dashboard to Check Login

**In dashboard.js:**

```javascript
async function loadDashboard(){

// Check if user is logged in
if(!protectRoute()){
  return
}

const user = getCurrentUser()

show(`

<div>
  ${showUserInfo()}
  
  <h2>Dashboard</h2>
  
  <p>Welcome, ${user.userName}! (${user.userRole})</p>
  
  <!-- Content based on role -->
  ${getDashboardContent(user.userRole)}
</div>

`)

}

function getDashboardContent(role){

if(role === "Superuser"){
  return getDashboardSuperuser()
} else if(role === "Admin"){
  return getDashboardAdmin()
} else if(role === "Treasurer"){
  return getDashboardTreasurer()
} else if(role === "Secretary"){
  return getDashboardSecretary()
} else {
  return getDashboardLimited()
}

}
```

---

## Step 4: Protect Features

### Update Each Feature Screen

**Example - Members.js:**

```javascript
async function loadMembers(){

// Check if authorized to access members
if(!protectRoute("Secretary")){
  return
}

// Load members...
// ...existing code...

}
```

**Example - Income.js:**

```javascript
async function loadIncome(){

// Check if authorized to access income
if(!protectRoute("Treasurer")){
  return
}

// Load income...
// ...existing code...

}
```

**Example - Expense.js:**

```javascript
async function loadExpense(){

// Check if authorized to access expense
if(!protectRoute("Treasurer")){
  return
}

// Load expense...
// ...existing code...

}
```

---

## Step 5: Update Navigation

### Add Logout Button to Menu

**In utils.js or main app:**

```html
<div class="navbar">
  ${showUserInfo()}  <!-- Shows user info and logout button -->
  
  <button onclick="loadDashboard()">Dashboard</button>
  
  <!-- Conditional buttons based on role -->
  <div id="memberBtn">
    <button onclick="loadMembers()">Members</button>
  </div>
  
  <div id="incomeBtn">
    <button onclick="loadIncome()">Income</button>
  </div>
  
  <div id="expenseBtn">
    <button onclick="loadExpense()">Expense</button>
  </div>
  
  <div id="budgetBtn">
    <button onclick="loadBudget()">Budget</button>
  </div>
  
  <div id="reportsBtn">
    <button onclick="loadReports()">Reports</button>
  </div>
  
  <div id="eventsBtn">
    <button onclick="loadEvents()">Events</button>
  </div>
  
  <div id="usersBtn">
    <button onclick="loadUsers()">Users</button>
  </div>
</div>

<script>
// Show nav buttons based on role
function updateNavigation(){
  const user = getCurrentUser()
  if(!user) return
  
  // Show based on role level
  if(user.userLevel >= 8) document.getElementById("incomeBtn").style.display = "block"
  if(user.userLevel >= 8) document.getElementById("expenseBtn").style.display = "block"
  if(user.userLevel >= 7) document.getElementById("memberBtn").style.display = "block"
  if(user.userLevel >= 7) document.getElementById("eventsBtn").style.display = "block"
  if(user.userLevel >= 9) document.getElementById("reportsBtn").style.display = "block"
  if(user.userLevel >= 10) document.getElementById("usersBtn").style.display = "block"
}
</script>
```

---

## Step 6: Add Password Field to Users

### Update users.js for Adding Users

```javascript
async function addUser(){

// ...existing code...

// Prompt for password
const password = prompt("Set temporary password for new user:")
if(!password){
  alert("Password required")
  return
}

await db.collection("users").add({
  Name: name,
  Email: email,
  Role: role,
  MemberID: memberId || null,
  MemberName: memberName || null,
  Active: active,
  Password: password,  // NEW: Add password
  CreatedDate: new Date()
})

alert("User added successfully. Temporary password: " + password)
loadUsers()

}
```

---

## Testing the Login

### Test Credentials

**Before testing, you MUST add users with passwords:**

1. Go to Firestore Console
2. Open `users` collection
3. Add test users with `Password` field

**Example Test User:**
```
Name: John Doe
Email: john@church.org
Password: TestPass123
Role: Treasurer
Active: true
```

### Test Scenarios

```
✓ Test 1: Valid Login
  Email: john@church.org
  Password: TestPass123
  Expected: Login successful, redirects to dashboard

✓ Test 2: Wrong Password
  Email: john@church.org
  Password: WrongPassword
  Expected: Error "Incorrect password"

✓ Test 3: Non-existent Email
  Email: invalid@church.org
  Password: TestPass123
  Expected: Error "Email not found"

✓ Test 4: Inactive Account
  Email: (inactive user)
  Password: (correct)
  Expected: Error "Account disabled"

✓ Test 5: Remember Me
  Check "Remember Me" when logging in
  Close browser
  Reopen app
  Expected: Still logged in

✓ Test 6: Session Timeout
  Log in
  Wait 24 hours (or test with shorter timeout)
  Expected: Auto logout, redirect to login

✓ Test 7: Logout
  Click Logout
  Confirm
  Expected: Redirected to login screen, session cleared

✓ Test 8: Role-based Access
  Login as Secretary
  Try to access Income
  Expected: "No permission" message
```

---

## Security Checklist

Before Going to Production:

```
□ Implement bcrypt for password hashing
□ Add HTTPS encryption
□ Set Firebase security rules for users collection
□ Implement password complexity requirements
□ Add rate limiting for failed logins
□ Implement email verification
□ Add 2FA (Two-Factor Authentication)
□ Set up password reset via email
□ Implement session timeout warnings
□ Add audit logging for all logins
□ Regular security audits
□ Backup strategy in place
```

---

## Firebase Security Rules

### Update Firestore Rules

```
match /users/{document=**} {
  // Superuser can read all users
  allow read: if request.auth != null && 
              get(/databases/$(database)/documents/users/$(request.auth.uid)).data.Role == "Superuser";
  
  // Users can read their own profile
  allow read: if request.auth != null && 
              resource.data.Email == request.auth.email;
  
  // Only Superuser can write
  allow write: if request.auth != null && 
               get(/databases/$(database)/documents/users/$(request.auth.uid)).data.Role == "Superuser";
}
```

---

## Troubleshooting

### Users Not Showing in Login

**Problem:** Can't log in even with correct credentials
**Solution:**
1. Check if `Password` field exists in user document
2. Check if password matches exactly (case-sensitive)
3. Check if user `Active` is true

### Session Not Persisting

**Problem:** Logged out after page refresh
**Solution:**
1. Check if "Remember Me" is checked
2. Verify localStorage/sessionStorage is enabled
3. Check browser privacy settings

### Role-Based Access Not Working

**Problem:** Users can access features they shouldn't
**Solution:**
1. Add `protectRoute(role)` to feature screens
2. Check role levels are set correctly
3. Verify user role in database

### Password Not Updating

**Problem:** Can't change password
**Solution:**
1. Implement password update function
2. Add confirmation dialog
3. Re-hash password with bcrypt

---

## Next Steps

### Phase 1: Basic Login (Implemented)
- ✅ Email/password login
- ✅ Session management
- ✅ Role-based dashboard
- ✅ Logout functionality

### Phase 2: Security (Recommended)
- [ ] Implement bcrypt hashing
- [ ] Add password strength requirements
- [ ] Implement password reset via email
- [ ] Add account lockout after failed attempts
- [ ] Implement 2FA

### Phase 3: Advanced (Future)
- [ ] OAuth integration (Google, etc.)
- [ ] Audit logging
- [ ] Role-based permissions API
- [ ] Session management dashboard
- [ ] API keys for integrations

---

## Support

For issues or questions:

1. Check browser console (F12) for errors
2. Check Firebase console for data
3. Review design document
4. Test with known credentials

---

## Summary

**Login System Implemented:**

✅ Email/password authentication
✅ Role-based access control
✅ Session management
✅ Feature protection
✅ Logout functionality
✅ User-friendly interface

**Next: Add password hashing (bcrypt) for production security**

