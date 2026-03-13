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

let rows=""

snap.forEach(doc=>{

const b = doc.data()

rows+=`

<tr>

<td>${b.BudgetID || ""}</td>

<td>${b.Category}</td>

<td>${b.SubCategory}</td>

<td>${b.BudgetAmount}</td>

<td>${b.Spent || 0}</td>

<td>${b.Balance || (b.BudgetAmount-(b.Spent||0))}</td>

</tr>

`

})

document.getElementById("budgetBody").innerHTML=rows

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