async function loadBudget(){

show(`

<h2>Budget</h2>

<button onclick="showAddBudget()">Add Budget</button>
<button onclick="printBudget()">Print</button>

<br><br>

<table border="1" width="100%" id="budgetTable">

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

<tbody id="budgetBody"></tbody>

</table>

`)

const snap = await db.collection("budget").orderBy("Category").get()

let budgetsByCategory = {}

// Group budgets by category
snap.forEach(doc=>{
  const b = doc.data()
  if (!budgetsByCategory[b.Category]) {
    budgetsByCategory[b.Category] = []
  }
  budgetsByCategory[b.Category].push(b)
})

let rows = ""

// Display each category with items and summary
for (const category in budgetsByCategory) {
  const items = budgetsByCategory[category]
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

    rows += `
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
  rows += `
  <tr style="background-color: #e8e8e8; font-weight: bold;">
    <td colspan="2">${category} TOTAL</td>
    <td></td>
    <td>${categoryBudgetTotal}</td>
    <td>${categorySpentTotal}</td>
    <td>${categoryBalanceTotal}</td>
  </tr>
  `
}

document.getElementById("budgetBody").innerHTML = rows

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

const table =
document.getElementById("budgetTable").outerHTML

const win = window.open("")

win.document.write(`

<h2>Church Budget</h2>

${table}

`)

win.print()

}