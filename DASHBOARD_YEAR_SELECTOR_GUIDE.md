# Treasurer Dashboard - Multi-Year Selection

## Overview
Added a **year selector dropdown** to the Treasurer Dashboard allowing users to choose which year's financial data to display. Previously, the dashboard only showed the current calendar year. Now you can view financial information for any year with data.

---

## How It Works

### Year Selection
1. Dashboard loads with **current year selected by default** (2026 on March 27, 2026)
2. **"Select Year" dropdown** appears at the top
3. Dropdown shows all years that have income, expense, or budget data
4. Select a different year from the dropdown
5. **Dashboard updates instantly** with that year's data

### Dynamic Data Updates
When you select a year, the following update automatically:
- **YTD Collection** - Total income for that year
- **YTD Expense** - Total expenses for that year
- **YTD Balance** - Income minus expenses for that year
- **Monthly Trend Chart** - Shows collection vs expense month-by-month for selected year
- **Budget vs Actual Chart** - Shows budget allocation and spending for selected year

---

## UI Layout

### Before (Current Calendar Year Only)
```
Treasurer Dashboard
Year 2026 Financial Overview

[Summary Cards]
[Charts]
```

### After (Multi-Year Support)
```
Treasurer Dashboard
Financial Overview

Select Year: [2027 ▼]  ← NEW

[Summary Cards updated for 2027]
[Charts updated for 2027]
```

---

## Example Scenarios

### Scenario 1: Current Year (Default)
- **Current Date:** March 27, 2026
- **Default Year:** 2026
- **Summary Shows:**
  - YTD Collection: $5,500
  - YTD Expense: $2,300
  - YTD Balance: $3,200

### Scenario 2: Viewing Previous Year
- **Current Date:** January 15, 2027
- **User selects:** 2026 from dropdown
- **Dashboard Updates to Show:**
  - 2026 YTD Collection: $8,250
  - 2026 YTD Expense: $4,100
  - 2026 YTD Balance: $4,150
  - 2026 monthly trends
  - 2026 budget vs actual

### Scenario 3: Multiple Years Available
- **Available years:** 2025, 2026, 2027, 2028
- **Dropdown shows:** 2028 (newest), 2027, 2026, 2025
- **User can switch** between any of these years instantly

---

## Features

✅ **Automatic Year Detection**
- System scans income, expense, and budget collections
- Populates dropdown with all years that have data
- No manual configuration needed

✅ **Current Year Default**
- Dashboard loads with current calendar year selected
- If no data for current year, shows available years

✅ **Instant Updates**
- Selecting a year immediately refreshes all dashboard sections
- Charts redraw with selected year's data
- No page reload needed

✅ **Complete Data Refresh**
- All calculations update for selected year:
  - YTD totals
  - Monthly breakdowns
  - Budget comparisons
  - Trend analysis

✅ **Backward Compatible**
- Works with existing data
- No database changes required
- Handles data from multiple years seamlessly

---

## Data Displayed for Selected Year

### Summary Cards
- **YTD Collection** - Total income from Jan 1 to today (within selected year)
- **YTD Expense** - Total expenses from Jan 1 to today (within selected year)
- **YTD Balance** - Collection minus Expense (shows Surplus or Deficit)

### Monthly Chart
- **X-axis:** Month names (Jan, Feb, Mar, ..., Dec)
- **Y-axis:** Amount in dollars
- **Green line:** Monthly collection for selected year
- **Orange line:** Monthly expenses for selected year

### Budget vs Actual Chart
- **Categories:** Budget Category - SubCategory labels
- **Blue bars:** Budgeted amount for selected year
- **Orange bars:** Actual spending (Spent) for selected year
- **Comparison:** Visually see where you are over/under budget

---

## Technical Implementation

### Year Collection Sources
1. **Income Collection** - Extracts year from `CollectionDate` field
   - Format: "2026-03-27" → year = "2026"

2. **Expense Collection** - Extracts year from `PaymentDate` field
   - Converts Firestore timestamp to date

3. **Budget Collection** - Extracts year from `BudgetID` field
   - Format: "2026-Missions" → year = "2026"

### Functions

**`treasurerDashboard()`**
- Entry point for dashboard
- Detects all available years
- Creates year selector dropdown
- Calls `updateDashboard()` to load initial data

**`updateDashboard()`**
- NEW function
- Called when year changes OR dashboard loads
- Reads selected year from dropdown
- Fetches and filters data for that year
- Recalculates all totals
- Redraws both charts
- Updates summary cards

**`drawMonthlyChart(monthlyIncome, monthlyExpense, year)`**
- Updated to accept year parameter
- Builds 12-month data array for selected year
- Renders Chart.js line chart

**`drawBudgetVsActualChart(budgetSnap, selectedYear)`**
- Updated to accept year parameter
- Filters budget items by selected year
- Renders Chart.js bar chart

---

## Files Modified

**dashboard.js**
- Redesigned `treasurerDashboard()` function
- Added new `updateDashboard()` function
- Updated `drawMonthlyChart()` to use year parameter
- Updated `drawBudgetVsActualChart()` to use year parameter
- Added year selector CSS styling
- Added year selector HTML

---

## Use Cases

### Scenario 1: End-of-Year Review (December 2026)
- View 2026 year-end totals
- Compare with 2025 previous year
- Plan 2027 budget based on historical data

### Scenario 2: Next Year Planning (January 2027)
- View 2026 complete year data
- View 2027 YTD data
- Compare to set 2027 targets

### Scenario 3: Financial Audit
- Treasurer can review any historical year
- Verify income, expenses, and budgets
- Generate year-specific reports

### Scenario 4: Multi-Year Comparison
- Manually switch between years
- Compare trends year-over-year
- Identify financial patterns

---

## Error Handling

✅ **No Data for Selected Year**
- Charts display empty (zero values)
- Summary cards show $0.00
- No errors thrown

✅ **Missing Year Data**
- Dashboard still functions
- Falls back to available years
- Graceful degradation

✅ **Invalid Data Format**
- Handles both Firestore timestamps and date strings
- Safely converts all date formats
- No crashes on malformed data

---

## Database Impact

✅ **No changes required**
- Works with existing collections:
  - `income` (CollectionDate field)
  - `expense` (PaymentDate field)
  - `budget` (BudgetID field)

✅ **All historical data accessible**
- No data deletion or archiving
- All years with data accessible
- Retroactive support for past data

---

## Browser Compatibility

✅ All modern browsers supported
- Chrome/Edge
- Firefox
- Safari

✅ Chart.js library handles rendering
- Responsive design
- Touch-friendly dropdown
- Mobile-compatible

---

## Testing Checklist

- [ ] Dashboard loads with current year selected
- [ ] Year dropdown shows all years with data
- [ ] Selecting 2026 updates all summary cards
- [ ] Monthly chart redraws for selected year
- [ ] Budget chart redraws for selected year
- [ ] YTD totals correct for selected year
- [ ] Charts display properly on mobile
- [ ] Works with 1 year, 2 years, and 3+ years of data

---

## Future Enhancements

Could add:
- **Year-over-year comparison** - Display 2 years side-by-side
- **Custom date range** - Select specific date range, not just calendar year
- **Export reports** - Export selected year's dashboard as PDF
- **Trend analysis** - Automatic insights comparing years
- **Forecast** - Predict end-of-year totals based on YTD data
- **Budget alerts** - Highlight categories over budget threshold

