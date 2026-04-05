function loadReports(){

show(`

<h2>Reports</h2>

<button onclick="collectionReport()">Collection Report</button>
<button onclick="expenseReport()">Expense Report</button>
<button onclick="showContributionStatementGenerator()">Annual Contribution Statement</button>

<div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
  <h3>Database Management</h3>
  <button onclick="backupDatabase()" style="background: #38ef7d; color: white; margin-right: 10px;">💾 Backup Database</button>
  <button onclick="showRestoreDialog()" style="background: #2196f3; color: white; margin-right: 10px;">⬆️ Restore Database</button>
  <button onclick="showBackupAuditTrail()" style="background: #ff9800; color: white;">📋 Backup Audit Trail</button>
</div>

`)

}

async function collectionReport(){

const currentYear = new Date().getFullYear()
const currentDate = new Date()
const yearStart = new Date(currentYear, 0, 1)
const yearStartStr = yearStart.toISOString().split('T')[0]
const currentDateStr = currentDate.toISOString().split('T')[0]

show(`

<h2>Collection Report - Year ${currentYear}</h2>

<div style="margin-bottom: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px;">

  <label>Report Type:</label>
  <select id="reportType" onchange="updateReportDateFields()">
    <option value="ytd">Year to Date (Default)</option>
    <option value="month">Specific Month</option>
    <option value="custom">Custom Date Range</option>
  </select>

  <br><br>

  <div id="monthField" style="display:none;">
    <label>Select Month & Year:</label>
    <input type="month" id="monthInput" value="${currentYear}-${String(currentDate.getMonth() + 1).padStart(2, '0')}">
  </div>

  <div id="customField" style="display:none;">
    <label>Start Date:</label>
    <input type="date" id="startDate" value="${yearStartStr}">
    <br><br>
    <label>End Date:</label>
    <input type="date" id="endDate" value="${currentDateStr}">
  </div>

  <br><br>

  <button onclick="generateCollectionReport()" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">Generate Report</button>
  <button onclick="exportCollectionToExcel()" style="padding: 8px 16px; background: #38ef7d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">📊 Export to Excel</button>

</div>

<div id="reportContent"></div>

`)

}

function updateReportDateFields(){
  const reportType = document.getElementById("reportType").value

  document.getElementById("monthField").style.display = reportType === "month" ? "block" : "none"
  document.getElementById("customField").style.display = reportType === "custom" ? "block" : "none"
}

async function generateCollectionReport(){

const currentYear = new Date().getFullYear()
const reportType = document.getElementById("reportType").value
const snap = await db.collection("income").get()

let startDate, endDate
let reportTitle = `Collection Report - Year ${currentYear}`

if(reportType === "ytd"){
  startDate = new Date(currentYear, 0, 1)
  endDate = new Date()
  // Ensure endDate includes the entire day
  endDate.setHours(23, 59, 59, 999)
  reportTitle = `Collection Report - Year to Date (${currentYear})`
} else if(reportType === "month"){
  const monthValue = document.getElementById("monthInput").value
  const [year, month] = monthValue.split('-')
  startDate = new Date(year, month - 1, 1)
  endDate = new Date(year, month, 0)
  reportTitle = `Collection Report - ${monthValue}`
} else if(reportType === "custom"){
  startDate = new Date(document.getElementById("startDate").value)
  endDate = new Date(document.getElementById("endDate").value)
  reportTitle = `Collection Report - ${document.getElementById("startDate").value} to ${document.getElementById("endDate").value}`
}

let collections = []
let totalAmount = 0

snap.forEach(doc=>{
  const d = doc.data()
  if(!d.CollectionDate) return

  // Parse date string as local date, not UTC
  const dateStr = d.CollectionDate
  const [year, month, day] = dateStr.split('-')
  const collectionDate = new Date(year, month - 1, day)

  if(collectionDate >= startDate && collectionDate <= endDate){
    collections.push({
      ...d,
      collectionDateObj: collectionDate
    })
    totalAmount += d.Amount || 0
  }
})

// Sort by date descending
collections.sort((a, b) => b.collectionDateObj - a.collectionDateObj)

let html = `
<h3>${reportTitle}</h3>

<table border="1" width="100%" style="border-collapse: collapse; margin-bottom: 20px;">
<thead style="background-color: #667eea; color: white;">
<tr>
  <th style="padding: 10px; text-align: left;">Collection Date</th>
  <th style="padding: 10px; text-align: left;">Create Date</th>
  <th style="padding: 10px; text-align: left;">Member Name</th>
  <th style="padding: 10px; text-align: left;">Type</th>
  <th style="padding: 10px; text-align: left;">Purpose</th>
  <th style="padding: 10px; text-align: left;">Check #</th>
  <th style="padding: 10px; text-align: right;">Amount</th>
  <th style="padding: 10px; text-align: left;">Memo</th>
</tr>
</thead>
<tbody>
`

collections.forEach(c => {
  const collDate = c.collectionDateObj.toLocaleDateString()
  const createDate = c.CreateDate ? (c.CreateDate.toDate ? new Date(c.CreateDate.toDate()).toLocaleDateString() : new Date(c.CreateDate).toLocaleDateString()) : ""
  const memberName = c.MemberName || "N/A"
  const type = c.Type || ""
  const purpose = c.Purpose || ""
  const checkNum = c.CheckNumber || ""
  const amount = c.Amount || 0
  const memo = c.Memo || ""

  html += `
  <tr>
    <td style="padding: 8px;">${collDate}</td>
    <td style="padding: 8px;">${createDate}</td>
    <td style="padding: 8px;">${memberName}</td>
    <td style="padding: 8px;">${type}</td>
    <td style="padding: 8px;">${purpose}</td>
    <td style="padding: 8px;">${checkNum}</td>
    <td style="padding: 8px; text-align: right;">$${amount.toFixed(2)}</td>
    <td style="padding: 8px;">${memo}</td>
  </tr>
  `
})

html += `
</tbody>
</table>

<div style="background: #f0f0f0; padding: 15px; border-radius: 5px; font-weight: bold; font-size: 16px;">
  <h3 style="margin-top: 0;">Total Collections: $${totalAmount.toFixed(2)}</h3>
  <p style="margin: 5px 0;">Total Records: ${collections.length}</p>
</div>
`

// Store collections data globally for export
window.lastCollectionReportData = collections
window.lastCollectionReportTitle = reportTitle

document.getElementById("reportContent").innerHTML = html

}

async function exportCollectionToExcel(){

if(!window.lastCollectionReportData || window.lastCollectionReportData.length === 0){
  alert("Please generate a report first")
  return
}

const collections = window.lastCollectionReportData
const reportTitle = window.lastCollectionReportTitle || "Collection Report"

// Create CSV content
let csv = "Collection Report\n"
csv += reportTitle + "\n"
csv += "Generated: " + new Date().toLocaleDateString() + "\n\n"

csv += "Collection Date,Create Date,Member Name,Type,Purpose,Check #,Amount,Memo\n"

collections.forEach(c => {
  const collDate = c.collectionDateObj.toLocaleDateString()
  const createDate = c.CreateDate ? (c.CreateDate.toDate ? new Date(c.CreateDate.toDate()).toLocaleDateString() : new Date(c.CreateDate).toLocaleDateString()) : ""
  const memberName = (c.MemberName || "N/A").replace(/,/g, ";")
  const type = (c.Type || "").replace(/,/g, ";")
  const purpose = (c.Purpose || "").replace(/,/g, ";")
  const checkNum = (c.CheckNumber || "").replace(/,/g, ";")
  const amount = c.Amount || 0
  const memo = (c.Memo || "").replace(/,/g, ";").replace(/\n/g, " ")

  csv += `"${collDate}","${createDate}","${memberName}","${type}","${purpose}","${checkNum}","${amount}","${memo}"\n`
})

// Add total
csv += "\n\nTotal Collections:," + collections.reduce((sum, c) => sum + (c.Amount || 0), 0).toFixed(2)

// Create blob and download
const blob = new Blob([csv], {type: "text/csv"})
const url = URL.createObjectURL(blob)
const a = document.createElement("a")
a.href = url
a.download = `Collection_Report_${new Date().toISOString().split('T')[0]}.csv`
a.click()
URL.revokeObjectURL(url)

alert("Report exported to Excel successfully!")

}

