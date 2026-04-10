/* LOGIN & AUTHENTICATION SYSTEM */

/* LOGIN SCREEN */
function showLoginScreen(){

document.body.innerHTML = `

<div id="loginContainer" style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: Arial, sans-serif;">

  <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); width: 100%; max-width: 400px;">

    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #333; margin: 0 0 5px 0; font-size: 24px;">BCA Administration</h1>
      <p style="color: #666; margin: 0; font-size: 14px;">Church Administration System</p>
    </div>

    <form onsubmit="handleLogin(event)" style="display: flex; flex-direction: column; gap: 15px;">

      <div>
        <label style="display: block; margin-bottom: 5px; color: #333; font-weight: bold;">Email</label>
        <input id="loginEmail" type="email" placeholder="Enter your email" required
          style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 14px;">
      </div>

      <div>
        <label style="display: block; margin-bottom: 5px; color: #333; font-weight: bold;">Password</label>
        <input id="loginPassword" type="password" placeholder="Enter your password" required
          style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 14px;">
      </div>

      <div style="display: flex; align-items: center; gap: 8px;">
        <input id="rememberMe" type="checkbox" style="cursor: pointer;">
        <label for="rememberMe" style="cursor: pointer; color: #666; font-size: 14px;">Remember Me</label>
      </div>

      <div id="loginError" style="display: none; color: #d32f2f; background: #ffebee; padding: 10px; border-radius: 4px; font-size: 13px;"></div>

      <button type="submit" style="padding: 12px; background: #667eea; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: bold; cursor: pointer; transition: background 0.3s;">
        LOGIN
      </button>

      <div style="text-align: center; margin-top: 15px;">
        <a href="#" onclick="showPasswordReset(event)" style="color: #667eea; text-decoration: none; font-size: 14px;">Forgot Password?</a>
      </div>

    </form>

    <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
      © 2026 Boston Christian Assembly
    </div>

  </div>

</div>

`

}

/* HANDLE LOGIN - Uses Firebase Authentication */
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
  // Use Firebase Authentication
  const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password)
  const firebaseUser = userCredential.user

  console.log("Firebase login successful:", firebaseUser.email)

  // Get user role from users collection
  const userSnap = await db.collection("users")
    .where("Email", "==", email)
    .limit(1)
    .get()

  if(userSnap.empty){
    // User authenticated but no role found
    showError("User role not configured")
    return
  }

  const userData = userSnap.docs[0].data()
  const userId = userSnap.docs[0].id

  // Check if active
  if(!userData.Active){
    showError("Account is disabled")
    return
  }

  // Create session with role info
  createSession({
    ...userData,
    firebaseUID: firebaseUser.uid
  }, userId, rememberMe)

  console.log("Login successful:", userData.Name, userData.Role)
  logAuditEvent("LOGIN", { email: email, role: userData.Role })

  // Navigate to dashboard using router
  navigateTo('dashboard')

} catch(error){
  console.error("Login error:", error)

  if(error.code === "auth/user-not-found"){
    showError("Email not found")
  } else if(error.code === "auth/wrong-password"){
    showError("Incorrect password")
  } else if(error.code === "auth/user-disabled"){
    showError("Account disabled")
  } else {
    showError("Login failed: " + error.message)
  }
}

function showError(message){
  errorDiv.textContent = message
  errorDiv.style.display = "block"
}

}

/* CREATE SESSION */
function createSession(user, userId, rememberMe){

const sessionData = {
  userId: userId,
  userEmail: user.Email,
  userName: user.Name,
  userRole: user.Role,
  userLevel: getRoleLevel(user.Role),
  memberID: user.MemberID || null,
  memberName: user.MemberName || null,
  loginTime: new Date().getTime(),
  sessionExpiry: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours
}

// Store session
if(rememberMe){
  localStorage.setItem("userSession", JSON.stringify(sessionData))
} else {
  sessionStorage.setItem("userSession", JSON.stringify(sessionData))
}

}

