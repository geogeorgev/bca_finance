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
<button onclick="generateAssetReport()" style="background:#667eea;">🖨️ Print Report</button>

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
    <td style="padding:12px; border:1px solid #ddd;"><b>${asset.AssetName}</b> ${asset.AssetImage ? '<span style="color:#4caf50; font-size:14px;">📸</span>' : ''}</td>
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

<div style="background:#f0f7ff; border:2px solid #2196f3; border-radius:6px; padding:15px; margin:15px 0;">
  <h3 style="margin-top:0; color:#1976d2;">📸 Asset Image (Optional)</h3>
  <p style="margin:5px 0; color:#666; font-size:13px;">Upload a photo of this asset for visual identification</p>
  <input type="file" id="assetImage" accept="image/*" style="margin: 10px 0; padding:8px; border:1px solid #2196f3; border-radius:4px; width:100%; box-sizing:border-box;">
  <small style="color: #666; display:block; margin-top:5px;">✓ Formats: JPG, PNG | ✓ Max size: 700KB</small>
</div>

<br>

<button onclick="saveAsset()" style="background:#4caf50; color:white; padding:10px 20px; border:none; border-radius:4px; cursor:pointer; font-size:14px;">💾 Save Asset</button>
<button onclick="loadAssets()" style="background:#999; color:white; padding:10px 20px; border:none; border-radius:4px; cursor:pointer; margin-left:5px; font-size:14px;">Cancel</button>

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
const assetImageFile = document.getElementById("assetImage").files[0]

if(!assetName){
  alert("Asset Name is required")
  return
}

try {
  // Upload image if file selected
  let assetImageUrl = null
  let assetImageFileName = null

  if(assetImageFile){
    const maxSize = 700 * 1024
    if(assetImageFile.size > maxSize){
      alert(`Image file is too large (${(assetImageFile.size/1024).toFixed(0)}KB).\nPlease use a file under 700KB.\nTip: Compress the image before uploading.`)
      return
    }

    const reader = new FileReader()
    assetImageUrl = await new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(assetImageFile)
    })
    assetImageFileName = assetImageFile.name
  }

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
    AssetImage: assetImageUrl,
    AssetImageFileName: assetImageFileName,
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

<div style="background:#f0f7ff; border:2px solid #2196f3; border-radius:6px; padding:15px; margin:15px 0;">
  <h3 style="margin-top:0; color:#1976d2;">📸 Asset Image</h3>

  ${asset.AssetImage ? `<div style="margin-bottom:15px; text-align:center;">
    <img src="${asset.AssetImage}" style="max-width:250px; max-height:250px; border:2px solid #ddd; border-radius:4px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
    <p style="margin:10px 0 0 0; color:#666; font-size:12px;">Current image</p>
  </div>` : '<p style="color:#999; font-style:italic;">No image uploaded yet</p>'}

  <p style="margin:5px 0; color:#666; font-size:13px;">Upload a new photo to replace the current image (or upload the first one)</p>
  <input type="file" id="assetImage" accept="image/*" style="margin: 10px 0; padding:8px; border:1px solid #2196f3; border-radius:4px; width:100%; box-sizing:border-box;">
  <small style="color: #666; display:block; margin-top:5px;">✓ Formats: JPG, PNG | ✓ Max size: 700KB</small>
</div>

<br>

<button onclick="updateAsset('${assetId}')" style="background:#2196f3; color:white; padding:10px 20px; border:none; border-radius:4px; cursor:pointer; font-size:14px;">✏️ Update Asset</button>
<button onclick="loadAssets()" style="background:#999; color:white; padding:10px 20px; border:none; border-radius:4px; cursor:pointer; margin-left:5px; font-size:14px;">Cancel</button>

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
const assetImageFile = document.getElementById("assetImage").files[0]

if(!assetName){
  alert("Asset Name is required")
  return
}

try{

  // Upload image if file selected
  let assetImageUrl = null
  let assetImageFileName = null

  if(assetImageFile){
    const maxSize = 700 * 1024
    if(assetImageFile.size > maxSize){
      alert(`Image file is too large (${(assetImageFile.size/1024).toFixed(0)}KB).\nPlease use a file under 700KB.\nTip: Compress the image before uploading.`)
      return
    }

    const reader = new FileReader()
    assetImageUrl = await new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(assetImageFile)
    })
    assetImageFileName = assetImageFile.name
  }

  // Get current asset data
  const currentAssetDoc = await db.collection("assets").doc(assetId).get()
  const currentAsset = currentAssetDoc.data()

  const updateData = {
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
  }

  // Only update image if new one provided
  if(assetImageFile){
    updateData.AssetImage = assetImageUrl
    updateData.AssetImageFileName = assetImageFileName
  }

  await db.collection("assets").doc(assetId).update(updateData)

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

