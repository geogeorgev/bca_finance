function loadReports(){

show(`

<h2>Reports</h2>

<button onclick="collectionReport()">Collection Report</button>
<button onclick="expenseReport()">Expense Report</button>
<button onclick="showContributionStatementGenerator()">Annual Contribution Statement</button>
<button onclick="backupDatabase()">Backup Database</button>

`)

}

async function collectionReport(){

const snap = await db.collection("income").get()

let total=0
let html="<h2>Collection Report</h2>"

snap.forEach(doc=>{

const d=doc.data()

total+=d.Amount

html+=`<div class="card">${d.MemberName} $${d.Amount}</div>`

})

html+=`<h3>Total ${total}</h3>`

show(html)

}

async function expenseReport(){

const snap=await db.collection("expense").get()

let total=0
let html="<h2>Expense Report</h2>"

snap.forEach(doc=>{

const d=doc.data()

total+=d.Amount

//html+=`<div class="card">${d.PayeeName} $${d.Amount}</div>`

const payee = d.MemberName || d.PayeeName || "Unknown"
html += `<div class="card">${payee} $${d.Amount}</div>`

})

html+=`<h3>Total ${total}</h3>`

show(html)

}

async function backupDatabase(){

let backup={}

const collections=["members","income","expense","budget"]

for(const col of collections){

const snap=await db.collection(col).get()

backup[col]=[]

snap.forEach(doc=>{
backup[col].push(doc.data())
})

}

const json=JSON.stringify(backup,null,2)

const blob=new Blob([json],{type:"application/json"})

const url=URL.createObjectURL(blob)

const a=document.createElement("a")

a.href=url
a.download="church_backup.json"
a.click()

}

//
async function generateMemberPDF(memberId){

const memberDoc = await db.collection("members").doc(memberId).get()
const member = memberDoc.data()

const incomeSnap = await db.collection("income")
.where("MemberID","==",memberId)
.get()

let total=0
let rows=""

incomeSnap.forEach(doc=>{

const d=doc.data()

total+=d.Amount

rows+=`${d.Purpose} - $${d.Amount}\n`

})

const { jsPDF } = window.jspdf

const pdf = new jsPDF()

pdf.text("Church Contribution Statement",20,20)

pdf.text(`Member: ${member.Name}`,20,40)

pdf.text(rows,20,60)

pdf.text(`Total Contribution: $${total}`,20,200)

pdf.save(member.Name+"_statement.pdf")

}

/* SHOW CONTRIBUTION STATEMENT GENERATOR */
async function showContributionStatementGenerator(){

const currentYear = new Date().getFullYear()

const membersSnap = await db.collection("members").get()

let activeMembers = []

membersSnap.forEach(doc=>{
  const m = doc.data()
  if(m.Active){
    activeMembers.push({id: doc.id, name: m.Name})
  }
})

// Sort by name
activeMembers.sort((a, b) => a.name.localeCompare(b.name))

let memberOptions = ""

activeMembers.forEach(member=>{
  memberOptions += `<option value="${member.id}">${member.name}</option>`
})

show(`

<h2>Annual Contribution Statement</h2>

<p>Generate tax return contribution statements for members</p>

<label>Select Member:</label>
<select id="selectedMember">
  <option value="">-- Select a member --</option>
  ${memberOptions}
  <option value="all">-- All Members --</option>
</select>

<br><br>

<label>Tax Year:</label>
<input type="number" id="taxYear" value="${currentYear}">

<br><br>

<button onclick="generateContributionStatement()">Generate PDF</button>

<button onclick="loadReports()">Cancel</button>

`)

}

/* GENERATE CONTRIBUTION STATEMENT PDF */
async function generateContributionStatement(){

const selectedMember = document.getElementById("selectedMember").value
const taxYear = parseInt(document.getElementById("taxYear").value)

if(!selectedMember){
  alert("Please select a member")
  return
}

if(selectedMember === "all"){
  // Generate for all active members
  await generateAllMembersStatement(taxYear)
} else {
  // Generate for single member
  await generateSingleMemberStatement(selectedMember, taxYear)
}

}

