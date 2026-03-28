async function loadBudget(){

show(`

<h2>Budget</h2>

<button onclick="showAddBudget()">Add Budget</button>
<button onclick="printBudget()">Print</button>
<button onclick="showBulkActivation()">Manage Year Status</button>

<br><br>

<div id="budgetYears"></div>

`)

const snap = await db.collection("budget").get()

let budgetsByYear = {}
let budgetsByYearAndCategory = {}

// Group budgets by year (extracted from BudgetID) and category
snap.forEach(doc=>{
  const b = doc.data()
  // Extract year from BudgetID (e.g., "2026-Missions" -> "2026")
  const year = b.BudgetID ? b.BudgetID.split("-")[0] : new Date().getFullYear().toString()
  const category = b.Category

  if (!budgetsByYear[year]) {
    budgetsByYear[year] = []
    budgetsByYearAndCategory[year] = {}
  }

  // Store both data AND document ID
  budgetsByYear[year].push({...b, docId: doc.id})

  if (!budgetsByYearAndCategory[year][category]) {
    budgetsByYearAndCategory[year][category] = []
  }

  budgetsByYearAndCategory[year][category].push({...b, docId: doc.id})
})

// Create tables for each year
let yearsHtml = ""
const sortedYears = Object.keys(budgetsByYear).sort().reverse()

for (const year of sortedYears) {
  let tableHtml = `
  <h3>Budget Year ${year}</h3>
  <table border="1" width="100%" class="budgetTable">
  <thead>
  <tr>
  <th>BudgetID</th>
  <th>Status</th>
  <th>Category</th>
  <th>SubCategory</th>
  <th>BudgetAmount</th>
  <th>Spent</th>
  <th>Balance</th>
  <th>Actions</th>
  </tr>
  </thead>
  <tbody>
  `

  let yearBudgetTotal = 0
  let yearSpentTotal = 0
  let yearBalanceTotal = 0

  const categoriesForYear = budgetsByYearAndCategory[year]

  for (const category in categoriesForYear) {
    const items = categoriesForYear[category]
    let categoryBudgetTotal = 0
    let categorySpentTotal = 0
    let categoryBalanceTotal = 0

    // Add individual items for this category
    items.forEach(b => {
      const budgetAmount = b.BudgetAmount || 0
      const spent = b.Spent || 0
      const balance = b.Balance || (budgetAmount - spent)
      const status = b.BudgetStatus || "Inactive"
      const docId = b.docId

      categoryBudgetTotal += budgetAmount
      categorySpentTotal += spent
      categoryBalanceTotal += balance

      tableHtml += `
      <tr>
        <td>${b.BudgetID || ""}</td>
        <td style="font-weight: bold; color: ${status === 'Active' ? 'green' : 'red'}">${status}</td>
        <td>${b.Category}</td>
        <td>${b.SubCategory}</td>
        <td>${budgetAmount}</td>
        <td>${spent}</td>
        <td>${balance}</td>
        <td>
          <button onclick="toggleBudgetStatus('${docId}', '${status}')">
            ${status === 'Active' ? 'Deactivate' : 'Activate'}
          </button>
        </td>
      </tr>
      `
    })

    // Add category summary row
    tableHtml += `
    <tr style="background-color: #e8e8e8; font-weight: bold;">
      <td colspan="3">${category} TOTAL</td>
      <td></td>
      <td>${categoryBudgetTotal}</td>
      <td>${categorySpentTotal}</td>
      <td>${categoryBalanceTotal}</td>
      <td></td>
    </tr>
    `

    yearBudgetTotal += categoryBudgetTotal
    yearSpentTotal += categorySpentTotal
    yearBalanceTotal += categoryBalanceTotal
  }

  // Add year grand total row
  tableHtml += `
  <tr style="background-color: #d4d4d4; font-weight: bold; font-size: 14px;">
    <td colspan="3">GRAND TOTAL (${year})</td>
    <td></td>
    <td>${yearBudgetTotal}</td>
    <td>${yearSpentTotal}</td>
    <td>${yearBalanceTotal}</td>
    <td></td>
  </tr>
  </tbody>
  </table>
  <br><br>
  `

  yearsHtml += tableHtml
}

document.getElementById("budgetYears").innerHTML = yearsHtml

}



/* ADD BUDGET SCREEN */

