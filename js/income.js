async function loadIncome(){

const members = await memberDropdown()

show(`

<h2>Collection Entry</h2>

Member
${members}

Amount
<input id="amount">

<button onclick="addIncome()">Save</button>

<br><br>

<button onclick="sundayCollectionScreen()">Sunday Bulk Entry</button>

`)

}

async function addIncome(){

const id = document.getElementById("memberSelect").value
const amount = Number(document.getElementById("amount").value)

const member = await db.collection("members").doc(id).get()

await db.collection("income").add({

MemberID:id,
MemberName:member.data().Name,
Amount:amount,
CollectionDate:new Date()

})

const total = member.data().TotalContribution || 0

await db.collection("members").doc(id).update({

TotalContribution: total + amount

})

alert("Saved")

}

async function sundayCollectionScreen(){

const snap = await db.collection("members").get()

let html = "<h2>Sunday Collection</h2>"

snap.forEach(doc=>{

const m = doc.data()

html += `
<div class="card">
${m.Name}
<input type="number" id="amt_${doc.id}" value="0">
</div>
`

})

html += `<button onclick="saveSundayCollections()">Save</button>`

show(html)

}

async function saveSundayCollections(){

const snap = await db.collection("members").get()

snap.forEach(async doc=>{

const amt = Number(document.getElementById("amt_"+doc.id).value)

if(amt>0){

const member = doc.data()

await db.collection("income").add({

MemberID:doc.id,
MemberName:member.Name,
Amount:amt,
CollectionDate:new Date()

})

}

})

alert("Collections Saved")

}