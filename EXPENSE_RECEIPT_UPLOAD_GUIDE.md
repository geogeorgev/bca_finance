# Expense Receipt Upload Feature - Complete Documentation

## Overview

Receipt upload functionality has been added to the Add Expense screen. Receipts are stored in Firebase Storage and linked to expense records for easy retrieval and audit trails.

---

## How It Works

### 1. **Receipt Upload Field**

**Location:** Add Expense Screen

**Features:**
- Optional file upload field
- Accepts: Images (JPG, PNG) and PDF files
- File size: Typically up to 25MB per Firebase Storage limits

```
Upload Receipt (Optional)
[Choose File]
Accepted: Images (JPG, PNG) or PDF files
```

---

### 2. **Storage Location**

**Firebase Storage Path Structure:**
```
receipts/
├── 2026/
│   ├── 1711270400000_receipt_office_supplies.pdf
│   ├── 1711270450000_utility_bill.jpg
│   └── 1711270500000_vendor_invoice.png
├── 2027/
│   └── ...
└── ...
```

**Path Format:**
```
receipts/{budgetYear}/{timestamp}_{originalFileName}
```

**Example:**
```
receipts/2026/1711270400000_receipt_office_supplies.pdf
```

---

### 3. **Expense Document Storage**

**Firebase Collection:** `expense`

**New Fields Added:**
```javascript
{
  Type: "member",
  MemberName: "John Doe",
  Category: "Office Supplies",
  SubCategory: "Stationery",
  Amount: 150.00,
  PaymentDate: Timestamp,
  PaymentMethod: "check",
  CheckNumber: "1001",
  Description: "Bulk office supplies purchase",
  BudgetYear: "2026",
  
  // Receipt Fields (NEW)
  ReceiptUrl: "https://firebasestorage.googleapis.com/...",
  ReceiptFileName: "receipt_office_supplies.pdf",
  
  CreatedDate: Timestamp
}
```

---

## Step-by-Step: How to Upload a Receipt

### Step 1: Open Add Expense
```
Expense → Add Expense
```

### Step 2: Fill Expense Details
- Type: Member or Non-Member
- Category: Select category
- SubCategory: Select subcategory
- Amount: Enter amount
- Payment Method: Cash or Check
- Description: Enter description

### Step 3: Upload Receipt
```
Upload Receipt (Optional)
[Click "Choose File"]
```

### Step 4: Select Receipt File
- Browse computer
- Select image (JPG, PNG) or PDF
- File will show in the field

### Step 4: Save Expense
```
[Click "Save Expense"]
```

**Result:**
- ✅ Receipt uploaded to Firebase Storage
- ✅ Download URL stored in expense document
- ✅ Success message: "Expense Saved and Receipt Uploaded"

---

## Viewing & Downloading Receipts

### From Expense Table

**Location:** Expense → Main List

**Receipt Column:**
- If receipt uploaded: Shows link with 📎 icon
- If no receipt: Shows "—" (dash)

**To Download:**
```
Click the receipt link in the table
→ Opens in new browser tab
→ Download or view directly
```

**Example:**
```
Type | Member    | Category       | Amount | Receipt
-----|-----------|----------------|--------|----------
paid | John Doe  | Office Sup.    | $150   | 📎 receipt_office_supplies.pdf
paid | Jane      | Utilities      | $200   | —
```

---

## Technical Details

### Upload Process

```javascript
// Get file from input
const receiptFile = document.getElementById("receiptFile").files[0]

// Create unique filename with timestamp
const timestamp = Date.now()
const fileName = `${timestamp}_${receiptFile.name}`

// Upload to Firebase Storage
const storagePath = `receipts/${budgetYear}/${fileName}`
const storageRef = firebase.storage().ref(storagePath)
const uploadTask = await storageRef.put(receiptFile)

// Get download URL
const receiptUrl = await uploadTask.ref.getDownloadURL()

// Save URL to expense document
await db.collection("expense").add({
  // ... expense fields
  ReceiptUrl: receiptUrl,
  ReceiptFileName: receiptFile.name
})
```

---

## Firebase Storage Configuration

### Required Setup

**Firebase Storage must be enabled:**
1. ✅ Firebase Console → Storage
2. ✅ Create bucket
3. ✅ Set security rules (allow authenticated users)

**Storage Rules (Example):**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /receipts/{allPaths=**} {
      allow read, write: if request.auth != null;
      allow delete: if request.auth != null;
    }
  }
}
```

---

## File Organization

### By Budget Year

Receipts are automatically organized by budget year:

```
2026 Expenses
├── receipts/2026/1711270400000_invoice.pdf
├── receipts/2026/1711270450000_receipt.jpg
└── receipts/2026/1711270500000_bill.png

2027 Expenses
├── receipts/2027/1722960000000_invoice.pdf
└── ...
```

**Benefit:** Easy to find receipts for specific year during audits

---

## Supported File Types

| Type | Extensions | Use Case |
|------|-----------|----------|
| JPEG | .jpg, .jpeg | Photos of receipts, invoices |
| PNG | .png | Screenshots, scanned documents |
| PDF | .pdf | Digital receipts, invoices |

**Not Supported:**
- ❌ .doc, .docx (Word documents)
- ❌ .xls, .xlsx (Excel files)
- ❌ Videos
- ❌ Audio files

---

## Data Flow Diagram

```
Add Expense Screen
    ↓
