/* ===============================
   PAYMENT GATEWAY RECONCILIATION
   Stripe/PayPal PDF Income Capture
================================ */

/* Helper function to get local date string without UTC conversion */
function getLocalDateString(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function loadBankScreen(){

let html = `

<h2>Payment Gateway Reconciliation</h2>

<div class="card">
  <h3>Upload Payment Statement</h3>

  <label>Payment Gateway</label>
  <select id="gatewayType" style="width:100%; padding:8px; margin:6px 0;">
    <option value="">-- Select Gateway --</option>
    <option value="Stripe">Stripe</option>
    <option value="PayPal">PayPal</option>
  </select>

  <br><br>

  <label>File Type</label>
  <select id="fileType" style="width:100%; padding:8px; margin:6px 0;">
    <option value="">-- Select Format --</option>
    <option value="pdf">PDF Statement</option>
    <option value="csv">CSV Export</option>
  </select>

  <br><br>

  <label>Select File</label>
  <input type="file" id="paymentFile" accept=".pdf,.csv">

  <br><br>

  <button onclick="processPaymentStatement()" style="padding:10px 20px; background:#4caf50; color:white; border:none; border-radius:4px; cursor:pointer; margin-right:5px;">
    Upload & Process
  </button>

  <button onclick="viewImportedTransactions()" style="padding:10px 20px; background:#2196f3; color:white; border:none; border-radius:4px; cursor:pointer;">
    View Imported Transactions
  </button>
</div>

<hr>

<div id="processingStatus" style="display:none; padding:15px; margin:10px 0; background:#e3f2fd; border:1px solid #2196f3; border-radius:4px;">
  <b>Processing...</b> <span id="statusMessage"></span>
</div>

<div id="results" style="margin:15px 0;"></div>

<style>
  .card {
    padding: 15px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #f9f9f9;
  }

  .transaction-item {
    padding: 10px;
    margin: 8px 0;
    border-left: 4px solid #4caf50;
    background: #f0f7f0;
    border-radius: 4px;
  }

  .transaction-item.warning {
    border-left-color: #ff9800;
    background: #fff3e0;
  }

  .transaction-item.error {
    border-left-color: #f44336;
    background: #ffebee;
  }

  .transaction-details {
    font-size: 12px;
    color: #666;
    margin-top: 5px;
  }

  .summary {
    padding: 15px;
    margin: 10px 0;
    background: #e8f5e9;
    border: 1px solid #4caf50;
    border-radius: 4px;
  }

  .summary-item {
    padding: 5px 0;
    font-weight: bold;
  }

  .summary-item.success {
    color: #4caf50;
  }

  .summary-item.warning {
    color: #ff9800;
  }

  .summary-item.error {
    color: #f44336;
  }
</style>

`

show(html)

}

/* ===============================
   PROCESS PAYMENT STATEMENT
================================ */

async function processPaymentStatement(){

const gateway = document.getElementById("gatewayType").value
const fileType = document.getElementById("fileType").value
const file = document.getElementById("paymentFile").files[0]

if(!gateway || !fileType || !file){
  alert("Please select Gateway, File Type, and File")
  return
}

// Show processing status
document.getElementById("processingStatus").style.display = "block"
document.getElementById("results").innerHTML = ""

try {
  let transactions = []

  if(fileType === "pdf"){
    // Extract text from PDF
    document.getElementById("statusMessage").textContent = "Extracting text from PDF..."
    const pdfText = await extractTextFromPDF(file)

    // Parse transactions
    document.getElementById("statusMessage").textContent = "Parsing transactions..."
    transactions = parsePaymentTransactions(pdfText, gateway)
  } else {
    // Parse CSV
    document.getElementById("statusMessage").textContent = "Parsing CSV file..."
    const csvText = await file.text()
    transactions = parseCSVTransactions(csvText, gateway)
  }

  if(transactions.length === 0){
    showResult("No transactions found in file", "error")
    return
  }

  // Process each transaction
  document.getElementById("statusMessage").textContent = `Processing ${transactions.length} transactions...`

  let results = {
    successful: [],
    failed: [],
    unmatched: []
  }

  for(let txn of transactions){
    try {
      // Find member by name
      const memberId = await findMemberByName(txn.memberName)

      if(!memberId){
        results.unmatched.push({
          ...txn,
          reason: "Member not found"
        })
        continue
      }

      // Get member data
      const memberDoc = await db.collection("members").doc(memberId).get()
      const memberData = memberDoc.data()

      // Create income document
      const incomeDoc = await db.collection("income").add({
        MemberID: memberId,
        MemberName: memberData.Name,
        CollectionDate: txn.date,
        Amount: txn.amount,
        Purpose: txn.purpose,
        Type: gateway,
        Memo: `Imported from ${gateway} PDF`,
        SourceType: `${gateway.toLowerCase()}_pdf`,
        SourceFile: file.name,
        CreatedDate: new Date()
      })

      results.successful.push({
        ...txn,
        incomeId: incomeDoc.id,
        memberId: memberId
      })

      console.log("Income inserted:", incomeDoc.id)

    } catch(error){
      console.error("Error processing transaction:", error)
      results.failed.push({
        ...txn,
        error: error.message
      })
    }
  }

  // Display results
  displayResults(results, gateway)

} catch(error){
  console.error("Error processing statement:", error)
  showResult("Error: " + error.message, "error")
} finally {
  document.getElementById("processingStatus").style.display = "none"
}

}

/* ===============================
   EXTRACT TEXT FROM PDF
================================ */

async function extractTextFromPDF(file){

return new Promise((resolve, reject) => {
  const reader = new FileReader()

  reader.onload = async function(event){
    try {
      // Set up PDF.js worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

      const pdf = await pdfjsLib.getDocument(new Uint8Array(event.target.result)).promise
      let fullText = ""

      console.log("PDF pages:", pdf.numPages)

      // Extract text from all pages
      for(let i = 1; i <= pdf.numPages; i++){
        try {
          const page = await pdf.getPage(i)
          const textContent = await page.getTextContent()
          const pageText = textContent.items.map(item => item.str).join(" ")
          fullText += pageText + "\n"
          console.log(`Page ${i} text length:`, pageText.length)
        } catch(pageError){
          console.error(`Error extracting page ${i}:`, pageError)
        }
      }

      console.log("Total extracted text length:", fullText.length)

      if(fullText.length === 0){
        reject(new Error("No text found in PDF. File may be image-based or corrupted."))
        return
      }

      resolve(fullText)
    } catch(error){
      console.error("PDF extraction error:", error)
      reject(error)
    }
  }

  reader.onerror = function(){
    reject(new Error("Failed to read file"))
  }

  reader.readAsArrayBuffer(file)
})

}

/* ===============================
   PARSE PAYMENT TRANSACTIONS
================================ */

function parsePaymentTransactions(text, gateway){

const transactions = []

// Remove extra whitespace and normalize
text = text.replace(/\s+/g, " ").trim()

console.log("Parsing text length:", text.length)
console.log("First 500 chars:", text.substring(0, 500))

// Strategy: Look for date patterns followed by amounts
// Handles formats like: 01/01/2026 General Offerings 1,000.00

// Find all lines with potential transaction data
const lines = text.split(/[\n;]/).filter(line => line.trim().length > 0)

console.log("Total lines found:", lines.length)

// Try to parse as table format (most common for statements)
const tableTransactions = parseTableFormat(lines, text)
if(tableTransactions.length > 0){
  return tableTransactions
}

// Fallback: Try original Stripe/PayPal format
if(gateway === "Stripe"){
  // Look for Stripe patterns
  const stripeTransactions = parseStripeFormat(text)
  if(stripeTransactions.length > 0) return stripeTransactions
} else if(gateway === "PayPal"){
  // Look for PayPal patterns
  const paypalTransactions = parsePayPalFormat(text)
  if(paypalTransactions.length > 0) return paypalTransactions
}

// If still no transactions, try generic date + amount pattern
return parseGenericFormat(text)

}

/* ===============================
   PARSE TABLE FORMAT (Most Common)
================================ */

function parseTableFormat(lines, fullText){

const transactions = []
let memberName = null

// Extract member name - look for names before transaction table
const namePattern = /^[A-Z][a-z]+ [A-Z][a-z]+/
for(let line of lines){
  const match = line.match(namePattern)
  if(match){
    memberName = match[0]
    break
  }
}

// Look for date patterns (MM/DD/YYYY or DD/MM/YYYY)
const dateRegex = /(\d{1,2})\/(\d{1,2})\/(\d{4})/g
const amountRegex = /(\d+,?\d*\.\d{2})/g

let dateMatch
const datePositions = []

// Find all date positions
while((dateMatch = dateRegex.exec(fullText)) !== null){
  datePositions.push({
    date: dateMatch[0],
    position: dateMatch.index,
    value: dateMatch[0]
  })
}

console.log("Found dates:", datePositions.length)

// For each date, find the next amount
for(let i = 0; i < datePositions.length; i++){
  const datePos = datePositions[i]
  const nextDatePos = datePositions[i + 1] ? datePositions[i + 1].position : fullText.length

  // Get text between this date and next date
  const segment = fullText.substring(datePos.position, nextDatePos)

  // Find amount in this segment
  const amountMatch = segment.match(amountRegex)
  if(amountMatch){
    // Extract purpose/description from segment
    let purpose = "General Offering"

    if(segment.includes("General Offering")){
      purpose = "General Offering"
    } else if(segment.includes("Tithe")){
      purpose = "Tithe"
    } else if(segment.includes("Donation")){
      purpose = "Donation"
    } else if(segment.includes("Special")){
      purpose = "Special Offering"
    } else if(segment.includes("Building")){
      purpose = "Building Fund"
    } else if(segment.includes("Mission")){
      purpose = "Mission Fund"
    }

    transactions.push({
      memberName: memberName || "Unknown",
      date: formatDate(datePos.value),
      amount: parseFloat(amountMatch[0].replace(/,/g, "")),
      purpose: purpose
    })
  }
}

console.log("Transactions found via table format:", transactions.length)
return transactions

}

/* ===============================
   PARSE STRIPE FORMAT
================================ */

function parseStripeFormat(text){

const transactions = []
const lines = text.split(/[\n;]/)

let currentTransaction = {}

for(let line of lines){
  line = line.trim()

  if(/\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}/.test(line)){
    if(currentTransaction.date === undefined){
      currentTransaction.date = extractDate(line)
    }
  }

  if(/\$?\d+[.,]\d{2}/.test(line)){
    if(currentTransaction.amount === undefined){
      currentTransaction.amount = parseFloat(line.replace(/[^0-9.]/g, ""))
    }
  }

  if(/tithe|offering|donation|contribution|collection|fund/i.test(line)){
    if(currentTransaction.purpose === undefined){
      currentTransaction.purpose = line.length > 50 ? line.substring(0, 50) : line
    }
  }

  if(/^[A-Z][a-z]+ [A-Z][a-z]+/.test(line) &&
     !/date|amount|stripe|payment|transaction/i.test(line)){
    if(currentTransaction.memberName === undefined){
      currentTransaction.memberName = line
    }
  }

  if(currentTransaction.memberName && currentTransaction.date &&
     currentTransaction.amount && currentTransaction.purpose){
    transactions.push(currentTransaction)
    currentTransaction = {}
  }
}

return transactions

}

