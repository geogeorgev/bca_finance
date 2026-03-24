/* ===== EVENT MANAGEMENT MODULE ===== */

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
  <th style="padding: 10px;">Action</th>
</tr>
</thead>
<tbody>
${participantsList.length > 0 ? participantsList : '<tr><td colspan="9" style="text-align: center; padding: 20px;">No participants registered yet</td></tr>'}
</tbody>
</table>

<br><br>

<button onclick="loadEvents()" style="padding: 8px 16px; background: #999; color: white; border: none; border-radius: 4px; cursor: pointer;">Back to Events</button>

<button onclick="showSyncContributionsToIncome('${eventId}')" style="padding: 8px 16px; background: #ff9800; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">💾 Sync Contributions to Income</button>

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

<label>Address Line 1:</label>
<input id="partAddress1" placeholder="Street address" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<label>Address Line 2:</label>
<input id="partAddress2" placeholder="Apt, suite, etc." style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<label>Address Line 3:</label>
<input id="partAddress3" placeholder="City, State, Zip" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

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
const address1 = document.getElementById("partAddress1").value
const address2 = document.getElementById("partAddress2").value
const address3 = document.getElementById("partAddress3").value
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
  address1: address1,
  address2: address2,
  address3: address3,
  phone: phone,
  guardian: guardianName,
  guardianType: guardianType,
  guardianMemberId: guardianType === "member" ? guardianMemberId : null,
  guardianMemberName: guardianType === "member" ? guardianMemberName : null,
  emergencyContact: emergency,
  checkedIn: false,
  contribution: contribution,
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
  await recordParticipantContributionAsIncome(eventId, name, contribution, guardianType, guardianMemberId, guardianName)
}

alert("Participant registered successfully!" + (recordAsIncome && contribution > 0 ? "\nContribution recorded as income." : ""))
viewEventDetails(eventId)

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
    document.getElementById("partAddress1").value = ""
    document.getElementById("partAddress2").value = ""
    document.getElementById("partAddress3").value = ""
    document.getElementById("partPhone").value = ""
  }
}

/* LOAD MEMBER ADDRESS AND PHONE */

