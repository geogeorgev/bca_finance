async function loadMembers(){

show(`

<h2>Members</h2>

<button onclick="showAddMember()">Add Member</button>

<br><br>

<input id="searchBox" placeholder="Search member" onkeyup="filterMembers()">

<div id="memberList"></div>

`)

const snap = await db.collection("members").orderBy("Name").get()

let html=""

for(const doc of snap.docs){

const m = doc.data()

// Check if this member has a linked user
const userSnap = await db.collection("users").where("MemberID", "==", doc.id).get()
let linkedUserInfo = "No user linked"
let linkedUserDisplay = '<span style="color: #ccc;">✗ No user linked</span>'

if(!userSnap.empty){
  const linkedUser = userSnap.docs[0].data()
  linkedUserInfo = linkedUser.Email
  linkedUserDisplay = `<span style="color: #4caf50;">✓ ${linkedUser.Email}</span><br><span style="font-size:12px; color:#666;">(${linkedUser.Role})</span>`
}

html+=`
<div class="card memberRow">

<b>${m.Name}</b><br>

Phone: ${m.Phone || ""}<br>

Email: ${m.Email || ""}<br>

Status: ${m.Active ? "Active":"Inactive"}<br>

<br>

<span style="font-size:12px; font-weight:bold;">App User:</span><br>
${linkedUserDisplay}

<br><br>

<button onclick="editMember('${doc.id}')">Edit</button>
<button onclick="linkUserToMember('${doc.id}', '${m.Name}')" style="background:#2196f3;">🔗 Link User</button>

</div>
`

}

document.getElementById("memberList").innerHTML=html

}



/* SEARCH MEMBERS */

function filterMembers(){

const text =
document.getElementById("searchBox").value.toLowerCase()

const rows =
document.getElementsByClassName("memberRow")

for(let r of rows){

if(r.innerText.toLowerCase().includes(text))
r.style.display="block"
else
r.style.display="none"

}

}



/* SHOW ADD MEMBER SCREEN */

function showAddMember(){

show(`

<h2>Add Member</h2>


Name<br>
<input id="name"><br><br>

Phone<br>
<input id="phone"><br><br>

Email<br>
<input id="email"><br><br>

Address1<br>
<input id="addr1"><br><br>

Address2<br>
<input id="addr2"><br><br>

Address3<br>
<input id="addr3"><br><br>

Active
<select id="active">
<option value="true">Active</option>
<option value="false">Inactive</option>
</select>

<br><br>

<button onclick="addMember()">Save</button>

<button onclick="loadMembers()">Cancel</button>

`)

}



/* SAVE MEMBER */

async function addMember(){

await db.collection("members").add({


Name:
document.getElementById("name").value,

Phone:
document.getElementById("phone").value,

Email:
document.getElementById("email").value,

Address1:
document.getElementById("addr1").value,

Address2:
document.getElementById("addr2").value,

Address3:
document.getElementById("addr3").value,

Active:
document.getElementById("active").value === "true",

TotalContribution:0

})

alert("Member added")

loadMembers()

}



/* EDIT MEMBER */

async function editMember(id){

const doc =
await db.collection("members").doc(id).get()

const m = doc.data()

show(`

<h2>Edit Member</h2>


Name<br>
<input id="name" value="${m.Name}"><br><br>

Phone<br>
<input id="phone" value="${m.Phone || ""}"><br><br>

Email<br>
<input id="email" value="${m.Email || ""}"><br><br>

Address1<br>
<input id="addr1" value="${m.Address1 || ""}"><br><br>

Address2<br>
<input id="addr2" value="${m.Address2 || ""}"><br><br>

Address3<br>
<input id="addr3" value="${m.Address3 || ""}"><br><br>

Active
<select id="active">
<option value="true" ${m.Active ? "selected":""}>Active</option>
<option value="false" ${!m.Active ? "selected":""}>Inactive</option>
</select>

<br><br>

<button onclick="updateMember('${id}')">Update</button>

<button onclick="loadMembers()">Cancel</button>

`)

}