/* ===============================
   PARSE PAYPAL FORMAT
================================ */

function parsePayPalFormat(text){

const transactions = []
const lines = text.split(/[\n;]/)

let currentTransaction = {}

for(let line of lines){
  line = line.trim()

  if(/date:/i.test(line) || /\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}/.test(line)){
    if(currentTransaction.date === undefined){
      currentTransaction.date = extractDate(line)
    }
  }

  if(/amount:|total:|\$\d+/i.test(line) || /\$?\d+[.,]\d{2}/.test(line)){
    if(currentTransaction.amount === undefined){
      currentTransaction.amount = parseFloat(line.replace(/[^0-9.]/g, ""))
    }
  }

  if(/item:|description:|[a-z]+ (offering|donation|tithe|fund)/i.test(line)){
    if(currentTransaction.purpose === undefined){
      currentTransaction.purpose = line.replace(/item:|description:|/i, "").substring(0, 50)
    }
  }

  if(/^[A-Z][a-z]+ [A-Z][a-z]+/.test(line) &&
     !/paypal|date|amount|transaction/i.test(line)){
    if(currentTransaction.memberName === undefined){
      currentTransaction.memberName = line
    }
  }

  if(currentTransaction.memberName && currentTransaction.date &&
     currentTransaction.amount && currentTransaction.purpose){
    transactions.push(currentTransaction)
    currentTransaction = {}
  }
}

