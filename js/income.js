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
<option value="PayPal">PayPal</option>
<option value="Stripe">Stripe</option>
</select>

<br><br>

<label>Payment Type</label>
<select id="type" onchange="toggleCheck()">
<option value="Cash">Cash</option>
<option value="Check">Check</option>
<option value="PayPal">PayPal</option>
<option value="Stripe">Stripe</option>
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

<label>Memo</label>
<textarea id="memo" placeholder="Enter memo or notes" style="width:100%; padding:8px; margin:6px 0; border:1px solid #ccc; border-radius:4px; font-family:Arial;" rows="3"></textarea>

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

/* Get last check number for a member */
async function getLastCheckNumber(memberId){
  if(memberId === "GUEST") return null

  const snap = await db.collection("income")
    .where("MemberID", "==", memberId)
    .where("Type", "==", "Check")
    .orderBy("CheckNumber", "desc")
    .limit(1)
    .get()

  if(snap.empty) return null

  const lastCheck = snap.docs[0].data().CheckNumber
  return lastCheck ? parseInt(lastCheck) : null
}

/* Validate check number sequence */
async function validateCheckNumber(memberId, currentCheckNumber){
  const lastCheckNumber = await getLastCheckNumber(memberId)

  if(!lastCheckNumber) return { valid: true, lastNumber: null }

  const currentNum = parseInt(currentCheckNumber)
  const expectedNum = lastCheckNumber + 1

  return {
    valid: currentNum === expectedNum,
    lastNumber: lastCheckNumber,
    expectedNumber: expectedNum,
    currentNumber: currentNum
  }
}

/* Show check number confirmation dialog */
function showCheckNumberConfirmation(validation, callback){
  const { valid, lastNumber, expectedNumber, currentNumber } = validation

  if(valid){
    // Check number is sequential, proceed with save
    callback(true)
    return
  }

  // Show warning for non-sequential check number
  const message = `⚠️ Check Number Mismatch!\n\nLast Check: #${lastNumber}\nExpected: #${expectedNumber}\nEntered: #${currentNumber}\n\nDo you want to double-check and proceed anyway?`

  if(confirm(message)){
    callback(true)
  } else {
    callback(false)
  }
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

const memo =
document.getElementById("memo").value

/* Validate check number if payment type is Check */
if(paymentType === "Check" && checkNumber){
  const validation = await validateCheckNumber(memberId, checkNumber)

  // Show confirmation dialog if check number is not sequential
  if(!validation.valid){
    return showCheckNumberConfirmation(validation, async function(proceed){
      if(proceed){
        await saveIncomeToDatabase(memberId, memberName, purpose, paymentType, checkNumber, amount, collectionDate, memo)
      }
    })
  }
}

// If check is valid or not a check payment, save directly
await saveIncomeToDatabase(memberId, memberName, purpose, paymentType, checkNumber, amount, collectionDate, memo)

}

/* Save income to database */
async function saveIncomeToDatabase(memberId, memberName, purpose, paymentType, checkNumber, amount, collectionDate, memo){

/* Generate IncomeID */
const incomeRef = db.collection("income").doc()
const incomeID = incomeRef.id

await incomeRef.set({
  IncomeID: incomeID,
  MemberID: memberId,
  MemberName: memberName,
  Purpose: purpose,
  Type: paymentType,
  CheckNumber: paymentType==="Check" ? checkNumber : "",
  Amount: amount,
  CollectionDate: collectionDate,
  Memo: memo,
  CreateDate: firebase.firestore.FieldValue.serverTimestamp()
})

/* Update member contribution */
if(memberId !== "GUEST"){
  const memberDoc = await db.collection("members").doc(memberId).get()
  const total = memberDoc.data().TotalContribution || 0

  await db.collection("members").doc(memberId).update({
    TotalContribution: total + amount
  })
}

alert("Collection Saved Successfully! 🎉")
// Refresh the page to ensure all data is synced
setTimeout(() => {
  location.reload()
}, 500)
}