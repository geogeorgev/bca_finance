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

regSnap.forEach(doc => {
  const p = doc.data()
  if(p.checkedIn) checkedInCount++
  totalContribution += p.contribution || 0

  const checkedInBadge = p.checkedIn ? '✅' : '❌'
  const badgePrintedBadge = p.badgePrinted ? '🖨️' : '❌'

  participantsList += `
  <tr>
    <td style="padding: 8px;">${p.name}</td>
    <td style="padding: 8px;">${p.phone}</td>
    <td style="padding: 8px;">${p.guardian}</td>
    <td style="padding: 8px; text-align: center;">${checkedInBadge}</td>
    <td style="padding: 8px; text-align: center;">${badgePrintedBadge}</td>
    <td style="padding: 8px; text-align: right;">$${p.contribution || 0}</td>
    <td style="padding: 8px; text-align: right;">$${p.balance || 0}</td>
    <td style="padding: 8px; text-align: center;">${p.foodCoupons || 0}</td>
    <td style="padding: 8px;">
      <button onclick="editParticipant('${eventId}', '${doc.id}')" style="padding: 4px 8px; background: #667eea; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">Edit</button>
    </td>
  </tr>
  `
})

show(`

<h2>${event.name} - Participants</h2>

<div style="margin-bottom: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px;">
  <h3 style="margin: 0 0 10px 0;">Event Summary</h3>
  <p><strong>Dates:</strong> ${new Date(event.startDate).toLocaleDateString()} to ${new Date(event.endDate).toLocaleDateString()}</p>
  <p><strong>Location:</strong> ${event.location}</p>
  <p><strong>Total Participants:</strong> ${regSnap.size}</p>
  <p><strong>Checked In:</strong> ${checkedInCount}/${regSnap.size}</p>
  <p><strong>Total Contributions:</strong> $${totalContribution.toFixed(2)}</p>
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

`)

}

/* SHOW REGISTER PARTICIPANT SCREEN */
function showRegisterParticipant(eventId){

show(`

<h2>Register Participant</h2>

<label>Participant Name:</label>
<input id="partName" placeholder="Full name" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<label>Address:</label>
<input id="partAddress" placeholder="Street address" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<label>Phone Number:</label>
<input id="partPhone" placeholder="Phone number" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<label>Guardian Name:</label>
<input id="partGuardian" placeholder="Parent/Guardian name" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<label>Emergency Contact:</label>
<input id="partEmergency" placeholder="Emergency contact number" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

<br><br>

<label>Contribution Amount ($):</label>
<input type="number" id="partContribution" placeholder="0" style="width: 100%; padding: 8px; margin: 6px 0; border: 1px solid #ccc; border-radius: 4px;">

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
const guardian = document.getElementById("partGuardian").value
const emergency = document.getElementById("partEmergency").value
const contribution = Number(document.getElementById("partContribution").value) || 0
const foodCoupons = Number(document.getElementById("partFoodCoupons").value) || 0

if(!name || !phone || !guardian){
  alert("Please fill in required fields (Name, Phone, Guardian)")
  return
}

const balance = contribution > 0 ? 0 : 0

await db.collection("eventRegistrations").add({
  eventId: eventId,
  name: name,
  address: address,
  phone: phone,
  guardian: guardian,
  emergencyContact: emergency,
  checkedIn: false,
  contribution: contribution,
  balance: balance,
  badgePrinted: false,
  foodCoupons: foodCoupons,
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
})

alert("Participant registered successfully!")
viewEventDetails(eventId)

}

/* SHOW CHECK-IN SCREEN */
async function showCheckIn(eventId){

const eventDoc = await db.collection("events").doc(eventId).get()
const event = eventDoc.data()

const regSnap = await db.collection("eventRegistrations")
  .where("eventId", "==", eventId)
  .orderBy("createdAt")
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