return transactions

}

/* ===============================
   PARSE GENERIC FORMAT
================================ */

function parseGenericFormat(text){

const transactions = []

// Look for any date followed by amounts
const pattern = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\s+([^0-9]*?)\s*([\d,]+\.\d{2})/g

let match
while((match = pattern.exec(text)) !== null){
  const date = `${match[3]}-${match[1].padStart(2, '0')}-${match[2].padStart(2, '0')}`
  const description = match[4].trim()
  const amount = parseFloat(match[5].replace(/,/g, ""))

  transactions.push({
    memberName: "Member",
    date: date,
    amount: amount,
    purpose: description || "Offering"
  })
}

return transactions

}

/* ===============================
   PARSE CSV TRANSACTIONS
================================ */

function parseCSVTransactions(csvText, gateway){

const transactions = []
const rows = csvText.split("\n")

// Skip header row
for(let i = 1; i < rows.length; i++){
  if(!rows[i].trim()) continue

  const cols = rows[i].split(",")

  if(cols.length < 4) continue

  transactions.push({
    date: cols[0].trim(),
    memberName: cols[1].trim(),
    amount: parseFloat(cols[2]),
    purpose: cols[3].trim()
  })
}

return transactions

}

/* ===============================
   FIND MEMBER BY NAME
================================ */

