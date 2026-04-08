# Guest Contribution Statement Generation Guide

## Current System Behavior

### How Guest Offerings Are Recorded
1. **Income Entry**: When recording a contribution, users can select:
   - **Member** - Records with member ID and auto-updates `TotalContribution`
   - **Guest** - Records with `MemberID: "GUEST"` (no member record created)

2. **Database Storage**: Guest offerings are stored in the `income` collection as:
   ```javascript
   {
     IncomeID: "...",
     MemberID: "GUEST",  // ← Special marker
     MemberName: "Guest Name",
     Purpose: "Offering-Common",
     Type: "Cash",
     Amount: 50.00,
     CollectionDate: "2026-04-07",
     CreateDate: timestamp
   }
   ```

### Current Limitation
The **Annual Contribution Statement** generator (Reports → Contribution Statement):
- ✅ Only shows active **members** in the dropdown
- ❌ Cannot generate statements for guests (no member record exists)
- ❌ Guest contributions are not included in member statements

---

## Solution: Generate Guest Contribution Statement

### Option 1: Quick Receipt for Individual Guest (Minimal Code)
Generate a simple one-time receipt immediately after a guest offering is recorded.

**File**: `income.js`
**Location**: Around line 250 (after saving income)

```javascript
// After saveIncomeToDatabase completes, add:
if(memberId === "GUEST") {
  // Option: Show option to print receipt
  const printReceipt = confirm("Print contribution receipt for guest?");
  if(printReceipt) {
    generateGuestContributionReceipt(memberName, amount, collectionDate, purpose);
  }
}
```

**New Function** (add to `income.js`):
```javascript
function generateGuestContributionReceipt(guestName, amount, date, purpose) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  
  pdf.setFontSize(14);
  pdf.setFont(undefined, "bold");
  pdf.text("Contribution Receipt", 20, 20);
  
  pdf.setFontSize(11);
  pdf.setFont(undefined, "normal");
  pdf.text(`Guest Name: ${guestName}`, 20, 40);
  pdf.text(`Amount: $${amount.toFixed(2)}`, 20, 50);
  pdf.text(`Date: ${date}`, 20, 60);
  pdf.text(`Purpose: ${purpose}`, 20, 70);
  pdf.text("Thank you for your generous contribution!", 20, 90);
  
  pdf.save(`${guestName}_Receipt_${date}.pdf`);
}
```

---

### Option 2: Guest Contribution Summary Report (Recommended)
Generate a report of ALL guest offerings for a date range.

**File**: `reports.js`
**Location**: Add new function to Reports section