async function expenseReport(){

const currentYear = new Date().getFullYear()
const currentDate = new Date()
const yearStart = new Date(currentYear, 0, 1)
const yearStartStr = yearStart.toISOString().split('T')[0]
const currentDateStr = currentDate.toISOString().split('T')[0]

show(`

<h2>Expense Report - Year ${currentYear}</h2>

<div style="margin-bottom: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px;">

  <label>Report Type:</label>
  <select id="expenseReportType" onchange="updateExpenseReportDateFields()">
    <option value="ytd">Year to Date (Default)</option>
    <option value="month">Specific Month</option>
    <option value="custom">Custom Date Range</option>
  </select>

  <br><br>

  <div id="expenseMonthField" style="display:none;">
    <label>Select Month & Year:</label>
    <input type="month" id="expenseMonthInput" value="${currentYear}-${String(currentDate.getMonth() + 1).padStart(2, '0')}">
  </div>

  <div id="expenseCustomField" style="display:none;">
    <label>Start Date:</label>
    <input type="date" id="expenseStartDate" value="${yearStartStr}">
    <br><br>
    <label>End Date:</label>
    <input type="date" id="expenseEndDate" value="${currentDateStr}">
  </div>

  <br><br>

  <button onclick="generateExpenseReport()" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">Generate Report</button>
  <button onclick="exportExpenseToExcel()" style="padding: 8px 16px; background: #38ef7d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">📊 Export to Excel</button>

</div>

<div id="expenseReportContent"></div>

`)

}

function updateExpenseReportDateFields(){
  const reportType = document.getElementById("expenseReportType").value

  document.getElementById("expenseMonthField").style.display = reportType === "month" ? "block" : "none"
  document.getElementById("expenseCustomField").style.display = reportType === "custom" ? "block" : "none"
}

async function generateExpenseReport(){

const currentYear = new Date().getFullYear()
const reportType = document.getElementById("expenseReportType").value
const snap = await db.collection("expense").get()

let startDate, endDate
let reportTitle = `Expense Report - Year ${currentYear}`

if(reportType === "ytd"){
  startDate = new Date(currentYear, 0, 1)
  endDate = new Date()
  reportTitle = `Expense Report - Year to Date (${currentYear})`
} else if(reportType === "month"){
  const monthValue = document.getElementById("expenseMonthInput").value
  const [year, month] = monthValue.split('-')
  startDate = new Date(year, month - 1, 1)
  endDate = new Date(year, month, 0)
  reportTitle = `Expense Report - ${monthValue}`
} else if(reportType === "custom"){
  startDate = new Date(document.getElementById("expenseStartDate").value)
  endDate = new Date(document.getElementById("expenseEndDate").value)
  reportTitle = `Expense Report - ${document.getElementById("expenseStartDate").value} to ${document.getElementById("expenseEndDate").value}`
}

let expenses = []
let totalAmount = 0

snap.forEach(doc=>{
  const d = doc.data()
  if(!d.PaymentDate) return

  const paymentDate = new Date(d.PaymentDate.toDate())

  if(paymentDate >= startDate && paymentDate <= endDate){
    expenses.push({
      ...d,
      paymentDateObj: paymentDate
    })
    totalAmount += d.Amount || 0
  }
})

// Sort by date descending
expenses.sort((a, b) => b.paymentDateObj - a.paymentDateObj)

let html = `
<h3>${reportTitle}</h3>

<table border="1" width="100%" style="border-collapse: collapse; margin-bottom: 20px;">
<thead style="background-color: #ee0979; color: white;">
<tr>
  <th style="padding: 10px; text-align: left;">Payment Date</th>
  <th style="padding: 10px; text-align: left;">Type</th>
  <th style="padding: 10px; text-align: left;">Payee Name</th>
  <th style="padding: 10px; text-align: left;">Member Name</th>
  <th style="padding: 10px; text-align: left;">Category</th>
  <th style="padding: 10px; text-align: left;">SubCategory</th>
  <th style="padding: 10px; text-align: left;">Payment Method</th>
  <th style="padding: 10px; text-align: left;">Check #</th>
  <th style="padding: 10px; text-align: right;">Amount</th>
  <th style="padding: 10px; text-align: left;">Description</th>
</tr>
</thead>
<tbody>
`

expenses.forEach(e => {
  const payDate = e.paymentDateObj.toLocaleDateString()
  const type = e.Type || ""
  const payeeName = e.PayeeName || ""
  const memberName = e.MemberName || ""
  const category = e.Category || ""
  const subCategory = e.SubCategory || ""
  const paymentMethod = e.PaymentMethod || ""
  const checkNum = e.CheckNumber || ""
  const amount = e.Amount || 0
  const description = e.Description || ""

  html += `
  <tr>
    <td style="padding: 8px;">${payDate}</td>
    <td style="padding: 8px;">${type}</td>
    <td style="padding: 8px;">${payeeName}</td>
    <td style="padding: 8px;">${memberName}</td>
    <td style="padding: 8px;">${category}</td>
    <td style="padding: 8px;">${subCategory}</td>
    <td style="padding: 8px;">${paymentMethod}</td>
    <td style="padding: 8px;">${checkNum}</td>
    <td style="padding: 8px; text-align: right;">$${amount.toFixed(2)}</td>
    <td style="padding: 8px;">${description}</td>
  </tr>
  `
})

html += `
</tbody>
</table>

<div style="background: #f0f0f0; padding: 15px; border-radius: 5px; font-weight: bold; font-size: 16px;">
  <h3 style="margin-top: 0;">Total Expenses: $${totalAmount.toFixed(2)}</h3>
  <p style="margin: 5px 0;">Total Records: ${expenses.length}</p>
</div>
`

// Store expenses data globally for export
window.lastExpenseReportData = expenses
window.lastExpenseReportTitle = reportTitle

document.getElementById("expenseReportContent").innerHTML = html

}

async function exportExpenseToExcel(){

if(!window.lastExpenseReportData || window.lastExpenseReportData.length === 0){
  alert("Please generate a report first")
  return
}

const expenses = window.lastExpenseReportData
const reportTitle = window.lastExpenseReportTitle || "Expense Report"

// Create CSV content
let csv = "Expense Report\n"
csv += reportTitle + "\n"
csv += "Generated: " + new Date().toLocaleDateString() + "\n\n"

csv += "Payment Date,Type,Payee Name,Member Name,Category,SubCategory,Payment Method,Check #,Amount,Description\n"

expenses.forEach(e => {
  const payDate = e.paymentDateObj.toLocaleDateString()
  const type = (e.Type || "").replace(/,/g, ";")
  const payeeName = (e.PayeeName || "").replace(/,/g, ";")
  const memberName = (e.MemberName || "").replace(/,/g, ";")
  const category = (e.Category || "").replace(/,/g, ";")
  const subCategory = (e.SubCategory || "").replace(/,/g, ";")
  const paymentMethod = (e.PaymentMethod || "").replace(/,/g, ";")
  const checkNum = (e.CheckNumber || "").replace(/,/g, ";")
  const amount = e.Amount || 0
  const description = (e.Description || "").replace(/,/g, ";").replace(/\n/g, " ")

  csv += `"${payDate}","${type}","${payeeName}","${memberName}","${category}","${subCategory}","${paymentMethod}","${checkNum}","${amount}","${description}"\n`
})

// Add total
csv += "\n\nTotal Expenses:," + expenses.reduce((sum, e) => sum + (e.Amount || 0), 0).toFixed(2)

// Create blob and download
const blob = new Blob([csv], {type: "text/csv"})
const url = URL.createObjectURL(blob)
const a = document.createElement("a")
a.href = url
a.download = `Expense_Report_${new Date().toISOString().split('T')[0]}.csv`
a.click()
URL.revokeObjectURL(url)

alert("Report exported to Excel successfully!")

}

