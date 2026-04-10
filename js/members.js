async function loadMembers(){

show(`

<h2>Members</h2>

<button onclick="showAddMember()">Add Member</button>

<br><br>

<input id="searchBox" placeholder="Search member" onkeyup="filterMembers()">

<div id="memberList"></div>

`)

const snap = await db.collection("members").orderBy("Name").get()

let html=""

for(const doc of snap.docs){

const m = doc.data()

// Check if this member has an assigned CURRENT role (user with current_record = true)
const userSnap = await db.collection("users")
  .where("MemberID", "==", doc.id)
  .where("current_record", "==", true)
  .get()
let roleDisplay = '<span style="color: #ccc;">✗ No role assigned</span>'

if(!userSnap.empty){
  const linkedUser = userSnap.docs[0].data()
  const roleColors = {
    "Superuser": "#d32f2f",
    "Admin": "#f57c00",
    "Pastor": "#9c27b0",
    "Senior Pastor": "#673ab7",
    "Associate Pastor": "#b39ddb",
    "Pastor and President": "#512da8",
    "Treasurer": "#388e3c",
    "Secretary": "#1976d2",
    "Joint Secretary": "#7b1fa2",
    "Joint Treasurer": "#c2185b"
  }
  const roleColor = roleColors[linkedUser.Role] || "#666"
  roleDisplay = `<span style="color: ${roleColor}; font-weight: bold;">✓ ${linkedUser.Role}</span>`
}

html+=`
<div class="card memberRow">

<b>${m.Name}</b><br>

Phone: ${m.Phone || ""}<br>

Email: ${m.Email || ""}<br>

Status: ${m.Active ? "Active":"Inactive"}<br>

<br>

<span style="font-size:12px; font-weight:bold;">App Role:</span><br>
${roleDisplay}

<br><br>

<button onclick="editMember('${doc.id}')">Edit</button>
<button onclick="assignRoleToMember('${doc.id}', '${m.Name}', '${m.Email}')" style="background:#2196f3;">🔐 Assign Role</button>
<button onclick="generateMemberContributionReceipt('${doc.id}')" style="background:#4caf50;">📄 Annual Receipt</button>
<button onclick="showEmailStatementForm('${doc.id}', '${m.Name}', '${m.Email}')" style="background:#ff9800;">📧 Email Receipt</button>

</div>
`

}

document.getElementById("memberList").innerHTML=html

}



/* SEARCH MEMBERS */

function filterMembers(){

const text =
document.getElementById("searchBox").value.toLowerCase()

const rows =
document.getElementsByClassName("memberRow")

for(let r of rows){

if(r.innerText.toLowerCase().includes(text))
r.style.display="block"
else
r.style.display="none"

}

}



/* SHOW ADD MEMBER SCREEN */

function showAddMember(){

show(`

<h2>Add Member</h2>


Name<br>
<input id="name"><br><br>

Phone<br>
<input id="phone"><br><br>

Email<br>
<input id="email"><br><br>

Address1<br>
<input id="addr1"><br><br>

Address2<br>
<input id="addr2"><br><br>

Address3<br>
<input id="addr3"><br><br>

Spouse Name (if applicable)<br>
<input id="spouseName" placeholder="Spouse's full name"><br><br>

Spouse Email<br>
<input id="spouseEmail" placeholder="Spouse's email"><br><br>

Joint Account (Couple offering together)<br>
<select id="isJoint">
<option value="false">No</option>
<option value="true">Yes</option>
</select>

<br><br>

Active
<select id="active">
<option value="true">Active</option>
<option value="false">Inactive</option>
</select>

<br><br>

<button onclick="addMember()">Save</button>

<button onclick="loadMembers()">Cancel</button>

`)

}



/* SAVE MEMBER */

