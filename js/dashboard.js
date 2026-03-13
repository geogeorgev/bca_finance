async function dashboard(){

const incomeSnap = await db.collection("income").get()
const expenseSnap = await db.collection("expense").get()

let incomeTotal=0
let expenseTotal=0

incomeSnap.forEach(doc=>{
incomeTotal += doc.data().Amount
})

expenseSnap.forEach(doc=>{
expenseTotal += doc.data().Amount
})

show(`

<h2>Finance Dashboard</h2>

<div class="card">Income: $${incomeTotal}</div>
<div class="card">Expense: $${expenseTotal}</div>
<div class="card">Balance: $${incomeTotal-expenseTotal}</div>

<canvas id="financeChart"></canvas>

`)

const ctx=document.getElementById("financeChart")

new Chart(ctx,{
type:'bar',
data:{
labels:["Income","Expense"],
datasets:[{
label:"Church Finance",
data:[incomeTotal,expenseTotal],
backgroundColor:["green","red"]
}]
}
})

}