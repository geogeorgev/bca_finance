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
</tr>
</thead>

<tbody id="expenseBody"></tbody>

</table>

`)

const snap = await db.collection("expense").orderBy("PaymentDate", "desc").get()

let rows=""

snap.forEach(doc=>{

const e = doc.data()

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

<td>${e.PaymentDate ? new Date(e.PaymentDate.toDate()).toLocaleDateString() : ""}</td>

</tr>

`

})

document.getElementById("expenseBody").innerHTML=rows

}

/* SHOW ADD EXPENSE SCREEN */

async function showAddExpense(){

const memberDropdownHtml = await memberDropdown()

const budgetSnap = await db.collection("budget").get()

let categoryOptions = ""

budgetSnap.forEach(doc=>{

const b = doc.data()

categoryOptions += `<option value="${b.Category}">${b.Category}</option>`

})

show(`

<h2>Add Expense</h2>

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

if(!category || !subCategory){
  alert("Please select Budget Category and SubCategory")
  return
}

if(!amount || amount <= 0){
  alert("Please enter a valid amount")
  return
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
  Description: description
})

/* UPDATE BUDGET BALANCE */

const budgetSnap = await db.collection("budget")
  .where("Category", "==", category)
  .where("SubCategory", "==", subCategory)
  .get()

if(!budgetSnap.empty){
  const budgetDoc = budgetSnap.docs[0]
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

alert("Expense Saved and Budget Updated")
loadExpense()

}


/* LOAD SUB CATEGORIES BASED ON SELECTED CATEGORY */

async function loadSubCategories(){

const category = document.getElementById("budgetCategory").value

const snap = await db.collection("budget")
  .where("Category", "==", category)
  .get()

let html = "<select id='budgetSubCategory'>"

snap.forEach(doc=>{

const b = doc.data()

html += `<option value="${b.SubCategory}">${b.SubCategory}</option>`

})

html += "</select>"

document.getElementById("budgetSubCategory").innerHTML = html

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
