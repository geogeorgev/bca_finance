# Stripe/PayPal PDF Income Capture System - Implementation Guide

## Overview

Repurpose Bank Reconciliation to automatically capture Stripe/PayPal transactions from PDF statements and insert them into the /income collection.

---

## How It Will Work

### Step 1: Upload PDF
```
User Action:
1. Open app
2. Click "Bank Reconciliation" (now "Payment Gateway Reconciliation")
3. Select PDF from Stripe/PayPal
4. Click "Upload Statement"

System:
├─ Read PDF file
├─ Extract text
├─ Parse transactions
├─ Match member names
├─ Insert into /income collection
└─ Show results
```

### Step 2: Process PDF

```
PDF Content:
═════════════════════════════════════════
Stripe Statement - March 2026

Transaction 1:
Date: 2026-03-15
Description: John Doe - Tithe Offering
Amount: $500.00

Transaction 2:
Date: 2026-03-18
Description: Jane Smith - Special Donation
Amount: $250.00
═════════════════════════════════════════

System Processing:
├─ Extract: Date, Member Name, Amount, Purpose
├─ Look up member in /members collection
├─ Create /income document:
│  ├─ MemberName: "John Doe"
│  ├─ CollectionDate: 2026-03-15
│  ├─ Amount: 500
│  ├─ Purpose: "Tithe Offering"
│  ├─ Type: "Stripe" (or "PayPal")
│  └─ Memo: "Imported from Stripe"
└─ Insert into /income collection
```

### Step 3: View Results

```
Display:
✅ Successfully imported 2 transactions:
  • John Doe - $500 (Tithe Offering)
  • Jane Smith - $250 (Special Donation)

⚠ Failed to import:
  • Unknown Member - $150 (no match found)
```

---

## PDF Parsing Requirements

### What PDF Contains

Typical Stripe/PayPal PDF structure:
```
Statement for: [MEMBER NAME] or Account: [MEMBER NAME]
Date: MM/DD/YYYY
Amount: $XXX.XX
Description: [PURPOSE/REASON]
Type: [Payment Type]

Example 1 - Stripe:
═════════════════════════════════════════
John Doe
Date: March 15, 2026
Amount: $500.00
Description: Tithe Offering - Weekly Contribution
Status: Completed
═════════════════════════════════════════

Example 2 - PayPal:
═════════════════════════════════════════
Jane Smith
Transaction ID: PP12345
Date: March 18, 2026
Amount: $250.00
Item: Special Donation - Easter Fund
Status: Completed
═════════════════════════════════════════
```

### Parsing Strategy

```javascript
// Extract text from PDF
pdfText = extractTextFromPDF(pdfFile)

// Parse each transaction
transactions = parseTransactions(pdfText)

// For each transaction:
For each transaction {
  1. Extract member name
  2. Extract amount
  3. Extract date
  4. Extract purpose/description
  5. Look up member in /members collection
  6. If found:
     ├─ Create income document
     └─ Insert into /income
  7. If not found:
     └─ Add to "unmatched" list
}
```

---

## Database Schema

### /income Collection Entry

```javascript
{
  // Existing fields
  MemberID: "mem_abc123",        // From /members lookup
  MemberName: "John Doe",        // From PDF
  CollectionDate: "2026-03-15",  // From PDF
  Amount: 500,                   // From PDF
  Purpose: "Tithe Offering",     // From PDF (description)
  Type: "Stripe",                // OR "PayPal" (from user selection)
  Memo: "Imported from Stripe PDF - March 2026",
  
  // Tracking fields
  CreatedDate: Timestamp,
  SourceType: "stripe_pdf",      // or "paypal_pdf"
  PDFFile: "stripe_march_2026.pdf"
}
```

---

## Implementation Components

### 1. PDF Parsing Library
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
```

### 2. Text Extraction Function
```javascript
async function extractTextFromPDF(file) {
  // Read PDF
  // Extract text from all pages
  // Return combined text
}
```

### 3. Transaction Parser
```javascript
function parseTransactions(pdfText) {
  // Parse text to extract:
  // - Member name
  // - Amount
  // - Date
  // - Purpose/Description
  
  return [
    {
      memberName: "John Doe",
      amount: 500,
      date: "2026-03-15",
      purpose: "Tithe Offering"
    },
    // ... more transactions
  ]
}
```

### 4. Member Matching
```javascript
async function findMemberByName(memberName) {
  // Search /members collection
  // Match name (case-insensitive, partial match)
  // Return member ID or null
}
```

### 5. Income Insert
```javascript
async function insertIncomeTransaction(transaction) {
  // Create document
  // Insert into /income collection
  // Return success/error
}
```

---

## Enhanced bank.js Structure

```
bank.js will handle:
├─ Upload PDF (stripe or paypal)
├─ Extract text from PDF
├─ Parse transactions
├─ Match members
├─ Insert into /income
├─ Show results
└─ List unmatched
```

---

## User Interface Flow

```
Bank Reconciliation Screen
├─ Payment Gateway Selection
│  ├─ [Stripe] [PayPal]
│  └─ [CSV] [PDF]
│
├─ File Upload
│  └─ Select PDF or CSV file
│
├─ Process Button
│  └─ [Upload & Process]
│
├─ Results Display
│  ├─ ✅ Successfully imported: X transactions
│  ├─ ⚠ Failed to import: X transactions
│  └─ [View Details] [View Unmatched]
│
└─ Action Buttons
   ├─ [Retry Failed]
   ├─ [View Income Records]
   └─ [Back to Dashboard]