async function addMember(){

const spouseName = document.getElementById("spouseName").value.trim()
const spouseEmail = document.getElementById("spouseEmail").value.trim()
const isJoint = document.getElementById("isJoint").value === "true"

// Build spouse object if spouse name is provided
const spouse = spouseName ? {
  Name: spouseName,
  Email: spouseEmail || null,
  Active: true
} : null

await db.collection("members").add({

Name:
document.getElementById("name").value,

Phone:
document.getElementById("phone").value,

Email:
document.getElementById("email").value,

Address1:
document.getElementById("addr1").value,

Address2:
document.getElementById("addr2").value,

Address3:
document.getElementById("addr3").value,

Spouse: spouse,

IsJointAccount: isJoint && !!spouseName,

Active:
document.getElementById("active").value === "true",

TotalContribution:0

})

alert("Member added")

loadMembers()

}



/* EDIT MEMBER */

async function editMember(id){

const doc =
await db.collection("members").doc(id).get()

const m = doc.data()

show(`

<h2>Edit Member</h2>


Name<br>
<input id="name" value="${m.Name}"><br><br>

Phone<br>
<input id="phone" value="${m.Phone || ""}"><br><br>

Email<br>
<input id="email" value="${m.Email || ""}"><br><br>

Address1<br>
<input id="addr1" value="${m.Address1 || ""}"><br><br>

Address2<br>
<input id="addr2" value="${m.Address2 || ""}"><br><br>

Address3<br>
<input id="addr3" value="${m.Address3 || ""}"><br><br>

Spouse Name (if applicable)<br>
<input id="spouseName" placeholder="Spouse's full name" value="${m.Spouse?.Name || ""}"><br><br>

Spouse Email<br>
<input id="spouseEmail" placeholder="Spouse's email" value="${m.Spouse?.Email || ""}"><br><br>

Joint Account (Couple offering together)<br>
<select id="isJoint">
<option value="false" ${!m.IsJointAccount ? "selected":""}>No</option>
<option value="true" ${m.IsJointAccount ? "selected":""}>Yes</option>
</select>

<br><br>

Active
<select id="active">
<option value="true" ${m.Active ? "selected":""}>Active</option>
<option value="false" ${!m.Active ? "selected":""}>Inactive</option>
</select>

<br><br>

<button onclick="updateMember('${id}')">Update</button>

<button onclick="loadMembers()">Cancel</button>

`)

}



/* UPDATE MEMBER */

async function updateMember(id){

const spouseName = document.getElementById("spouseName").value.trim()
const spouseEmail = document.getElementById("spouseEmail").value.trim()
const isJoint = document.getElementById("isJoint").value === "true"

// Build spouse object if spouse name is provided
const spouse = spouseName ? {
  Name: spouseName,
  Email: spouseEmail || null,
  Active: true
} : null

await db.collection("members").doc(id).update({

Name:
document.getElementById("name").value,

Phone:
document.getElementById("phone").value,

Email:
document.getElementById("email").value,

Address1:
document.getElementById("addr1").value,

Address2:
document.getElementById("addr2").value,

Address3:
document.getElementById("addr3").value,

Spouse: spouse,

IsJointAccount: isJoint && !!spouseName,

Active:
document.getElementById("active").value === "true"

})

alert("Member updated")

loadMembers()

}

/* ASSIGN ROLE TO MEMBER */

