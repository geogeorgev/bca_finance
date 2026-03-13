async function treasurerDashboard(){

const incomeSnap = await db.collection("income").get()
const expenseSnap = await db.collection("expense").get()

let monthlyIncome = {}
let monthlyExpense = {}

incomeSnap.forEach(doc=>{

const d = doc.data()
const date = new Date(d.CollectionDate.seconds*1000)

const key = date.getFullYear()+"-"+(date.getMonth()+1)

monthlyIncome[key] = (monthlyIncome[key] || 0) + d.Amount

})

expenseSnap.forEach(doc=>{

const d = doc.data()
const date = new Date(d.PaymentDate.seconds*1000)

const key = date.getFullYear()+"-"+(date.getMonth()+1)

monthlyExpense[key] = (monthlyExpense[key] || 0) + d.Amount

})

let html="<h2>Treasurer Dashboard</h2>"

Object.keys(monthlyIncome).forEach(month=>{

const income = monthlyIncome[month]
const expense = monthlyExpense[month] || 0

html += `
<div class="card">

<b>${month}</b><br>

Income: $${income}<br>
Expense: $${expense}<br>
Balance: $${income-expense}

</div>
`

})

show(html)

}

//
async function budgetVsActualChart(){

const snap = await db.collection("budget").get()

let labels=[]
let budget=[]
let spent=[]

snap.forEach(doc=>{

const b = doc.data()

labels.push(b.Category)

budget.push(b.BudgetAmount)

spent.push(b.Spent || 0)

})

show(`
<h2>Budget vs Actual</h2>
<canvas id="budgetChart"></canvas>
`)

new Chart(document.getElementById("budgetChart"),{

type:'bar',

data:{
labels:labels,
datasets:[
{
label:'Budget',
data:budget,
backgroundColor:'blue'
},
{
label:'Spent',
data:spent,
backgroundColor:'orange'
}
]
}

})

}