async function findMemberByName(name){

try {
  const snap = await db.collection("members")
    .where("Name", "==", name)
    .limit(1)
    .get()

  if(!snap.empty){
    return snap.docs[0].id
  }

  // Try partial match (case-insensitive)
  const allSnap = await db.collection("members").get()
  const nameLower = name.toLowerCase()

  for(const doc of allSnap.docs){
    if(doc.data().Name.toLowerCase().includes(nameLower)){
      return doc.id
    }
  }

  return null
} catch(error){
  console.error("Error finding member:", error)
  return null
}

}

/* ===============================
   EXTRACT DATE
================================ */

function extractDate(str){

// Match various date formats
const datePattern = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})|(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/
const match = str.match(datePattern)

if(match){
  if(match[1]){ // MM/DD/YYYY or DD/MM/YYYY
    const m = match[1], d = match[2], y = match[3]
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  } else { // YYYY-MM-DD
    return `${match[4]}-${match[5].padStart(2, '0')}-${match[6].padStart(2, '0')}`
  }
}

return null

}

/* ===============================
   FORMAT DATE
================================ */

function formatDate(dateStr){

if(!dateStr) return getLocalDateString(new Date())

// Convert to YYYY-MM-DD format
const date = new Date(dateStr)
if(isNaN(date)) return getLocalDateString(new Date())

return getLocalDateString(date)

}

