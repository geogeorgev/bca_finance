/* USER MANAGEMENT - Manage app users and roles */

/* LOAD USERS */
async function loadUsers(){

show(`

<h2>Users & Roles</h2>

<button onclick="showAddUser()">Add User</button>

<br><br>

<input id="searchBox" placeholder="Search user" onkeyup="filterUsers()">

<div id="userList"></div>

`)

const snap = await db.collection("users").orderBy("Name").get()

let html=""

snap.forEach(doc=>{

const u = doc.data()

const roleColors = {
  "Superuser": "#d32f2f",
  "Admin": "#f57c00",
  "Treasurer": "#388e3c",
  "Secretary": "#1976d2",
  "Joint Secretary": "#7b1fa2",
  "Joint Treasurer": "#c2185b"
}

const roleColor = roleColors[u.Role] || "#666"

html+=`
<div class="card userRow" style="border-left: 4px solid ${roleColor};">

<b>${u.Name}</b><br>
Email: ${u.Email || ""}<br>
Role: <span style="color: ${roleColor}; font-weight: bold;">${u.Role}</span><br>
Member Linked: ${u.MemberID ? "✓ Yes" : "✗ No"}<br>
Status: ${u.Active ? "Active" : "Inactive"}<br>

<br>

<button onclick="editUser('${doc.id}')">Edit</button>
<button onclick="deleteUser('${doc.id}', '${u.Name}')" style="background: #d32f2f;">Delete</button>

</div>
`

})

if(snap.empty){
  html = "<p>No users found. <a href='#' onclick='showAddUser()'>Add one now</a></p>"
}

document.getElementById("userList").innerHTML=html

}



/* SEARCH USERS */

function filterUsers(){

const text = document.getElementById("searchBox").value.toLowerCase()

const rows = document.getElementsByClassName("userRow")

for(let r of rows){

if(r.innerText.toLowerCase().includes(text))
r.style.display="block"
else
r.style.display="none"

}

}



/* SHOW ADD USER */

async function showAddUser(){

const membersSnap = await db.collection("members").orderBy("Name").get()

let memberOptions = '<option value="">-- Not Linked to Member --</option>'

membersSnap.forEach(doc => {
  const m = doc.data()
  memberOptions += `<option value="${doc.id}">${m.Name}</option>`
})

show(`

<h2>Add User</h2>

<label>Name</label>
<input id="userName" placeholder="User full name" style="width:100%; padding:8px; margin:6px 0;"><br><br>

<label>Email</label>
<input id="userEmail" type="email" placeholder="user@example.com" style="width:100%; padding:8px; margin:6px 0;"><br><br>

<label>Role</label>
<select id="userRole" style="width:100%; padding:8px; margin:6px 0;">
<option value="">-- Select Role --</option>
<option value="Superuser">Superuser (Full Access)</option>
<option value="Admin">Admin (Manage All)</option>
<option value="Treasurer">Treasurer (Finance)</option>
<option value="Secretary">Secretary (Records)</option>
<option value="Joint Secretary">Joint Secretary (Records)</option>
<option value="Joint Treasurer">Joint Treasurer (Finance)</option>
</select>

<br><br>

<label>Link to Member (Optional)</label>
<select id="userMember" style="width:100%; padding:8px; margin:6px 0;">
${memberOptions}
</select>

<br><br>

<label>Status</label>
<select id="userActive" style="width:100%; padding:8px; margin:6px 0;">
<option value="true">Active</option>
<option value="false">Inactive</option>
</select>

<br><br>

<p style="font-size:12px; color:#666; margin:15px 0;">
<strong>Note:</strong> Password is set separately in Firebase Authentication.
Ask admin to create Firebase Auth account with the email address above.
</p>

<br>

<button onclick="addUser()" style="padding:8px 16px; background:#4caf50; color:white; border:none; border-radius:4px; cursor:pointer; margin-right:5px;">Save User (Role Only)</button>
<button onclick="loadUsers()" style="padding:8px 16px; background:#999; color:white; border:none; border-radius:4px; cursor:pointer;">Cancel</button>

`)

}



/* ADD USER */

