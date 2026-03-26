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

// Get members not already linked to a user
const membersSnap = await db.collection("members").orderBy("Name").get()
const usersSnap = await db.collection("users").get()

// Build set of already-linked MemberIDs
const linkedMemberIds = new Set()
usersSnap.forEach(doc => {
  if(doc.data().MemberID) linkedMemberIds.add(doc.data().MemberID)
})

let memberOptions = '<option value="">-- Select Member --</option>'
membersSnap.forEach(doc => {
  const m = doc.data()
  if(!linkedMemberIds.has(doc.id)){
    memberOptions += `<option value="${doc.id}" data-email="${m.Email || ''}" data-name="${m.Name || ''}">${m.Name}${m.Email ? ' — ' + m.Email : ''}</option>`
  }
})

show(`

<h2>Add User</h2>

<p style="background:#e3f2fd; padding:12px; border-radius:4px; font-size:13px; margin-bottom:15px;">
  ℹ️ Users must be existing <strong>Members</strong>. Select a member below — their Name and Email will be pulled automatically.
</p>

<label>Select Member <span style="color:red">*</span></label>
<select id="userMember" onchange="previewMemberInfo()" style="width:100%; padding:8px; margin:6px 0; border:1px solid #ccc; border-radius:4px;">
${memberOptions}
</select>

<div id="memberPreview" style="display:none; background:#f5f5f5; padding:10px; border-radius:4px; margin:8px 0; font-size:13px; color:#444;">
</div>

<br>

<label>Role <span style="color:red">*</span></label>
<select id="userRole" style="width:100%; padding:8px; margin:6px 0; border:1px solid #ccc; border-radius:4px;">
<option value="">-- Select Role --</option>
<option value="Superuser">Superuser (Full Access)</option>
<option value="Admin">Admin (Manage All)</option>
<option value="Treasurer">Treasurer (Finance)</option>
<option value="Secretary">Secretary (Records)</option>
<option value="Joint Secretary">Joint Secretary (Records)</option>
<option value="Joint Treasurer">Joint Treasurer (Finance)</option>
</select>

<br><br>

<label>Status</label>
<select id="userActive" style="width:100%; padding:8px; margin:6px 0; border:1px solid #ccc; border-radius:4px;">
<option value="true">Active</option>
<option value="false">Inactive</option>
</select>

<br><br>

<p style="font-size:12px; color:#666; margin:10px 0;">
  <strong>Note:</strong> Password is managed separately in Firebase Authentication using the member's email address.
</p>

<button onclick="addUser()" style="padding:8px 16px; background:#4caf50; color:white; border:none; border-radius:4px; cursor:pointer; margin-right:5px;">Save User</button>
<button onclick="loadUsers()" style="padding:8px 16px; background:#999; color:white; border:none; border-radius:4px; cursor:pointer;">Cancel</button>

`)

}


/* PREVIEW MEMBER INFO WHEN SELECTED */

function previewMemberInfo(){
  const sel = document.getElementById("userMember")
  const opt = sel.options[sel.selectedIndex]
  const preview = document.getElementById("memberPreview")
  const name = opt.getAttribute("data-name")
  const email = opt.getAttribute("data-email")

  if(sel.value && name){
    preview.style.display = "block"
    preview.innerHTML = `<strong>Name:</strong> ${name}<br><strong>Email:</strong> ${email || '<span style="color:#c00">No email on file — please update the member record first</span>'}`
  } else {
    preview.style.display = "none"
  }
}


/* ADD USER */

async function addUser(){

const memberId = document.getElementById("userMember").value
const role = document.getElementById("userRole").value
const active = document.getElementById("userActive").value === "true"

if(!memberId){
  alert("Please select a member")
  return
}
if(!role){
  alert("Please select a role")
  return
}

// Get name and email from member record
const memberDoc = await db.collection("members").doc(memberId).get()
if(!memberDoc.exists){
  alert("Member not found")
  return
}
const memberData = memberDoc.data()
const name = memberData.Name
const email = memberData.Email || ""

if(!email){
  if(!confirm("This member has no email on file. Continue anyway?\n\nNote: They won't be able to log in until an email is added.")){
    return
  }
}

// Check if member already linked to a user
const existingSnap = await db.collection("users").where("MemberID", "==", memberId).get()
if(!existingSnap.empty){
  alert("This member already has a user account")
  return
}

// Check if email already exists in users
if(email){
  const emailSnap = await db.collection("users").where("Email", "==", email).get()
  if(!emailSnap.empty){
    alert("A user with this email already exists")
    return
  }
}

await db.collection("users").add({
  Name: name,
  Email: email,
  Role: role,
  MemberID: memberId,
  MemberName: name,
  Active: active,
  CreatedDate: new Date()
})

alert("User added successfully!\n\nNEXT STEP: Create a Firebase Authentication account with email: " + (email || "(no email on file)"))
loadUsers()

}