/* ===============================
   DISPLAY RESULTS
================================ */

function displayResults(results, gateway){

let html = '<div class="summary">'

html += `<h3>${gateway} Income Import Results</h3>`
html += `<div class="summary-item success">✅ Successfully imported: ${results.successful.length}</div>`
html += `<div class="summary-item warning">⚠ Could not match: ${results.unmatched.length}</div>`
html += `<div class="summary-item error">❌ Failed: ${results.failed.length}</div>`
html += '</div>'

if(results.successful.length > 0){
  html += '<h4>✅ Successfully Imported</h4>'
  for(let txn of results.successful){
    html += `<div class="transaction-item">
      <b>${txn.memberName}</b> - $${txn.amount.toFixed(2)}<br>
      <div class="transaction-details">
        Date: ${txn.date} | Purpose: ${txn.purpose}
      </div>
    </div>`
  }
}

if(results.unmatched.length > 0){
  html += '<h4>⚠ Unmatched (Member Not Found)</h4>'
  for(let txn of results.unmatched){
    html += `<div class="transaction-item warning">
      <b>${txn.memberName}</b> - $${txn.amount.toFixed(2)}<br>
      <div class="transaction-details">
        Date: ${txn.date} | Reason: ${txn.reason}
      </div>
    </div>`
  }
}

if(results.failed.length > 0){
  html += '<h4>❌ Failed to Import</h4>'
  for(let txn of results.failed){
    html += `<div class="transaction-item error">
      <b>${txn.memberName}</b> - $${txn.amount.toFixed(2)}<br>
      <div class="transaction-details">
        Error: ${txn.error}
      </div>
    </div>`
  }
}

document.getElementById("results").innerHTML = html

}

/* ===============================
   SHOW IMPORTED TRANSACTIONS
================================ */

async function viewImportedTransactions(){

// Get all imported transactions (Stripe and PayPal)
const stripeSnap = await db.collection("income")
  .where("Type", "==", "Stripe")
  .orderBy("CollectionDate", "desc")
  .get()

const paypalSnap = await db.collection("income")
  .where("Type", "==", "PayPal")
  .orderBy("CollectionDate", "desc")
  .get()

// Combine results
const allDocs = [...stripeSnap.docs, ...paypalSnap.docs]

let html = '<h3>Imported Income Transactions</h3>'

if(allDocs.length === 0){
  html += '<p>No imported transactions found</p>'
  document.getElementById("results").innerHTML = html
  return
}

// Sort by date descending
allDocs.sort((a, b) => {
  const dateStrA = a.data().CollectionDate
  const dateStrB = b.data().CollectionDate
  const [yearA, monthA, dayA] = dateStrA.split('-')
  const [yearB, monthB, dayB] = dateStrB.split('-')
  const dateA = new Date(yearA, monthA - 1, dayA)
  const dateB = new Date(yearB, monthB - 1, dayB)
  return dateB - dateA
})

for(const doc of allDocs){
  const txn = doc.data()
  html += `<div class="transaction-item">
    <b>${txn.MemberName}</b> - $${txn.Amount.toFixed(2)}<br>
    <div class="transaction-details">
      Date: ${txn.CollectionDate} | Type: ${txn.Type} | Purpose: ${txn.Purpose}
    </div>
  </div>`
}

document.getElementById("results").innerHTML = html

}

/* ===============================
   SHOW RESULT
================================ */

function showResult(message, type){

let color = "#4caf50"
let bgColor = "#e8f5e9"

if(type === "error"){
  color = "#f44336"
  bgColor = "#ffebee"
} else if(type === "warning"){
  color = "#ff9800"
  bgColor = "#fff3e0"
}

const html = `<div style="padding:15px; background:${bgColor}; color:${color}; border-left:4px solid ${color}; border-radius:4px;">
  ${message}
</div>`

document.getElementById("results").innerHTML = html

}