Select Receipt File
    ↓
Click "Save Expense"
    ↓
Upload to Firebase Storage
    ├─ Path: receipts/2026/timestamp_filename
    └─ Get download URL
    ↓
Save Expense Document with Receipt URL
    ├─ ReceiptUrl: download link
    └─ ReceiptFileName: original filename
    ↓
Display in Expense Table
    ├─ Receipt Column shows link
    └─ Click to download/view
```

---

## Features

### ✅ Features Implemented

- [x] Optional file upload (not required)
- [x] File type validation (images + PDF)
- [x] Automatic organization by budget year
- [x] Unique filename with timestamp (prevents duplicates)
- [x] Download URL stored with expense
- [x] Click-to-download from table
- [x] Error handling (fails gracefully)
- [x] Success notification
- [x] Original filename preserved

### ✅ What Happens If Upload Fails

- Alert: "Failed to upload receipt. Expense will be saved without receipt."
- Expense saved normally (without receipt)
- No crash or data loss
- Can manually add receipt later if needed

---

## Expense Document Example

### With Receipt

```json
{
  "Type": "member",
  "MemberName": "John Doe",
  "Category": "Utilities",
  "SubCategory": "Electric",
  "Amount": 250.00,
  "PaymentDate": Timestamp,
  "PaymentMethod": "check",
  "CheckNumber": "1001",
  "Description": "Monthly electric bill",
  "BudgetYear": "2026",
  "ReceiptUrl": "https://firebasestorage.googleapis.com/v0/b/bca-finance.appspot.com/o/receipts%2F2026%2F1711270400000_utility_bill.pdf?alt=media&token=abc123...",
  "ReceiptFileName": "utility_bill.pdf",
  "CreatedDate": Timestamp
}
```

### Without Receipt

```json
{
  "Type": "member",
  "MemberName": "Jane Smith",
  "Category": "Maintenance",
  "SubCategory": "Repair",
  "Amount": 500.00,
  "PaymentDate": Timestamp,
  "PaymentMethod": "cash",
  "CheckNumber": null,
  "Description": "AC unit repair",
  "BudgetYear": "2026",
  "ReceiptUrl": null,
  "ReceiptFileName": null,
  "CreatedDate": Timestamp
}
```

---

## Viewing the Receipt Column

### On Expense List

```
Expense Table
┌────────────────────────────────────────────────────┐
│ Type | Member | Category | Amount | ... | Receipt  │
├────────────────────────────────────────────────────┤
│ paid | John   | Utility  | $250   | ... │ 📎 View  │
│ paid | Jane   | Repair   | $500   | ... │  —       │
│ paid | Bob    | Office   | $150   | ... │ 📎 View  │
└────────────────────────────────────────────────────┘
```

**Click Receipt Link:**
- Opens in new tab
- Shows PDF or image
- Can download from browser

---

## Search & Filter

**Note:** Receipts are tied to expenses by URL. To find expenses with receipts:

```javascript
// Query in Firebase Console:
// WHERE ReceiptUrl != null
```

---

## Best Practices

### ✅ Do's:
- ✅ Upload receipt immediately after recording expense
- ✅ Use clear filenames (e.g., "utility_bill_march_2026.pdf")
- ✅ Upload high-quality images
- ✅ Include receipt for all expenses over $100
- ✅ Check receipt link works before closing

### ❌ Don'ts:
- ❌ Don't upload non-receipt files
- ❌ Don't use very large files (>10MB)
- ❌ Don't delete receipts from storage (keeps audit trail)
- ❌ Don't share download links with unauthorized people

---

## Audit & Compliance

**Receipt Tracking Benefits:**
✅ Complete audit trail
✅ Support for tax documentation
✅ Easy reconciliation
✅ Proof of expense
✅ Date stamped (created automatically)

**For Audits:**
- All receipts organized by year
- Linked to expense records
- Download URLs ensure authenticity
- Timestamp in filename prevents duplicates

---

## Troubleshooting

### Receipt Not Uploading

**Problem:** File doesn't upload
**Solution:** 
- Check file type (JPG, PNG, PDF only)
- Check file size (under 25MB)
- Check internet connection
- Try different file

### Can't See Download Link

**Problem:** Receipt column shows "—"
**Solution:**
- Receipt might not have uploaded
- Try uploading again
- Check browser console for errors

### File Too Large

**Problem:** "Failed to upload receipt"
**Solution:**
- Compress image (use online tool)
- Reduce PDF file size
- Check Firebase Storage quotas

---

## Summary

**Receipt Upload Feature:**

✅ **Where Uploaded:** Firebase Storage (receipts/{year}/ folder)
✅ **How Stored:** Cloud storage with download URL
✅ **Access:** Click link in Expense table
✅ **Organization:** Automatic by budget year
✅ **Linked:** To expense document with ReceiptUrl field
✅ **Optional:** Not required to save expense
✅ **Secure:** Firebase authentication required

**Benefits:**
- Organized receipt management
- Easy access to receipts
- Audit trail
- Tax documentation support
- Professional record keeping

**Ready to use!** 📎

