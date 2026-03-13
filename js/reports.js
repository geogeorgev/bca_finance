function loadReports(){

show(`

<h2>Reports</h2>

<button onclick="collectionReport()">Collection Report</button>
<button onclick="expenseReport()">Expense Report</button>
<button onclick="backupDatabase()">Backup Database</button>

`)

}

async function collectionReport(){

const snap = await db.collection("income").get()

let total=0
let html="<h2>Collection Report</h2>"

snap.forEach(doc=>{

const d=doc.data()

total+=d.Amount

html+=`<div class="card">${d.MemberName} $${d.Amount}</div>`

})

html+=`<h3>Total ${total}</h3>`

show(html)

}

async function expenseReport(){

const snap=await db.collection("expense").get()

let total=0
let html="<h2>Expense Report</h2>"

snap.forEach(doc=>{

const d=doc.data()

total+=d.Amount

html+=`<div class="card">${d.PayeeName} $${d.Amount}</div>`

})

html+=`<h3>Total ${total}</h3>`

show(html)

}

async function backupDatabase(){

let backup={}

const collections=["members","income","expense","budget"]

for(const col of collections){

const snap=await db.collection(col).get()

backup[col]=[]

snap.forEach(doc=>{
backup[col].push(doc.data())
})

}

const json=JSON.stringify(backup,null,2)

const blob=new Blob([json],{type:"application/json"})

const url=URL.createObjectURL(blob)

const a=document.createElement("a")

a.href=url
a.download="church_backup.json"
a.click()

}