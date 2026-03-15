window.loadBankScreen = function(){

let html = `

<h2>Bank Reconciliation</h2>

<div class="card">
<input type="file" id="csvFile" accept=".csv">
<button onclick="uploadBankCSV()">Upload Bank CSV</button>
</div>

<div style="margin-top:20px;">
<button onclick="loadBankTransactions()">View Transactions</button>
</div>

<hr>

<div id="bankResults"></div>

`

show(html)

}

window.uploadBankCSV = async function(){

const file = document.getElementById("csvFile").files[0]

if(!file){
alert("Please select a CSV file")
return
}

const text = await file.text()

const rows = text.split("\n")

for(let i=1;i<rows.length;i++){

if(!rows[i].trim()) continue

const cols = rows[i].split(",")

await db.collection("bank_transactions").add({

Date: cols[0],
Description: cols[1],
Debit: Number(cols[2] || 0),
Credit: Number(cols[3] || 0),
Balance: Number(cols[4] || 0),

Matched:false,
CreateDate: firebase.firestore.FieldValue.serverTimestamp()

})

}

alert("Bank statement imported")

loadBankTransactions()

}

window.loadBankTransactions = async function(){

const snap = await db.collection("bank_transactions")
.orderBy("Date","desc")
.get()

let html = "<h3>Bank Transactions</h3>"

snap.forEach(doc=>{

const d = doc.data()

const amount = d.Credit || d.Debit
const status = d.Matched ? "✅ Matched" : "⚠ Not Matched"

html += `
<div class="card">
<b>${d.Date}</b><br>
${d.Description}<br>
Amount: $${amount}<br>
${status}
</div>
`

})

document.getElementById("bankResults").innerHTML = html

}
