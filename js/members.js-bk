async function loadMembers(){

let html = `
<h3>Add Member</h3>

<input id="name" placeholder="Name">
<input id="phone" placeholder="Phone">
<input id="email" placeholder="Email">

<button onclick="addMember()">Add</button>

<h3>Members</h3>
`

const snap = await db.collection("members").get()

snap.forEach(doc=>{

const m = doc.data()

html += `
<div class="card">

${m.MemberID} - ${m.Name}<br>
Phone: ${m.Phone}

</div>
`
})

show(html)

}

async function addMember(){

const ref = db.collection("members").doc()

await ref.set({

MemberID: ref.id,
Name: document.getElementById("name").value,
Phone: document.getElementById("phone").value,
Email: document.getElementById("email").value,
TotalContribution:0

})

loadMembers()

}