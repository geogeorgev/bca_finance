function loadReports(){

show(`

<h2>Reports</h2>

<button onclick="collectionReport()">Collection Report</button>

<button onclick="expenseReport()">Expense Report</button>

<button onclick="memberContributionReport()">Member Contributions</button>

<button onclick="generateMemberStatement()">Generate Member PDF</button>

<button onclick="exportIncomeExcel()">Export Excel</button>

`)

}



async function collectionReport(){

const snap = await db.collection("income").get()

let total = 0
let html = "<h3>Collection Report</h3>"

snap.forEach(doc=>{

const d = doc.data()

total += d.Amount

html += `
<div class="card">

${d.MemberName}<br>
Purpose: ${d.Purpose}<br>
Amount: $${d.Amount}

</div>
`
})

html += `<h3>Total: $${total}</h3>`

show(html)

}



async function expenseReport(){

const snap = await db.collection("expense").get()

let total = 0
let html = "<h3>Expense Report</h3>"

snap.forEach(doc=>{

const d = doc.data()

total += d.Amount

html += `
<div class="card">

${d.PayeeName}<br>
Purpose: ${d.Purpose}<br>
Amount: $${d.Amount}

</div>
`
})

html += `<h3>Total: $${total}</h3>`

show(html)

}



async function memberContributionReport(){

const snap = await db.collection("members").get()

let html = "<h3>Member Contributions</h3>"

snap.forEach(doc=>{

const m = doc.data()

html += `
<div class="card">

${m.Name}<br>
Total Contribution: $${m.TotalContribution || 0}

</div>
`
})

show(html)

}



async function exportCollectionsExcel(){

const snap = await db.collection("income").get()

let rows = []

snap.forEach(doc=>{
rows.push(doc.data())
})

const worksheet = XLSX.utils.json_to_sheet(rows)

const workbook = XLSX.utils.book_new()

XLSX.utils.book_append_sheet(workbook,worksheet,"Collections")

XLSX.writeFile(workbook,"collections.xlsx")

}

// Member Statement PDF
async function generateMemberStatement(){

const memberId = document.getElementById("memberSelect").value

const memberDoc = await db.collection("members").doc(memberId).get()

const member = memberDoc.data()

const incomeSnap = await db.collection("income")
.where("MemberID","==",memberId)
.get()

let total = 0

let rows=""

incomeSnap.forEach(doc=>{

const d=doc.data()

total += d.Amount

rows += `
${d.CollectionDate.toDate().toDateString()} - ${d.Purpose} - $${d.Amount}
\n
`

})

const { jsPDF } = window.jspdf

const pdf = new jsPDF()

pdf.text("Church Contribution Statement",20,20)

pdf.text(`Member: ${member.Name}`,20,40)

pdf.text(rows,20,60)

pdf.text(`Total Contribution: $${total}`,20,200)

pdf.save(member.Name+"_statement.pdf")

}

// Export Income to Excel
```javascript
async function exportIncomeExcel(){

const snap = await db.collection("income").get()

let rows=[]

snap.forEach(doc=>{

rows.push(doc.data())

})

const sheet = XLSX.utils.json_to_sheet(rows)

const book = XLSX.utils.book_new()

XLSX.utils.book_append_sheet(book,sheet,"Income")

XLSX.writeFile(book,"income_report.xlsx")

}