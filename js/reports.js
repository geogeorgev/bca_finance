function loadReports(){

show(`

<h2>Reports</h2>

<button onclick="collectionReport()">Collection Report</button>
<button onclick="expenseReport()">Expense Report</button>
<button onclick="showContributionStatementGenerator()">Annual Contribution Statement</button>

<div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
  <h3>Database Management</h3>
  <button onclick="backupDatabase()" style="background: #38ef7d; color: white; margin-right: 10px;">💾 Backup Database</button>
  <button onclick="showRestoreDialog()" style="background: #2196f3; color: white;">⬆️ Restore Database</button>
</div>`

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

const collections=["members","income","expense","budget"]

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

const a=document.createElement("a")

a.href=url
a.download="church_backup.json"
a.click()

alert("✅ Backup downloaded as 'church_backup.json'\n\nStore this file in a safe location for recovery purposes.")

}

/* SHOW RESTORE DIALOG */
function showRestoreDialog(){

show(`

<h2>Restore Database from Backup</h2>

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
    2. Choose your "church_backup.json" file<br>
    3. Review the data to be restored<br>
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

  alert("✅ Restore Complete!\n\nDatabase has been restored from backup.\n\nMembers: " + (backup.members ? backup.members.length : 0) + "\nIncome: " + (backup.income ? backup.income.length : 0) + "\nExpenses: " + (backup.expense ? backup.expense.length : 0) + "\nBudgets: " + (backup.budget ? backup.budget.length : 0))

  loadReports()

} catch(error) {
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
<select id="selectedMember">
  <option value="">-- Select a member --</option>
  ${memberOptions}
  <option value="all">-- All Members --</option>
</select>

<br><br>

<label>Tax Year:</label>
<input type="number" id="taxYear" value="${currentYear}">

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

// Generate PDF
const { jsPDF } = window.jspdf

const pdf = new jsPDF()
const pageWidth = pdf.internal.pageSize.getWidth()
const pageHeight = pdf.internal.pageSize.getHeight()
let yPosition = 20

// Add small logo to top right (commented out - logo file not available)
// addSmallLogoPDF(pdf, pageWidth)

yPosition = 20

// Header - Boston Christian Assembly
pdf.setFontSize(16)
pdf.setFont(undefined, "bold")
pdf.text("Boston Christian Assembly", pageWidth / 2, yPosition, { align: "center" })

yPosition += 8

pdf.setFontSize(12)
pdf.setFont(undefined, "bold")
pdf.text("ANNUAL CONTRIBUTION STATEMENT", pageWidth / 2, yPosition, { align: "center" })

yPosition += 8

pdf.setFontSize(10)
pdf.setFont(undefined, "normal")
pdf.text(`Tax Year: ${taxYear}`, pageWidth / 2, yPosition, { align: "center" })

yPosition += 15

// Member Information - simplified (no label)
pdf.setFont(undefined, "normal")
pdf.setFontSize(10)

pdf.text(`${member.Name}`, 20, yPosition)
yPosition += 7

if(member.Address1){
  pdf.text(`${member.Address1}`, 20, yPosition)
  yPosition += 7
}

if(member.Address2){
  pdf.text(`${member.Address2}`, 20, yPosition)
  yPosition += 7
}

if(member.Address3){
  pdf.text(`${member.Address3}`, 20, yPosition)
  yPosition += 7
}

yPosition += 5

// Contribution Summary
pdf.setFont(undefined, "bold")
pdf.setFontSize(11)
pdf.text("Contribution Summary", 20, yPosition)

yPosition += 8

pdf.setFont(undefined, "normal")
pdf.setFontSize(10)

pdf.text(`Total Contributions: $${totalContribution.toFixed(2)}`, 20, yPosition)
yPosition += 10

// Contribution Details Table
pdf.setFontSize(9)
pdf.setFont(undefined, "bold")

const columnX = [20, 60, 100, 150]

pdf.text("Date", columnX[0], yPosition)
pdf.text("Purpose", columnX[1], yPosition)
pdf.text("Amount", columnX[2], yPosition)

yPosition += 8

pdf.setFont(undefined, "normal")

contributions.forEach(contribution => {

  if(yPosition > pageHeight - 40){
    pdf.addPage()
    yPosition = 20
  }

  const date = new Date(contribution.date)
  const dateStr = date.toLocaleDateString()

  pdf.text(dateStr, columnX[0], yPosition)
  pdf.text(contribution.purpose, columnX[1], yPosition)
  pdf.text(`$${contribution.amount.toFixed(2)}`, columnX[2], yPosition)

  yPosition += 7
})

// Footer
pdf.setFont(undefined, "normal")
pdf.setFontSize(9)

// Left footer
pdf.text("Treasurer", 20, pageHeight - 15)
pdf.text("Boston Christian Assembly", 20, pageHeight - 10)

// Right footer
const treasurerX = pageWidth - 20
const churchX = pageWidth - 20

pdf.text("Pastor", treasurerX, pageHeight - 15, { align: "right" })
pdf.text("Boston Christian Assembly", churchX, pageHeight - 10, { align: "right" })

// Save PDF
pdf.save(`${member.Name}_Contribution_Statement_${taxYear}.pdf`)

alert(`Contribution statement generated for ${member.Name}`)
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

  // Generate PDF for this member
  const { jsPDF } = window.jspdf

  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  let yPosition = 20

  // Add small logo to top right (commented out - logo file not available)
  // addSmallLogoPDF(pdf, pageWidth)

  yPosition = 20

  // Header - Boston Christian Assembly
  pdf.setFontSize(16)
  pdf.setFont(undefined, "bold")
  pdf.text("Boston Christian Assembly", pageWidth / 2, yPosition, { align: "center" })

  yPosition += 8

  pdf.setFontSize(12)
  pdf.setFont(undefined, "bold")
  pdf.text("ANNUAL CONTRIBUTION STATEMENT", pageWidth / 2, yPosition, { align: "center" })

  yPosition += 8

  pdf.setFontSize(10)
  pdf.setFont(undefined, "normal")
  pdf.text(`Tax Year: ${taxYear}`, pageWidth / 2, yPosition, { align: "center" })

  yPosition += 15

  // Member Information - simplified (no label)
  pdf.setFont(undefined, "normal")
  pdf.setFontSize(10)

  pdf.text(`${memberData.Name}`, 20, yPosition)
  yPosition += 7

  if(memberData.Address1){
    pdf.text(`${memberData.Address1}`, 20, yPosition)
    yPosition += 7
  }

  if(memberData.Address2){
    pdf.text(`${memberData.Address2}`, 20, yPosition)
    yPosition += 7
  }

  if(memberData.Address3){
    pdf.text(`${memberData.Address3}`, 20, yPosition)
    yPosition += 7
  }

  yPosition += 5

  // Contribution Summary
  pdf.setFont(undefined, "bold")
  pdf.setFontSize(11)
  pdf.text("Contribution Summary", 20, yPosition)

  yPosition += 8

  pdf.setFont(undefined, "normal")
  pdf.setFontSize(10)

  pdf.text(`Total Contributions: $${totalContribution.toFixed(2)}`, 20, yPosition)
  yPosition += 10

  // Contribution Details Table
  pdf.setFontSize(9)
  pdf.setFont(undefined, "bold")

  pdf.text("Date", 20, yPosition)
  pdf.text("Purpose", 60, yPosition)
  pdf.text("Amount", 150, yPosition)

  yPosition += 8

  pdf.setFont(undefined, "normal")

  contributions.forEach(contribution => {

    if(yPosition > pageHeight - 40){
      pdf.addPage()
      yPosition = 20
    }

    const date = new Date(contribution.date)
    const dateStr = date.toLocaleDateString()

    pdf.text(dateStr, 20, yPosition)
    pdf.text(contribution.purpose, 60, yPosition)
    pdf.text(`$${contribution.amount.toFixed(2)}`, 150, yPosition)

    yPosition += 7
  })

  // Footer
  pdf.setFont(undefined, "normal")
  pdf.setFontSize(9)

  // Left footer
  pdf.text("Treasurer", 20, pageHeight - 15)
  pdf.text("Boston Christian Assembly", 20, pageHeight - 10)

  // Right footer
  const treasurerX = pageWidth - 20
  const churchX = pageWidth - 20

  pdf.text("Pastor", treasurerX, pageHeight - 15, { align: "right" })
  pdf.text("Boston Christian Assembly", churchX, pageHeight - 10, { align: "right" })

  // Save PDF
  pdf.save(`${memberData.Name}_Contribution_Statement_${taxYear}.pdf`)

  processedCount++
}

alert(`Generated contribution statements for ${processedCount} members`)
loadReports()

}
