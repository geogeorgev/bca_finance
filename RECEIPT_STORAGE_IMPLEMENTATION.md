# Receipt Storage - Base64 in Firestore Implementation

## Problem
Firebase Storage requires a **Blaze (pay-as-you-go) plan**, which adds costs. The free Spark plan doesn't support Storage.

## Solution
Receipts are now stored as **Base64-encoded data directly in Firestore** in a separate `receipts` collection. This keeps the expense documents lightweight and avoids any paid services.

---

## How It Works

### 1. **Upload Receipt**
When adding an expense with a receipt:
- User selects a receipt file (image or PDF, max 700KB)
- File is read as **Base64 data URL** using FileReader API
- Base64 data is saved to Firestore `receipts` collection with metadata:
  - `FileName` - original filename
  - `FileType` - MIME type (image/jpeg, application/pdf, etc.)
  - `FileSizeKB` - file size in KB
  - `Data` - full Base64 string
  - `BudgetYear` - which year's expense
  - `UploadedAt` - timestamp

### 2. **View Receipt**
When viewing expenses:
- Each expense with a receipt shows a **📎 View Receipt** link
- Clicking the link calls `viewReceipt(receiptDocId)`
- Function fetches the Base64 data from Firestore
- Opens in a new browser tab with proper formatting:
  - **Images** - displayed with dark background
  - **PDFs** - displayed in iframe viewer

### 3. **File Size Limits**
- **Max file size:** 700 KB
- **Why?** Base64 encoding increases size by ~33%, so 700KB file → ~935KB Base64. Firestore documents have a 1MB limit.
- Users are warned if file is too large and given option to compress

---

## Database Schema

### `expense` Collection
```javascript
{
  Type: "member" | "nonmember",
  MemberName: string,
  PayeeName: string,
  Category: string,
  SubCategory: string,
  Amount: number,
  PaymentDate: Timestamp,
  PaymentMethod: "cash" | "check",
  CheckNumber: string (optional),
  Description: string,
  BudgetYear: string,
  ReceiptDocID: string (optional - reference to receipts doc),
  ReceiptFileName: string (optional),
  CreatedDate: Timestamp
}
```

### `receipts` Collection
```javascript
{
  FileName: string,
  FileType: string,
  FileSizeKB: number,
  Data: string,  // Base64 data URL
  BudgetYear: string,
  UploadedAt: Timestamp
}
```

---

## Files Modified

### 1. **firebase.js**
- ✅ Removed `firebase.storage()` initialization (not available on free plan)
- ✅ Added comment explaining receipts are stored in Firestore

### 2. **index.html**
- ✅ Removed `firebase-storage.js` script tag (no longer needed)

### 3. **expense.js**
- ✅ Updated receipt upload logic to use Base64 + Firestore
- ✅ Added file size validation (max 700KB)
- ✅ Modified `loadExpense()` to display receipt links from both:
  - New: `ReceiptDocID` (Firestore Base64 storage)
  - Old: `ReceiptUrl` (legacy Storage URLs - for backward compatibility)
- ✅ Added `viewReceipt()` function to fetch and display receipts from Firestore

---

## Usage

### Adding an Expense with Receipt
1. Click **Add Expense**
2. Fill in expense details
3. Under "Upload Receipt (Optional)", select an image (JPG, PNG) or PDF
4. Click **Save Expense**
5. Receipt is automatically saved to Firestore and linked

### Viewing a Receipt
1. In the Expense table, click the **📎 View Receipt** link
2. Receipt opens in a new tab
3. For images: Shows centered image with dark background
4. For PDFs: Shows in embedded PDF viewer

### No Receipt Needed
- Leave "Upload Receipt" empty
- Expense saves normally without receipt

---

## Advantages

| Aspect | Firebase Storage | Base64 in Firestore |
|--------|------------------|-------------------|
| **Cost** | Requires Blaze plan | Free (Firestore only) |
| **Setup** | Needs Storage bucket + rules | Already in Firestore |
| **Files** | Limited by Storage rules | Limited by Firestore (1MB per doc) |
| **Speed** | Faster for large files | Good for receipts (<700KB) |
| **Maintenance** | Manage separate service | Single collection |

---

## Limitations

- **Maximum file size:** 700 KB (enforced)
- **Supported formats:** Images (JPG, PNG) and PDFs
- **Storage cost:** Counts against Firestore read/write quota (minimal for typical receipts)

---

## Error Handling

- **File too large** → User warned, can compress and retry
- **Upload fails** → Expense still saves without receipt
- **Receipt not found** → User notified when clicking link
- **Corrupted data** → Try deleting and re-uploading

---

## Future Upgrade Path

If you upgrade to Firebase Blaze plan later, you can:
1. Migrate Base64 receipts to Cloud Storage
2. Update logic to reference Storage URLs instead of Firestore
3. No data loss — existing receipts remain accessible during transition