async function assignRoleToMember(memberId, memberName, memberEmail){

try {
  // Check if member already has a CURRENT role assigned (current_record = true)
  const existingUserSnap = await db.collection("users")
    .where("MemberID", "==", memberId)
    .where("current_record", "==", true)
    .get()
  let currentRoleDisplay = ""
  let currentRoleValue = ""

  if(!existingUserSnap.empty){
    const existingUser = existingUserSnap.docs[0].data()
    currentRoleDisplay = `<p style="color: #4caf50;"><b>Currently Assigned Role:</b> ${existingUser.Role}</p>`
    currentRoleValue = existingUser.Role
  }

  show(`

  <h2>Assign Role to Member: ${memberName}</h2>

  <p><b>Email:</b> ${memberEmail}</p>

  ${currentRoleDisplay}

  <label>Select Role</label>
  <select id="roleSelect" style="width:100%; padding:8px; margin:6px 0;">
  <option value="">-- Select Role --</option>
  <option value="Superuser" ${currentRoleValue === "Superuser" ? "selected" : ""}>Superuser (Full Access)</option>
  <option value="Admin" ${currentRoleValue === "Admin" ? "selected" : ""}>Admin (Manage All)</option>
  <option value="Pastor" ${currentRoleValue === "Pastor" ? "selected" : ""}>Pastor</option>
  <option value="Senior Pastor" ${currentRoleValue === "Senior Pastor" ? "selected" : ""}>Senior Pastor</option>
  <option value="Associate Pastor" ${currentRoleValue === "Associate Pastor" ? "selected" : ""}>Associate Pastor</option>
  <option value="Pastor and President" ${currentRoleValue === "Pastor and President" ? "selected" : ""}>Pastor and President</option>
  <option value="Treasurer" ${currentRoleValue === "Treasurer" ? "selected" : ""}>Treasurer (Finance)</option>
  <option value="Secretary" ${currentRoleValue === "Secretary" ? "selected" : ""}>Secretary (Records)</option>
  <option value="Joint Secretary" ${currentRoleValue === "Joint Secretary" ? "selected" : ""}>Joint Secretary (Records)</option>
  <option value="Joint Treasurer" ${currentRoleValue === "Joint Treasurer" ? "selected" : ""}>Joint Treasurer (Finance)</option>
  </select>

  <br><br>

  <p style="font-size:12px; color:#666;">Assigning a role will create/update an app user account for this member with their name and email.</p>

  <br>

  <button onclick="saveRoleAssignment('${memberId}', '${memberName}', '${memberEmail}')" style="padding:8px 16px; background:#4caf50; color:white; border:none; border-radius:4px; cursor:pointer; margin-right:5px;">Assign Role</button>
  <button onclick="removeRoleFromMember('${memberId}')" style="padding:8px 16px; background:#d32f2f; color:white; border:none; border-radius:4px; cursor:pointer; margin-right:5px;">Remove Role</button>
  <button onclick="loadMembers()" style="padding:8px 16px; background:#999; color:white; border:none; border-radius:4px; cursor:pointer;">Cancel</button>

  `)
} catch(error){
  console.error("Error assigning role:", error)
  alert("Error loading role assignment. Please try again.")
}

}

/* SAVE ROLE ASSIGNMENT */

async function saveRoleAssignment(memberId, memberName, memberEmail){

const role = document.getElementById("roleSelect").value

if(!role){
  alert("Please select a role")
  return
}

// Check for duplicate one-to-one roles
const oneToOneRoles = ["Pastor and President", "Treasurer", "Secretary"]
if(oneToOneRoles.includes(role)){
  const roleSnap = await db.collection("users")
    .where("Role", "==", role)
    .where("current_record", "==", true)
    .get()

  if(!roleSnap.empty){
    const existingUser = roleSnap.docs[0].data()
    // Only prevent if trying to assign to a DIFFERENT member
    if(existingUser.MemberID !== memberId){
      alert(`❌ Cannot assign this role!\n\nThe role "${role}" is already assigned to: ${existingUser.Name}\n\nEach of these roles can only be assigned to ONE member:\n✓ Pastor and President\n✓ Treasurer\n✓ Secretary\n\nTo change the assignment, you must first remove the role from ${existingUser.Name}.`)
      return
    }
  }
}

try {
  // Check if user already exists for this member (only current records)
  const existingUserSnap = await db.collection("users")
    .where("MemberID", "==", memberId)
    .where("current_record", "==", true)
    .get()

  if(!existingUserSnap.empty){
    // Update existing user with new role using audit trail
    const userId = existingUserSnap.docs[0].id
    const oldData = existingUserSnap.docs[0].data()

    // Get current user for audit trail
    const currentUser = getCurrentUser()
    const auditEmail = (currentUser && currentUser.userEmail) ? currentUser.userEmail : "system"

    // Mark old record as no longer current
    await db.collection("users").doc(userId).update({
      current_record: false,
      deleted_at: new Date(),
      deleted_by: auditEmail || "system"
    })

    // Create new record with updated role
    await db.collection("users").add({
      Name: oldData.Name,
      Email: oldData.Email,
      Role: role,
      MemberID: memberId,
      MemberName: memberName,
      Active: oldData.Active,
      CreatedDate: oldData.CreatedDate || new Date(),
      // Audit trail fields
      current_record: true,
      previous_record_id: userId,
      created_at: oldData.created_at || new Date(),
      created_by: oldData.created_by || "system",
      updated_at: new Date(),
      updated_by: auditEmail || "system",
      action: "updated",
      changes: {
        role: oldData.Role !== role ? {old: oldData.Role, new: role} : undefined
      }
    })

    alert(`Role updated to ${role}`)
  } else {
    // Create new user for this member
    const currentUser = getCurrentUser()
    const auditEmail = (currentUser && currentUser.userEmail) ? currentUser.userEmail : "system"

    await db.collection("users").add({
      Name: memberName,
      Email: memberEmail,
      Role: role,
      MemberID: memberId,
      MemberName: memberName,
      Active: true,
      CreatedDate: new Date(),
      // Audit trail fields
      current_record: true,
      created_at: new Date(),
      created_by: auditEmail || "system",
      updated_at: new Date(),
      updated_by: auditEmail || "system",
      action: "created"
    })

    alert(`Role ${role} assigned to ${memberName}`)
  }

  loadMembers()
} catch(error){
  console.error("Error saving role:", error)
  alert("Error saving role assignment. Please try again.")
}

}