```javascript
async function showGuestContributionReport() {
  const currentYear = new Date().getFullYear();
  
  show(`
    <h2>Guest Contributions Report</h2>
    
    <label>Start Date:</label>
    <input type="date" id="guestReportStart" value="${currentYear}-01-01">
    
    <br><br>
    
    <label>End Date:</label>
    <input type="date" id="guestReportEnd" value="${new Date().toISOString().split('T')[0]}">
    
    <br><br>
    
    <button onclick="generateGuestContributionReport()">Generate Report</button>
    <button onclick="loadReports()">Cancel</button>
  `);
}

async function generateGuestContributionReport() {
  const startDate = document.getElementById("guestReportStart").value;
  const endDate = document.getElementById("guestReportEnd").value;
  
  const incomeSnap = await db.collection("income")
    .where("MemberID", "==", "GUEST")
    .get();
  
  let totalGuests = 0;
  let totalAmount = 0;
  let guestContributions = [];
  
  incomeSnap.forEach(doc => {
    const d = doc.data();
    const [year, month, day] = d.CollectionDate.split('-');
    const date = new Date(year, month - 1, day);
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if(date >= start && date <= end) {
      totalGuests++;
      totalAmount += d.Amount;
      guestContributions.push(d);
    }
  });
  
  // Sort by date
  guestContributions.sort((a, b) => 
    new Date(a.CollectionDate) - new Date(b.CollectionDate)
  );
  
  // Generate PDF
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  pdf.setFontSize(16);
  pdf.setFont(undefined, "bold");
  pdf.text("Guest Contributions Report", 20, 20);
  
  pdf.setFontSize(11);
  pdf.setFont(undefined, "normal");
  pdf.text(`Period: ${startDate} to ${endDate}`, 20, 35);
  pdf.text(`Total Guest Contributions: ${totalGuests}`, 20, 45);
  pdf.text(`Total Amount: $${totalAmount.toFixed(2)}`, 20, 55);
  
  let yPos = 70;
  pdf.setFontSize(10);
  pdf.setFont(undefined, "bold");
  pdf.text("Guest Name", 20, yPos);
  pdf.text("Amount", 100, yPos);
  pdf.text("Purpose", 130, yPos);
  pdf.text("Date", 170, yPos);
  
  yPos += 8;
  pdf.setFont(undefined, "normal");
  
  guestContributions.forEach(contrib => {
    if(yPos > 250) {
      pdf.addPage();
      yPos = 20;
    }
    pdf.text(contrib.MemberName, 20, yPos);
    pdf.text(`$${contrib.Amount.toFixed(2)}`, 100, yPos);
    pdf.text(contrib.Purpose, 130, yPos);
    pdf.text(contrib.CollectionDate, 170, yPos);
    yPos += 8;
  });
  
  pdf.save(`Guest_Contributions_${startDate}_to_${endDate}.pdf`);
  alert(`Report generated for ${totalGuests} guest contributions totaling $${totalAmount.toFixed(2)}`);
  loadReports();
}
```

**Add to Reports Menu** (in `loadReports()` function):
```html
<button onclick="showGuestContributionReport()" style="...">
  👥 Guest Contributions Report
</button>
```

---

### Option 3: Create Guest Profile (Most Flexible)
Instead of using `MemberID: "GUEST"`, create a temporary guest profile that can generate statements.

**Database**: Add new `guests` collection
```javascript
{
  GuestID: "guest_123",
  Name: "John Doe",
  Email: "john@example.com",  // Optional
  Phone: "555-1234",            // Optional
  CreatedDate: timestamp,
  TotalContribution: 150.00
}
```

**Modification to `income.js`**:
```javascript
if(contributorType === "guest") {
  // Create guest profile if new
  const guestName = document.getElementById("guestName").value;
  const guestQuery = await db.collection("guests")
    .where("Name", "==", guestName)
    .get();
  
  let guestId;
  if(guestQuery.empty) {
    const guestRef = db.collection("guests").doc();
    guestId = guestRef.id;
    await guestRef.set({
      GuestID: guestId,
      Name: guestName,
      CreatedDate: firebase.firestore.FieldValue.serverTimestamp(),
      TotalContribution: 0
    });
  } else {
    guestId = guestQuery.docs[0].id;
  }
  memberId = guestId;
}

// Then income is saved with real guestId instead of "GUEST"
// And TotalContribution gets updated
```

---

## Recommendation

**For Immediate Implementation**: Use **Option 1** or **Option 2**
- Option 1: Quick receipt after each guest offering
- Option 2: Monthly/yearly guest contribution summary report

**For Long-term**: Consider **Option 3**
- Allows individual guest statements
- Tracks repeat guest contributors
- More detailed analytics

---

## Files to Modify

### Option 1 Changes
- **`js/income.js`**: Add receipt generation

### Option 2 Changes
- **`js/reports.js`**: Add guest report function and add button to menu

### Option 3 Changes
- **`js/income.js`**: Modify guest handling logic
- **`js/reports.js`**: Add guest contribution statements
- Firestore: Create `guests` collection

---

## Test Scenarios

1. **Record a guest offering** → Verify MemberID = "GUEST" in database
2. **Generate guest report** → Should show all "GUEST" MemberID contributions
3. **Compare totals** → Guest report total should match sum of income collection entries where MemberID = "GUEST"

