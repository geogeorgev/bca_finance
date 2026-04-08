/* ===== EVENT MANAGEMENT MODULE ===== */

/* Helper function to get local date string without UTC conversion */
function getLocalDateString(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/* LOAD EVENTS SCREEN */
async function loadEvents(){

const snap = await db.collection("events").orderBy("startDate", "desc").get()

let eventsList = ""

snap.forEach(doc => {
  const e = doc.data()
  const startDate = new Date(e.startDate).toLocaleDateString()
  const endDate = new Date(e.endDate).toLocaleDateString()

  eventsList += `
  <div style="background: white; padding: 15px; margin: 10px 0; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <h3 style="margin: 0 0 10px 0;">${e.name}</h3>
    <p style="margin: 5px 0;"><strong>Type:</strong> ${e.type}</p>
    <p style="margin: 5px 0;"><strong>Dates:</strong> ${startDate} to ${endDate}</p>
    <p style="margin: 5px 0;"><strong>Location:</strong> ${e.location}</p>
    <p style="margin: 5px 0;"><strong>Fee:</strong> $${e.fee}</p>
    <div style="margin-top: 10px;">
      <button onclick="viewEventDetails('${doc.id}')" style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">View Participants</button>
      <button onclick="showRegisterParticipant('${doc.id}')" style="padding: 6px 12px; background: #38ef7d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Register</button>
      <button onclick="showCheckIn('${doc.id}')" style="padding: 6px 12px; background: #ff6a00; color: white; border: none; border-radius: 4px; cursor: pointer;">Check-In</button>
    </div>
  </div>
  `
})

show(`

<h2>Event Management</h2>

<button onclick="showAddEvent()" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">➕ Create Event</button>

<br><br>

<h3>Events List</h3>

${eventsList.length > 0 ? eventsList : '<p>No events created yet.</p>'}

`)

}

/* SHOW ADD EVENT SCREEN */
function showAddEvent(){

show(`

<h2>Create New Event</h2>

<label>Event Name:</label>
<input id="eventName" placeholder="e.g., Family Camp 2026" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<label>Event Type:</label>
<select id="eventType" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">
  <option value="camp">Camp</option>
  <option value="retreat">Retreat</option>
  <option value="vbs">VBS (Vacation Bible School)</option>
  <option value="conference">Conference</option>
  <option value="other">Other</option>
</select>

<br><br>

<label>Location:</label>
<input id="eventLocation" placeholder="e.g., Camp XYZ" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<label>Start Date:</label>
<input type="date" id="eventStartDate" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<label>End Date:</label>
<input type="date" id="eventEndDate" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<label>Event Fee ($):</label>
<input type="number" id="eventFee" placeholder="0" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<button onclick="addEvent()" style="padding: 8px 16px; background: #38ef7d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Create Event</button>
<button onclick="loadEvents()" style="padding: 8px 16px; background: #999; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>

`)

}

/* ADD EVENT */
async function addEvent(){

const name = document.getElementById("eventName").value
const type = document.getElementById("eventType").value
const location = document.getElementById("eventLocation").value
const startDate = document.getElementById("eventStartDate").value
const endDate = document.getElementById("eventEndDate").value
const fee = Number(document.getElementById("eventFee").value) || 0

if(!name || !startDate || !endDate || !location){
  alert("Please fill in all required fields")
  return
}

if(new Date(startDate) > new Date(endDate)){
  alert("Start date must be before end date")
  return
}

await db.collection("events").add({
  name: name,
  type: type,
  location: location,
  startDate: startDate,
  endDate: endDate,
  fee: fee,
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
})

alert("Event created successfully!")
loadEvents()

}

/* VIEW EVENT DETAILS / PARTICIPANTS LIST */
async function viewEventDetails(eventId){

const eventDoc = await db.collection("events").doc(eventId).get()
const event = eventDoc.data()

const regSnap = await db.collection("eventRegistrations")
  .where("eventId", "==", eventId)
  .get()

let participantsList = ""
let checkedInCount = 0
let totalContribution = 0
let totalBalance = 0

regSnap.forEach(doc => {
  const p = doc.data()
  if(p.checkedIn) checkedInCount++

  const contribution = p.contribution || 0
  const calculatedBalance = event.fee - contribution

  totalContribution += contribution
  totalBalance += calculatedBalance

  const checkedInBadge = p.checkedIn ? '✅' : '❌'
  const badgePrintedBadge = p.badgePrinted ? '🖨️' : '❌'

  // Get audit info
  const auditType = p.auditType || "N/A"
  const auditEditedBy = p.auditEditedBy || "N/A"
  const auditEditedAt = p.auditEditedAt || "Never"

  participantsList += `
  <tr>
    <td style="padding: 8px;">${p.name}</td>
    <td style="padding: 8px;">${p.phone}</td>
    <td style="padding: 8px;">${p.guardian}</td>
    <td style="padding: 8px; text-align: center;">${checkedInBadge}</td>
    <td style="padding: 8px; text-align: center;">${badgePrintedBadge}</td>
    <td style="padding: 8px; text-align: right;">$${contribution.toFixed(2)}</td>
    <td style="padding: 8px; text-align: right;">$${calculatedBalance.toFixed(2)}</td>
    <td style="padding: 8px; text-align: center;">${p.foodCoupons || 0}</td>
    <td style="padding: 8px; font-size: 10px;">
      <strong style="color: #667eea;">${auditType}</strong>
    </td>
    <td style="padding: 8px; font-size: 10px;">
      <strong>${auditEditedBy}</strong>
    </td>
    <td style="padding: 8px; font-size: 10px;">
      ${auditEditedAt}
    </td>
    <td style="padding: 8px;">
      <button onclick="editParticipant('${eventId}', '${doc.id}')" style="padding: 4px 8px; background: #667eea; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">Edit</button>
    </td>
  </tr>
  `
})

const checkedInPercentage = regSnap.size > 0 ? Math.round((checkedInCount / regSnap.size) * 100) : 0

show(`

<h2>${event.name} - Event Dashboard</h2>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">

  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
    <p style="margin: 0; font-size: 12px; opacity: 0.9; text-transform: uppercase;">Total Registrations</p>
    <h3 style="margin: 10px 0 0 0; font-size: 32px;">${regSnap.size}</h3>
    <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">participants</p>
  </div>

  <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
    <p style="margin: 0; font-size: 12px; opacity: 0.9; text-transform: uppercase;">Checked In</p>
    <h3 style="margin: 10px 0 0 0; font-size: 32px;">${checkedInCount}/${regSnap.size}</h3>
    <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">${checkedInPercentage}% complete</p>
  </div>

  <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
    <p style="margin: 0; font-size: 12px; opacity: 0.9; text-transform: uppercase;">Total Collected</p>
    <h3 style="margin: 10px 0 0 0; font-size: 32px;">$${totalContribution.toFixed(2)}</h3>
    <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">received</p>
  </div>

  <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
    <p style="margin: 0; font-size: 12px; opacity: 0.9; text-transform: uppercase;">Pending Balance</p>
    <h3 style="margin: 10px 0 0 0; font-size: 32px;">$${totalBalance.toFixed(2)}</h3>
    <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">outstanding</p>
  </div>

</div>

<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
  <h3 style="margin-top: 0;">Event Information</h3>
  <p><strong>Dates:</strong> ${new Date(event.startDate).toLocaleDateString()} to ${new Date(event.endDate).toLocaleDateString()}</p>
  <p><strong>Location:</strong> ${event.location}</p>
  <p><strong>Event Fee per Participant:</strong> $${event.fee}</p>
  <p><strong>Expected Revenue:</strong> $${(regSnap.size * event.fee).toFixed(2)}</p>
</div>

<h3>Participants List</h3>

<div style="margin-bottom: 15px;">
  <button onclick="printParticipantsList('${eventId}', '${event.name}')" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">🖨️ Print Participants List</button>
</div>

<table border="1" width="100%" style="border-collapse: collapse;">
<thead style="background-color: #667eea; color: white;">
<tr>
  <th style="padding: 10px;">Name</th>
  <th style="padding: 10px;">Phone</th>
  <th style="padding: 10px;">Guardian</th>
  <th style="padding: 10px;">Checked In</th>
  <th style="padding: 10px;">Badge Printed</th>
  <th style="padding: 10px;">Contribution</th>
  <th style="padding: 10px;">Balance</th>
  <th style="padding: 10px;">Food Coupons</th>
  <th style="padding: 10px;">Audit Type</th>
  <th style="padding: 10px;">Edited By</th>
  <th style="padding: 10px;">Edited At</th>
  <th style="padding: 10px;">Action</th>
</tr>
</thead>
<tbody>
${participantsList.length > 0 ? participantsList : '<tr><td colspan="9" style="text-align: center; padding: 20px;">No participants registered yet</td></tr>'}
</tbody>
</table>

<br><br>

<button onclick="loadEvents()" style="padding: 8px 16px; background: #999; color: white; border: none; border-radius: 4px; cursor: pointer;">Back to Events</button>


`)

}

/* SHOW REGISTER PARTICIPANT SCREEN */
async function showRegisterParticipant(eventId){

// Get members data to populate dropdown
const membersSnap = await db.collection("members").get()
let memberOptions = '<option value="">-- Select Member --</option>'

membersSnap.forEach(doc => {
  const member = doc.data()
  memberOptions += `<option value="${doc.id}">${member.Name}</option>`
})

show(`

<h2>Register Participant</h2>

<label>Participant Name:</label>
<input id="partName" placeholder="Full name" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<label>Guardian Type:</label>
<select id="guardianType" onchange="toggleGuardianFieldAndLoadData()" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">
  <option value="member">Member</option>
  <option value="nonmember">Non-Member</option>
</select>

<br><br>

<div id="memberGuardianDiv">
<label>Guardian (Member):</label>
<select id="memberSelect" onchange="loadMemberAddressPhone()" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">
  ${memberOptions}
</select>
<p style="font-size: 12px; color: #666; margin: 5px 0;">Select guardian from member list - address and phone will auto-load</p>
</div>

<div id="nonMemberGuardianDiv" style="display:none;">
<label>Guardian Name (Non-Member):</label>
<input id="partGuardianNonMember" placeholder="Parent/Guardian name" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">
</div>

<br><br>

<label>Address:</label>
<input id="partAddress" placeholder="Street address" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<label>Phone Number:</label>
<input id="partPhone" placeholder="Phone number" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<label>Emergency Contact:</label>
<input id="partEmergency" placeholder="Emergency contact number" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<label>Contribution Amount ($):</label>
<input type="number" id="partContribution" placeholder="0" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<label>Payment Method:</label>
<select id="paymentMethod" onchange="toggleCheckNumberField()" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">
  <option value="cash">Cash</option>
  <option value="check">Check</option>
</select>

<br><br>

<div id="checkNumberDiv" style="display:none;">
<label>Check Number:</label>
<input id="checkNumber" placeholder="Check number" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">
<br><br>
</div>

<input type="checkbox" id="recordAsIncome" checked>
<label style="display: inline;">Record Contribution as Income Entry</label>

<br><br>

<label>Food Coupons:</label>
<input type="number" id="partFoodCoupons" placeholder="0" value="3" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<button onclick="registerParticipant('${eventId}')" style="padding: 8px 16px; background: #38ef7d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Register Participant</button>
<button onclick="loadEvents()" style="padding: 8px 16px; background: #999; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>

`)

}

/* REGISTER PARTICIPANT */
async function registerParticipant(eventId){

const name = document.getElementById("partName").value
const address = document.getElementById("partAddress").value
const phone = document.getElementById("partPhone").value
const guardianType = document.getElementById("guardianType").value
let guardianName = ""
let guardianMemberId = null
let guardianMemberName = ""

if(guardianType === "member"){
  const memberSelect = document.getElementById("memberSelect")
  const selectedOption = memberSelect.options[memberSelect.selectedIndex]
  guardianMemberId = memberSelect.value
  guardianMemberName = selectedOption.text
  guardianName = guardianMemberName
} else {
  guardianName = document.getElementById("partGuardianNonMember").value
}

const emergency = document.getElementById("partEmergency").value
const contribution = Number(document.getElementById("partContribution").value) || 0
const paymentMethod = document.getElementById("paymentMethod").value
const checkNumber = document.getElementById("checkNumber").value || ""
const foodCoupons = Number(document.getElementById("partFoodCoupons").value) || 0
const recordAsIncome = document.getElementById("recordAsIncome").checked

if(!name || !phone || !guardianName){
  alert("Please fill in required fields (Name, Phone, Guardian)")
  return
}

const balance = contribution > 0 ? 0 : 0

// Register participant in events collection
const regDoc = await db.collection("eventRegistrations").add({
  eventId: eventId,
  name: name,
  address: address,
  phone: phone,
  guardian: guardianName,
  guardianType: guardianType,
  guardianMemberId: guardianType === "member" ? guardianMemberId : null,
  guardianMemberName: guardianType === "member" ? guardianMemberName : null,
  emergencyContact: emergency,
  checkedIn: false,
  contribution: contribution,
  paymentMethod: paymentMethod,
  checkNumber: paymentMethod === "check" ? checkNumber : null,
  balance: balance,
  badgePrinted: false,
  foodCoupons: foodCoupons,
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
})

// If guardian is a member, update member's contribution record
if(guardianType === "member" && guardianMemberId && contribution > 0){
  try {
    const memberDoc = await db.collection("members").doc(guardianMemberId).get()
    if(memberDoc.exists){
      const currentContribution = memberDoc.data().TotalContribution || 0
      await db.collection("members").doc(guardianMemberId).update({
        TotalContribution: currentContribution + contribution
      })
    }
  } catch(error){
    console.error("Error updating member contribution:", error)
  }
}

// If checkbox is checked and contribution > 0, record as income
if(recordAsIncome && contribution > 0){
  await recordParticipantContributionAsIncome(eventId, guardianName, contribution, paymentMethod, checkNumber, guardianMemberId)
}

alert("Participant registered successfully!" + (recordAsIncome && contribution > 0 ? "\nContribution recorded as income." : ""))
viewEventDetails(eventId)

}

/* TOGGLE CHECK NUMBER FIELD */

function toggleCheckNumberField(){
  const paymentMethod = document.getElementById("paymentMethod").value

  if(paymentMethod === "check"){
    document.getElementById("checkNumberDiv").style.display = "block"
  } else {
    document.getElementById("checkNumberDiv").style.display = "none"
    document.getElementById("checkNumber").value = ""
  }
}

/* TOGGLE GUARDIAN FIELD AND LOAD DATA */

function toggleGuardianFieldAndLoadData(){
  const guardianType = document.getElementById("guardianType").value

  if(guardianType === "member"){
    document.getElementById("memberGuardianDiv").style.display = "block"
    document.getElementById("nonMemberGuardianDiv").style.display = "none"
  } else {
    document.getElementById("memberGuardianDiv").style.display = "none"
    document.getElementById("nonMemberGuardianDiv").style.display = "block"
    // Clear address and phone when switching to non-member
    document.getElementById("partAddress").value = ""
    document.getElementById("partPhone").value = ""
  }
}

/* LOAD MEMBER ADDRESS AND PHONE */

async function loadMemberAddressPhone(){
  const memberSelect = document.getElementById("memberSelect")
  const memberId = memberSelect.value

  if(!memberId){
    document.getElementById("partAddress").value = ""
    document.getElementById("partPhone").value = ""
    return
  }

  try {
    const memberDoc = await db.collection("members").doc(memberId).get()
    if(memberDoc.exists){
      const memberData = memberDoc.data()

      // Concatenate Address1, Address2, Address3
      const address1 = memberData.Address1 || ""
      const address2 = memberData.Address2 || ""
      const address3 = memberData.Address3 || ""

      // Build concatenated address
      let concatenatedAddress = ""
      if(address1) concatenatedAddress += address1
      if(address2) concatenatedAddress += (concatenatedAddress ? ", " : "") + address2
      if(address3) concatenatedAddress += (concatenatedAddress ? ", " : "") + address3

      document.getElementById("partAddress").value = concatenatedAddress
      document.getElementById("partPhone").value = memberData.Phone || ""
    }
  } catch(error){
    console.error("Error loading member data:", error)
  }
}

/* SHOW CHECK-IN SCREEN */
async function showCheckIn(eventId){

const eventDoc = await db.collection("events").doc(eventId).get()
const event = eventDoc.data()

const regSnap = await db.collection("eventRegistrations")
  .where("eventId", "==", eventId)
  .get()

let checkInList = ""

regSnap.forEach(doc => {
  const p = doc.data()
  const checkedInClass = p.checkedIn ? 'background-color: #c8e6c9;' : ''
  const badgePrintedClass = p.badgePrinted ? 'background-color: #fff9c4;' : ''

  checkInList += `
  <div style="background: white; padding: 12px; margin: 8px 0; border-radius: 5px; border-left: 4px solid ${p.checkedIn ? '#4caf50' : '#ccc'}; ${checkedInClass}">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h4 style="margin: 0;">${p.name}</h4>
        <p style="margin: 5px 0; font-size: 12px;">Guardian: ${p.guardian} | Phone: ${p.phone}</p>
      </div>
      <div style="text-align: right;">
        <button onclick="toggleCheckIn('${eventId}', '${doc.id}', ${!p.checkedIn})" style="padding: 6px 12px; background: ${p.checkedIn ? '#ff5252' : '#4caf50'}; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">
          ${p.checkedIn ? '❌ Check Out' : '✅ Check In'}
        </button>
        <button onclick="printBadge('${eventId}', '${doc.id}', '${p.name}')" style="padding: 6px 12px; background: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">🖨️ Print Badge</button>
        <button onclick="editParticipant('${eventId}', '${doc.id}')" style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">✏️ Edit</button>
      </div>
    </div>
  </div>
  `
})

show(`

<h2>${event.name} - Check-In</h2>

<div style="margin-bottom: 20px; padding: 10px; background: #e3f2fd; border-radius: 5px;">
  <input type="text" id="searchParticipant" placeholder="Search participant by name..." onkeyup="filterCheckInList()"
    style="width: 100%; padding: 10px; border: 1px solid #2196f3; border-radius: 4px; font-size: 14px;">
</div>

<div id="checkInListContainer">
${checkInList.length > 0 ? checkInList : '<p>No participants registered yet</p>'}
</div>

<br><br>

<button onclick="viewEventDetails('${eventId}')" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">View Details</button>
<button onclick="loadEvents()" style="padding: 8px 16px; background: #999; color: white; border: none; border-radius: 4px; cursor: pointer;">Back to Events</button>

`)

}


/* TOGGLE CHECK-IN STATUS */
async function toggleCheckIn(eventId, registrationId, checkIn){

const regRef = db.collection("eventRegistrations").doc(registrationId)

await regRef.update({
  checkedIn: checkIn
})

showCheckIn(eventId)

}

/* PRINT BADGE */
async function printBadge(eventId, registrationId, participantName){

// Get event name
const eventDoc = await db.collection("events").doc(eventId).get()
const event = eventDoc.data()
const eventName = event.name

const badge = `
<html>
<head>
  <title>Badge - ${participantName}</title>
  <style>
    body {
      margin: 0;
      padding: 10px;
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f0f0f0;
    }

    .badge {
      width: 3.5in;
      height: 2.2in;
      border: 3px solid #667eea;
      border-radius: 8px;
      padding: 15px;
      background: white;
      text-align: center;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
    }

    .badge .event-name {
      font-size: 12px;
      color: #667eea;
      font-weight: bold;
      margin-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge .name {
      font-weight: bold;
      font-size: 28px;
      color: #333;
      margin: 10px 0;
      line-height: 1.2;
    }

    .badge .footer {
      font-size: 11px;
      color: #666;
      border-top: 1px solid #ddd;
      padding-top: 5px;
    }

    @media print {
      body {
        margin: 0;
        padding: 0;
      }
      .badge {
        box-shadow: none;
        border: 2px solid #667eea;
      }
    }
  </style>
</head>
<body>
  <div class="badge">
    <div class="event-name">${eventName}</div>
    <div class="name">${participantName}</div>
    <div class="footer">
      <p>${new Date().toLocaleDateString()}</p>
    </div>
  </div>
</body>
</html>
`

const win = window.open("", "", "width=600,height=400")
win.document.write(badge)
win.focus()
win.print()

// Mark badge as printed
db.collection("eventRegistrations").doc(registrationId).update({
  badgePrinted: true
})

}

/* FILTER CHECK-IN LIST */
function filterCheckInList(){

const searchTerm = document.getElementById("searchParticipant").value.toLowerCase()
const items = document.querySelectorAll("#checkInListContainer > div")

items.forEach(item => {
  const name = item.querySelector("h4").textContent.toLowerCase()
  item.style.display = name.includes(searchTerm) ? "block" : "none"
})

}

/* EDIT PARTICIPANT */
async function editParticipant(eventId, registrationId){

const regDoc = await db.collection("eventRegistrations").doc(registrationId).get()
const p = regDoc.data()

// Get event details to calculate balance
const eventDoc = await db.collection("events").doc(eventId).get()
const event = eventDoc.data()

const contribution = p.contribution || 0
const balance = event.fee - contribution
const hasBalance = balance > 0

// Build audit history display
let auditHistoryHtml = ""
if(p.auditType || p.auditEditedBy || p.auditEditedAt){
  auditHistoryHtml = `
  <div style="background: #f0f4ff; padding: 12px; border-radius: 4px; margin-bottom: 15px; border-left: 4px solid #667eea;">
    <h4 style="margin-top: 0; margin-bottom: 8px;">📋 Last Modification</h4>
    <p style="margin: 3px 0; font-size: 12px;"><strong>Type:</strong> ${p.auditType || 'N/A'}</p>
    <p style="margin: 3px 0; font-size: 12px;"><strong>Edited By:</strong> ${p.auditEditedBy || 'N/A'}</p>
    <p style="margin: 3px 0; font-size: 12px;"><strong>Edited At:</strong> ${p.auditEditedAt || 'N/A'}</p>
  </div>
  `
}

// Build balance payment section if balance exists
let balancePaymentHtml = ""
if(hasBalance){
  balancePaymentHtml = `
  <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin-bottom: 15px; border-left: 4px solid #ffc107;">
    <h3 style="margin-top: 0; color: #856404;">⚠️ Outstanding Balance</h3>
    <p style="margin: 5px 0; font-weight: bold; font-size: 18px;">Balance Due: $${balance.toFixed(2)}</p>
    <p style="margin: 5px 0; color: #666;">Event Fee: $${event.fee.toFixed(2)} | Paid: $${contribution.toFixed(2)}</p>
    <button onclick="showPayBalanceForm('${eventId}', '${registrationId}')" style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">💳 Pay Balance Now</button>
  </div>
  `
}

show(`

<h2>Edit Participant</h2>

${auditHistoryHtml}
${balancePaymentHtml}

<label>Participant Name:</label>
<input id="editPartName" value="${p.name}" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<label>Address:</label>
<input id="editPartAddress" value="${p.address || ''}" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<label>Phone Number:</label>
<input id="editPartPhone" value="${p.phone}" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<label>Guardian Name:</label>
<input id="editPartGuardian" value="${p.guardian}" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<label>Emergency Contact:</label>
<input id="editPartEmergency" value="${p.emergencyContact || ''}" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">


<br><br>

<label>Food Coupons:</label>
<input type="number" id="editPartFoodCoupons" value="${p.foodCoupons || 0}" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<button onclick="updateParticipant('${eventId}', '${registrationId}')" style="padding: 8px 16px; background: #38ef7d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Update</button>
<button onclick="viewEventDetails('${eventId}')" style="padding: 8px 16px; background: #999; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>

`)

}

/* SHOW BALANCE PAYMENT FORM */
async function showPayBalanceForm(eventId, registrationId){

const regDoc = await db.collection("eventRegistrations").doc(registrationId).get()
const p = regDoc.data()

const eventDoc = await db.collection("events").doc(eventId).get()
const event = eventDoc.data()

const balance = event.fee - (p.contribution || 0)

show(`

<h2>Pay Outstanding Balance</h2>

<div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin-bottom: 15px; border-left: 4px solid #2196f3;">
  <h3 style="margin-top: 0;">Payment Details</h3>
  <p style="margin: 5px 0;"><strong>Participant:</strong> ${p.name}</p>
  <p style="margin: 5px 0;"><strong>Event:</strong> ${event.name}</p>
  <p style="margin: 5px 0;"><strong>Event Fee:</strong> $${event.fee.toFixed(2)}</p>
  <p style="margin: 5px 0;"><strong>Already Paid:</strong> $${(p.contribution || 0).toFixed(2)}</p>
  <p style="margin: 5px 0; font-weight: bold; font-size: 16px; color: #d32f2f;"><strong>Balance Due:</strong> $${balance.toFixed(2)}</p>
</div>

<label>Payment Amount ($):</label>
<input type="number" id="balancePaymentAmount" value="${balance.toFixed(2)}" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<label>Payment Method:</label>
<select id="balancePaymentMethod" onchange="toggleBalanceCheckNumberField()" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">
  <option value="cash">Cash</option>
  <option value="check">Check</option>
</select>

<br><br>

<div id="balanceCheckDiv" style="display:none;">
  <label>Check Number:</label>
  <input id="balanceCheckNumber" placeholder="Check number" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">
  <br><br>
</div>

<input type="checkbox" id="recordBalanceAsIncome" checked>
<label style="display: inline;">Record Payment as Income Entry</label>

<br><br>

<label>Payment Notes (Optional):</label>
<textarea id="balancePaymentNotes" placeholder="e.g., Partial payment, Scheduled payment date, etc." style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px; font-family:Arial;" rows="3"></textarea>

<br><br>

<button onclick="processBalancePayment('${eventId}', '${registrationId}')" style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">✅ Process Payment</button>
<button onclick="editParticipant('${eventId}', '${registrationId}')" style="padding: 8px 16px; background: #999; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>

`)

}

/* TOGGLE CHECK NUMBER FIELD FOR BALANCE PAYMENT */
function toggleBalanceCheckNumberField(){
  const method = document.getElementById("balancePaymentMethod").value
  if(method === "check")
    document.getElementById("balanceCheckDiv").style.display = "block"
  else
    document.getElementById("balanceCheckDiv").style.display = "none"
}

/* PROCESS BALANCE PAYMENT */
async function processBalancePayment(eventId, registrationId){

const paymentAmount = Number(document.getElementById("balancePaymentAmount").value)
const paymentMethod = document.getElementById("balancePaymentMethod").value
const checkNumber = document.getElementById("balanceCheckNumber").value || ""
const recordAsIncome = document.getElementById("recordBalanceAsIncome").checked
const paymentNotes = document.getElementById("balancePaymentNotes").value

if(!paymentAmount || paymentAmount <= 0){
  alert("Please enter a valid payment amount")
  return
}

if(paymentMethod === "check" && !checkNumber){
  alert("Please enter check number")
  return
}

// Get participant and event data
const regDoc = await db.collection("eventRegistrations").doc(registrationId).get()
const p = regDoc.data()

const eventDoc = await db.collection("events").doc(eventId).get()
const event = eventDoc.data()

// Get current user for tracking
const user = firebase.auth().currentUser
const currentUserEmail = user ? user.email : "Unknown"
const currentTime = new Date().toLocaleString()

// Update participant with new contribution and audit columns
const newContribution = (p.contribution || 0) + paymentAmount

await db.collection("eventRegistrations").doc(registrationId).update({
  contribution: newContribution,
  auditType: `Balance Payment: $${paymentAmount.toFixed(2)}`,
  auditEditedBy: currentUserEmail,
  auditEditedAt: currentTime
})

// Record payment as income if checkbox is checked
if(recordAsIncome && paymentAmount > 0){
  await recordParticipantContributionAsIncome(
    eventId,
    p.guardian,
    paymentAmount,
    paymentMethod,
    checkNumber,
    p.guardianMemberId || null
  )
}

alert(`✅ Balance payment of $${paymentAmount.toFixed(2)} processed successfully!${recordAsIncome ? '\nPayment recorded as income.' : ''}`)
viewEventDetails(eventId)

}

/* UPDATE PARTICIPANT */
async function updateParticipant(eventId, registrationId){

const name = document.getElementById("editPartName").value
const address = document.getElementById("editPartAddress").value
const phone = document.getElementById("editPartPhone").value
const guardian = document.getElementById("editPartGuardian").value
const emergency = document.getElementById("editPartEmergency").value
const foodCoupons = Number(document.getElementById("editPartFoodCoupons").value) || 0

// Get current user for tracking
const user = firebase.auth().currentUser
const currentUserEmail = user ? user.email : "Unknown"
const currentTime = new Date().toLocaleString()

// Update with audit columns
await db.collection("eventRegistrations").doc(registrationId).update({
  name: name,
  address: address,
  phone: phone,
  guardian: guardian,
  emergencyContact: emergency,
  foodCoupons: foodCoupons,
  auditType: "Information Updated",
  auditEditedBy: currentUserEmail,
  auditEditedAt: currentTime
})

alert("Participant updated successfully!")
viewEventDetails(eventId)

}


/* RECORD PARTICIPANT CONTRIBUTION AS INCOME */

async function recordParticipantContributionAsIncome(eventId, memberName, amount, paymentMethod, checkNumber, guardianMemberId){

try {
  // Get event details
  const eventDoc = await db.collection("events").doc(eventId).get()
  const event = eventDoc.data()

  // Generate IncomeID
  const incomeRef = db.collection("income").doc()
  const incomeID = incomeRef.id

  // Use guardianMemberId if available (member guardian), otherwise use "EVENT" (non-member)
  const memberID = guardianMemberId || "EVENT"

  // Save to income collection as normal collection entry
  await incomeRef.set({
    IncomeID: incomeID,
    MemberID: memberID,
    MemberName: memberName,
    Purpose: event.name,
    Type: paymentMethod === "check" ? "Check" : "Cash",
    CheckNumber: paymentMethod === "check" ? checkNumber : "",
    Amount: amount,
    CollectionDate: getLocalDateString(new Date()),
    Memo: "Event Contribution",
    CreateDate: firebase.firestore.FieldValue.serverTimestamp()
  })

  // Update member contribution if guardianMemberId exists
  if(guardianMemberId){
    const memberDoc = await db.collection("members").doc(guardianMemberId).get()
    const total = memberDoc.data().TotalContribution || 0

    await db.collection("members").doc(guardianMemberId).update({
      TotalContribution: total + amount
    })
  }

} catch(error){
  console.error("Error recording income: ", error)
}

/* PRINT PARTICIPANTS LIST */
async function printParticipantsList(eventId, eventName){

  try {
    const eventDoc = await db.collection("events").doc(eventId).get()
    const event = eventDoc.data()

    const regSnap = await db.collection("eventRegistrations")
      .where("eventId", "==", eventId)
      .get()

    let totalContribution = 0
    let totalBalance = 0
    let participantsData = []

    regSnap.forEach(doc => {
      const p = doc.data()
      const contribution = p.contribution || 0
      const calculatedBalance = event.fee - contribution

      totalContribution += contribution
      totalBalance += calculatedBalance

      participantsData.push({
        name: p.name,
        phone: p.phone,
        guardian: p.guardian,
        contribution: contribution,
        balance: calculatedBalance,
        foodCoupons: p.foodCoupons || 0,
        checkedIn: p.checkedIn ? 'Yes' : 'No'
      })
    })

    // Sort by name
    participantsData.sort((a, b) => a.name.localeCompare(b.name))

    // Create print window
    const printWindow = window.open('', '', 'width=900,height=600')

    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${eventName} - Participants List</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background: white;
          }
          h1 {
            color: #333;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .event-info {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-size: 14px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th {
            background-color: #667eea;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
            border: 1px solid #555;
          }
          td {
            padding: 10px 12px;
            border: 1px solid #ddd;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          tr:hover {
            background-color: #f0f0f0;
          }
          .total-row {
            background-color: #e8e8e8;
            font-weight: bold;
            font-size: 14px;
          }
          .summary {
            background: #f0f4ff;
            padding: 15px;
            border-radius: 5px;
            border-left: 5px solid #667eea;
            margin-top: 20px;
          }
          .summary p {
            margin: 5px 0;
            font-size: 14px;
          }
          .summary strong {
            color: #667eea;
          }
          @media print {
            body {
              margin: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <h1>📋 ${eventName} - Participants List</h1>

        <div class="event-info">
          <p><strong>Event Dates:</strong> ${new Date(event.startDate).toLocaleDateString()} to ${new Date(event.endDate).toLocaleDateString()}</p>
          <p><strong>Location:</strong> ${event.location}</p>
          <p><strong>Event Fee:</strong> $${event.fee}</p>
          <p><strong>Total Participants:</strong> ${participantsData.length}</p>
          <p><strong>Print Date:</strong> ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 5%;">#</th>
              <th style="width: 20%;">Participant Name</th>
              <th style="width: 15%;">Phone</th>
              <th style="width: 15%;">Guardian</th>
              <th style="width: 12%; text-align: right;">Contribution</th>
              <th style="width: 12%; text-align: right;">Balance</th>
              <th style="width: 10%;">Checked In</th>
              <th style="width: 11%;">Food Coupons</th>
            </tr>
          </thead>
          <tbody>
    `

    // Add participant rows
    participantsData.forEach((p, index) => {
      htmlContent += `
        <tr>
          <td style="text-align: center;">${index + 1}</td>
          <td>${p.name}</td>
          <td>${p.phone}</td>
          <td>${p.guardian}</td>
          <td style="text-align: right;">$${p.contribution.toFixed(2)}</td>
          <td style="text-align: right;">$${p.balance.toFixed(2)}</td>
          <td style="text-align: center;">${p.checkedIn}</td>
          <td style="text-align: center;">${p.foodCoupons}</td>
        </tr>
      `
    })

    // Add total row
    htmlContent += `
        <tr class="total-row">
          <td colspan="4" style="text-align: right;"><strong>TOTALS:</strong></td>
          <td style="text-align: right;"><strong>$${totalContribution.toFixed(2)}</strong></td>
          <td style="text-align: right;"><strong>$${totalBalance.toFixed(2)}</strong></td>
          <td colspan="2"></td>
        </tr>
      </tbody>
    </table>

    <div class="summary">
      <p><strong>Summary:</strong></p>
      <p>Total Participants: <strong>${participantsData.length}</strong></p>
      <p>Total Collected: <strong>$${totalContribution.toFixed(2)}</strong></p>
      <p>Pending Balance: <strong>$${totalBalance.toFixed(2)}</strong></p>
      <p>Expected Revenue: <strong>$${(participantsData.length * event.fee).toFixed(2)}</strong></p>
    </div>

    <div class="no-print" style="margin-top: 30px; text-align: center;">
      <button onclick="window.print()" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; margin-right: 10px;">🖨️ Print</button>
      <button onclick="window.close()" style="padding: 10px 20px; background: #999; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">Close</button>
    </div>
      </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()

  } catch(error) {
    console.error("Error printing participants list:", error)
    alert("Error generating print preview: " + error.message)
  }
}
