# Budget Year Management Guide

## Overview
This guide explains how to manage active/inactive budgets by year and handle late expense entries for previous years.

---

## Features Added

### 1. Budget Status Management (budget.js)

#### BudgetStatus Column
- Every budget now has a **BudgetStatus** field (Active or Inactive)
- Status is color-coded:
  - **Green** = Active
  - **Red** = Inactive

#### Individual Toggle Buttons
- Each budget row has an "Activate" or "Deactivate" button
- Click to toggle status one at a time
- A confirmation dialog will appear before making changes

#### Bulk Year Management
- New button: **"Manage Year Status"**
- Allows activating/deactivating ALL budgets for a specific year at once
- Two options:
  - **Activate All for Selected Year** - Makes all budgets for the selected year Active
  - **Deactivate All Other Years** - Makes all budgets for years OTHER than the selected year Inactive

#### How to Use Year Management

**For Current Year (2026 - March 2026):**
1. Click "Manage Year Status"
2. Select Year: 2026
3. Click "Activate All for Selected Year"
   - All 2026 budgets → Active
4. Click "Deactivate All Other Years"
   - All 2027+ budgets → Inactive

**In January 2027:**
1. Click "Manage Year Status"
2. Select Year: 2027
3. Click "Activate All for Selected Year"
   - All 2027 budgets → Active
4. Click "Deactivate All Other Years"
   - All 2026 budgets → Inactive

---

### 2. Budget Year Selection in Expense Entry (expense.js)

#### New Budget Year Selector
- Added **Budget Year** dropdown at the top of "Add Expense" form
- Shows all available years from existing budgets
- Defaults to current year on page load

#### How to Record Late Entries

**Example: Recording February 2026 Expense in February 2027**

1. Go to Expense screen
2. Click "Add Expense"
3. **Budget Year** dropdown: Select **2026** (even though 2026 is now inactive)
4. Proceed with normal expense entry:
   - Select Category (will show 2026 categories)
   - Select SubCategory (will show 2026 subcategories)
   - Fill in other details
5. Click "Save Expense"
   - Expense will be saved with BudgetYear: 2026
   - Budget balance for 2026 will be updated (if 2026 still exists)

#### Category/SubCategory Updates
- When you change the **Budget Year**, categories and subcategories automatically update
- This ensures you only see categories that exist for the selected year

---

## Database Changes

### Budget Collection
Added field: **BudgetStatus** (String)
- Values: "Active" or "Inactive"
- Default: "Inactive"

### Expense Collection
Added field: **BudgetYear** (String)
- Stores the year the expense belongs to
- Used to match expenses with correct budget entries

---

## Typical Workflow

### Beginning of Year (e.g., January 2026)
1. Create all 2026 budgets with status = "Inactive"
2. Go to "Manage Year Status" → Select 2026 → Activate All
3. This makes 2026 active for the year

### End of Year (e.g., December 2026)
1. All expenses already recorded against 2026
2. 2026 budget remains active until year-end review

### New Year (e.g., January 2027)
1. Create new 2027 budgets with status = "Inactive"
2. Go to "Manage Year Status" → Select 2027 → Activate All
3. Go to "Manage Year Status" → Select 2027 → Deactivate All Other Years
   - This deactivates 2026 (and any other past years)

### Late Entry (e.g., February 2027 for a 2026 expense)
1. Click "Add Expense"
2. Budget Year dropdown: Select **2026**
3. This allows you to post expenses to 2026 even though 2026 is now inactive
4. Categories and subcategories for 2026 will appear

---

## Benefits

✅ **Clear Year Management** - See which budget years are active at a glance
✅ **Bulk Operations** - Toggle entire year status with one click
✅ **Late Entries** - Still able to add expenses to previous years
✅ **Accurate Tracking** - Budget Year stored with each expense for accurate reporting
✅ **Flexibility** - Individual toggle buttons for granular control

---

## Notes

- Budget Status does NOT prevent data entry
- You can always change status back if needed
- Both active AND inactive budgets can receive expense entries
- Budget Year is stored with expense for accurate reconciliation
- Reports can filter by year to show accurate financial data