function showAddBudget(){

show(`

<h2>Add Budget</h2>

BudgetID<br>
<input id="budgetID"><br><br>

Category<br>
<input id="category"><br><br>

SubCategory<br>
<input id="subcategory"><br><br>

Budget Amount<br>
<input id="amount" type="number"><br><br>

BudgetStatus<br>
<select id="budgetStatus">
  <option value="Inactive">Inactive</option>
  <option value="Active">Active</option>
</select><br><br>

<button onclick="addBudget()">Save Budget</button>

<button onclick="loadBudget()">Cancel</button>

`)

}



/* SAVE BUDGET */

async function addBudget(){

const amount =
Number(document.getElementById("amount").value)

await db.collection("budget").add({

BudgetID:
document.getElementById("budgetID").value,

Category:
document.getElementById("category").value,

SubCategory:
document.getElementById("subcategory").value,

BudgetAmount: amount,

Spent:0,

Balance:amount,

BudgetStatus:
document.getElementById("budgetStatus").value

})

alert("Budget added")

loadBudget()

}



/* PRINT BUDGET */

function printBudget(){

const tables = document.querySelectorAll(".budgetTable")
let tablesHtml = ""

tables.forEach(table => {
  tablesHtml += table.outerHTML
})

const win = window.open("")

win.document.write(`

<h2>Church Budget Report</h2>

${tablesHtml}

`)

win.print()

}



/* TOGGLE BUDGET STATUS */

async function toggleBudgetStatus(docId, currentStatus){

const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active'

if(confirm(`Are you sure you want to ${newStatus === 'Active' ? 'activate' : 'deactivate'} this budget?`)){
  await db.collection("budget").doc(docId).update({
    BudgetStatus: newStatus
  })

  alert(`Budget ${newStatus === 'Active' ? 'activated' : 'deactivated'}`)
  loadBudget()
}

}



/* SHOW BULK ACTIVATION SCREEN */

async function showBulkActivation(){

const snap = await db.collection("budget").get()

let yearsSet = new Set()

snap.forEach(doc=>{
  const b = doc.data()
  const year = b.BudgetID ? b.BudgetID.split("-")[0] : new Date().getFullYear().toString()
  yearsSet.add(year)
})

const years = Array.from(yearsSet).sort().reverse()

let yearOptions = ""
years.forEach(year => {
  yearOptions += `<option value="${year}">${year}</option>`
})

show(`

<h2>Manage Budget Year Status</h2>

<p>Use this to activate/deactivate all budgets for a specific year.</p>
<p>Example: In January 2027, activate 2027 and deactivate 2026</p>

<br>

Select Year to Activate:<br>
<select id="yearSelect">
  <option value="">-- Select Year --</option>
  ${yearOptions}
</select><br><br>

<button onclick="activateBudgetYear()">Activate All for Selected Year</button>
<button onclick="deactivateAllOtherYears()">Deactivate All Other Years</button>

<hr>

<button onclick="loadBudget()">Back</button>

`)

}



/* ACTIVATE ALL BUDGETS FOR SELECTED YEAR */

async function activateBudgetYear(){

const selectedYear = document.getElementById("yearSelect").value

if(!selectedYear){
  alert("Please select a year")
  return
}

if(!confirm(`Activate all budgets for year ${selectedYear}?`)){
  return
}

const snap = await db.collection("budget").get()

let updateCount = 0

snap.forEach(doc=>{
  const b = doc.data()
  const year = b.BudgetID ? b.BudgetID.split("-")[0] : new Date().getFullYear().toString()

  if(year === selectedYear){
    db.collection("budget").doc(doc.id).update({
      BudgetStatus: "Active"
    })
    updateCount++
  }
})

alert(`Activated ${updateCount} budget entries for year ${selectedYear}`)
loadBudget()

}



/* DEACTIVATE ALL BUDGETS FOR OTHER YEARS */

async function deactivateAllOtherYears(){

const selectedYear = document.getElementById("yearSelect").value

if(!selectedYear){
  alert("Please select a year")
  return
}

if(!confirm(`Deactivate all budgets for years OTHER than ${selectedYear}?`)){
  return
}

const snap = await db.collection("budget").get()

let updateCount = 0

snap.forEach(doc=>{
  const b = doc.data()
  const year = b.BudgetID ? b.BudgetID.split("-")[0] : new Date().getFullYear().toString()

  if(year !== selectedYear){
    db.collection("budget").doc(doc.id).update({
      BudgetStatus: "Inactive"
    })
    updateCount++
  }
})

alert(`Deactivated ${updateCount} budget entries for all years except ${selectedYear}`)
loadBudget()

}
