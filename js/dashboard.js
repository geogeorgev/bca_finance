async function dashboard(){

const incomeSnap = await db.collection("income").get()
const expenseSnap = await db.collection("expense").get()

let income = 0
let expense = 0

incomeSnap.forEach(doc=>{
income += doc.data().Amount
})

expenseSnap.forEach(doc=>{
expense += doc.data().Amount
})

show(`

<h2>Dashboard</h2>

<div class="card">
Total Income: $${income}
</div>

<div class="card">
Total Expense: $${expense}
</div>

<div class="card">
Balance: $${income-expense}
</div>

`)

}