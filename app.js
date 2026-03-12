console.log("app loaded")

// DASHBOARD
async function dashboard(){

const incomeSnap = await db.collection("income").get()
const expenseSnap = await db.collection("expense").get()

let incomeTotal = 0
let expenseTotal = 0

incomeSnap.forEach(doc=>{
incomeTotal += doc.data().Amount
})

expenseSnap.forEach(doc=>{
expenseTotal += doc.data().Amount
})

document.getElementById("content").innerHTML = `
<h3>Finance Dashboard</h3>

<canvas id="chart"></canvas>
`

const ctx = document.getElementById("chart")

new Chart(ctx,{
type:'bar',
data:{
labels:['Income','Expense'],
datasets:[{
label:'Finance',
data:[incomeTotal,expenseTotal],
backgroundColor:['green','red']
}]
}
})
}



// MEMBERS
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

document.getElementById("content").innerHTML = html
}



async function addMember(){

const ref = db.collection("members").doc()

await ref.set({

MemberID:ref.id,
Name:document.getElementById("name").value,
Phone:document.getElementById("phone").value,
Email:document.getElementById("email").value,
TotalContribution:0

})

loadMembers()

}