/* REMOVE ROLE FROM MEMBER */

async function removeRoleFromMember(memberId){

try {
  const userSnap = await db.collection("users")
    .where("MemberID", "==", memberId)
    .where("current_record", "==", true)
    .get()

  if(userSnap.empty){
    alert("No role assigned to this member")
    return
  }

  if(!confirm("Are you sure you want to remove this member's app role?")){
    return
  }

  const userId = userSnap.docs[0].id
  const userData = userSnap.docs[0].data()

  // Get current user for audit trail
  const currentUser = getCurrentUser()
  const auditEmail = (currentUser && currentUser.userEmail) ? currentUser.userEmail : "system"

  // Mark user role as removed (using audit trail approach)
  await db.collection("users").doc(userId).update({
    current_record: false,
    deleted_at: new Date(),
    deleted_by: auditEmail || "system",
    action: "deleted"
  })

  alert(`Role removed from ${userData.Name}.\n\nAudit trail recorded.`)
  loadMembers()
} catch(error){
  console.error("Error removing role:", error)
  alert("Error removing role. Please try again.")
}

}

/* GENERATE MEMBER CONTRIBUTION RECEIPT */
async function generateMemberContributionReceipt(memberId){
  const currentYear = new Date().getFullYear()

  show(`

  <h2>Annual Contribution Receipt</h2>

  <p>Generate a tax contribution receipt for the member.</p>

  <label>Select Tax Year:</label>
  <input type="number" id="receiptTaxYear" value="${currentYear}" min="2000" max="${currentYear}">

  <br><br>

  <button onclick="generateMemberReceipt('${memberId}')">Generate PDF</button>
  <button onclick="loadMembers()">Cancel</button>

  `)
}

/* GENERATE SINGLE MEMBER RECEIPT */
async function generateMemberReceipt(memberId){
  const taxYear = parseInt(document.getElementById("receiptTaxYear").value)

  if(!taxYear || taxYear < 2000){
    alert("Please enter a valid tax year")
    return
  }

  // Call the same function from reports.js
  await generateSingleMemberStatement(memberId, taxYear)
}

