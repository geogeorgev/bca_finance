async function loadBudget(){

let html = `
<h3>Add Budget</h3>

<input id="cat" placeholder="Category">
<input id="subcat" placeholder="SubCategory">
<input id="amount" placeholder="Budget Amount">

<button onclick="addBudget()">Add Budget</button>

<h3>Budget List</h3>
`

const snap = await db.collection("budget").get()

snap.forEach(doc=>{

const b = doc.data()

html += `
<div class="card">

<b>${b.Category}</b><br>
Sub: ${b.SubCategory}<br>
Budget: $${b.BudgetAmount}<br>
Spent: $${b.Spent || 0}<br>
Balance: $${b.Balance || b.BudgetAmount}

</div>
`
})

show(html)

}


async function addBudget(){

const cat = document.getElementById("cat").value
const sub = document.getElementById("subcat").value
const amount = Number(document.getElementById("amount").value)

await db.collection("budget").add({

Category:cat,
SubCategory:sub,
BudgetAmount:amount,
Spent:0,
Balance:amount

})

loadBudget()

}