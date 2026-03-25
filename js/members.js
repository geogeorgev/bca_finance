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

snap.forEach(doc=>{

const m = doc.data()

html+=`
<div class="card memberRow">

<b>${m.Name}</b><br>


Phone: ${m.Phone || ""}<br>

Email: ${m.Email || ""}<br>

Status: ${m.Active ? "Active":"Inactive"}

<br><br>

<button onclick="editMember('${doc.id}')">Edit</button>

</div>
`

})

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