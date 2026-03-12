function loadReports(){

show(`

<h3>Reports</h3>

<button onclick="collectionReport()">Collection Report</button>
<button onclick="expenseReport()">Expense Report</button>
<button onclick="memberContributionReport()">Member Contributions</button>
<button onclick="exportCollectionsExcel()">Export Collections Excel</button>

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