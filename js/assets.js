/* ===============================
   ASSET MANAGEMENT SYSTEM
   Manages church assets: equipment, furniture, etc.
================================ */

/* LOAD ASSETS PAGE */
async function loadAssets(){

const user = getCurrentUser()

if(!user){
  showLoginScreen()
  return
}

// Check if user has permission (Superuser, Admin)
if(!canAccess("Admin")){
  alert("You don't have permission to access Asset Management")
  return
}

show(`

<h2>Asset Management</h2>

<button onclick="showAddAsset()" style="background:#4caf50;">➕ Add New Asset</button>
<button onclick="loadAssets()" style="background:#2196f3;">🔄 Refresh</button>

<br><br>

<input id="assetSearchBox" placeholder="Search assets by name, serial number, or make" onkeyup="filterAssets()">

<div id="assetList"></div>

`)

displayAssets()

}

/* DISPLAY ALL ASSETS */
async function displayAssets(){

const snap = await db.collection("assets").orderBy("AssetName").get()

let html = ""

for(const doc of snap.docs){
  const asset = doc.data()

  const assetCard = `
  <div class="card assetRow" style="margin-bottom:15px;">
    <div style="display:flex; justify-content:space-between; align-items:start;">
      <div style="flex:1;">
        <b style="font-size:16px; color:#333;">${asset.AssetName}</b><br>
        <span style="color:#666; font-size:13px;">Serial Number: ${asset.SerialNumber || "N/A"}</span><br>
        <span style="color:#666; font-size:13px;">Make: ${asset.Make || "N/A"} | Model: ${asset.Model || "N/A"}</span><br>
        <span style="color:#666; font-size:13px;">Year Bought: ${asset.YearBought || "N/A"}</span><br>
        <span style="color:#666; font-size:13px;">Replace Year: ${asset.ReplaceYear || "N/A"}</span><br>
        ${asset.Location ? `<span style="color:#999; font-size:12px;">📍 Location: ${asset.Location}</span><br>` : ""}
        ${asset.Cost ? `<span style="color:#999; font-size:12px;">💰 Cost: $${asset.Cost}</span><br>` : ""}
        ${asset.Condition ? `<span style="color:#999; font-size:12px;">Condition: ${asset.Condition}</span><br>` : ""}
        ${asset.Notes ? `<span style="color:#999; font-size:12px;">Notes: ${asset.Notes}</span><br>` : ""}
      </div>
      <div>
        <button onclick="editAsset('${doc.id}')" style="background:#2196f3; margin:5px;">✏️ Edit</button>
        <button onclick="deleteAsset('${doc.id}', '${asset.AssetName}')" style="background:#f44336; margin:5px;">🗑️ Delete</button>
      </div>
    </div>
  </div>
  `

  html += assetCard
}

if(html === ""){
  html = `<p style="color:#999; text-align:center; padding:40px;">No assets found. <a href="javascript:showAddAsset()" style="color:#2196f3;">Add one now</a></p>`
}

document.getElementById("assetList").innerHTML = html

}

/* FILTER ASSETS */
function filterAssets(){

const text = document.getElementById("assetSearchBox").value.toLowerCase()

const rows = document.getElementsByClassName("assetRow")

for(let r of rows){
  if(r.innerText.toLowerCase().includes(text)){
    r.style.display = "block"
  } else {
    r.style.display = "none"
  }
}

}

/* SHOW ADD ASSET FORM */
function showAddAsset(){

show(`

<h2>Add New Asset</h2>

<label>Asset Name *</label>
<input id="assetName" placeholder="e.g., Cordless Microphone"><br><br>

<label>Serial Number</label>
<input id="serialNumber" placeholder="Serial number or identifier"><br><br>

<label>Make</label>
<input id="make" placeholder="Manufacturer or brand"><br><br>

<label>Model</label>
<input id="model" placeholder="Model number or description"><br><br>

<label>Year Bought</label>
<input id="yearBought" type="number" min="1900" max="2100" placeholder="e.g., 2020"><br><br>

<label>Replace Year</label>
<input id="replaceYear" type="number" min="2000" max="2200" placeholder="e.g., 2025"><br><br>

<label>Location</label>
<input id="location" placeholder="Where it's stored/used"><br><br>

<label>Cost</label>
<input id="cost" type="number" step="0.01" placeholder="Original purchase cost"><br><br>

<label>Condition</label>
<select id="condition">
  <option value="">-- Select Condition --</option>
  <option value="Excellent">Excellent</option>
  <option value="Good">Good</option>
  <option value="Fair">Fair</option>
  <option value="Poor">Poor</option>
  <option value="Needs Repair">Needs Repair</option>
</select>

<br><br>

<label>Notes</label>
<textarea id="notes" placeholder="Any additional notes or maintenance history" style="width:100%; padding:8px; margin:6px 0; border:1px solid #ccc; border-radius:4px; font-family:Arial;" rows="3"></textarea>

<br><br>

<button onclick="saveAsset()">Save Asset</button>
<button onclick="loadAssets()">Cancel</button>

`)

}