/* GENERATE ASSET REPORT */
async function generateAssetReport(){

try {
  // Use simple query without composite index
  const snap = await db.collection("assets").get()

  if(snap.empty){
    alert("No assets to report")
    return
  }

  // Convert to array
  let assets = []
  snap.forEach((doc) => {
    assets.push({
      id: doc.id,
      data: doc.data()
    })
  })

  // Sort by category and asset name on client side
  assets.sort((a, b) => {
    const catA = (a.data.Category || "").toLowerCase()
    const catB = (b.data.Category || "").toLowerCase()
    if(catA !== catB) return catA.localeCompare(catB)
    return (a.data.AssetName || "").localeCompare(b.data.AssetName)
  })

  // Group by category
  let assetsByCategory = {}
  let totalAssets = 0

  assets.forEach(item => {
    const asset = item.data
    const category = asset.Category || "Uncategorized"

    if(!assetsByCategory[category]){
      assetsByCategory[category] = []
    }
    assetsByCategory[category].push(asset)
    totalAssets++
  })

  // Sort categories alphabetically
  const sortedCategories = Object.keys(assetsByCategory).sort()

  // Create HTML report
  let reportHtml = `
  <html>
  <head>
    <title>Asset Report</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
      .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #667eea; padding-bottom: 20px; }
      .header h1 { margin: 0; color: #667eea; }
      .header p { margin: 5px 0; color: #666; }
      .category-section { margin-bottom: 30px; page-break-inside: avoid; }
      .category-title { background: #667eea; color: white; padding: 12px; margin: 0 0 10px 0; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; }
      .category-count { background: white; color: #667eea; padding: 4px 12px; border-radius: 3px; font-weight: bold; font-size: 18px; }
      .asset-list { padding-left: 20px; }
      .asset-item { padding: 8px 0; border-bottom: 1px solid #eee; }
      .asset-name { font-weight: bold; color: #333; font-size: 14px; }
      .asset-details { font-size: 12px; color: #666; margin-top: 3px; }
      .summary { background: #f5f5f5; padding: 20px; border-radius: 4px; margin-top: 30px; }
      .summary h3 { margin-top: 0; color: #667eea; }
      .summary-table { width: 100%; border-collapse: collapse; }
      .summary-table th, .summary-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
      .summary-table th { background: #667eea; color: white; }
      .summary-table tr:hover { background: #f9f9f9; }
      .total-row { font-weight: bold; background: #f0f0f0; }
      @media print {
        body { margin: 0; }
        .no-print { display: none; }
        .category-section { page-break-inside: avoid; }
      }
      .print-buttons { text-align: center; margin-bottom: 20px; }
      .print-buttons button { padding: 10px 20px; margin: 0 5px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; }
      .print-buttons button:hover { background: #5568d3; }
    </style>
  </head>
  <body>
    <div class="print-buttons no-print">
      <button onclick="window.print()">🖨️ Print Report</button>
      <button onclick="loadAssets()">Back to Assets</button>
    </div>

    <div class="header">
      <h1>Church Asset Report</h1>
      <p>Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
    </div>
  `

  // Add each category section
  sortedCategories.forEach(category => {
    const categoryAssets = assetsByCategory[category]
    const count = categoryAssets.length

    reportHtml += `
    <div class="category-section">
      <div class="category-title">
        <span>${category}</span>
        <span class="category-count">${count}</span>
      </div>
      <div class="asset-list">
    `

    categoryAssets.forEach(asset => {
      reportHtml += `
      <div class="asset-item">
        <div class="asset-name">${asset.AssetName}</div>
        <div class="asset-details">
          ${asset.SerialNumber ? `Serial: ${asset.SerialNumber} | ` : ''}
          ${asset.Make ? `Make: ${asset.Make}` : ''}
          ${asset.Model ? ` / Model: ${asset.Model}` : ''}
          ${asset.YearBought ? ` | Year: ${asset.YearBought}` : ''}
          ${asset.Location ? ` | Location: ${asset.Location}` : ''}
          ${asset.Condition ? ` | Condition: ${asset.Condition}` : ''}
        </div>
      </div>
      `
    })

    reportHtml += `
      </div>
    </div>
    `
  })

  // Add summary section
  reportHtml += `
  <div class="summary">
    <h3>Summary by Category</h3>
    <table class="summary-table">
      <thead>
        <tr>
          <th>Category</th>
          <th style="text-align: center;">Total Assets</th>
        </tr>
      </thead>
      <tbody>
  `

  let summaryTotal = 0
  sortedCategories.forEach(category => {
    const count = assetsByCategory[category].length
    summaryTotal += count
    reportHtml += `
      <tr>
        <td>${category}</td>
        <td style="text-align: center; font-weight: bold;">${count}</td>
      </tr>
    `
  })

  reportHtml += `
      <tr class="total-row">
        <td>TOTAL ASSETS</td>
        <td style="text-align: center;">${summaryTotal}</td>
      </tr>
      </tbody>
    </table>
  </div>

  </body>
  </html>
  `

  // Open report in new window
  const reportWindow = window.open('', 'assetReport')
  reportWindow.document.write(reportHtml)
  reportWindow.document.close()

} catch(error) {
  console.error("Error generating report:", error)
  alert("Error generating report: " + error.message)
}

}
