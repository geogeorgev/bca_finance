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

//
async function generateMemberPDF(memberId){

const memberDoc = await db.collection("members").doc(memberId).get()
const member = memberDoc.data()

const incomeSnap = await db.collection("income")
.where("MemberID","==",memberId)
.get()

let total=0
let rows=""

incomeSnap.forEach(doc=>{

const d=doc.data()

total+=d.Amount

rows+=`${d.Purpose} - $${d.Amount}\n`

})

const { jsPDF } = window.jspdf

const pdf = new jsPDF()

pdf.text("Church Contribution Statement",20,20)

pdf.text(`Member: ${member.Name}`,20,40)

pdf.text(rows,20,60)

pdf.text(`Total Contribution: $${total}`,20,200)

pdf.save(member.Name+"_statement.pdf")

}