async function loadMemberAddressPhone(){
  const memberSelect = document.getElementById("memberSelect")
  const memberId = memberSelect.value

  if(!memberId){
    document.getElementById("partAddress1").value = ""
    document.getElementById("partAddress2").value = ""
    document.getElementById("partAddress3").value = ""
    document.getElementById("partPhone").value = ""
    return
  }

  try {
    const memberDoc = await db.collection("members").doc(memberId).get()
    if(memberDoc.exists){
      const memberData = memberDoc.data()
      document.getElementById("partAddress1").value = memberData.Address1 || ""
      document.getElementById("partAddress2").value = memberData.Address2 || ""
      document.getElementById("partAddress3").value = memberData.Address3 || ""
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
function printBadge(eventId, registrationId, participantName){

const badge = `
<html>
<head>
  <title>Badge - ${participantName}</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f0f0f0;
    }

    .badge {
      width: 4in;
      height: 3in;
      border: 2px solid #667eea;
      border-radius: 10px;
      padding: 20px;
      background: white;
      text-align: center;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .badge h1 {
      margin: 10px 0;
      font-size: 24px;
      color: #667eea;
    }

    .badge p {
      margin: 5px 0;
      font-size: 14px;
    }

    .badge .name {
      font-weight: bold;
      font-size: 20px;
      color: #333;
      margin: 20px 0;
    }

    .badge .footer {
      font-size: 12px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="badge">
    <div>
      <h1>EVENT BADGE</h1>
    </div>
    <div class="name">${participantName}</div>
    <div class="footer">
      <p>${new Date().toLocaleDateString()}</p>
    </div>
  </div>
</body>
</html>
`

const win = window.open("", "", "width=600,height=500")
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

show(`

<h2>Edit Participant</h2>

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

<label>Contribution Amount ($):</label>
<input type="number" id="editPartContribution" value="${p.contribution || 0}" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<label>Food Coupons:</label>
<input type="number" id="editPartFoodCoupons" value="${p.foodCoupons || 0}" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<button onclick="updateParticipant('${eventId}', '${registrationId}')" style="padding: 8px 16px; background: #38ef7d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Update</button>
<button onclick="viewEventDetails('${eventId}')" style="padding: 8px 16px; background: #999; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>

`)

}

/* UPDATE PARTICIPANT */
async function updateParticipant(eventId, registrationId){

const name = document.getElementById("editPartName").value
const address = document.getElementById("editPartAddress").value
const phone = document.getElementById("editPartPhone").value
const guardian = document.getElementById("editPartGuardian").value
const emergency = document.getElementById("editPartEmergency").value
const contribution = Number(document.getElementById("editPartContribution").value) || 0
const foodCoupons = Number(document.getElementById("editPartFoodCoupons").value) || 0

await db.collection("eventRegistrations").doc(registrationId).update({
  name: name,
  address: address,
  phone: phone,
  guardian: guardian,
  emergencyContact: emergency,
  contribution: contribution,
  foodCoupons: foodCoupons
})

alert("Participant updated successfully!")
viewEventDetails(eventId)

}


/* RECORD PARTICIPANT CONTRIBUTION AS INCOME */

async function recordParticipantContributionAsIncome(eventId, participantName, amount, guardianType, guardianMemberId, guardianName){

try {
  // Get event details
  const eventDoc = await db.collection("events").doc(eventId).get()
  const event = eventDoc.data()

  // Generate IncomeID
  const incomeRef = db.collection("income").doc()
  const incomeID = incomeRef.id

  // Determine member linking for income record
  let memberID = null
  let memberName = null
  if(guardianType === "member" && guardianMemberId){
    memberID = guardianMemberId
    memberName = guardianName
  } else {
    memberID = "EVENT-" + eventId
  }

  // Save to income collection with event and guardian details
  await incomeRef.set({
    IncomeID: incomeID,
    MemberID: memberID,
    MemberName: memberName || participantName,
    Purpose: "Event Contribution - " + event.name,
    Type: "Cash",
    CheckNumber: "",
    Amount: amount,
    CollectionDate: new Date().toISOString().split('T')[0],
    Memo: "Event: " + event.name + " | Participant: " + participantName + " | Guardian: " + guardianName,
    EventId: eventId,
    ParticipantName: participantName,
    EventName: event.name,
    GuardianType: guardianType,
    GuardianMemberId: guardianType === "member" ? guardianMemberId : null,
    GuardianName: guardianName,
    IsEventContribution: true,
    CreateDate: firebase.firestore.FieldValue.serverTimestamp()
  })

} catch(error){
  console.error("Error recording income: ", error)
}

}


/* SYNC CONTRIBUTIONS TO INCOME - BATCH RECORD */

async function showSyncContributionsToIncome(eventId){

const eventDoc = await db.collection("events").doc(eventId).get()
const event = eventDoc.data()

const regSnap = await db.collection("eventRegistrations")
  .where("eventId", "==", eventId)
  .get()

let unrecordedContributions = 0

regSnap.forEach(doc => {
  const p = doc.data()
  if(p.contribution > 0){
    unrecordedContributions++
  }
})

show(`

<h2>Sync Contributions to Income - ${event.name}</h2>

<p>This will record all participant contributions as income entries in the Collection (Income) records.</p>

<div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ffc107;">
  <strong>⚠️ Note:</strong> This will create income entries for participants with contributions > $0.
  <br>
  <strong>Count:</strong> ${unrecordedContributions} unrecorded contributions will be synced.
</div>

<button onclick="syncAllContributionsToIncome('${eventId}')" style="padding: 8px 16px; background: #38ef7d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Sync All Contributions</button>

<button onclick="viewEventDetails('${eventId}')" style="padding: 8px 16px; background: #999; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>

`)

}


/* BATCH SYNC ALL CONTRIBUTIONS */

async function syncAllContributionsToIncome(eventId){

if(!confirm("Are you sure you want to sync all contributions to income collection? This cannot be undone.")){
  return
}

const eventDoc = await db.collection("events").doc(eventId).get()
const event = eventDoc.data()

const regSnap = await db.collection("eventRegistrations")
  .where("eventId", "==", eventId)
  .get()

let syncedCount = 0
let skippedCount = 0

for(const doc of regSnap.docs){
  const p = doc.data()

  if(p.contribution > 0){
    try {
      // Check if already recorded
      const incomeSnap = await db.collection("income")
        .where("EventId", "==", eventId)
        .where("ParticipantName", "==", p.name)
        .get()

      // Only sync if not already recorded
      if(incomeSnap.empty){
        await recordParticipantContributionAsIncome(
          eventId,
          p.name,
          p.contribution,
          p.guardianType || "nonmember",
          p.guardianMemberId || null,
          p.guardian || "Unknown"
        )
        syncedCount++
      } else {
        skippedCount++
      }
    } catch(error){
      console.error("Error syncing:", error)
    }
  }
}

alert(`Sync Complete!\n\nRecorded: ${syncedCount} contributions\nSkipped (already recorded): ${skippedCount}`)
viewEventDetails(eventId)

}