async function backupDatabase(){

let backup={}

// Include ALL collections in database
const collections=["members","income","expense","budget","users","events","eventRegistrations","bank_transactions","receipts"]

for(const col of collections){

const snap=await db.collection(col).get()

backup[col]=[]

snap.forEach(doc=>{
backup[col].push(doc.data())
})

}

const json=JSON.stringify(backup,null,2)

const blob=new Blob([json],{type:"application/json"})

const url=URL.createObjectURL(blob)

// Generate timestamp in YYYY-MM-DD-HH:MM:SS format
const now = new Date()
const year = now.getFullYear()
const month = String(now.getMonth() + 1).padStart(2, '0')
const day = String(now.getDate()).padStart(2, '0')
const hours = String(now.getHours()).padStart(2, '0')
const minutes = String(now.getMinutes()).padStart(2, '0')
const seconds = String(now.getSeconds()).padStart(2, '0')
const timestamp = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`

const a=document.createElement("a")

a.href=url
a.download=`church_backup_${timestamp}.json`
a.click()

// Log backup to audit trail
const currentUser = getCurrentUser()
const auditEmail = (currentUser && currentUser.userEmail) ? currentUser.userEmail : "system"
const auditName = (currentUser && currentUser.userName) ? currentUser.userName : "Unknown User"

try {
  await db.collection("backup_audit_trail").add({
    action: "BACKUP",
    timestamp: new Date(),
    performed_by: auditName,
    performed_by_email: auditEmail,
    filename: `church_backup_${timestamp}.json`,
    tables_backed_up: collections,
    table_record_counts: {
      members: backup.members ? backup.members.length : 0,
      income: backup.income ? backup.income.length : 0,
      expense: backup.expense ? backup.expense.length : 0,
      budget: backup.budget ? backup.budget.length : 0,
      users: backup.users ? backup.users.length : 0,
      events: backup.events ? backup.events.length : 0,
      eventRegistrations: backup.eventRegistrations ? backup.eventRegistrations.length : 0,
      bank_transactions: backup.bank_transactions ? backup.bank_transactions.length : 0,
      receipts: backup.receipts ? backup.receipts.length : 0
    },
    status: "success",
    details: "Database backup created successfully"
  })
} catch(auditError) {
  console.warn("Error logging backup to audit trail:", auditError)
}

alert(`✅ Complete Database Backup Downloaded!\n\nFilename: church_backup_${timestamp}.json\n\nCollections Backed Up:\n✅ Members\n✅ Income\n✅ Expenses\n✅ Budgets\n✅ Users & Roles\n✅ Events\n✅ Event Registrations\n✅ Bank Transactions\n✅ Receipt Files\n\nStore this file in a safe location for recovery purposes.`)

}

/* SHOW RESTORE DIALOG */
function showRestoreDialog(){

// Check if user has permission to restore (Superuser, Treasurer, or Secretary)
const user = getCurrentUser()

if(!user){
  alert("You must be logged in to restore the database")
  return
}

const userLevel = user.userLevel
const allowedRoles = [10, 8, 7] // Superuser (10), Treasurer (8), Secretary (7)

if(!allowedRoles.includes(userLevel)){
  alert("❌ Access Denied\n\nDatabase restore is restricted to:\n✅ Superuser\n✅ Treasurer\n✅ Secretary\n\nYour role: " + (user.userRole || "Unknown") + " does not have restore permissions.\n\nContact your Superuser or Treasurer to restore the database.")
  return
}

show(`

<h2>Restore Database from Backup</h2>

<div style="background: #e8f5e9; padding: 12px; border-radius: 5px; margin-bottom: 15px; border-left: 4px solid #4caf50;">
  <strong>✅ Authorized:</strong> You have permission to restore the database
</div>

<div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin-bottom: 15px; border-left: 4px solid #ffc107;">
  <strong>⚠️ WARNING:</strong>
  <p style="margin: 10px 0 0 0; font-size: 14px;">
    Restoring will <strong>replace all current data</strong> with data from the backup file.
    <br><br>
    Make sure you:
    <ul style="margin: 10px 0; padding-left: 20px;">
      <li>Have selected the correct backup file</li>
      <li>Have a recent backup of current data</li>
      <li>Are authorized to restore data</li>
    </ul>
  </p>
</div>

<div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin-bottom: 15px; border-left: 4px solid #2196f3;">
  <strong>Instructions:</strong>
  <p style="margin: 10px 0; font-size: 13px;">
    1. Click "Select Backup File" below<br>
    2. Choose your backup file (church_backup_YYYY-MM-DD-HH-MM-SS.json)<br>
    3. Review the data preview<br>
    4. Click "Confirm Restore" to proceed<br>
  </p>
</div>

<label><strong>Select Backup File:</strong></label>
<input type="file" id="restoreFile" accept=".json" style="margin: 10px 0; display: block; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">

<div id="restorePreview" style="margin: 15px 0;"></div>

<button onclick="restoreDatabase()" style="padding: 10px 20px; background: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">⬆️ Confirm Restore</button>
<button onclick="loadReports()" style="padding: 10px 20px; background: #999; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>

`)

// Add file input listener to show preview
document.getElementById("restoreFile").addEventListener("change", function(e){
  const file = e.target.files[0]
  if(!file) return

  const reader = new FileReader()
  reader.onload = function(event){
    try {
      const backup = JSON.parse(event.target.result)

      let preview = '<div style="background: #f0f4ff; padding: 12px; border-radius: 4px; margin-bottom: 15px;">'
      preview += '<strong>📋 Backup Contents Preview:</strong><br>'
      preview += `<ul style="margin: 10px 0; padding-left: 20px;">`
      preview += `<li><strong>Members:</strong> ${backup.members ? backup.members.length : 0} records</li>`
      preview += `<li><strong>Income/Collections:</strong> ${backup.income ? backup.income.length : 0} records</li>`
      preview += `<li><strong>Expenses:</strong> ${backup.expense ? backup.expense.length : 0} records</li>`
      preview += `<li><strong>Budgets:</strong> ${backup.budget ? backup.budget.length : 0} records</li>`
      preview += `</ul>`
      preview += '<p style="font-size: 12px; color: #666; margin-top: 10px;">✅ File is valid and ready to restore</p>'
      preview += '</div>'

      document.getElementById("restorePreview").innerHTML = preview

    } catch(error) {
      document.getElementById("restorePreview").innerHTML = '<div style="background: #ffebee; padding: 12px; border-radius: 4px; color: #c62828; border-left: 4px solid #c62828;">❌ Invalid backup file. Please select a valid church_backup.json file.</div>'
    }
  }
  reader.readAsText(file)
})

}

/* RESTORE DATABASE */
async function restoreDatabase(){

const fileInput = document.getElementById("restoreFile")
if(!fileInput || !fileInput.files[0]){
  alert("Please select a backup file")
  return
}

const confirmed = confirm("⚠️ IMPORTANT: This will replace ALL current data with the backup.\n\nAre you absolutely sure you want to proceed?")
if(!confirmed) return

const file = fileInput.files[0]

try {
  const text = await file.text()
  const backup = JSON.parse(text)

  show(`

  <h2>Restoring Database...</h2>

  <div style="background: #f0f4ff; padding: 15px; border-radius: 5px; text-align: center;">
    <p>Restoring data from backup. Please wait...</p>
    <p style="font-size: 12px; color: #666; margin-top: 10px;">Do not refresh the page or navigate away.</p>
  </div>

  `)

  // Restore members
  if(backup.members && backup.members.length > 0){
    for(const member of backup.members){
      try {
        await db.collection("members").add(member)
      } catch(e) {
        console.warn("Error restoring member:", e)
      }
    }
  }

  // Restore income
  if(backup.income && backup.income.length > 0){
    for(const inc of backup.income){
      try {
        // Convert timestamp if needed
        if(inc.CreateDate && typeof inc.CreateDate === 'object' && inc.CreateDate.seconds){
          inc.CreateDate = new Date(inc.CreateDate.seconds * 1000)
        }
        if(inc.CollectionDate && typeof inc.CollectionDate === 'string'){
          inc.CollectionDate = new Date(inc.CollectionDate)
        }
        await db.collection("income").add(inc)
      } catch(e) {
        console.warn("Error restoring income:", e)
      }
    }
  }

  // Restore expenses
  if(backup.expense && backup.expense.length > 0){
    for(const exp of backup.expense){
      try {
        if(exp.PaymentDate && typeof exp.PaymentDate === 'string'){
          exp.PaymentDate = new Date(exp.PaymentDate)
        }
        if(exp.CreatedDate && typeof exp.CreatedDate === 'object' && exp.CreatedDate.seconds){
          exp.CreatedDate = new Date(exp.CreatedDate.seconds * 1000)
        }
        await db.collection("expense").add(exp)
      } catch(e) {
        console.warn("Error restoring expense:", e)
      }
    }
  }

  // Restore budgets
  if(backup.budget && backup.budget.length > 0){
    for(const bud of backup.budget){
      try {
        await db.collection("budget").add(bud)
      } catch(e) {
        console.warn("Error restoring budget:", e)
      }
    }
  }

  // Restore users
  if(backup.users && backup.users.length > 0){
    for(const user of backup.users){
      try {
        if(user.created_at && typeof user.created_at === 'object' && user.created_at.seconds){
          user.created_at = new Date(user.created_at.seconds * 1000)
        }
        if(user.updated_at && typeof user.updated_at === 'object' && user.updated_at.seconds){
          user.updated_at = new Date(user.updated_at.seconds * 1000)
        }
        await db.collection("users").add(user)
      } catch(e) {
        console.warn("Error restoring user:", e)
      }
    }
  }

  // Restore events
  if(backup.events && backup.events.length > 0){
    for(const evt of backup.events){
      try {
        if(evt.startDate && typeof evt.startDate === 'string'){
          evt.startDate = new Date(evt.startDate)
        }
        if(evt.endDate && typeof evt.endDate === 'string'){
          evt.endDate = new Date(evt.endDate)
        }
        await db.collection("events").add(evt)
      } catch(e) {
        console.warn("Error restoring event:", e)
      }
    }
  }

  // Restore event registrations
  if(backup.eventRegistrations && backup.eventRegistrations.length > 0){
    for(const reg of backup.eventRegistrations){
      try {
        if(reg.registeredDate && typeof reg.registeredDate === 'string'){
          reg.registeredDate = new Date(reg.registeredDate)
        }
        await db.collection("eventRegistrations").add(reg)
      } catch(e) {
        console.warn("Error restoring event registration:", e)
      }
    }
  }

  // Restore bank transactions
  if(backup.bank_transactions && backup.bank_transactions.length > 0){
    for(const trans of backup.bank_transactions){
      try {
        if(trans.CreateDate && typeof trans.CreateDate === 'object' && trans.CreateDate.seconds){
          trans.CreateDate = new Date(trans.CreateDate.seconds * 1000)
        }
        await db.collection("bank_transactions").add(trans)
      } catch(e) {
        console.warn("Error restoring bank transaction:", e)
      }
    }
  }

  // Restore receipts
  if(backup.receipts && backup.receipts.length > 0){
    for(const receipt of backup.receipts){
      try {
        if(receipt.UploadedAt && typeof receipt.UploadedAt === 'object' && receipt.UploadedAt.seconds){
          receipt.UploadedAt = new Date(receipt.UploadedAt.seconds * 1000)
        }
        await db.collection("receipts").add(receipt)
      } catch(e) {
        console.warn("Error restoring receipt:", e)
      }
    }
  }

  // Log restore to audit trail
  const currentUser = getCurrentUser()
  const auditEmail = (currentUser && currentUser.userEmail) ? currentUser.userEmail : "system"
  const auditName = (currentUser && currentUser.userName) ? currentUser.userName : "Unknown User"

  try {
    await db.collection("backup_audit_trail").add({
      action: "RESTORE",
      timestamp: new Date(),
      performed_by: auditName,
      performed_by_email: auditEmail,
      filename: file.name,
      tables_restored: Object.keys(backup).filter(key => backup[key] && backup[key].length > 0),
      table_record_counts: {
        members: backup.members ? backup.members.length : 0,
        income: backup.income ? backup.income.length : 0,
        expense: backup.expense ? backup.expense.length : 0,
        budget: backup.budget ? backup.budget.length : 0,
        users: backup.users ? backup.users.length : 0,
        events: backup.events ? backup.events.length : 0,
        eventRegistrations: backup.eventRegistrations ? backup.eventRegistrations.length : 0,
        bank_transactions: backup.bank_transactions ? backup.bank_transactions.length : 0,
        receipts: backup.receipts ? backup.receipts.length : 0
      },
      status: "success",
      details: "Database restore completed successfully"
    })
  } catch(auditError) {
    console.warn("Error logging restore to audit trail:", auditError)
  }

  // Summary of restored data
  const summary = `✅ Complete Database Restore Successful!\n\nRestored Collections:\n✅ Members: ${backup.members ? backup.members.length : 0}\n✅ Income: ${backup.income ? backup.income.length : 0}\n✅ Expenses: ${backup.expense ? backup.expense.length : 0}\n✅ Budgets: ${backup.budget ? backup.budget.length : 0}\n✅ Users: ${backup.users ? backup.users.length : 0}\n✅ Events: ${backup.events ? backup.events.length : 0}\n✅ Registrations: ${backup.eventRegistrations ? backup.eventRegistrations.length : 0}\n✅ Bank Transactions: ${backup.bank_transactions ? backup.bank_transactions.length : 0}\n✅ Receipts: ${backup.receipts ? backup.receipts.length : 0}`

  alert(summary)

  loadReports()

} catch(error) {
  // Log failed restore to audit trail
  const currentUser = getCurrentUser()
  const auditEmail = (currentUser && currentUser.userEmail) ? currentUser.userEmail : "system"
  const auditName = (currentUser && currentUser.userName) ? currentUser.userName : "Unknown User"

  try {
    await db.collection("backup_audit_trail").add({
      action: "RESTORE",
      timestamp: new Date(),
      performed_by: auditName,
      performed_by_email: auditEmail,
      filename: file.name,
      status: "failed",
      details: error.message
    })
  } catch(auditError) {
    console.warn("Error logging failed restore to audit trail:", auditError)
  }

  alert("❌ Restore Failed:\n\n" + error.message + "\n\nMake sure you selected a valid backup file.")
  showRestoreDialog()
}

}

//
async function generateMemberPDF(memberId){

const memberDoc = await db.collection("members").doc(memberId).get()
const member = memberDoc.data()

const incomeSnap = await db.collection("income")
.where("MemberID","==",memberId)
.get()

let total=0
let rows=""

incomeSnap.forEach(doc=>{

const d=doc.data()

total+=d.Amount

rows+=`${d.Purpose} - $${d.Amount}\n`

})

const { jsPDF } = window.jspdf

const pdf = new jsPDF()

pdf.text("Church Contribution Statement",20,20)

pdf.text(`Member: ${member.Name}`,20,40)

pdf.text(rows,20,60)

pdf.text(`Total Contribution: $${total}`,20,200)

pdf.save(member.Name+"_statement.pdf")

}

/* SHOW CONTRIBUTION STATEMENT GENERATOR */
async function showContributionStatementGenerator(){

const currentYear = new Date().getFullYear()

const membersSnap = await db.collection("members").get()

let activeMembers = []

membersSnap.forEach(doc=>{
  const m = doc.data()
  if(m.Active){
    activeMembers.push({id: doc.id, name: m.Name})
  }
})

// Sort by name
activeMembers.sort((a, b) => a.name.localeCompare(b.name))

let memberOptions = ""

activeMembers.forEach(member=>{
  memberOptions += `<option value="${member.id}">${member.name}</option>`
})

show(`

<h2>Annual Contribution Statement</h2>

<p>Generate tax return contribution statements for members</p>

<label>Select Member:</label>
<select id="selectedMember" onchange="displayMemberContributions('${currentYear}')">
  <option value="">-- Select a member --</option>
  ${memberOptions}
  <option value="all">-- All Members --</option>
</select>

<br><br>

<label>Tax Year:</label>
<input type="number" id="taxYear" value="${currentYear}" onchange="displayMemberContributions(document.getElementById('taxYear').value)">

<br><br>

<div id="contributionsDisplay" style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px; display: none;">
  <h3>Member Contributions for <span id="displayYear">${currentYear}</span></h3>
  <div id="contributionsList"></div>
</div>

<br><br>

<button onclick="generateContributionStatement()">Generate PDF</button>

<button onclick="loadReports()">Cancel</button>

`)

}

/* GENERATE CONTRIBUTION STATEMENT PDF */
async function generateContributionStatement(){

const selectedMember = document.getElementById("selectedMember").value
const taxYear = parseInt(document.getElementById("taxYear").value)

if(!selectedMember){
  alert("Please select a member")
  return
}

if(selectedMember === "all"){
  // Generate for all active members
  await generateAllMembersStatement(taxYear)
} else {
  // Generate for single member
  await generateSingleMemberStatement(selectedMember, taxYear)
}

}

/* ADD SMALL LOGO TO PDF */
function addSmallLogoPDF(pdf, pageWidth){
  // Logo loading disabled - file not found
  // PDF continues without logo
}

/* GENERATE SINGLE MEMBER STATEMENT */
async function generateSingleMemberStatement(memberId, taxYear){

const memberDoc = await db.collection("members").doc(memberId).get()
const member = memberDoc.data()

const incomeSnap = await db.collection("income")
  .where("MemberID", "==", memberId)
  .get()

let totalContribution = 0
let contributions = []

incomeSnap.forEach(doc=>{
  const d = doc.data()
  // Parse date string as local date, not UTC
  const dateStr = d.CollectionDate
  const [year, month, day] = dateStr.split('-')
  const date = new Date(year, month - 1, day)

  // Filter by year
  if(date.getFullYear() === taxYear){
    totalContribution += d.Amount
    contributions.push({
      date: d.CollectionDate,
      purpose: d.Purpose,
      amount: d.Amount
    })
  }
})

// Sort by date
contributions.sort((a, b) => {
  const dateA = new Date(a.date)
  const dateB = new Date(b.date)
  return dateA - dateB
})

// Fetch Pastor and Treasurer names
const { pastorAndPresident, treasurer } = await getPastorAndTreasurerNames()

// Generate PDF
const { jsPDF } = window.jspdf

const pdf = new jsPDF()
const pageWidth = pdf.internal.pageSize.getWidth()
const pageHeight = pdf.internal.pageSize.getHeight()
let yPosition = 10

// Add logo image (from logo.png file)
try {
  const logoImg = new Image()
  logoImg.src = 'logo.png'

  // Add logo to left side
  pdf.addImage(logoImg, 'PNG', 12, 10, 25, 25)
} catch(e) {
  console.warn("Logo image not found, continuing without logo")
}

// Header text - positioned to the right of logo
yPosition = 12

// Organization Name (bold, larger)
pdf.setFontSize(13)
pdf.setFont(undefined, "bold")
pdf.text("The Boston Christian Assembly", 42, yPosition)

yPosition += 6

// Contact information (smaller)
pdf.setFontSize(9)
pdf.setFont(undefined, "normal")
pdf.text("26 Wellesley Road, Natick, MA 01760  |  Tel: 781-883-9708  |  www.bostonchristian.net", 42, yPosition)

yPosition = 40

// Salutation
pdf.setFontSize(10)
pdf.text("Dear " + member.Name.split(" ")[0] + ",", 20, yPosition)

yPosition += 8

// Letter content
pdf.setFontSize(10)
pdf.setFont(undefined, "normal")

const letterText1 = "The pastors and board members of the church thank you for your faithful support for the ongoing Ministries of the church."
pdf.text(letterText1, 20, yPosition, { maxWidth: pageWidth - 40 })
yPosition += 12

const letterText2 = `We have prepared the annual contribution for the year ${taxYear} from the records of the church. Please note that item 1 is the amount of total tax-deductible donations that were recorded by the church.`
pdf.text(letterText2, 20, yPosition, { maxWidth: pageWidth - 40 })
yPosition += 12

const letterText3 = "It is our prayer that the Lord will continue to bless you in your commitment to give sacrificially for the needs of the church."
pdf.text(letterText3, 20, yPosition, { maxWidth: pageWidth - 40 })
yPosition += 12

const letterText4 = "Yours in His Servants in Christ"
pdf.text(letterText4, 20, yPosition)

yPosition += 12

// Signatures with actual names
pdf.setFontSize(9)
pdf.setFont(undefined, "normal")

pdf.text("____________________", 20, yPosition)
yPosition += 5
pdf.text(pastorAndPresident, 20, yPosition)

yPosition -= 5
pdf.text("____________________", pageWidth - 50, yPosition)
yPosition += 5
pdf.text(treasurer, pageWidth - 50, yPosition)

yPosition += 15

// Receipt Table Section
const tableStartY = yPosition
const tableStartX = 20
const tableWidth = pageWidth - 40
const leftColWidth = tableWidth / 2
const rightColWidth = tableWidth / 2

// Draw table lines
const lineColor = [0, 0, 0]
pdf.setDrawColor(...lineColor)
pdf.setLineWidth(0.8)

// Outer box
pdf.rect(tableStartX, tableStartY, leftColWidth, 95)
pdf.rect(tableStartX + leftColWidth, tableStartY, rightColWidth, 95)

// Inner dividing lines - horizontal
pdf.line(tableStartX, tableStartY + 23, tableStartX + tableWidth, tableStartY + 23) // After org address
pdf.line(tableStartX, tableStartY + 40, tableStartX + tableWidth, tableStartY + 40) // After fed ID
pdf.line(tableStartX, tableStartY + 50, tableStartX + tableWidth, tableStartY + 50) // After SSN
pdf.line(tableStartX, tableStartY + 68, tableStartX + tableWidth, tableStartY + 68) // After donor name
pdf.line(tableStartX, tableStartY + 79, tableStartX + tableWidth, tableStartY + 79) // After street address
pdf.line(tableStartX + leftColWidth, tableStartY, tableStartX + leftColWidth, tableStartY + 95) // Middle column divide

// Inner dividing lines - vertical (for right column sub-sections, only in header labels)
const rightColStartX = tableStartX + leftColWidth
const col1Divide = rightColStartX + (rightColWidth / 3)  // Between "Total Tax" and "Year"
const col2Divide = rightColStartX + (2 * rightColWidth / 3)  // Between "Year" and "Annual Contribution"

pdf.line(col1Divide, tableStartY, col1Divide, tableStartY + 10)  // Vertical line 1 (header labels only)
pdf.line(col2Divide, tableStartY, col2Divide, tableStartY + 10)  // Vertical line 2 (header labels only)

// ...existing code...
pdf.setFontSize(8)
pdf.setFont(undefined, "bold")
pdf.text("RECIPIENT ORGANIZATION's", tableStartX + 2, tableStartY + 3)
pdf.text("Name & Address", tableStartX + 2, tableStartY + 6)

pdf.setFont(undefined, "normal")
pdf.text("The Boston Christian Assembly", tableStartX + 2, tableStartY + 12)
pdf.text("26 Wellesley Road,", tableStartX + 2, tableStartY + 15)
pdf.text("Natick, MA 01760", tableStartX + 2, tableStartY + 18)

// Federal ID section
pdf.setFont(undefined, "bold")
pdf.text("RECIPIENT ORGANIZATION's Federal", tableStartX + 2, tableStartY + 28)
pdf.text("Identification No.", tableStartX + 2, tableStartY + 31)

pdf.setFont(undefined, "normal")
pdf.text("04-3144979", tableStartX + 2, tableStartY + 37)

// Donor SSN section
pdf.setFont(undefined, "bold")
pdf.text("Donor's Social Security or C.I.D. No.", tableStartX + 2, tableStartY + 47)

// Donor Name section
pdf.setFont(undefined, "bold")
pdf.text("Donor's Name (First, Middle, Last):", tableStartX + 2, tableStartY + 58)
pdf.setFont(undefined, "normal")
pdf.text(member.Name, tableStartX + 2, tableStartY + 64)

// Street Address section
pdf.setFont(undefined, "bold")
pdf.text("Street Address:", tableStartX + 2, tableStartY + 72)
pdf.setFont(undefined, "normal")
if(member.Address1){
  pdf.text(member.Address1, tableStartX + 2, tableStartY + 78)
}

// City, State and Zip Code section
pdf.setFont(undefined, "bold")
pdf.text("City, State and Zip Code:", tableStartX + 2, tableStartY + 88)
pdf.setFont(undefined, "normal")
if(member.Address2){
  pdf.text(member.Address2, tableStartX + 2, tableStartY + 94)
}

// Add text inside table - RIGHT COLUMN
const rightColX = tableStartX + leftColWidth + 2

// Contribution headers - top section
pdf.setFontSize(7)
pdf.setFont(undefined, "bold")
pdf.text("1. Total Tax", rightColX, tableStartY + 3)
pdf.text("Deductible", rightColX, tableStartY + 5)
pdf.text("Contributions", rightColX, tableStartY + 7)

pdf.text("2. Year", rightColX + 30, tableStartY + 3)

pdf.text("3. Annual", rightColX + 55, tableStartY + 3)
pdf.text("Contribution", rightColX + 55, tableStartY + 5)
pdf.text("Record", rightColX + 55, tableStartY + 7)

// Contribution values
pdf.setFontSize(10)
pdf.setFont(undefined, "bold")
pdf.text(`$${totalContribution.toFixed(2)}`, rightColX, tableStartY + 15)
pdf.text(taxYear.toString(), rightColX + 30, tableStartY + 15)
pdf.text(`$${totalContribution.toFixed(2)}`, rightColX + 55, tableStartY + 15)

// Prepared by section
pdf.setFontSize(8)
pdf.setFont(undefined, "bold")
pdf.text("Prepared by", rightColX, tableStartY + 28)

pdf.setFont(undefined, "normal")
pdf.text("Treasurer", rightColX, tableStartY + 35)
pdf.text("Boston Christian Assembly", rightColX, tableStartY + 38)

yPosition = tableStartY + 100

// Disclaimer
pdf.setFontSize(8)
pdf.setFont(undefined, "normal")
const disclaimerText = "This information has not been submitted to the Internal Revenue Service. This information is not given with the intentions of offering tax advice or an explanation of the law."
pdf.text(disclaimerText, 20, yPosition, { maxWidth: pageWidth - 40 })

yPosition += 8

pdf.text(`Form 11(71-1997) Year End Contribution Receipt     |     File BCA/${taxYear}Receipts`, 20, yPosition)

// Save PDF
pdf.save(`${member.Name}_Contribution_Receipt_${taxYear}.pdf`)

alert(`Contribution receipt generated for ${member.Name}`)
loadReports()

}

/* GENERATE ALL MEMBERS STATEMENTS */
async function generateAllMembersStatement(taxYear){

const membersSnap = await db.collection("members").get()

let activeMembers = []

membersSnap.forEach(doc=>{
  const m = doc.data()
  if(m.Active){
    activeMembers.push({id: doc.id, data: m})
  }
})

const totalMembers = activeMembers.length

if(totalMembers === 0){
  alert("No active members found")
  return
}

let processedCount = 0

for(const member of activeMembers){
  const memberData = member.data

  const incomeSnap = await db.collection("income")
    .where("MemberID", "==", member.id)
    .get()

  let totalContribution = 0
  let contributions = []

  incomeSnap.forEach(doc=>{
    const d = doc.data()
    // Parse date string as local date, not UTC
    const dateStr = d.CollectionDate
    const [year, month, day] = dateStr.split('-')
    const date = new Date(year, month - 1, day)

    if(date.getFullYear() === taxYear){
      totalContribution += d.Amount
      contributions.push({
        date: d.CollectionDate,
        purpose: d.Purpose,
        amount: d.Amount
      })
    }
  })

  contributions.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateA - dateB
  })

  // Fetch Pastor and Treasurer names for each member's PDF
  const { pastorAndPresident, treasurer } = await getPastorAndTreasurerNames()

  // Generate PDF for this member
  const { jsPDF } = window.jspdf

  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  let yPosition = 10

  // Add logo image (from logo.png file)
  try {
    const logoImg = new Image()
    logoImg.src = 'logo.png'

    // Add logo to left side
    pdf.addImage(logoImg, 'PNG', 12, 10, 25, 25)
  } catch(e) {
    console.warn("Logo image not found, continuing without logo")
  }

  // Header text - positioned to the right of logo
  yPosition = 12

  // Organization Name (bold, larger)
  pdf.setFontSize(13)
  pdf.setFont(undefined, "bold")
  pdf.text("The Boston Christian Assembly", 42, yPosition)

  yPosition += 6

  // Contact information (smaller)
  pdf.setFontSize(9)
  pdf.setFont(undefined, "normal")
  pdf.text("26 Wellesley Road, Natick, MA 01760  |  Tel: 781-883-9708  |  www.bostonchristian.net", 42, yPosition)

  yPosition = 40

  // Salutation
  pdf.setFontSize(10)
  pdf.text("Dear " + memberData.Name.split(" ")[0] + ",", 20, yPosition)

  yPosition += 8

  // Letter content
  pdf.setFontSize(10)
  pdf.setFont(undefined, "normal")

  const letterText1 = "The pastors and board members of the church thank you for your faithful support for the ongoing Ministries of the church."
  pdf.text(letterText1, 20, yPosition, { maxWidth: pageWidth - 40 })
  yPosition += 12

  const letterText2 = `We have prepared the annual contribution for the year ${taxYear} from the records of the church. Please note that item 1 is the amount of total tax-deductible donations that were recorded by the church.`
  pdf.text(letterText2, 20, yPosition, { maxWidth: pageWidth - 40 })
  yPosition += 12

  const letterText3 = "It is our prayer that the Lord will continue to bless you in your commitment to give sacrificially for the needs of the church."
  pdf.text(letterText3, 20, yPosition, { maxWidth: pageWidth - 40 })
  yPosition += 12

  const letterText4 = "Yours in His Servants in Christ"
  pdf.text(letterText4, 20, yPosition)

  yPosition += 12

  // Signatures with actual names
  pdf.setFontSize(9)
  pdf.setFont(undefined, "normal")

  pdf.text("____________________", 20, yPosition)
  yPosition += 5
  pdf.text(pastorAndPresident, 20, yPosition)

  yPosition -= 5
  pdf.text("____________________", pageWidth - 50, yPosition)
  yPosition += 5
  pdf.text(treasurer, pageWidth - 50, yPosition)

  yPosition += 15

  // Receipt Table Section
  const tableStartY = yPosition
  const tableStartX = 20
  const tableWidth = pageWidth - 40
  const leftColWidth = tableWidth / 2
  const rightColWidth = tableWidth / 2

  // Draw table lines
  const lineColor = [0, 0, 0]
  pdf.setDrawColor(...lineColor)
  pdf.setLineWidth(0.8)

  // Outer borders for left and right columns
  pdf.rect(tableStartX, tableStartY, leftColWidth, 95)
  pdf.rect(tableStartX + leftColWidth, tableStartY, rightColWidth, 95)

  // Inner dividing lines - horizontal
  pdf.line(tableStartX, tableStartY + 23, tableStartX + tableWidth, tableStartY + 23)
  pdf.line(tableStartX, tableStartY + 40, tableStartX + tableWidth, tableStartY + 40)
  pdf.line(tableStartX, tableStartY + 50, tableStartX + tableWidth, tableStartY + 50)
  pdf.line(tableStartX, tableStartY + 68, tableStartX + tableWidth, tableStartY + 68)
  pdf.line(tableStartX, tableStartY + 79, tableStartX + tableWidth, tableStartY + 79)
  pdf.line(tableStartX + leftColWidth, tableStartY, tableStartX + leftColWidth, tableStartY + 95)

  // Inner dividing lines - vertical (for right column sub-sections, only in header labels)
  const rightColStartX = tableStartX + leftColWidth
  const col1Divide = rightColStartX + (rightColWidth / 3)  // Between "Total Tax" and "Year"
  const col2Divide = rightColStartX + (2 * rightColWidth / 3)  // Between "Year" and "Annual Contribution"

  pdf.line(col1Divide, tableStartY, col1Divide, tableStartY + 10)  // Vertical line 1 (header labels only)
  pdf.line(col2Divide, tableStartY, col2Divide, tableStartY + 10)  // Vertical line 2 (header labels only)

  // ...existing code...
  pdf.setFontSize(8)
  pdf.setFont(undefined, "bold")
  pdf.text("RECIPIENT ORGANIZATION's", tableStartX + 2, tableStartY + 3)
  pdf.text("Name & Address", tableStartX + 2, tableStartY + 6)

  pdf.setFont(undefined, "normal")
  pdf.text("The Boston Christian Assembly", tableStartX + 2, tableStartY + 12)
  pdf.text("26 Wellesley Road,", tableStartX + 2, tableStartY + 15)
  pdf.text("Natick, MA 01760", tableStartX + 2, tableStartY + 18)

  // Federal ID section
  pdf.setFont(undefined, "bold")
  pdf.text("RECIPIENT ORGANIZATION's Federal", tableStartX + 2, tableStartY + 28)
  pdf.text("Identification No.", tableStartX + 2, tableStartY + 31)

  pdf.setFont(undefined, "normal")
  pdf.text("04-3144979", tableStartX + 2, tableStartY + 37)

  // Donor SSN section
  pdf.setFont(undefined, "bold")
  pdf.text("Donor's Social Security or C.I.D. No.", tableStartX + 2, tableStartY + 47)

  // Donor Name section
  pdf.setFont(undefined, "bold")
  pdf.text("Donor's Name (First, Middle, Last):", tableStartX + 2, tableStartY + 58)
  pdf.setFont(undefined, "normal")
  pdf.text(memberData.Name, tableStartX + 2, tableStartY + 64)

  // Street Address section
  pdf.setFont(undefined, "bold")
  pdf.text("Street Address:", tableStartX + 2, tableStartY + 72)
  pdf.setFont(undefined, "normal")
  if(memberData.Address1){
    pdf.text(memberData.Address1, tableStartX + 2, tableStartY + 78)
  }

  // City, State and Zip Code section
  pdf.setFont(undefined, "bold")
  pdf.text("City, State and Zip Code:", tableStartX + 2, tableStartY + 88)
  pdf.setFont(undefined, "normal")
  if(memberData.Address2){
    pdf.text(memberData.Address2, tableStartX + 2, tableStartY + 94)
  }

  // Add text inside table - RIGHT COLUMN
  const rightColX = tableStartX + leftColWidth + 2

  // Contribution headers - top section
  pdf.setFontSize(7)
  pdf.setFont(undefined, "bold")
  pdf.text("1. Total Tax", rightColX, tableStartY + 3)
  pdf.text("Deductible", rightColX, tableStartY + 5)
  pdf.text("Contributions", rightColX, tableStartY + 7)

  pdf.text("2. Year", rightColX + 30, tableStartY + 3)

  pdf.text("3. Annual", rightColX + 55, tableStartY + 3)
  pdf.text("Contribution", rightColX + 55, tableStartY + 5)
  pdf.text("Record", rightColX + 55, tableStartY + 7)

  // Contribution values
  pdf.setFontSize(10)
  pdf.setFont(undefined, "bold")
  pdf.text(`$${totalContribution.toFixed(2)}`, rightColX, tableStartY + 15)
  pdf.text(taxYear.toString(), rightColX + 30, tableStartY + 15)
  pdf.text(`$${totalContribution.toFixed(2)}`, rightColX + 55, tableStartY + 15)

  // Prepared by section
  pdf.setFontSize(8)
  pdf.setFont(undefined, "bold")
  pdf.text("Prepared by", rightColX, tableStartY + 28)

  pdf.setFont(undefined, "normal")
  pdf.text("Treasurer", rightColX, tableStartY + 35)
  pdf.text("Boston Christian Assembly", rightColX, tableStartY + 38)

  yPosition = tableStartY + 100

  // Disclaimer
  pdf.setFontSize(8)
  pdf.setFont(undefined, "normal")
  const disclaimerText = "This information has not been submitted to the Internal Revenue Service. This information is not given with the intentions of offering tax advice or an explanation of the law."
  pdf.text(disclaimerText, 20, yPosition, { maxWidth: pageWidth - 40 })

  yPosition += 8

  pdf.text(`Form 11(71-1997) Year End Contribution Receipt     |     File BCA/${taxYear}Receipts`, 20, yPosition)

  // Save PDF
  pdf.save(`${memberData.Name}_Contribution_Receipt_${taxYear}.pdf`)

  processedCount++
}

alert(`Generated contribution statements for ${processedCount} members`)
loadReports()

}

/* DISPLAY MEMBER CONTRIBUTIONS */
async function displayMemberContributions(year){

const selectedMember = document.getElementById("selectedMember").value
const taxYear = parseInt(year)

// Hide contributions display if no member selected or "All Members" is selected
if(!selectedMember || selectedMember === "all"){
  document.getElementById("contributionsDisplay").style.display = "none"
  return
}

// Fetch member data
const memberDoc = await db.collection("members").doc(selectedMember).get()
const member = memberDoc.data()

// Fetch contributions for this member
const incomeSnap = await db.collection("income")
  .where("MemberID", "==", selectedMember)
  .get()

let totalContribution = 0
let contributions = []

incomeSnap.forEach(doc => {
  const d = doc.data()
  const dateStr = d.CollectionDate
  const [year, month, day] = dateStr.split('-')
  const date = new Date(year, month - 1, day)

  if(date.getFullYear() === taxYear){
    totalContribution += d.Amount
    contributions.push({
      date: d.CollectionDate,
      purpose: d.Purpose || "Contribution",
      amount: d.Amount
    })
  }
})

// Sort contributions by date
contributions.sort((a, b) => {
  const dateA = new Date(a.date)
  const dateB = new Date(b.date)
  return dateA - dateB
})

// Build contributions table
let contributionsHTML = ""

if(contributions.length === 0){
  contributionsHTML = `<p style="color: #666; font-style: italic;">No contributions found for ${taxYear}</p>`
} else {
  contributionsHTML = `
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
      <tr style="background: #e8e8e8; font-weight: bold;">
        <th style="padding: 8px; border: 1px solid #ccc; text-align: left;">Date</th>
        <th style="padding: 8px; border: 1px solid #ccc; text-align: left;">Purpose</th>
        <th style="padding: 8px; border: 1px solid #ccc; text-align: right;">Amount</th>
      </tr>
  `

  contributions.forEach(contrib => {
    const date = new Date(contrib.date)
    const dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
    contributionsHTML += `
      <tr>
        <td style="padding: 8px; border: 1px solid #ccc;">${dateStr}</td>
        <td style="padding: 8px; border: 1px solid #ccc;">${contrib.purpose}</td>
        <td style="padding: 8px; border: 1px solid #ccc; text-align: right;">$${contrib.amount.toFixed(2)}</td>
      </tr>
    `
  })

  contributionsHTML += `
      <tr style="background: #f0f0f0; font-weight: bold;">
        <td colspan="2" style="padding: 8px; border: 1px solid #ccc; text-align: right;">TOTAL:</td>
        <td style="padding: 8px; border: 1px solid #ccc; text-align: right;">$${totalContribution.toFixed(2)}</td>
      </tr>
    </table>
  `
}

// Display the contributions
document.getElementById("displayYear").innerText = taxYear
document.getElementById("contributionsList").innerHTML = contributionsHTML
document.getElementById("contributionsDisplay").style.display = "block"

}

/* GET PASTOR AND TREASURER NAMES */
async function getPastorAndTreasurerNames(){
  try {
    const usersSnap = await db.collection("users").where("current_record", "==", true).get()

    let pastorAndPresident = "____________________"
    let treasurer = "____________________"

    usersSnap.forEach(doc => {
      const user = doc.data()
      if(user.Role === "Pastor and President"){
        pastorAndPresident = user.Name || "____________________"
      } else if(user.Role === "Treasurer"){
        treasurer = user.Name || "____________________"
      }
    })

    return {
      pastorAndPresident: pastorAndPresident,
      treasurer: treasurer
    }
  } catch(error) {
    console.error("Error fetching pastor and treasurer names:", error)
    return {
      pastorAndPresident: "____________________",
      treasurer: "____________________"
    }
  }
}

/* SHOW BACKUP AUDIT TRAIL */
async function showBackupAuditTrail(){

show(`

<h2>Database Management Audit Trail</h2>

<p style="background:#e8f5e9; padding:12px; border-radius:4px; margin-bottom:15px;">
  📋 View all backup and restore operations performed on the database
</p>

<button onclick="loadReports()" style="margin-bottom:15px;">← Back to Reports</button>

<div id="auditTrailContent" style="background:#f5f5f5; padding:15px; border-radius:4px;">
  Loading audit trail data...
</div>

`)

try {
  const auditSnap = await db.collection("backup_audit_trail").orderBy("timestamp", "desc").get()

  if(auditSnap.empty){
    document.getElementById("auditTrailContent").innerHTML = '<p style="color:#666;">No backup or restore operations recorded yet</p>'
    return
  }

  let html = `
    <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
      <thead style="background:#667eea; color:white;">
        <tr>
          <th style="padding:10px; text-align:left; border:1px solid #ddd;">Action</th>
          <th style="padding:10px; text-align:left; border:1px solid #ddd;">Date & Time</th>
          <th style="padding:10px; text-align:left; border:1px solid #ddd;">Performed By</th>
          <th style="padding:10px; text-align:left; border:1px solid #ddd;">Email</th>
          <th style="padding:10px; text-align:left; border:1px solid #ddd;">Status</th>
          <th style="padding:10px; text-align:left; border:1px solid #ddd;">File</th>
          <th style="padding:10px; text-align:left; border:1px solid #ddd;">Details</th>
        </tr>
      </thead>
      <tbody>
  `

  auditSnap.forEach(doc => {
    const record = doc.data()
    const action = record.action || "Unknown"
    const timestamp = record.timestamp ? new Date(record.timestamp.toDate()).toLocaleString() : "N/A"
    const performedBy = record.performed_by || "Unknown"
    const email = record.performed_by_email || "N/A"
    const status = record.status || "Unknown"
    const statusColor = status === "success" ? "#4caf50" : status === "failed" ? "#d32f2f" : "#666"
    const filename = record.filename || "N/A"
    const details = record.details || "N/A"

    const actionColor = action === "BACKUP" ? "#38ef7d" : action === "RESTORE" ? "#2196f3" : "#999"

    html += `
      <tr>
        <td style="padding:10px; border:1px solid #ddd;"><span style="background:${actionColor}; color:white; padding:4px 8px; border-radius:3px;">${action}</span></td>
        <td style="padding:10px; border:1px solid #ddd; font-size:13px;">${timestamp}</td>
        <td style="padding:10px; border:1px solid #ddd;">${performedBy}</td>
        <td style="padding:10px; border:1px solid #ddd; font-size:12px;">${email}</td>
        <td style="padding:10px; border:1px solid #ddd;"><span style="background:${statusColor}; color:white; padding:4px 8px; border-radius:3px; font-size:12px;">${status.toUpperCase()}</span></td>
        <td style="padding:10px; border:1px solid #ddd; font-size:12px;">${filename}</td>
        <td style="padding:10px; border:1px solid #ddd; font-size:12px;">${details}</td>
      </tr>
    `

    // Add table details if available
    if(record.action === "BACKUP" && record.table_record_counts){
      const counts = record.table_record_counts
      html += `
        <tr style="background:#f9f9f9;">
          <td colspan="7" style="padding:10px; border:1px solid #ddd; font-size:12px;">
            <strong>Tables Backed Up:</strong>
            Members: ${counts.members || 0},
            Income: ${counts.income || 0},
            Expense: ${counts.expense || 0},
            Budget: ${counts.budget || 0},
            Users: ${counts.users || 0},
            Events: ${counts.events || 0},
            Registrations: ${counts.eventRegistrations || 0},
            Bank Transactions: ${counts.bank_transactions || 0},
            Receipts: ${counts.receipts || 0}
          </td>
        </tr>
      `
    }

    if(record.action === "RESTORE" && record.table_record_counts){
      const counts = record.table_record_counts
      html += `
        <tr style="background:#f9f9f9;">
          <td colspan="7" style="padding:10px; border:1px solid #ddd; font-size:12px;">
            <strong>Tables Restored:</strong>
            Members: ${counts.members || 0},
            Income: ${counts.income || 0},
            Expense: ${counts.expense || 0},
            Budget: ${counts.budget || 0},
            Users: ${counts.users || 0},
            Events: ${counts.events || 0},
            Registrations: ${counts.eventRegistrations || 0},
            Bank Transactions: ${counts.bank_transactions || 0},
            Receipts: ${counts.receipts || 0}
          </td>
        </tr>
      `
    }
  })

  html += `
      </tbody>
    </table>
  `

  document.getElementById("auditTrailContent").innerHTML = html

} catch(error) {
  console.error("Error loading audit trail:", error)
  document.getElementById("auditTrailContent").innerHTML = '<p style="color:#d32f2f;">Error loading audit trail: ' + error.message + '</p>'
}

}
