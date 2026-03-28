async function loadExpense(){

show(`

<h2>Expense</h2>

<button onclick="showAddExpense()">Add Expense</button>
<button onclick="printExpense()">Print</button>

<br><br>

<table border="1" width="100%" id="expenseTable">

<thead>
<tr>
<th>Type</th>
<th>Member/Payee</th>
<th>Category</th>
<th>SubCategory</th>
<th>Amount</th>
<th>Payment Method</th>
<th>Check #</th>
<th>Description</th>
<th>Pay Date</th>
<th>Receipt</th>
</tr>
</thead>

<tbody id="expenseBody"></tbody>

</table>

`)

const currentYear = new Date().getFullYear()
const snap = await db.collection("expense").orderBy("PaymentDate", "desc").get()

let rows=""

snap.forEach(doc=>{

const e = doc.data()
const paymentDate = e.PaymentDate ? new Date(e.PaymentDate.toDate()) : null
const year = paymentDate ? paymentDate.getFullYear() : null

// Only show expenses for current year
if (year === currentYear) {
  const receiptCell = e.ReceiptDocID
    ? `<a href="#" onclick="viewReceipt('${e.ReceiptDocID}')" style="color:#2196f3; text-decoration:none; cursor:pointer;">📎 ${e.ReceiptFileName || 'View Receipt'}</a>`
    : e.ReceiptUrl
      ? `<a href="${e.ReceiptUrl}" target="_blank" style="color:#2196f3; text-decoration:none;">📎 ${e.ReceiptFileName || 'View'}</a>`
      : '<span style="color:#ccc;">—</span>'

  rows+=`

  <tr>

  <td>${e.Type || "N/A"}</td>

  <td>${e.MemberName || e.PayeeName || ""}</td>

  <td>${e.Category || ""}</td>

  <td>${e.SubCategory || ""}</td>

  <td>${e.Amount}</td>

  <td>${e.PaymentMethod || "N/A"}</td>

  <td>${e.CheckNumber || ""}</td>

  <td>${e.Description || ""}</td>

  <td>${paymentDate ? paymentDate.toLocaleDateString() : ""}</td>

  <td>${receiptCell}</td>

  </tr>

  `
}

})

document.getElementById("expenseBody").innerHTML=rows

}

/* SHOW ADD EXPENSE SCREEN */

async function showAddExpense(){

const memberDropdownHtml = await memberDropdown()

const currentYear = new Date().getFullYear()
const budgetSnap = await db.collection("budget").get()

// Get all available years from budgets
let yearsSet = new Set()
let categoryOptions = ""
let categorySet = new Set()

budgetSnap.forEach(doc=>{

const b = doc.data()
// Extract year from BudgetID
const year = b.BudgetID ? b.BudgetID.split("-")[0] : currentYear.toString()
yearsSet.add(year)

// Initially populate categories for current year
if (year === currentYear.toString() && !categorySet.has(b.Category)) {
  categoryOptions += `<option value="${b.Category}">${b.Category}</option>`
  categorySet.add(b.Category)
}

})

const years = Array.from(yearsSet).sort().reverse()
let yearOptions = ""
years.forEach(year => {
  yearOptions += `<option value="${year}" ${year === currentYear.toString() ? 'selected' : ''}>${year}</option>`
})

show(`

<h2>Add Expense</h2>

Budget Year<br>
<select id="budgetYear" onchange="updateCategoriesForYear()">
${yearOptions}
</select><br><br>

Type<br>
<select id="expenseType" onchange="togglePayeeField()">
<option value="member">Member</option>
<option value="nonmember">Non-Member</option>
</select><br><br>

<div id="memberField" style="display:block;">
Member Name<br>
${memberDropdownHtml}
<br><br>
</div>

<div id="payeeField" style="display:none;">
Payee Name<br>
<input id="payee" placeholder="Payee Name"><br><br>
</div>

Budget Category<br>
<select id="budgetCategory" onchange="loadSubCategories()">
<option value="">-- Select Category --</option>
${categoryOptions}
</select><br><br>

Budget SubCategory<br>
<select id="budgetSubCategory"></select><br><br>

Amount<br>
<input id="amount" type="number" placeholder="Amount"><br><br>

Pay Date<br>
<input id="payDate" type="date"><br><br>

Payment Method<br>
<select id="paymentMethod" onchange="toggleCheckNumber()">
<option value="cash">Cash</option>
<option value="check">Check</option>
</select><br><br>

<div id="checkNumberField" style="display:none;">
Check Number<br>
<input id="checkNumber" placeholder="Check Number"><br><br>
</div>

Expense Description<br>
<textarea id="description" placeholder="Enter expense description" style="width:100%; padding:8px; margin:6px 0; border:1px solid #ccc; border-radius:4px; font-family:Arial;" rows="3"></textarea><br><br>

Upload Receipt (Optional)<br>
<input type="file" id="receiptFile" accept="image/*,.pdf" style="margin: 6px 0;"><br>
<small style="color: #666;">Accepted: Images (JPG, PNG) or PDF files</small><br><br>

<button onclick="addExpense()">Save Expense</button>

<button onclick="loadExpense()">Cancel</button>

`)

// Set today's date as default
const today = new Date().toISOString().split('T')[0]
document.getElementById("payDate").value = today

// Load initial subcategories
await loadSubCategories()

}

