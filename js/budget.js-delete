async function loadBudget(){

show(`

<h2>Add Budget</h2>

<input id="cat" placeholder="Category">
<input id="sub" placeholder="SubCategory">
<input id="amt" placeholder="Amount">

<button onclick="addBudget()">Add Budget</button>

`)

}

async function addBudget(){

await db.collection("budget").add({

Category:document.getElementById("cat").value,
SubCategory:document.getElementById("sub").value,
BudgetAmount:Number(document.getElementById("amt").value),
Spent:0

})

alert("Budget Added")

}