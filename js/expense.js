async function loadExpense(){

const members = await memberDropdown()

let budgetSnap = await db.collection("budget").get()

let budgetSelect = `<select id="budgetSelect">`

budgetSnap.forEach(doc=>{

const b = doc.data()

budgetSelect += `<option value="${doc.id}">
${b.Category} - ${b.SubCategory}
</option>`

})

budgetSelect += "</select>"

show(`

<h3>Expense Entry</h3>

Payee Type
<select id="payeeType">
<option value="member">Member</option>
<option value="other">Other</option>
</select>

Member
${members}

Payee Name
<input id="payeeName">

Purpose
<input id="purpose">

Budget
${budgetSelect}

Amount
<input id="amount">

<button onclick="addExpense()">Save</button>

`)

}



async function addExpense(){

const budgetId = document.getElementById("budgetSelect").value
const amount = Number(document.getElementById("amount").value)

await db.collection("expense").add({

PayeeName:document.getElementById("payeeName").value,
Purpose:document.getElementById("purpose").value,
Amount:amount,
BudgetID:budgetId,
PaymentDate:new Date()

})

const ref = db.collection("budget").doc(budgetId)

const doc = await ref.get()

const spent = doc.data().Spent || 0
const total = doc.data().BudgetAmount

const newSpent = spent + amount

await ref.update({

Spent:newSpent,
Balance: total - newSpent

})

alert("Expense saved")

}