/* UPDATE MEMBER */

async function updateMember(id){

await db.collection("members").doc(id).update({

Name:
document.getElementById("name").value,

Phone:
document.getElementById("phone").value,

Email:
document.getElementById("email").value,

Address1:
document.getElementById("addr1").value,

Address2:
document.getElementById("addr2").value,

Address3:
document.getElementById("addr3").value,

Active:
document.getElementById("active").value === "true"

})

alert("Member updated")

loadMembers()

}

/* LINK USER TO MEMBER */

async function linkUserToMember(memberId, memberName){

// Get all users
const usersSnap = await db.collection("users").orderBy("Name").get()

let userOptions = '<option value="">-- Select User to Link --</option>'

for(const userDoc of usersSnap.docs){
  const u = userDoc.data()
  const isAlreadyLinked = u.MemberID === memberId

  userOptions += `<option value="${userDoc.id}" ${isAlreadyLinked ? 'selected' : ''}>${u.Name} (${u.Email}) - ${u.Role}</option>`
}

// Check if member already has a linked user
const linkedUserSnap = await db.collection("users").where("MemberID", "==", memberId).get()
let linkedUserDisplay = ""
if(!linkedUserSnap.empty){
  const linkedUser = linkedUserSnap.docs[0].data()
  linkedUserDisplay = `<p style="color: #4caf50;"><b>Currently Linked to:</b> ${linkedUser.Name} (${linkedUser.Email})</p>`
}

show(`

<h2>Link User to Member: ${memberName}</h2>

${linkedUserDisplay}

<label>Select User</label>
<select id="userToLink" style="width:100%; padding:8px; margin:6px 0;">
${userOptions}
</select>

<br><br>

<p style="font-size:12px; color:#666;">Linking a user to a member allows the member to have an app login with a staff role. You can create a new user first if needed.</p>

<br>

<button onclick="saveUserLink('${memberId}', '${memberName}')" style="padding:8px 16px; background:#4caf50; color:white; border:none; border-radius:4px; cursor:pointer; margin-right:5px;">Link User</button>
<button onclick="unlinkUserFromMember('${memberId}')" style="padding:8px 16px; background:#d32f2f; color:white; border:none; border-radius:4px; cursor:pointer; margin-right:5px;">Unlink User</button>
<button onclick="loadMembers()" style="padding:8px 16px; background:#999; color:white; border:none; border-radius:4px; cursor:pointer;">Cancel</button>

`)

}

/* SAVE USER LINK */

async function saveUserLink(memberId, memberName){

const userToLink = document.getElementById("userToLink").value

if(!userToLink){
  alert("Please select a user to link")
  return
}

// Get the user data
const userDoc = await db.collection("users").doc(userToLink).get()
const userData = userDoc.data()

// Get the member data
const memberDoc = await db.collection("members").doc(memberId).get()
const memberData = memberDoc.data()

// Check if this user is already linked to a different member
if(userData.MemberID && userData.MemberID !== memberId){
  if(!confirm(`This user is already linked to ${userData.MemberName}. Change link to ${memberName}?`)){
    return
  }
}

// Update the user to link to this member
await db.collection("users").doc(userToLink).update({
  MemberID: memberId,
  MemberName: memberData.Name
})

alert(`Successfully linked ${userData.Name} to ${memberName}`)
loadMembers()

}

/* UNLINK USER FROM MEMBER */

async function unlinkUserFromMember(memberId){

const linkedUserSnap = await db.collection("users").where("MemberID", "==", memberId).get()

if(linkedUserSnap.empty){
  alert("No user linked to this member")
  return
}

if(!confirm("Are you sure you want to unlink this user?")){
  return
}

const userDoc = linkedUserSnap.docs[0]
const userData = userDoc.data()

// Update user to remove member link
await db.collection("users").doc(userDoc.id).update({
  MemberID: null,
  MemberName: null
})

alert(`Successfully unlinked ${userData.Name} from this member`)
loadMembers()

}