async function addUser(){

const name = document.getElementById("userName").value
const email = document.getElementById("userEmail").value
const role = document.getElementById("userRole").value
const memberId = document.getElementById("userMember").value
const active = document.getElementById("userActive").value === "true"

if(!name || !email || !role){
  alert("Please fill in Name, Email, and Role")
  return
}

// Check if email already exists
const existingSnap = await db.collection("users").where("Email", "==", email).get()
if(!existingSnap.empty){
  alert("Email already in use")
  return
}

// Get member name if linked
let memberName = ""
if(memberId){
  const memberDoc = await db.collection("members").doc(memberId).get()
  memberName = memberDoc.data().Name
}

// Save user with ROLE ONLY (no password)
await db.collection("users").add({
  Name: name,
  Email: email,
  Role: role,
  MemberID: memberId || null,
  MemberName: memberName || null,
  Active: active,
  CreatedDate: new Date()
})

alert("User added successfully!\n\nNEXT STEP: Ask admin to create Firebase Authentication account with email: " + email)
loadUsers()

}



/* EDIT USER */

async function editUser(id){

const doc = await db.collection("users").doc(id).get()
const u = doc.data()

const membersSnap = await db.collection("members").orderBy("Name").get()

let memberOptions = '<option value="">-- Not Linked to Member --</option>'

membersSnap.forEach(docM => {
  const m = docM.data()
  const selected = u.MemberID === docM.id ? "selected" : ""
  memberOptions += `<option value="${docM.id}" ${selected}>${m.Name}</option>`
})

show(`

<h2>Edit User</h2>

<label>Name</label>
<input id="userName" value="${u.Name}" style="width:100%; padding:8px; margin:6px 0;"><br><br>

<label>Email</label>
<input id="userEmail" type="email" value="${u.Email}" style="width:100%; padding:8px; margin:6px 0;"><br><br>

<label>Role</label>
<select id="userRole" style="width:100%; padding:8px; margin:6px 0;">
<option value="Superuser" ${u.Role === "Superuser" ? "selected" : ""}>Superuser (Full Access)</option>
<option value="Admin" ${u.Role === "Admin" ? "selected" : ""}>Admin (Manage All)</option>
<option value="Treasurer" ${u.Role === "Treasurer" ? "selected" : ""}>Treasurer (Finance)</option>
<option value="Secretary" ${u.Role === "Secretary" ? "selected" : ""}>Secretary (Records)</option>
<option value="Joint Secretary" ${u.Role === "Joint Secretary" ? "selected" : ""}>Joint Secretary (Records)</option>
<option value="Joint Treasurer" ${u.Role === "Joint Treasurer" ? "selected" : ""}>Joint Treasurer (Finance)</option>
</select>

<br><br>

<label>Link to Member (Optional)</label>
<select id="userMember" style="width:100%; padding:8px; margin:6px 0;">
${memberOptions}
</select>

<br><br>

<label>Status</label>
<select id="userActive" style="width:100%; padding:8px; margin:6px 0;">
<option value="true" ${u.Active ? "selected" : ""}>Active</option>
<option value="false" ${!u.Active ? "selected" : ""}>Inactive</option>
</select>

<br><br>

<button onclick="updateUser('${id}')" style="padding:8px 16px; background:#2196f3; color:white; border:none; border-radius:4px; cursor:pointer; margin-right:5px;">Update User</button>
<button onclick="loadUsers()" style="padding:8px 16px; background:#999; color:white; border:none; border-radius:4px; cursor:pointer;">Cancel</button>

`)

}



/* UPDATE USER */

async function updateUser(id){

const name = document.getElementById("userName").value
const email = document.getElementById("userEmail").value
const role = document.getElementById("userRole").value
const memberId = document.getElementById("userMember").value
const active = document.getElementById("userActive").value === "true"

if(!name || !email || !role){
  alert("Please fill in Name, Email, and Role")
  return
}

// Check if email changed and already exists
const userDoc = await db.collection("users").doc(id).get()
if(userDoc.data().Email !== email){
  const existingSnap = await db.collection("users").where("Email", "==", email).get()
  if(!existingSnap.empty){
    alert("Email already in use")
    return
  }
}

// Get member name if linked
let memberName = ""
if(memberId){
  const memberDoc = await db.collection("members").doc(memberId).get()
  memberName = memberDoc.data().Name
}

await db.collection("users").doc(id).update({
  Name: name,
  Email: email,
  Role: role,
  MemberID: memberId || null,
  MemberName: memberName || null,
  Active: active
})

alert("User updated successfully")
loadUsers()

}



/* DELETE USER */

async function deleteUser(id, name){

if(!confirm(`Are you sure you want to delete user: ${name}?`)){
  return
}

await db.collection("users").doc(id).delete()

alert("User deleted")
loadUsers()

}