//
async function addExpense(){

const expenseType = document.getElementById("expenseType").value
const budgetYear = document.getElementById("budgetYear").value
let memberName = ""

if(expenseType === "member"){
  const memberSelect = document.getElementById("memberSelect")
  const selectedOption = memberSelect.options[memberSelect.selectedIndex]
  memberName = selectedOption.text
}

const payeeName = document.getElementById("payee").value
const category = document.getElementById("budgetCategory").value
const subCategory = document.getElementById("budgetSubCategory").value
const amount = Number(document.getElementById("amount").value)
const payDate = document.getElementById("payDate").value
const paymentMethod = document.getElementById("paymentMethod").value
const checkNumber = document.getElementById("checkNumber").value
const description = document.getElementById("description").value
const receiptFile = document.getElementById("receiptFile").files[0]

if(!category || !subCategory){
  alert("Please select Budget Category and SubCategory")
  return
}

if(!amount || amount <= 0){
  alert("Please enter a valid amount")
  return
}

// Upload receipt if file selected
let receiptDocId = null
let receiptFileName = null

if(receiptFile){
  // Max ~700KB file → ~950KB base64 — stays under Firestore's 1MB doc limit
  const maxSize = 700 * 1024
  if(receiptFile.size > maxSize){
    alert(`Receipt file is too large (${(receiptFile.size/1024).toFixed(0)}KB).\nPlease use a file under 700KB.\nTip: Compress the image or PDF before uploading.`)
    // Continue saving expense without receipt
  } else {
    try {
      // Read file as Base64 data URL
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => resolve(e.target.result)
        reader.onerror = reject
        reader.readAsDataURL(receiptFile)
      })

      // Save to separate 'receipts' collection to keep expense docs lightweight
      const receiptRef = db.collection("receipts").doc()
      await receiptRef.set({
        FileName: receiptFile.name,
        FileType: receiptFile.type,
        FileSizeKB: Math.round(receiptFile.size / 1024),
        Data: base64Data,
        BudgetYear: budgetYear,
        UploadedAt: new Date()
      })

      receiptDocId = receiptRef.id
      receiptFileName = receiptFile.name
      console.log("Receipt saved to Firestore:", receiptDocId)

    } catch(error){
      console.error("Error saving receipt:", error)
      alert("Failed to save receipt. Expense will be saved without receipt.")
    }
  }
}

// Add expense to database
await db.collection("expense").add({
  Type: expenseType,
  MemberName: expenseType === "member" ? memberName : null,
  PayeeName: expenseType === "nonmember" ? payeeName : null,
  Category: category,
  SubCategory: subCategory,
  Amount: amount,
  PaymentDate: new Date(payDate),
  PaymentMethod: paymentMethod,
  CheckNumber: paymentMethod === "check" ? checkNumber : null,
  Description: description,
  BudgetYear: budgetYear,
  ReceiptDocID: receiptDocId,
  ReceiptFileName: receiptFileName,
  CreatedDate: new Date()
})

/* UPDATE BUDGET BALANCE */

const budgetSnap = await db.collection("budget")
  .where("Category", "==", category)
  .where("SubCategory", "==", subCategory)
  .get()

if(!budgetSnap.empty){
  // Find the budget for the selected year
  let budgetDoc = null
  budgetSnap.forEach(doc=>{
    const b = doc.data()
    const year = b.BudgetID ? b.BudgetID.split("-")[0] : new Date().getFullYear().toString()
    if(year === budgetYear){
      budgetDoc = doc
    }
  })

  if(budgetDoc){
    const budgetRef = db.collection("budget").doc(budgetDoc.id)
    const budget = budgetDoc.data()

    const spent = budget.Spent || 0
    const total = budget.BudgetAmount

    const newSpent = spent + amount

    await budgetRef.update({
      Spent: newSpent,
      Balance: total - newSpent
    })
  }
}