/* SHOW EMAIL STATEMENT FORM */
function showEmailStatementForm(memberId, memberName, memberEmail){

  const currentYear = new Date().getFullYear()

  if(!memberEmail){
    alert("This member does not have an email address on file. Please add email first.")
    loadMembers()
    return
  }

  show(`

  <h2>Email Annual Contribution Receipt</h2>

  <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #2196f3;">
    <p><strong>Member:</strong> ${memberName}</p>
    <p><strong>Email:</strong> ${memberEmail}</p>
  </div>

  <label>Select Tax Year:</label>
  <input type="number" id="emailTaxYear" value="${currentYear}" min="2000" max="${currentYear}">

  <br><br>

  <label>Email Subject (Optional):</label>
  <input type="text" id="emailSubject" value="Your ${currentYear} Annual Contribution Statement" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">

  <br><br>

  <label>Email Message (Optional):</label>
  <textarea id="emailMessage" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; height: 100px;">Dear ${memberName},

Please find attached your Annual Contribution Statement for tax year. Thank you for your continued support.

Blessings,
Boston Christian Assembly</textarea>

  <br><br>

  <button onclick="emailMemberStatement('${memberId}', '${memberName}', '${memberEmail}')" style="padding: 10px 20px; background: #ff9800; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">📧 Send Email</button>
  <button onclick="loadMembers()" style="padding: 10px 20px; background: #999; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>

  <br><br>

  <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #ffc107;">
    <h4 style="margin-top: 0;">📋 How Email Works</h4>
    <p><strong>Email will be sent FROM:</strong> Your church treasurer/finance Gmail account</p>
    <p><strong>Email will be sent TO:</strong> ${memberEmail}</p>
    <p><strong>Attachment:</strong> PDF Annual Contribution Receipt</p>
    <p style="margin-bottom: 0;"><strong>Powered by:</strong> Google Apps Script (Free for non-profits)</p>
  </div>

  `)
}

/* EMAIL MEMBER STATEMENT */
async function emailMemberStatement(memberId, memberName, memberEmail){

  const taxYear = parseInt(document.getElementById("emailTaxYear").value)
  const emailSubject = document.getElementById("emailSubject").value
  const emailMessage = document.getElementById("emailMessage").value

  if(!taxYear || taxYear < 2000){
    alert("Please enter a valid tax year")
    return
  }

  // First, generate the PDF as a string
  const pdfData = await generateMemberStatementPDF(memberId, taxYear)

  if(!pdfData){
    alert("Failed to generate statement PDF")
    return
  }

  // Prepare email data
  const emailData = {
    to: memberEmail,
    subject: emailSubject || `Your ${taxYear} Annual Contribution Statement`,
    body: emailMessage || `Dear ${memberName},\n\nPlease find attached your Annual Contribution Statement for tax year. Thank you for your continued support.\n\nBlessings,\nBoston Christian Assembly`,
    pdfData: pdfData,
    fileName: `${memberName}_Contribution_Receipt_${taxYear}.pdf`
  }

  // Send via Google Apps Script
  try {
    // Call the Google Apps Script Web App
    const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_URL_HERE', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    })

    alert(`✅ Email sent successfully to ${memberEmail}!`)
    loadMembers()
  } catch(error){
    console.error("Error sending email:", error)
    alert("Error sending email. Make sure Google Apps Script URL is configured.\n\nError: " + error.message)
  }
}

/* GENERATE MEMBER STATEMENT PDF (Returns PDF as data) */
async function generateMemberStatementPDF(memberId, taxYear){
  // This should return the PDF data instead of opening in window
  // For now, we'll call the existing function and capture the PDF
  // This requires modification of the existing PDF generation function

  try {
    const memberDoc = await db.collection("members").doc(memberId).get()
    const memberData = memberDoc.data()

    const collectionSnap = await db.collection("income")
      .where("MemberID", "==", memberId)
      .get()

    let totalContribution = 0
    let collections = []

    collectionSnap.forEach(doc => {
      const income = doc.data()
      const collectionYear = new Date(income.CollectionDate).getFullYear()
      if(collectionYear === taxYear){
        totalContribution += income.Amount || 0
        collections.push(income)
      }
    })

    // Return the data needed to generate PDF
    return {
      memberName: memberData.Name,
      memberEmail: memberData.Email,
      totalContribution: totalContribution,
      taxYear: taxYear,
      collections: collections
    }
  } catch(error){
    console.error("Error generating statement data:", error)
    return null
  }
}
