/* ===============================
   ASSET MANAGEMENT SYSTEM
   Manages church assets: equipment, furniture, etc.
   With Categories and Horizontal Table Display
================================ */

/* ASSET CATEGORIES */
const ASSET_CATEGORIES = [
  "Audio Equipment",
  "Musical Instruments",
  "Office Equipment",
  "Furniture",
  "Tools & Equipment",
  "Technology",
  "Other"
]

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

/* DISPLAY ALL ASSETS - HORIZONTAL TABLE */
async function displayAssets(){

try {
  const snap = await db.collection("assets").orderBy("AssetName").get()

  if(snap.empty){
    document.getElementById("assetList").innerHTML = `<p style="color:#999; text-align:center; padding:40px;">No assets found. <a href="javascript:showAddAsset()" style="color:#2196f3;">Add one now</a></p>`
    return
  }

  // Convert to array and sort by Category, then by AssetName
  let assets = []
  snap.forEach((doc, index) => {
    assets.push({
      id: doc.id,
      data: doc.data(),
      index: index
    })
  })

  // Sort by Category first, then by AssetName
  assets.sort((a, b) => {
    const catA = (a.data.Category || "").toLowerCase()
    const catB = (b.data.Category || "").toLowerCase()
    if(catA !== catB) return catA.localeCompare(catB)
    return a.data.AssetName.localeCompare(b.data.AssetName)
  })

  let html = `
<div style="overflow-x:auto; margin-top:20px;">
<table style="width:100%; border-collapse:collapse; background:white; box-shadow:0 2px 8px rgba(0,0,0,0.1); border-radius:8px;">
  <thead>
    <tr style="background:#667eea; color:white;">
      <th style="padding:12px; text-align:left; border:1px solid #ddd;">Asset Name</th>
      <th style="padding:12px; text-align:left; border:1px solid #ddd;">Category</th>
      <th style="padding:12px; text-align:left; border:1px solid #ddd;">Serial #</th>
      <th style="padding:12px; text-align:left; border:1px solid #ddd;">Make / Model</th>
      <th style="padding:12px; text-align:left; border:1px solid #ddd;">Year Bought</th>
      <th style="padding:12px; text-align:left; border:1px solid #ddd;">Replace Year</th>
      <th style="padding:12px; text-align:left; border:1px solid #ddd;">Location</th>
      <th style="padding:12px; text-align:left; border:1px solid #ddd;">Cost</th>
      <th style="padding:12px; text-align:left; border:1px solid #ddd;">Condition</th>
      <th style="padding:12px; text-align:center; border:1px solid #ddd;">Actions</th>
    </tr>
  </thead>
  <tbody>
`

  assets.forEach((item, displayIndex) => {
    const asset = item.data
    const rowColor = displayIndex % 2 === 0 ? "#f9f9f9" : "white"

    const conditionColor = {
      "Excellent": "#4caf50",
      "Good": "#8bc34a",
      "Fair": "#ff9800",
      "Poor": "#f44336",
      "Needs Repair": "#d32f2f"
    }[asset.Condition] || "#999"

    html += `
  <tr class="assetRow" style="background:${rowColor}; border-bottom:1px solid #ddd;">
    <td style="padding:12px; border:1px solid #ddd;"><b>${asset.AssetName}</b></td>
    <td style="padding:12px; border:1px solid #ddd;"><span style="background:#e3f2fd; color:#1976d2; padding:4px 8px; border-radius:4px; font-size:12px;">${asset.Category || "N/A"}</span></td>
    <td style="padding:12px; border:1px solid #ddd;">${asset.SerialNumber || "-"}</td>
    <td style="padding:12px; border:1px solid #ddd;">${asset.Make || "-"} ${asset.Model ? "/ " + asset.Model : ""}</td>
    <td style="padding:12px; border:1px solid #ddd; text-align:center;">${asset.YearBought || "-"}</td>
    <td style="padding:12px; border:1px solid #ddd; text-align:center;">${asset.ReplaceYear || "-"}</td>
    <td style="padding:12px; border:1px solid #ddd;">${asset.Location || "-"}</td>
    <td style="padding:12px; border:1px solid #ddd;">${asset.Cost ? "$" + asset.Cost.toFixed(2) : "-"}</td>
    <td style="padding:12px; border:1px solid #ddd;"><span style="background:${conditionColor}20; color:${conditionColor}; padding:4px 8px; border-radius:4px; font-size:12px; font-weight:bold;">${asset.Condition || "-"}</span></td>
    <td style="padding:12px; border:1px solid #ddd; text-align:center; white-space:nowrap;">
      <button onclick="editAsset('${item.id}')" style="background:#2196f3; color:white; border:none; padding:6px 10px; border-radius:4px; cursor:pointer; margin:2px; font-size:12px;">✏️</button>
      <button onclick="deleteAsset('${item.id}', '${asset.AssetName}')" style="background:#f44336; color:white; border:none; padding:6px 10px; border-radius:4px; cursor:pointer; margin:2px; font-size:12px;">🗑️</button>
    </td>
  </tr>
  `
  })

  html += `
  </tbody>
</table>
</div>
`

  document.getElementById("assetList").innerHTML = html

} catch(error) {
  console.error("Error loading assets:", error)
  document.getElementById("assetList").innerHTML = `<p style="color:#d32f2f; text-align:center; padding:40px;">Error loading assets: ${error.message}</p>`
}

}

/* FILTER ASSETS */
function filterAssets(){

const text = document.getElementById("assetSearchBox").value.toLowerCase()

const rows = document.getElementsByClassName("assetRow")

for(let r of rows){
  if(r.innerText.toLowerCase().includes(text)){
    r.style.display = "table-row"
  } else {
    r.style.display = "none"
  }
}

}

/* SHOW ADD ASSET FORM */
function showAddAsset(){

let categoryOptions = '<option value="">-- Select Category --</option>'
ASSET_CATEGORIES.forEach(cat => {
  categoryOptions += `<option value="${cat}">${cat}</option>`
})

show(`

<h2>Add New Asset</h2>

<label>Asset Name *</label>
<input id="assetName" placeholder="e.g., Cordless Microphone"><br><br>

<label>Category</label>
<select id="category">
${categoryOptions}
</select>

<br><br>

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
const category = document.getElementById("category").value.trim()
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
  Category: category,
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

let categoryOptions = '<option value="">-- Select Category --</option>'
ASSET_CATEGORIES.forEach(cat => {
  const selected = cat === asset.Category ? "selected" : ""
  categoryOptions += `<option value="${cat}" ${selected}>${cat}</option>`
})

show(`

<h2>Edit Asset</h2>

<label>Asset Name *</label>
<input id="assetName" value="${asset.AssetName}"><br><br>

<label>Category</label>
<select id="category">
${categoryOptions}
</select>

<br><br>

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
const category = document.getElementById("category").value.trim()
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
  Category: category,
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