/* GENERATE SINGLE MEMBER STATEMENT */
async function generateSingleMemberStatement(memberId, taxYear){

const memberDoc = await db.collection("members").doc(memberId).get()
const member = memberDoc.data()

const incomeSnap = await db.collection("income")
  .where("MemberID", "==", memberId)
  .get()

let totalContribution = 0
let contributions = []

incomeSnap.forEach(doc=>{
  const d = doc.data()
  const date = new Date(d.CollectionDate)

  // Filter by year
  if(date.getFullYear() === taxYear){
    totalContribution += d.Amount
    contributions.push({
      date: d.CollectionDate,
      purpose: d.Purpose,
      amount: d.Amount
    })
  }
})

// Sort by date
contributions.sort((a, b) => {
  const dateA = new Date(a.date)
  const dateB = new Date(b.date)
  return dateA - dateB
})

// Generate PDF
const { jsPDF } = window.jspdf

const pdf = new jsPDF()
const pageWidth = pdf.internal.pageSize.getWidth()
const pageHeight = pdf.internal.pageSize.getHeight()
let yPosition = 20

// Add logo
addLogoPDF(pdf, pageWidth)

yPosition = 50

// Header
pdf.setFontSize(16)
pdf.text("ANNUAL CONTRIBUTION STATEMENT", pageWidth / 2, yPosition, { align: "center" })

yPosition += 10

pdf.setFontSize(10)
pdf.text(`Tax Year: ${taxYear}`, pageWidth / 2, yPosition, { align: "center" })

yPosition += 15

// Member Information
pdf.setFontSize(11)
pdf.setFont(undefined, "bold")
pdf.text("Member Information", 20, yPosition)

yPosition += 8

pdf.setFont(undefined, "normal")
pdf.setFontSize(10)

pdf.text(`Name: ${member.Name}`, 20, yPosition)
yPosition += 7

if(member.Address1){
  pdf.text(`Address: ${member.Address1}`, 20, yPosition)
  yPosition += 7
}

if(member.Address2){
  pdf.text(`${member.Address2}`, 20, yPosition)
  yPosition += 7
}

if(member.Address3){
  pdf.text(`${member.Address3}`, 20, yPosition)
  yPosition += 7
}

if(member.Email){
  pdf.text(`Email: ${member.Email}`, 20, yPosition)
  yPosition += 7
}

if(member.Phone){
  pdf.text(`Phone: ${member.Phone}`, 20, yPosition)
  yPosition += 7
}

yPosition += 5

// Contribution Summary
pdf.setFont(undefined, "bold")
pdf.setFontSize(11)
pdf.text("Contribution Summary", 20, yPosition)

yPosition += 8

pdf.setFont(undefined, "normal")
pdf.setFontSize(10)

pdf.text(`Total Contributions: $${totalContribution.toFixed(2)}`, 20, yPosition)
yPosition += 10

// Contribution Details Table
pdf.setFontSize(9)
pdf.setFont(undefined, "bold")

const columnX = [20, 60, 100, 150]
const headers = ["Date", "Purpose", "Amount", ""]

pdf.text("Date", columnX[0], yPosition)
pdf.text("Purpose", columnX[1], yPosition)
pdf.text("Amount", columnX[2], yPosition)

yPosition += 8

pdf.setFont(undefined, "normal")

contributions.forEach(contribution => {

  if(yPosition > pageHeight - 30){
    pdf.addPage()
    yPosition = 20
  }

  const date = new Date(contribution.date)
  const dateStr = date.toLocaleDateString()

  pdf.text(dateStr, columnX[0], yPosition)
  pdf.text(contribution.purpose, columnX[1], yPosition)
  pdf.text(`$${contribution.amount.toFixed(2)}`, columnX[2], yPosition)

  yPosition += 7
})

yPosition += 5

// Footer
pdf.setFont(undefined, "italic")
pdf.setFontSize(9)
pdf.text("This statement is provided for tax return purposes.", 20, yPosition)

yPosition += 5

pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition)

// Save PDF
pdf.save(`${member.Name}_Contribution_Statement_${taxYear}.pdf`)

alert(`Contribution statement generated for ${member.Name}`)
loadReports()

}