```

---

## Process Flow

```
Start: User uploads Stripe PDF
   ↓
1. Read PDF file
   ↓
2. Extract text content
   ↓
3. Parse transactions (name, date, amount, purpose)
   ↓
4. For each transaction:
   ├─ Match member by name
   ├─ If match found:
   │  ├─ Create income document
   │  ├─ Insert into /income
   │  └─ Add to success list
   └─ If no match:
      └─ Add to unmatched list
   ↓
5. Display results
   ├─ ✅ X successfully imported
   ├─ ⚠ X could not be matched
   └─ [Show unmatched details]
   ↓
6. User can:
   ├─ Manual match unmatched items
   ├─ View imported records in /income
   └─ Re-upload corrected data
```

---

## Error Handling

```javascript
Possible Errors:
├─ Invalid PDF format
├─ Cannot extract text
├─ No transactions found
├─ Member name not found
├─ Duplicate transaction
├─ Invalid amount/date
└─ Database insert failure

Recovery:
├─ Show clear error message
├─ List specific problems
├─ Allow manual correction
└─ Retry option
```

---

## Example: Stripe PDF Parsing

### Input PDF Text:
```
Stripe Account: John Doe
Statement Period: March 1-31, 2026

Payouts Received:
Date: March 5, 2026
Amount: $500.00
Description: Tithe Collection Week 1

Date: March 12, 2026
Amount: $1200.00
Description: Special Offering - Building Fund

Date: March 19, 2026
Amount: $450.00
Description: General Offering
```

### Parsed Output:
```javascript
[
  {
    memberName: "John Doe",
    amount: 500,
    date: "2026-03-05",
    purpose: "Tithe Collection Week 1"
  },
  {
    memberName: "John Doe",
    amount: 1200,
    date: "2026-03-12",
    purpose: "Special Offering - Building Fund"
  },
  {
    memberName: "John Doe",
    amount: 450,
    date: "2026-03-19",
    purpose: "General Offering"
  }
]
```

### Inserted into /income:
```javascript
{
  MemberID: "mem_john_doe_id",
  MemberName: "John Doe",
  CollectionDate: "2026-03-05",
  Amount: 500,
  Purpose: "Tithe Collection Week 1",
  Type: "Stripe",
  Memo: "Imported from Stripe PDF",
  CreatedDate: Timestamp
}
// ... more records
```

---

## Configuration

### Supported Formats

```
Stripe:
├─ CSV (current)
├─ PDF (new)
└─ JSON (future)

PayPal:
├─ CSV (current)
├─ PDF (new)
└─ JSON (future)

PDF Content:
├─ Member names (or account holder)
├─ Transaction dates
├─ Amounts
└─ Transaction descriptions/purposes
```

---

## Benefits

```
✅ Automatic income capture
✅ No manual data entry
✅ Faster reconciliation
✅ Fewer errors
✅ Audit trail (PDF source)
✅ Trackable transactions
✅ Member matching
✅ Payment gateway tracking
```

---

## Implementation Steps

### Step 1: Add PDF.js Library
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
```

### Step 2: Create PDF Functions
```javascript
// Extract text from PDF
async function extractTextFromPDF(file)

// Parse transaction data
function parsePaymentTransactions(text, gatewayType)

// Match member by name
async function findMemberByName(name)
```

### Step 3: Update bank.js
```javascript
// Add PDF upload handler
// Add transaction parsing
// Add income insertion
// Add result display
```

### Step 4: Update UI
```
Add payment gateway selector (Stripe/PayPal)
Add PDF file upload input
Add results display
Add unmatched items handler
```

### Step 5: Testing
```javascript
// Test with sample Stripe PDF
// Test with sample PayPal PDF
// Test member matching
// Test income insertion
// Test error handling
```

---

## Database Changes Required

### New Collection (Optional)
```
payment_gateway_imports:
├─ import_id
├─ file_name
├─ gateway_type (stripe/paypal)
├─ import_date
├─ transactions_count
├─ successful_imports
├─ failed_imports
└─ pdf_file_url (for audit trail)
```

### Update /income Collection
Add optional fields:
```javascript
{
  // ... existing fields ...
  SourceType: "stripe_pdf",    // Track where it came from
  SourceFile: "stripe_mar26.pdf",
  ImportDate: Timestamp
}
```

---

## Future Enhancements

### Phase 1 (Current)
- PDF upload
- Text extraction
- Basic parsing
- Member matching
- Income insertion

### Phase 2
- Auto-matching improvements
- Duplicate detection
- Amount validation
- Bulk operations

### Phase 3
- Image-based OCR
- Multi-page PDFs
- Complex formats
- Scheduled imports

---

## Summary

**What You'll Get:**
1. Upload Stripe/PayPal PDF
2. Automatically extract transactions
3. Match members
4. Insert into /income collection
5. Track imports and results

**Time to Implement:** 4-6 hours
**Complexity:** Medium
**Impact:** High (saves manual data entry)

---

## Next Steps

1. Review this implementation plan
2. Confirm PDF format expectations
3. Provide sample Stripe/PayPal PDFs
4. Implement PDF parsing
5. Test with real data
6. Deploy and monitor


