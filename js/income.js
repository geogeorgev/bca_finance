async function loadIncome(){

const members = await memberDropdown()

show(`

<h2>Collection Entry</h2>

<label>Member</label>
${members}

<br><br>

<label>Purpose</label>
<select id="purpose">
<option value="Offering-Common">Offering - Common</option>
<option value="Offering-Individual">Offering - Individual</option>
</select>

<br><br>

<label>Type</label>
<select id="type" onchange="toggleCheck()">
<option value="Cash">Cash</option>
<option value="Check">Check</option>
</select>

<br><br>

<div id="checkDiv" style="display:none">

<label>Check Number</label>
<input id="checkNumber" placeholder="Enter check number">

</div>

<br>

<label>Collection Date</label>
<input type="date" id="collectionDate">

<br><br>

<label>Amount</label>
<input id="amount" type="number">

<br><br>

<button onclick="addIncome()">Save Collection</button>

`)

}


/* Show check number field */

function toggleCheck(){

const type = document.getElementById("type").value

if(type === "Check")
document.getElementById("checkDiv").style.display="block"
else
document.getElementById("checkDiv").style.display="none"

}


/* Save collection */

async function addIncome(){

const memberId = document.getElementById("memberSelect").value
const amount = Number(document.getElementById("amount").value)

const purpose = document.getElementById("purpose").value
const type = document.getElementById("type").value
const checkNumber = document.getElementById("checkNumber").value

const collectionDate =
document.getElementById("collectionDate").value

const memberDoc =
await db.collection("members").doc(memberId).get()

const member = memberDoc.data()

await db.collection("income").add({

MemberID: memberId,
MemberName: member.Name,
Purpose: purpose,
Type: type,
CheckNumber: type==="Check" ? checkNumber : "",
Amount: amount,

CollectionDate: new Date(collectionDate),

CreateDate: new Date()

})


/* Update TotalContribution */

const total = member.TotalContribution || 0

await db.collection("members").doc(memberId).update({

TotalContribution: total + amount

})

alert("Collection Saved")

}