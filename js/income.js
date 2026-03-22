async function loadIncome(){


const members = await memberDropdown()

show(`

<h2>Collection Entry</h2>

<label>Contributor Type</label>
<select id="contributorType" onchange="toggleContributor()">
<option value="member">Member</option>
<option value="guest">Guest</option>
</select>

<br><br>

<div id="memberDiv">
<label>Member</label>
${members}
</div>

<div id="guestDiv" style="display:none">
<label>Guest Name</label>
<input id="guestName" placeholder="Guest name">
</div>

<br>

<label>Purpose</label>
<select id="purpose">
<option value="Offering-Common">Offering - Common</option>
<option value="Offering-Individual">Offering - Individual</option>
<option value="Special Donation">Special Donation</option>
</select>

<br><br>

<label>Payment Type</label>
<select id="type" onchange="toggleCheck()">
<option value="Cash">Cash</option>
<option value="Check">Check</option>
</select>

<br><br>

<div id="checkDiv" style="display:none">
<label>Check Number</label>
<input id="checkNumber" placeholder="Check number">
</div>

<br>

<label>Collection Date</label>
<input type="date" id="collectionDate" value="${new Date().toISOString().split('T')[0]}">

<br><br>


<label>Amount</label>
<input type="number" id="amount">

<br><br>

<button onclick="addIncome()">Save Collection</button>

`)
}


/* Toggle guest/member */

function toggleContributor(){

const type = document.getElementById("contributorType").value

if(type==="guest"){

document.getElementById("memberDiv").style.display="none"
document.getElementById("guestDiv").style.display="block"

}else{

document.getElementById("memberDiv").style.display="block"
document.getElementById("guestDiv").style.display="none"

}

}


/* Toggle check field */

function toggleCheck(){

const type = document.getElementById("type").value

if(type==="Check")
document.getElementById("checkDiv").style.display="block"
else
document.getElementById("checkDiv").style.display="none"

}


/* Save income */

async function addIncome(){

const contributorType =
document.getElementById("contributorType").value

let memberId=""
let memberName=""

if(contributorType==="member"){

memberId = document.getElementById("memberSelect").value

const memberDoc =
await db.collection("members").doc(memberId).get()

memberName = memberDoc.data().Name

}else{

memberName =
document.getElementById("guestName").value

memberId = "GUEST"

}

const purpose =
document.getElementById("purpose").value

const paymentType =
document.getElementById("type").value

const checkNumber =
document.getElementById("checkNumber").value

const amount =
Number(document.getElementById("amount").value)

const collectionDate =
document.getElementById("collectionDate").value


/* Generate IncomeID */

const incomeRef = db.collection("income").doc()

const incomeID = incomeRef.id


await incomeRef.set({

IncomeID: incomeID,

MemberID: memberId,

MemberName: memberName,

Purpose: purpose,

Type: paymentType,

CheckNumber:
paymentType==="Check" ? checkNumber : "",

Amount: amount,

//CollectionDate: new Date(collectionDate),
CollectionDate: collectionDate,

//CreateDate: new Date()
CreateDate: firebase.firestore.FieldValue.serverTimestamp()

})


/* Update member contribution */

if(memberId !== "GUEST"){

const memberDoc =
await db.collection("members").doc(memberId).get()

const total =
memberDoc.data().TotalContribution || 0

await db.collection("members").doc(memberId).update({

TotalContribution: total + amount

})

}

alert("Collection Saved")

}