/* GENERATE ALL MEMBERS STATEMENTS */
async function generateAllMembersStatement(taxYear){

const membersSnap = await db.collection("members").get()

let activeMembers = []

membersSnap.forEach(doc=>{
  const m = doc.data()
  if(m.Active){
    activeMembers.push({id: doc.id, data: m})
  }
})

const totalMembers = activeMembers.length

if(totalMembers === 0){
  alert("No active members found")
  return
}

let processedCount = 0

for(const member of activeMembers){
  const memberData = member.data

  const incomeSnap = await db.collection("income")
    .where("MemberID", "==", member.id)
    .get()

  let totalContribution = 0
  let contributions = []

  incomeSnap.forEach(doc=>{
    const d = doc.data()
    const date = new Date(d.CollectionDate)

    if(date.getFullYear() === taxYear){
      totalContribution += d.Amount
      contributions.push({
        date: d.CollectionDate,
        purpose: d.Purpose,
        amount: d.Amount
      })
    }
  })

  contributions.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateA - dateB
  })

  // Generate PDF for this member
  const { jsPDF } = window.jspdf

  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  let yPosition = 20

  // Add logo
  addLogoPDF(pdf, pageWidth)

  yPosition = 50

  // Header
  pdf.setFontSize(16)
  pdf.text("ANNUAL CONTRIBUTION STATEMENT", pageWidth / 2, yPosition, { align: "center" })

  yPosition += 10

  pdf.setFontSize(10)
  pdf.text(`Tax Year: ${taxYear}`, pageWidth / 2, yPosition, { align: "center" })

  yPosition += 15

  // Member Information
  pdf.setFontSize(11)
  pdf.setFont(undefined, "bold")
  pdf.text("Member Information", 20, yPosition)

  yPosition += 8

  pdf.setFont(undefined, "normal")
  pdf.setFontSize(10)

  pdf.text(`Name: ${memberData.Name}`, 20, yPosition)
  yPosition += 7

  if(memberData.Address1){
    pdf.text(`Address: ${memberData.Address1}`, 20, yPosition)
    yPosition += 7
  }

  if(memberData.Address2){
    pdf.text(`${memberData.Address2}`, 20, yPosition)
    yPosition += 7
  }

  if(memberData.Address3){
    pdf.text(`${memberData.Address3}`, 20, yPosition)
    yPosition += 7
  }

  if(memberData.Email){
    pdf.text(`Email: ${memberData.Email}`, 20, yPosition)
    yPosition += 7
  }

  if(memberData.Phone){
    pdf.text(`Phone: ${memberData.Phone}`, 20, yPosition)
    yPosition += 7
  }

  yPosition += 5

  // Contribution Summary
  pdf.setFont(undefined, "bold")
  pdf.setFontSize(11)
  pdf.text("Contribution Summary", 20, yPosition)

  yPosition += 8

  pdf.setFont(undefined, "normal")
  pdf.setFontSize(10)

  pdf.text(`Total Contributions: $${totalContribution.toFixed(2)}`, 20, yPosition)
  yPosition += 10

  // Contribution Details Table
  pdf.setFontSize(9)
  pdf.setFont(undefined, "bold")

  pdf.text("Date", 20, yPosition)
  pdf.text("Purpose", 60, yPosition)
  pdf.text("Amount", 150, yPosition)

  yPosition += 8

  pdf.setFont(undefined, "normal")

  contributions.forEach(contribution => {

    if(yPosition > pageHeight - 30){
      pdf.addPage()
      yPosition = 20
    }

    const date = new Date(contribution.date)
    const dateStr = date.toLocaleDateString()

    pdf.text(dateStr, 20, yPosition)
    pdf.text(contribution.purpose, 60, yPosition)
    pdf.text(`$${contribution.amount.toFixed(2)}`, 150, yPosition)

    yPosition += 7
  })

  yPosition += 5

  // Footer
  pdf.setFont(undefined, "italic")
  pdf.setFontSize(9)
  pdf.text("This statement is provided for tax return purposes.", 20, yPosition)

  yPosition += 5

  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition)

  // Save PDF
  pdf.save(`${memberData.Name}_Contribution_Statement_${taxYear}.pdf`)

  processedCount++
}

alert(`Generated contribution statements for ${processedCount} members`)
loadReports()

}
