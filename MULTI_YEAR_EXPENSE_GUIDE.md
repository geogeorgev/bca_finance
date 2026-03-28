# Multi-Year Expense Display Feature

## Overview
The Expense screen now displays expenses from **all years in separate grids**, with each year's expenses grouped together. This allows users (especially in January 2027) to view and manage expenses from previous years (like 2026) alongside current year expenses.

---

## How It Works

### Display Format

When you view the Expense screen:
1. **All expenses are automatically grouped by year**
2. **Newest year appears first** (e.g., 2027, then 2026)
3. **Each year has its own section** with:
   - Year header (e.g., "Expenses - 2026")
   - Print button for that year only
   - Complete expense table with all columns
   - Year total at the bottom

### Example Layout (January 2027)

```
┌─────────────────────────────────────────┐
│  [+ Add Expense]                        │
└─────────────────────────────────────────┘

┌─ Expenses - 2027 ──────── [🖨️ Print 2027] ─┐
│ Type | Member | Category | Amount | ...    │
│ Cash | John   | Utilities| $150   | ...    │
│ Check| Mary   | Repairs  | $300   | ...    │
│      Year 2027 Total: $450.00              │
└──────────────────────────────────────────┘

┌─ Expenses - 2026 ──────── [🖨️ Print 2026] ─┐
│ Type | Member | Category | Amount | ...    │
│ Cash | John   | Utilities| $200   | ...    │
│ Cash | Sarah  | Office   | $75    | ...    │
│      Year 2026 Total: $275.00              │
└──────────────────────────────────────────┘
```

---

## Features

### ✅ Separate Grids for Each Year
- Clear visual separation between years
- Color-coded headers (blue background)
- Year-specific styling

### ✅ Print Option for Each Year
- **Print 2026** button prints only 2026 expenses
- **Print 2027** button prints only 2027 expenses
- Each print has its own title and formatting
- Includes year total in the printout

### ✅ Year Totals
- Each year section shows total expenses for that year
- Formatted as currency (e.g., "$275.00")
- Easy to see spending by year at a glance

### ✅ Full Functionality in All Years
- "Add Receipt" buttons available for all years
- Receipt viewing works across all years
- All expense details visible for all years

---

## UI Changes

### Before
- Single table showing only current year (2026)
- Single "Print" button
- Limited year visibility

### After
- Multiple tables, one per year
- Individual "Print YEAR" button for each year
- All historical expenses visible
- Year totals displayed

---

## Functions Updated

### `loadExpense()` - Completely redesigned
**What it does:**
- Fetches ALL expenses from Firestore (not just current year)
- Groups expenses by year into `expensesByYear` object
- Sorts years in descending order (newest first)
- Creates separate HTML section for each year
- Calculates and displays total for each year

**Key logic:**
```javascript
// Group by year
expensesByYear[year] = [expense1, expense2, ...]

// Sort years descending (2027, 2026, 2025...)
const sortedYears = Object.keys(expensesByYear).sort((a, b) => b - a)

// Create table and total for each year
sortedYears.forEach(year => { ... })
```

### `printExpenseYear(year)` - New function
**What it does:**
- Takes a year as parameter
- Selects the table for that specific year (using CSS class selector `.year${year}`)
- Opens a new window with proper formatting
- Includes title, date generated, and styled table
- Triggers browser print dialog

**Usage:**
```javascript
printExpenseYear(2026)  // Prints only 2026 expenses
printExpenseYear(2027)  // Prints only 2027 expenses
```

---

## Database

No database changes required. The feature works with existing:
- **expense** collection
- **receipts** collection (for attachments)

The grouping happens on the client-side, so all historical expenses are automatically available.

---

## Files Modified

**expense.js**
- Replaced `loadExpense()` function
- Replaced `printExpense()` with `printExpenseYear(year)`
- No other functions affected

---

## User Experience Flow

### View Multiple Years
1. Go to **Expense** screen
2. See all years with expenses
3. Each year in its own section

### Print a Specific Year
1. Find the year you want to print (e.g., 2026)
2. Click **🖨️ Print 2026** button
3. Browser print dialog opens
4. Select printer and print

### Add Receipt to Old Expense
1. Find expense in 2026 section
2. Click **Add Receipt** button in Actions column
3. Upload receipt as normal
4. Receipt linked to 2026 expense (works across all years)

---

## Browser Compatibility

✅ Works in all modern browsers
- Chrome/Edge
- Firefox
- Safari

Print functionality uses standard browser print dialog (Ctrl+P equivalent).

---

## Advantages

| Aspect | Before | After |
|--------|--------|-------|
| **View past expenses** | Only current year | All years visible |
| **Manage old expenses** | Can't access | Full access (add receipts, etc.) |
| **Print reports** | One generic print | Year-specific prints |
| **Year totals** | Not shown | Clearly displayed |
| **Scalability** | Limited to 1 year | Handles unlimited years |

---

## Limitations

- **Maximum display:** No limit, but very large datasets (1000+ expenses) may slow rendering
- **Print formatting:** Print button triggers browser print (uses browser CSS, not custom formatting)
- **Exports:** No direct Excel/CSV export per year (could be added as future feature)

---

## Future Enhancements

Could add:
- **Year selector dropdown** - Jump to specific year
- **Year comparison** - Side-by-side comparison of two years
- **Export to Excel by year** - Export 2026 expenses as CSV
- **Filter by category** - Show only certain categories across all years
- **Search across years** - Search text in all expenses

