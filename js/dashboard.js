async function dashboard(){

const incomeSnap = await db.collection("income").get()
const expenseSnap = await db.collection("expense").get()

let incomeTotal = 0
let expenseTotal = 0

incomeSnap.forEach(doc=>{
incomeTotal += doc.data().Amount
})

expenseSnap.forEach(doc=>{
expenseTotal += doc.data().Amount
})

show(`
<h3>Finance Dashboard</h3>

<canvas id="chart"></canvas>
`)

const ctx = document.getElementById("chart")

new Chart(ctx,{
type:'bar',
data:{
labels:['Income','Expense'],
datasets:[{
label:'Church Finance',
data:[incomeTotal,expenseTotal],
backgroundColor:['green','red']
}]
}
})

}