/* SAVE ASSET */
async function saveAsset(){

const assetName = document.getElementById("assetName").value.trim()
const serialNumber = document.getElementById("serialNumber").value.trim()
const make = document.getElementById("make").value.trim()
const model = document.getElementById("model").value.trim()
const yearBought = document.getElementById("yearBought").value
const replaceYear = document.getElementById("replaceYear").value
const location = document.getElementById("location").value.trim()
const cost = document.getElementById("cost").value
const condition = document.getElementById("condition").value
const notes = document.getElementById("notes").value.trim()

if(!assetName){
  alert("Asset Name is required")
  return
}

try{

await db.collection("assets").add({
  AssetName: assetName,
  SerialNumber: serialNumber,
  Make: make,
  Model: model,
  YearBought: yearBought ? parseInt(yearBought) : null,
  ReplaceYear: replaceYear ? parseInt(replaceYear) : null,
  Location: location,
  Cost: cost ? parseFloat(cost) : null,
  Condition: condition,
  Notes: notes,
  CreateDate: firebase.firestore.FieldValue.serverTimestamp(),
  UpdateDate: firebase.firestore.FieldValue.serverTimestamp()
})

alert("Asset added successfully! 🎉")
loadAssets()

} catch(error){
  alert("Error saving asset: " + error.message)
}

}

/* EDIT ASSET */
async function editAsset(assetId){

const doc = await db.collection("assets").doc(assetId).get()

if(!doc.exists){
  alert("Asset not found")
  return
}

const asset = doc.data()

show(`

<h2>Edit Asset</h2>

<label>Asset Name *</label>
<input id="assetName" value="${asset.AssetName}"><br><br>

<label>Serial Number</label>
<input id="serialNumber" value="${asset.SerialNumber || ''}"><br><br>

<label>Make</label>
<input id="make" value="${asset.Make || ''}"><br><br>

<label>Model</label>
<input id="model" value="${asset.Model || ''}"><br><br>

<label>Year Bought</label>
<input id="yearBought" type="number" min="1900" max="2100" value="${asset.YearBought || ''}"><br><br>

<label>Replace Year</label>
<input id="replaceYear" type="number" min="2000" max="2200" value="${asset.ReplaceYear || ''}"><br><br>

<label>Location</label>
<input id="location" value="${asset.Location || ''}"><br><br>

<label>Cost</label>
<input id="cost" type="number" step="0.01" value="${asset.Cost || ''}"><br><br>

<label>Condition</label>
<select id="condition">
  <option value="">-- Select Condition --</option>
  <option value="Excellent" ${asset.Condition === "Excellent" ? "selected" : ""}>Excellent</option>
  <option value="Good" ${asset.Condition === "Good" ? "selected" : ""}>Good</option>
  <option value="Fair" ${asset.Condition === "Fair" ? "selected" : ""}>Fair</option>
  <option value="Poor" ${asset.Condition === "Poor" ? "selected" : ""}>Poor</option>
  <option value="Needs Repair" ${asset.Condition === "Needs Repair" ? "selected" : ""}>Needs Repair</option>
</select>

<br><br>

<label>Notes</label>
<textarea id="notes" style="width:100%; padding:8px; margin:6px 0; border:1px solid #ccc; border-radius:4px; font-family:Arial;" rows="3">${asset.Notes || ''}</textarea>

<br><br>

<button onclick="updateAsset('${assetId}')">Update Asset</button>
<button onclick="loadAssets()">Cancel</button>

`)

}

/* UPDATE ASSET */
async function updateAsset(assetId){

const assetName = document.getElementById("assetName").value.trim()
const serialNumber = document.getElementById("serialNumber").value.trim()
const make = document.getElementById("make").value.trim()
const model = document.getElementById("model").value.trim()
const yearBought = document.getElementById("yearBought").value
const replaceYear = document.getElementById("replaceYear").value
const location = document.getElementById("location").value.trim()
const cost = document.getElementById("cost").value
const condition = document.getElementById("condition").value
const notes = document.getElementById("notes").value.trim()

if(!assetName){
  alert("Asset Name is required")
  return
}

try{

await db.collection("assets").doc(assetId).update({
  AssetName: assetName,
  SerialNumber: serialNumber,
  Make: make,
  Model: model,
  YearBought: yearBought ? parseInt(yearBought) : null,
  ReplaceYear: replaceYear ? parseInt(replaceYear) : null,
  Location: location,
  Cost: cost ? parseFloat(cost) : null,
  Condition: condition,
  Notes: notes,
  UpdateDate: firebase.firestore.FieldValue.serverTimestamp()
})

alert("Asset updated successfully! ✅")
loadAssets()

} catch(error){
  alert("Error updating asset: " + error.message)
}

}

/* DELETE ASSET */
async function deleteAsset(assetId, assetName){

if(!confirm(`Delete asset: ${assetName}?\n\nThis cannot be undone.`)){
  return
}

try{

await db.collection("assets").doc(assetId).delete()

alert("Asset deleted successfully! 🗑️")
loadAssets()

} catch(error){
  alert("Error deleting asset: " + error.message)
}

}

