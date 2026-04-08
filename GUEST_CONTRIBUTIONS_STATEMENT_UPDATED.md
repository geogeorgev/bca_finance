# Guest Contributions Statement - UPDATED ✅

## Recent Updates (April 7, 2026)

### 1. **Collection Report Now Includes Guest Contributions** ✅
- Guest offerings now appear in the Collection Report
- Marked as "(Guest)" next to the guest name for clarity
- Included in totals and Excel export
- Example: `John Doe (Guest)` instead of just `John Doe`

### 2. **Renamed Button to "Guest Contributions Statement"** ✅
- Updated menu button label in Reports
- More accurately reflects the functionality

### 3. **New Guest Contributions Statement Interface** ✅
- **No more date range filters** - Simplified interface
- Shows dropdown list of all unique guest names
- Select a guest and tax year
- Generates annual contribution statement (like members)
- Reuses member statement template for consistency

---

## How to Use - Updated Workflow

### Option 1: View All Guest Contributions (Collection Report)
1. Go to **Reports**
2. Click **Collection Report**
3. Select date range
4. View all collections including guests (marked with "(Guest)")
5. Export to Excel if needed

### Option 2: Generate Guest Annual Statement
1. Go to **Reports**
2. Click **👥 Guest Contributions Statement**
3. Select a guest name from dropdown
4. Select tax year
5. Click **Generate PDF**
6. Professional annual contribution statement downloads

---

## Example Guest Statement

**Output:** `John_Doe_Guest_Contribution_Receipt_2026.pdf`

Contains:
- BCA letterhead and header
- Thank you letter from church
- Pastor and Treasurer signatures
- IRS Form 11(71-1997) table showing:
  - Total tax-deductible contributions for year
  - Tax year
  - Guest name and church info
- Federal ID number
- Disclaimer

---

## Key Features - Updated

✅ **Collection Report Integration** - Guests included in financial reports  
✅ **Simplified Guest List** - Dropdown of unique guest names  
✅ **No Date Requirements** - Just select guest and year  
✅ **Professional PDF** - Reuses member statement template  
✅ **Annual Focus** - Perfect for year-end records  
✅ **Tax Deductible** - Proper documentation for IRS  

---

## Database Storage (Unchanged)

Guest contributions stored in `income` collection:

```javascript
{
  MemberID: "GUEST",              // ← Identifies as guest
  MemberName: "John Doe",         // Guest's name
  Purpose: "Offering-Common",
  Type: "Cash",
  Amount: 50.00,
  CollectionDate: "2026-04-07",
  ...
}
```

---

## Menu Structure

**Main Menu**
  └─ **Reports**
      ├─ Collection Report
      │   └─ Shows all collections (members + guests marked)
      ├─ Expense Report
      ├─ Annual Contribution Statement
      │   └─ For members only
      ├─ **👥 Guest Contributions Statement** ← NEW!
      │   └─ Select guest → Generate PDF
      └─ Database Management

---

## Comparison: Reports Available

| Report | Member | Guest | Shows Dates |
|--------|--------|-------|-------------|
| Collection Report | ✅ | ✅ | ✅ Yes |
| Annual Statement (Member) | ✅ | ❌ | ❌ No |
| Guest Contribution Statement | ❌ | ✅ | ❌ No |
| Expense Report | ✅ | N/A | ✅ Yes |

---

## Use Cases

### 1. Financial Reconciliation
- **Situation**: Treasurer counting cash after Sunday service
- **Action**: Use Collection Report with date filter
- **Result**: See all contributions (members + guests) to match with cash counted

### 2. Year-End Reporting
- **Situation**: Need IRS documentation for guest donor
- **Action**: Reports → Guest Contributions Statement → Select guest → Generate PDF
- **Result**: Professional annual statement for tax purposes

### 3. Month-End Close
- **Situation**: Monthly financial reporting
- **Action**: Collection Report shows all activity including guest offerings
- **Result**: Accurate total church income for the month

### 4. Donor Thank You
- **Situation**: Want to thank a guest for their generosity
- **Action**: Generate guest statement showing their contributions
- **Result**: Professional document to include with thank you letter

---

## Technical Details

### Files Modified

**js/reports.js**
1. `loadReports()` - Updated button label
2. `generateCollectionReport()` - Added guest indicator in display
3. `exportCollectionToExcel()` - Added guest indicator in CSV
4. `showGuestContributionStatement()` - New function for guest selection
5. `generateGuestContributionStatement()` - New function for PDF generation

### Guest Selection Algorithm
- Queries all income records where `MemberID == "GUEST"`
- Extracts unique `MemberName` values
- Sorts alphabetically
- Displays in dropdown for selection

### Statement Generation (Reused from Members)
- Uses same PDF template as member statements
- Same header image, letterhead, signatures
- Same IRS form 11(71-1997) table layout
- Filtered to show only selected guest's contributions for the year

---

## Important Notes

⚠️ **Guest contributions:**
- Do NOT update any member `TotalContribution` field
- Are tracked separately in `income` collection
- Can have multiple entries per person
- Show guest name (unlike member ID system)

✅ **Collections Report:**
- Now includes all contributions (member + guest)
- Guests clearly marked with "(Guest)" suffix
- Totals include both member and guest giving
- Useful for financial reconciliation

✅ **Guest Statements:**
- Treat like member statements for tax purposes
- Professional format suitable for IRS
- Can be sent directly to guests for their records
- Suitable for one-time or repeat donors

---

## Testing Checklist

- [ ] Record a guest offering
- [ ] Check Collection Report includes "(Guest)" in name
- [ ] Export Collection Report to Excel
- [ ] Generate Guest Contributions Statement for that guest
- [ ] Verify PDF has correct guest name
- [ ] Verify PDF shows correct total for year
- [ ] Verify pastor and treasurer names appear

---

**Implementation Complete**: April 7, 2026  
**Status**: ✅ Ready to Use  
**Last Updated**: April 7, 2026