/* GET CURRENT USER */
function getCurrentUser(){

let session = sessionStorage.getItem("userSession")
if(!session){
  session = localStorage.getItem("userSession")
}

if(!session){
  return null
}

const user = JSON.parse(session)

// Check if session expired
if(new Date().getTime() > user.sessionExpiry){
  clearSession()
  return null
}

return user

}

/* VALIDATE SESSION */
function validateSession(){

const user = getCurrentUser()

if(!user){
  return false
}

return true

}

/* CLEAR SESSION */
function clearSession(){

sessionStorage.removeItem("userSession")
localStorage.removeItem("userSession")

}

/* HANDLE LOGOUT */
async function handleLogout(){

if(!confirm("Are you sure you want to logout?")){
  return
}

const user = getCurrentUser()

if(user){
  logLogoutEvent(user.userEmail)
}

clearSession()

showLoginScreen()

}

/* LOGOUT FUNCTION */
async function logout(){
  try {
    // Clear session storage
    sessionStorage.clear()
    localStorage.removeItem('bcaSession')
    localStorage.removeItem('rememberMe')

    // Sign out from Firebase
    await firebase.auth().signOut()

    // Log audit event
    logAuditEvent("LOGOUT", { email: getCurrentUser()?.userEmail || "unknown" })

    // Navigate to login using router
    navigateTo('login')

    console.log("User logged out successfully")
  } catch(error){
    console.error("Logout error:", error)
    // Force logout even if error
    navigateTo('login')
  }
}

/* GET ROLE LEVEL */
function getRoleLevel(role){

const levels = {
  "Superuser": 10,
  "Admin": 9,
  "Treasurer": 8,
  "Secretary": 7,
  "Joint Secretary": 6,
  "Joint Treasurer": 5
}

return levels[role] || 0

}

/* CHECK ACCESS */
function canAccess(requiredRole){

const user = getCurrentUser()

if(!user){
  return false
}

const userLevel = user.userLevel
const requiredLevel = getRoleLevel(requiredRole)

return userLevel >= requiredLevel

}

/* PROTECT ROUTE */
function protectRoute(requiredRole = null){

const user = getCurrentUser()

if(!user){
  showLoginScreen()
  return false
}

if(requiredRole && !canAccess(requiredRole)){
  alert("You don't have permission to access this feature")
  return false
}

return true

}

/* SHOW PASSWORD RESET */
function showPasswordReset(event){

if(event) event.preventDefault()

document.body.innerHTML = `

<div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: Arial, sans-serif;">

  <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); width: 100%; max-width: 400px;">

    <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px;">Reset Password</h2>

    <form onsubmit="handlePasswordReset(event)" style="display: flex; flex-direction: column; gap: 15px;">

      <div>
        <label style="display: block; margin-bottom: 5px; color: #333; font-weight: bold;">Email</label>
        <input id="resetEmail" type="email" placeholder="Enter your email" required
          style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
      </div>

      <div id="resetMessage"></div>

      <button type="submit" style="padding: 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">
        SEND RESET LINK
      </button>

      <button type="button" onclick="showLoginScreen()" style="padding: 12px; background: #999; color: white; border: none; border-radius: 4px; cursor: pointer;">
        BACK TO LOGIN
      </button>

    </form>

  </div>

</div>

`

}

