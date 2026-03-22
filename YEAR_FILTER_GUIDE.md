# Quick Reference - Year-Based Budget System

## BudgetID Format
**Format:** `YYYY-BudgetName`

**Examples:**
- `2026-General`
- `2026-Missions`
- `2026-Youth Ministry`
- `2027-General`

## Changes Made

### 1. Collection Date Default ✓
- **File:** `income.js`
- **Change:** Collection Date now defaults to today's date
- **User Impact:** No need to manually enter date for each entry

### 2. Budget Grouped by Year ✓
- **File:** `budget.js`
- **Changes:**
  - Budgets are extracted and grouped by year (from BudgetID)
  - Each year gets its own section with heading "Budget Year 2026"
  - Category subtotals within each year
  - Grand total row for each year showing:
    - Total Budget Amount
    - Total Spent
    - Total Balance

**Example Output:**
```
Budget Year 2026
┌─────────────────────────────────────────┐
│ BudgetID    Category    Amount Spent    │
├─────────────────────────────────────────┤
│ 2026-Gen    Utilities   5000   2500     │
│ Utilities TOTAL         5000   2500     │
├─────────────────────────────────────────┤
│ 2026-Gen    Missions    3000   1500     │
│ Missions TOTAL          3000   1500     │
├─────────────────────────────────────────┤
│ GRAND TOTAL (2026)      8000   4000     │
└─────────────────────────────────────────┘

Budget Year 2027
┌─────────────────────────────────────────┐
│ BudgetID    Category    Amount Spent    │
└─────────────────────────────────────────┘
```

### 3. Dashboard Filters by Current Year ✓
- **File:** `dashboard.js`
- **Changes:**
  - Only 2026 budgets included in calculations
  - Budget chart only shows 2026 data
  - Prevents 2027+ budgets from affecting current year metrics

### 4. Expense Screen - Current Year Only ✓
- **File:** `expense.js`
- **Changes:**
  - Expense list shows only current year expenses
  - "Add Expense" dropdown only shows current year budget categories
  - Subcategories filtered by current year

### 5. Reports - Current Year Data ✓
- **File:** `reports.js`
- **Changes:**
  - Collection Report title: "Collection Report - Year 2026"
  - Expense Report title: "Expense Report - Year 2026"
  - Only current year data included in totals

---

## How to Use

### Creating Budgets
1. Click **Budget** → **Add Budget**
2. Enter BudgetID as: `2026-BudgetName` (e.g., "2026-Missions")
3. Enter Category, SubCategory, and Budget Amount
4. Click Save

### Viewing Multi-Year Budgets
1. Click **Budget**
2. View automatic sections for each year:
   - Budget Year 2026 (with all 2026 budgets)
   - Budget Year 2027 (if budgets exist)
3. Each year section shows:
   - Individual budget items
   - Category subtotals
   - **Grand Total for that year**

### Adding Expenses
1. Click **Expense** → **Add Expense**
2. Budget Category dropdown automatically shows only 2026 categories
3. SubCategory dropdown updates based on selected category
4. Enter amount and save
5. Expense list shows only 2026 expenses

### Viewing Dashboard
1. Click **Dashboard**
2. Data reflects only 2026 year:
   - YTD Collection
   - YTD Expense
   - YTD Balance
   - Budget vs Actual chart (2026 only)

### Collection Entry
1. Click **Collection**
2. **Collection Date field now defaults to today's date**
3. Fill in other required fields
4. Submit

---

## Key Features

| Feature | Before | After |
|---------|--------|-------|
| Collection Date | Manual entry | Auto-defaults to today |
| Budget Display | All budgets mixed | Grouped by year with subtotals |
| Year Filter | Manual filtering | Automatic by year |
| Grand Totals | None | One per year |
| Expense Categories | All years | Current year only |
| Dashboard Budget Data | All budgets | Current year only |
| Reports | All data | Current year only |

---

## Year Format Details

### Budget ID Examples
- ✓ Correct: `2026-General`, `2027-Missions`, `2024-Youth`
- ✗ Incorrect: `General`, `2026`, `Missions-2026`

### Year Extraction
- System splits BudgetID on "-" and uses first part as year
- Example: `2026-Missions` → Year = `2026`
- If no year found, defaults to current year

### Multi-Year Support
- System automatically creates separate sections for different years
- Works with 2024, 2025, 2026, 2027, etc.
- Years display in reverse order (newest first)

---

## Troubleshooting

**Issue:** Budget not appearing in Budget screen
- **Solution:** Check BudgetID format - should start with year (e.g., `2026-Name`)

**Issue:** "Add Expense" shows no budget categories
- **Solution:** Ensure budget exists with current year in BudgetID (e.g., `2026-Category`)

**Issue:** Dashboard shows unexpected totals
- **Solution:** Verify all budget entries have BudgetID in correct format with current year

**Issue:** Collection Date not defaulting to today
- **Solution:** Clear browser cache and reload the page

---

## Testing Commands

### View Budget by Year
1. Navigate to Budget screen
2. Verify separate sections for 2026, 2027, etc.
3. Check category and grand totals

### Test Expense Filter
1. Navigate to Add Expense
2. Verify only current year categories appear
3. Verify expense list shows only current year items

### Check Dashboard Year Filter
1. View Dashboard
2. Compare YTD figures with manual calculation of 2026 data only
3. Verify budget chart excludes non-2026 items

---

## Configuration Notes

**Current Year:** System uses `new Date().getFullYear()`
- Automatically updates each January 1st
- No manual configuration needed

**Budget Year Prefix:** First part of BudgetID before "-"
- Example: `2026-Budget` uses `2026` as year
- Fully customizable per organization needs


