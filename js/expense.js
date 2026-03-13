async function loadExpense(){

show(`

<h2>Expense</h2>
<select id="budgetSelect"></select>
<input id="payee" placeholder="Payee">
<input id="amount" placeholder="Amount">

<button onclick="addExpense()">Save</button>

`)

}

//
async function addExpense(){

const payee = document.getElementById("payee").value
const amount = Number(document.getElementById("amount").value)
const budgetId = document.getElementById("budgetSelect").value

await db.collection("expense").add({

PayeeName:payee,
Amount:amount,
BudgetID:budgetId,
PaymentDate:new Date()

})

/* UPDATE BUDGET BALANCE */

const ref = db.collection("budget").doc(budgetId)

const doc = await ref.get()

const budget = doc.data()

const spent = budget.Spent || 0
const total = budget.BudgetAmount

const newSpent = spent + amount

await ref.update({

Spent:newSpent,
Balance: total - newSpent

})

alert("Expense Saved")

}

// Load Budget Categories in Dropdown
async function loadBudgetDropdown(){

const snap = await db.collection("budget").get()

let html=""

snap.forEach(doc=>{

const b=doc.data()

html+=`<option value="${doc.id}">
${b.Category} - ${b.SubCategory}
</option>`

})

document.getElementById("budgetSelect").innerHTML=html

}
