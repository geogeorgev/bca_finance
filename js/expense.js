async function loadExpense(){

show(`

<h2>Expense</h2>

<input id="payee" placeholder="Payee">
<input id="amount" placeholder="Amount">

<button onclick="addExpense()">Save</button>

`)

}

async function addExpense(){

await db.collection("expense").add({

PayeeName:document.getElementById("payee").value,
Amount:Number(document.getElementById("amount").value),
PaymentDate:new Date()

})

alert("Expense Saved")

}