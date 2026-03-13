async function loadIncome(){

const members = await memberDropdown()

show(`
<h3>Collection Entry</h3>

Type
<select id="type">
<option>Cash</option>
<option>Check</option>
</select>

Member
${members}

Purpose
<input id="purpose">

Amount
<input id="amount">

Check Number
<input id="check">

<button onclick="addIncome()">Save</button>
`)

}


async function addIncome(){

const memberId = document.getElementById("memberSelect").value
const amount = Number(document.getElementById("amount").value)

const memberDoc = await db.collection("members").doc(memberId).get()

const memberName = memberDoc.data().Name

await db.collection("income").add({

MemberID:memberId,
MemberName:memberName,
Type:document.getElementById("type").value,
Purpose:document.getElementById("purpose").value,
CheckNumber:document.getElementById("check").value,
Amount:amount,
CollectionDate:new Date()

})

const total = memberDoc.data().TotalContribution || 0

await db.collection("members").doc(memberId).update({

TotalContribution: total + amount

})

alert("Collection saved")

}