/* EDIT USER */

async function editUser(id){

const doc = await db.collection("users").doc(id).get()
const u = doc.data()

// Get all members for dropdown
const membersSnap = await db.collection("members").orderBy("Name").get()
const usersSnap = await db.collection("users").get()

// Build set of already-linked MemberIDs (exclude current user's member)
const linkedMemberIds = new Set()
usersSnap.forEach(d => {
  if(d.data().MemberID && d.data().MemberID !== u.MemberID) linkedMemberIds.add(d.data().MemberID)
})

let memberOptions = '<option value="">-- Select Member --</option>'
membersSnap.forEach(docM => {
  const m = docM.data()
  if(!linkedMemberIds.has(docM.id)){
    const selected = u.MemberID === docM.id ? "selected" : ""
    memberOptions += `<option value="${docM.id}" data-email="${m.Email || ''}" data-name="${m.Name || ''}" ${selected}>${m.Name}${m.Email ? ' — ' + m.Email : ''}</option>`
  }
})

show(`

<h2>Edit User</h2>

<p style="background:#e3f2fd; padding:12px; border-radius:4px; font-size:13px; margin-bottom:15px;">
  ℹ️ Name and Email are pulled from the Member record. To change them, update the member directly.
</p>

<label>Select Member <span style="color:red">*</span></label>
<select id="userMember" onchange="previewMemberInfo()" style="width:100%; padding:8px; margin:6px 0; border:1px solid #ccc; border-radius:4px;">
${memberOptions}
</select>

<div id="memberPreview" style="background:#f5f5f5; padding:10px; border-radius:4px; margin:8px 0; font-size:13px; color:#444;">
  <strong>Name:</strong> ${u.Name || ""}<br><strong>Email:</strong> ${u.Email || "(none)"}
</div>

<br>

<label>Role <span style="color:red">*</span></label>
<select id="userRole" style="width:100%; padding:8px; margin:6px 0; border:1px solid #ccc; border-radius:4px;">
<option value="Superuser" ${u.Role === "Superuser" ? "selected" : ""}>Superuser (Full Access)</option>
<option value="Admin" ${u.Role === "Admin" ? "selected" : ""}>Admin (Manage All)</option>
<option value="Treasurer" ${u.Role === "Treasurer" ? "selected" : ""}>Treasurer (Finance)</option>
<option value="Secretary" ${u.Role === "Secretary" ? "selected" : ""}>Secretary (Records)</option>
<option value="Joint Secretary" ${u.Role === "Joint Secretary" ? "selected" : ""}>Joint Secretary (Records)</option>
<option value="Joint Treasurer" ${u.Role === "Joint Treasurer" ? "selected" : ""}>Joint Treasurer (Finance)</option>
</select>

<br><br>

<label>Status</label>
<select id="userActive" style="width:100%; padding:8px; margin:6px 0; border:1px solid #ccc; border-radius:4px;">
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

const memberId = document.getElementById("userMember").value
const role = document.getElementById("userRole").value
const active = document.getElementById("userActive").value === "true"

if(!memberId){
  alert("Please select a member")
  return
}
if(!role){
  alert("Please select a role")
  return
}

// Get name and email from member record
const memberDoc = await db.collection("members").doc(memberId).get()
if(!memberDoc.exists){
  alert("Member not found")
  return
}
const memberData = memberDoc.data()
const name = memberData.Name
const email = memberData.Email || ""

// Check if another user already uses this member (excluding current)
const existingSnap = await db.collection("users").where("MemberID", "==", memberId).get()
const conflict = existingSnap.docs.find(d => d.id !== id)
if(conflict){
  alert("This member is already linked to another user account")
  return
}

await db.collection("users").doc(id).update({
  Name: name,
  Email: email,
  Role: role,
  MemberID: memberId,
  MemberName: name,
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
