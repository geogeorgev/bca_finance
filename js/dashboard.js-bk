async function dashboard(){

const incomeSnap = await db.collection("income").get()
const expenseSnap = await db.collection("expense").get()

let incomeTotal = 0
let expenseTotal = 0

let monthlyIncome = {}
let monthlyExpense = {}

incomeSnap.forEach(doc=>{

const d = doc.data()
const date = new Date(d.CollectionDate.seconds * 1000)
const month = date.getMonth()+1

incomeTotal += d.Amount

monthlyIncome[month] = (monthlyIncome[month] || 0) + d.Amount

})

expenseSnap.forEach(doc=>{

const d = doc.data()
const date = new Date(d.PaymentDate.seconds * 1000)
const month = date.getMonth()+1

expenseTotal += d.Amount

monthlyExpense[month] = (monthlyExpense[month] || 0) + d.Amount

})

show(`
<h2>Finance Dashboard</h2>

<div class="card">Total Income: $${incomeTotal}</div>
<div class="card">Total Expense: $${expenseTotal}</div>
<div class="card">Net Balance: $${incomeTotal-expenseTotal}</div>

<canvas id="financeChart"></canvas>
`)

const labels = Object.keys(monthlyIncome)

const incomeData = labels.map(m => monthlyIncome[m])
const expenseData = labels.map(m => monthlyExpense[m] || 0)

const ctx = document.getElementById("financeChart")

new Chart(ctx,{
type:'bar',
data:{
labels:labels,
datasets:[
{
label:'Income',
data:incomeData,
backgroundColor:'green'
},
{
label:'Expense',
data:expenseData,
backgroundColor:'red'
}
]
}
})

}

// Budget Usage Pie Chart
async function budgetChart(){

const snap = await db.collection("budget").get()

let labels=[]
let spent=[]

snap.forEach(doc=>{

const b=doc.data()

labels.push(b.Category + " - " + b.SubCategory)
spent.push(b.Spent || 0)

})

show(`
<h3>Budget Usage</h3>
<canvas id="budgetChart"></canvas>
`)

new Chart(document.getElementById("budgetChart"),{

type:'pie',

data:{
labels:labels,
datasets:[{
data:spent
}]
}

})

}