/* HANDLE PASSWORD RESET */
async function handlePasswordReset(event){

event.preventDefault()

const email = document.getElementById("resetEmail").value.trim().toLowerCase()
const messageDiv = document.getElementById("resetMessage")

try {
  const userSnap = await db.collection("users")
    .where("Email", "==", email)
    .where("current_record", "==", true)
    .get()

  if(userSnap.empty){
    messageDiv.innerHTML = '<div style="color: #d32f2f; background: #ffebee; padding: 10px; border-radius: 4px;">Email not found in system</div>'
    return
  }

  // Use Firebase Authentication to send password reset email
  try {
    await firebase.auth().sendPasswordResetEmail(email)
    messageDiv.innerHTML = '<div style="color: #4caf50; background: #e8f5e9; padding: 10px; border-radius: 4px;">✓ Password reset link sent to your email. Check your inbox and spam folder.</div>'

    setTimeout(() => {
      showLoginScreen()
    }, 4000)
  } catch(authError){
    // Email might not be in Firebase Auth yet
    if(authError.code === "auth/user-not-found"){
      messageDiv.innerHTML = '<div style="color: #ff9800; background: #fff3e0; padding: 10px; border-radius: 4px;">⚠️ Email exists in system but not yet registered for login. Please contact your administrator to set up Firebase Authentication.</div>'
    } else {
      messageDiv.innerHTML = '<div style="color: #d32f2f; background: #ffebee; padding: 10px; border-radius: 4px;">Error sending reset email: ' + authError.message + '</div>'
    }
  }

} catch(error){
  console.error("Reset error:", error)
  messageDiv.innerHTML = '<div style="color: #d32f2f; background: #ffebee; padding: 10px; border-radius: 4px;">An error occurred: ' + error.message + '</div>'
}

}

/* LOG LOGIN ATTEMPT */
function logFailedLogin(email, reason){

console.log(`Failed login: ${email} - ${reason}`)

// In production, log to database
// db.collection("auditLog").add({...})

}

/* LOG SUCCESSFUL LOGIN */
function logSuccessfulLogin(email, role){

console.log(`Successful login: ${email} (${role})`)

}

/* LOG LOGOUT */
function logLogoutEvent(email){

console.log(`Logout: ${email}`)

}

/* LOG AUDIT EVENT */
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
    userAgent: navigator.userAgent
  })

  console.log("Audit logged:", action)
} catch(error){
  console.error("Error logging audit:", error)
  // Don't break login if audit logging fails
}

}

/* CHECK AUTH ON PAGE LOAD */
window.addEventListener("load", function(){

// For initial setup, load dashboard without login
// This allows you to create first user
// After first user created, uncomment the check below

// If on dashboard but not logged in, show login
// if(window.location.hash.includes("dashboard")){
//   if(!validateSession()){
//     showLoginScreen()
//   }
// }

// TEMPORARY: Allow dashboard access for initial setup
loadDashboard()

})

/* SHOW USER INFO */
function showUserInfo(){

const user = getCurrentUser()

if(!user){
  return "Not logged in"
}

return `
<div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; background: #f5f5f5; border-bottom: 1px solid #ddd;">
  <div>
    <span style="font-weight: bold;">${user.userName}</span>
    <span style="color: #666; font-size: 12px;"> (${user.userRole})</span>
  </div>
  <button onclick="handleLogout()" style="padding: 6px 12px; background: #d32f2f; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
    LOGOUT
  </button>
</div>
`

}

/* ROLE-BASED FEATURE VISIBILITY */
function showFeatureIfAuthorized(featureId, requiredRole){

const user = getCurrentUser()

if(!user){
  document.getElementById(featureId).style.display = "none"
  return
}

if(requiredRole && !canAccess(requiredRole)){
  document.getElementById(featureId).style.display = "none"
} else {
  document.getElementById(featureId).style.display = "block"
}

}

/* INIT APP */
function initializeApp(){

const user = getCurrentUser()

if(!user){
  // Check if this is first time setup (no users in system)
  checkIfFirstTimeSetup()
  return
}

// User is logged in, navigate to dashboard using router
navigateTo('dashboard')

}

/* Check if First Time Setup - Allow setup without login */
async function checkIfFirstTimeSetup(){

try {
  const usersSnap = await db.collection("users").limit(1).get()

  if(usersSnap.empty){
    // No users exist - show setup mode
    console.log("First time setup detected - allowing access")
    navigateTo('users') // Go to users setup
  } else {
    // Users exist - show login
    navigateTo('login')
  }
} catch(error){
  console.error("Error checking setup:", error)
  navigateTo('login')
}

}
