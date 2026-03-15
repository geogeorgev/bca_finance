/* ===============================
   BANK RECONCILIATION SCREEN
================================ */

window.loadBankScreen = function(){

let html = `

<h2>Bank Reconciliation</h2>

<div class="card">
<h3>Upload Bank CSV</h3>

<input type="file" id="csvFile" accept=".csv">

<br><br>

<button onclick="uploadBankCSV()">Upload Statement</button>

<button onclick="loadBankTransactions()">View Transactions</button>

</div>

<hr>

<div id="bankResults"></div>

<style>

.card{
padding:15px;
margin:10px 0;
border:1px solid #ddd;
border-radius:8px;
background:#f9f9f9;
}

.txn{
padding:10px;
margin:6px 0;
border-bottom:1px solid #eee;
}

.credit{
color:green;
font-weight:bold;
}

.debit{
color:red;
font-weight:bold;
}

</style>

`

show(html)

}



/* ===============================
   CSV UPLOAD
================================ */

window.uploadBankCSV = async function(){

const file = document.getElementById("csvFile").files[0]

if(!file){
alert("Please select a CSV file")
return
}

const text = await file.text()

const rows = text.split("\n")

let imported = 0

for(let i=1;i<rows.length;i++){

if(!rows[i].trim()) continue

const cols = rows[i].split(",")

const date = cols[0]
const description = cols[1]
const debit = Number(cols[2] || 0)
const credit = Number(cols[3] || 0)
const balance = Number(cols[4] || 0)

await db.collection("bank_transactions").add({

Date: date,
Description: description,
Debit: debit,
Credit: credit,
Balance: balance,

Matched:false,

CreateDate: firebase.firestore.FieldValue.serverTimestamp()

})

imported++

}

alert(imported + " transactions imported")

loadBankTransactions()

}



/* ===============================
   LOAD TRANSACTIONS
================================ */

window.loadBankTransactions = async function(){

const snap = await db.collection("bank_transactions")
.orderBy("Date","desc")
.get()

let html = "<h3>Bank Transactions</h3>"

if(snap.empty){

html += "<p>No transactions found</p>"

document.getElementById("bankResults").innerHTML = html

return

}

snap.forEach(doc=>{

const d = doc.data()

const amount = d.Credit || d.Debit

const type = d.Credit ? "credit" : "debit"

const status = d.Matched ? "✅ Matched" : "⚠ Not Matched"

html += `

<div class="txn">

<b>${d.Date}</b><br>

${d.Description}<br>

<span class="${type}">
$${amount}
</span>

<br>

${status}

</div>

`

})

document.getElementById("bankResults").innerHTML = html

}