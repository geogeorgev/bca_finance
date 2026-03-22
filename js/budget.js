async function loadBudget(){

show(`

<h2>Budget</h2>

<button onclick="showAddBudget()">Add Budget</button>
<button onclick="printBudget()">Print</button>

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

  budgetsByYear[year].push(b)

  if (!budgetsByYearAndCategory[year][category]) {
    budgetsByYearAndCategory[year][category] = []
  }

  budgetsByYearAndCategory[year][category].push(b)
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
  <th>Category</th>
  <th>SubCategory</th>
  <th>BudgetAmount</th>
  <th>Spent</th>
  <th>Balance</th>
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

      categoryBudgetTotal += budgetAmount
      categorySpentTotal += spent
      categoryBalanceTotal += balance

      tableHtml += `
      <tr>
        <td>${b.BudgetID || ""}</td>
        <td>${b.Category}</td>
        <td>${b.SubCategory}</td>
        <td>${budgetAmount}</td>
        <td>${spent}</td>
        <td>${balance}</td>
      </tr>
      `
    })

    // Add category summary row
    tableHtml += `
    <tr style="background-color: #e8e8e8; font-weight: bold;">
      <td colspan="2">${category} TOTAL</td>
      <td></td>
      <td>${categoryBudgetTotal}</td>
      <td>${categorySpentTotal}</td>
      <td>${categoryBalanceTotal}</td>
    </tr>
    `

    yearBudgetTotal += categoryBudgetTotal
    yearSpentTotal += categorySpentTotal
    yearBalanceTotal += categoryBalanceTotal
  }

  // Add year grand total row
  tableHtml += `
  <tr style="background-color: #d4d4d4; font-weight: bold; font-size: 14px;">
    <td colspan="2">GRAND TOTAL (${year})</td>
    <td></td>
    <td>${yearBudgetTotal}</td>
    <td>${yearSpentTotal}</td>
    <td>${yearBalanceTotal}</td>
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

Balance:amount

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