alert("Expense Saved" + (receiptDocId ? " with Receipt" : ""))
loadExpense()

}


/* LOAD SUB CATEGORIES BASED ON SELECTED CATEGORY */

async function loadSubCategories(){

const currentYear = new Date().getFullYear()
const selectedYear = document.getElementById("budgetYear") ? document.getElementById("budgetYear").value : currentYear.toString()
const category = document.getElementById("budgetCategory").value

const snap = await db.collection("budget")
  .where("Category", "==", category)
  .get()

let html = "<select id='budgetSubCategory'>"

snap.forEach(doc=>{

const b = doc.data()
// Extract year from BudgetID
const year = b.BudgetID ? b.BudgetID.split("-")[0] : currentYear.toString()

// Include subcategories for selected year (both active and inactive)
if (year === selectedYear) {
  html += `<option value="${b.SubCategory}">${b.SubCategory}</option>`
}

})

html += "</select>"

document.getElementById("budgetSubCategory").innerHTML = html

}

/* UPDATE CATEGORIES WHEN BUDGET YEAR IS CHANGED */

async function updateCategoriesForYear(){

const budgetYear = document.getElementById("budgetYear").value
const budgetSnap = await db.collection("budget").get()

let categorySet = new Set()
let categoryOptions = "<option value=''>-- Select Category --</option>"

budgetSnap.forEach(doc=>{
  const b = doc.data()
  const year = b.BudgetID ? b.BudgetID.split("-")[0] : new Date().getFullYear().toString()

  if(year === budgetYear && !categorySet.has(b.Category)){
    categoryOptions += `<option value="${b.Category}">${b.Category}</option>`
    categorySet.add(b.Category)
  }
})

document.getElementById("budgetCategory").innerHTML = categoryOptions
document.getElementById("budgetSubCategory").innerHTML = "<select id='budgetSubCategory'></select>"

}

/* TOGGLE PAYEE FIELD VISIBILITY */

function togglePayeeField(){

const type = document.getElementById("expenseType").value

if(type === "member"){

document.getElementById("memberField").style.display = "block"

document.getElementById("payeeField").style.display = "none"

} else {

document.getElementById("memberField").style.display = "none"

document.getElementById("payeeField").style.display = "block"

}

}

/* TOGGLE CHECK NUMBER FIELD VISIBILITY */

function toggleCheckNumber(){

const method = document.getElementById("paymentMethod").value

if(method === "check"){

document.getElementById("checkNumberField").style.display = "block"

} else {

document.getElementById("checkNumberField").style.display = "none"

}

}

/* PRINT EXPENSE */

function printExpense(){

const table = document.getElementById("expenseTable").outerHTML

const win = window.open("")

win.document.write(`

<h2>Church Expense Report</h2>

${table}

`)

win.print()

}


/* VIEW RECEIPT - Fetch base64 from Firestore and open in new tab */

async function viewReceipt(receiptDocId){
  try {
    const doc = await db.collection("receipts").doc(receiptDocId).get()
    if(!doc.exists){
      alert("Receipt not found.")
      return
    }
    const r = doc.data()
    const win = window.open("", "_blank")

    if(r.FileType && r.FileType.startsWith("image/")){
      win.document.write(`
        <!DOCTYPE html><html><head><title>${r.FileName || 'Receipt'}</title></head>
        <body style="margin:0; background:#222; display:flex; justify-content:center; align-items:flex-start; min-height:100vh; padding:20px; box-sizing:border-box;">
          <img src="${r.Data}" style="max-width:100%; border-radius:4px; box-shadow:0 2px 12px rgba(0,0,0,0.5);" alt="${r.FileName || 'Receipt'}">
        </body></html>
      `)
    } else {
      // PDF or other — embed in iframe
      win.document.write(`
        <!DOCTYPE html><html><head><title>${r.FileName || 'Receipt'}</title></head>
        <body style="margin:0;">
          <iframe src="${r.Data}" style="width:100vw; height:100vh; border:none;"></iframe>
        </body></html>
      `)
    }
    win.document.close()
  } catch(error){
    console.error("Error loading receipt:", error)
    alert("Failed to load receipt.")
  }
}

