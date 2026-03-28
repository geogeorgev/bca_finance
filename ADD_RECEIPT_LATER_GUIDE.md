# Expense Receipt - Add Receipt Later Feature

## Overview
You can now add receipts to existing expenses **after they've been created**. This is useful when:
- An expense is recorded without a receipt initially
- The receipt becomes available later
- You want to batch add receipts

---

## How It Works

### Expense List View
In the **Expense** screen, for each expense **without a receipt**, you'll see:
- **Receipt column** shows: `—` (dash)
- **Actions column** shows: **Add Receipt** button (green)

### Adding a Receipt

1. Click the **Add Receipt** button on an expense row
2. A dialog opens asking you to select a receipt file
3. Select an image (JPG, PNG) or PDF file (max 700KB)
4. Click **Upload Receipt**
5. Receipt is saved and the expense is immediately updated

### After Adding

The expense row updates:
- **Actions column** changes to: `—` (no button needed anymore)
- **Receipt column** shows: **📎 View Receipt** link
- Click to view the receipt in a new tab

---

## Features

✅ **File Size Validation**
- Max 700KB enforced
- User warned if file is too large
- Suggestion to compress before uploading

✅ **Multiple File Formats**
- Images: JPG, PNG (display with dark background)
- PDFs: Display in embedded viewer

✅ **Error Handling**
- No file selected → shows alert
- Upload fails → user is notified
- Expense data remains unchanged if upload fails

✅ **Metadata Tracking**
- Original filename saved
- File type stored
- File size recorded
- Upload timestamp recorded

---

## UI Changes

### Expense Table - New "Actions" Column

| Before | After |
|--------|-------|
| Receipt column only | Receipt column + Actions column |
| No option to add receipts later | "Add Receipt" button for expenses without receipts |

### Example Expense Rows

**Expense without receipt:**
```
Type | Member | Category | ... | Pay Date | Receipt | Actions
---- | ------ | -------- | --- | -------- | ------- | --------
Cash | John   | Utilities| ... | 3/27/26  | —       | [Add Receipt] ← Click here
```

**Expense with receipt:**
```
Type | Member | Category | ... | Pay Date | Receipt | Actions
---- | ------ | -------- | --- | -------- | ------- | --------
Cash | John   | Utilities| ... | 3/27/26  | 📎 View | —
```

---

## Functions Added

### `showAddReceiptDialog(expenseDocId, budgetYear)`
- Opens a dialog to upload a receipt
- Takes the expense ID and budget year
- Shows file input field
- Validates file before processing

### `addReceiptToExpense(expenseDocId, budgetYear)`
- Reads selected file as Base64
- Saves to `receipts` collection (like during expense creation)
- Updates the expense document with:
  - `ReceiptDocID` - reference to receipt
  - `ReceiptFileName` - original filename
- Reloads expense list to show updated receipt status

---

## Database Impact

**receipts Collection** (unchanged)
- Same structure as before
- Stores: FileName, FileType, FileSizeKB, Data (Base64), BudgetYear, UploadedAt

**expense Collection** (updated)
- Existing documents can now be updated with:
  - `ReceiptDocID` (was nullable before, now populated when receipt added)
  - `ReceiptFileName` (was nullable before, now populated when receipt added)

---

## Files Modified

- **expense.js**
  - Added "Actions" header to table
  - Updated receipt cell logic
  - Added `actionCell` with "Add Receipt" button (only shown when no receipt exists)
  - Added `showAddReceiptDialog()` function
  - Added `addReceiptToExpense()` function

---

## User Experience Flow

### Scenario 1: Add Receipt During Expense Creation
1. Add Expense → Select receipt file → Save
✅ Receipt linked immediately

### Scenario 2: Add Receipt Later
1. Expense created without receipt
2. User sees **Add Receipt** button in Actions column
3. Click button → Select file → Upload
✅ Receipt now linked to expense

### Scenario 3: No Receipt Needed
1. Add expense without receipt
2. **Add Receipt** button stays available if needed later
3. If not needed, leave it (no action required)
✅ Expense is complete without receipt

---

## Limitations

- **Cannot modify receipt** - If you upload a wrong receipt, delete the expense and recreate it
- **Cannot replace receipt** - Add Receipt button only appears for expenses without receipts
- **Max file size** - 700KB (due to Firestore 1MB document limit with Base64 encoding)

---

## Future Enhancement

Could add:
- **Replace Receipt** - Allow changing receipt if wrong one was uploaded
- **Multiple Receipts** - Allow multiple receipts per expense
- **Bulk Upload** - Add receipts to multiple expenses at once

