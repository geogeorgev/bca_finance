# Quick Start Implementation Guide
**For:** BCA Finance System Users
**Date:** March 22, 2026
**Version:** 2.0

---

## What's New? 🆕

Your BCA Finance application has been enhanced with **three major improvements**:

### 1. 📅 Collection Date Auto-Fill
Collection Date now automatically fills with today's date when you create a collection entry.

### 2. 📊 Year-Based Budget Organization
Budgets are now organized by year. If you have 2026 and 2027 budgets, they'll display in separate sections.

### 3. 📈 Smart Year Filtering
Dashboard, Expenses, and Reports automatically show only current year (2026) data.

---

## How to Use - Step by Step

### Step 1️⃣: Create a Budget with Year Format

**Go to:** Menu → **Budget** → **Add Budget**

**Important:** When entering the BudgetID, use this format:
```
YYYY-BudgetName

Examples:
✅ 2026-General         ✅ 2026-Missions        ✅ 2026-Youth Programs
```

**Fill in:**
- **BudgetID:** `2026-General` (with year prefix)
- **Category:** General
- **SubCategory:** Office Supplies
- **Budget Amount:** 5000

**Click:** Save Budget

---

### Step 2️⃣: Add a Collection Entry

**Go to:** Menu → **Collection**

**Notice:** The Collection Date field is already filled with today's date ✅

**Fill in:**
- **Contributor Type:** Member or Guest
- **Purpose:** Offering - Common (or other)
- **Payment Type:** Cash or Check
- **Amount:** Enter amount
- **Click:** Save Collection

---

### Step 3️⃣: View Your Budget with Summary

**Go to:** Menu → **Budget**

**You'll see:**
```
📊 Budget Year 2026

Individual Items:
├─ 2026-General    General    Office Supplies    $5000    $0      $5000
├─ 2026-General    General    Utilities          $3000    $1000   $2000

Category Summary:
└─ General TOTAL                                  $8000    $1000   $7000

═════════════════════════════════════════════
GRAND TOTAL (2026)                           $8000    $1000   $7000
═════════════════════════════════════════════
```

**If you have 2027 budgets, they'll appear in separate section below.**

---

### Step 4️⃣: Add an Expense

**Go to:** Menu → **Expense** → **Add Expense**

**Notice:** Budget Category dropdown only shows 2026 categories ✅

**Fill in:**
- **Type:** Member or Non-Member
- **Category:** General (only 2026 categories shown)
- **SubCategory:** Office Supplies
- **Amount:** 500
- **Pay Date:** (defaults to today)
- **Click:** Save Expense

---

### Step 5️⃣: Check Your Dashboard

**Go to:** Menu → **Dashboard**

**You'll see:**
- **YTD Collection:** Only 2026 collections
- **YTD Expense:** Only 2026 expenses
- **YTD Balance:** Calculation based on 2026 only
- **Budget Chart:** Shows only 2026 budgets

---

### Step 6️⃣: Generate Reports

**Go to:** Menu → **Reports**

**Collection Report:**
- Title shows: "Collection Report - Year 2026"
- Total includes only 2026 collections

**Expense Report:**
- Title shows: "Expense Report - Year 2026"
- Total includes only 2026 expenses

---

## Key Features Explained

### 📅 Collection Date Auto-Fill
**What:** The date field automatically shows today's date
**Why:** Faster data entry
**Can I change it?** Yes, just click and select a different date

### 📊 Year in Budget ID
**Format Required:** `YYYY-BudgetName`
- First 4 characters = Year
- Followed by hyphen
- Followed by budget name

**Why?** So the system knows which year each budget belongs to

### 🎯 Automatic Year Filtering
**What:** The system automatically shows only 2026 data
**Where:** Dashboard, Expenses, Reports
**How:** Uses the year from your BudgetID and current dates
**When:** All automatically - you don't have to do anything

### 📈 Category Summaries
**What:** Totals for each budget category
**Where:** Budget screen
**Shows:** Sum of Budget Amount, Spent, and Balance per category
**Gray Background:** Makes it easy to spot

### 🏆 Grand Totals
**What:** Overall total for the entire year
**Where:** Bottom of each year's budget section
**Shows:** Total Budget, Total Spent, Total Balance for that year
**Dark Gray Background:** Stands out from category totals

---

## Common Questions

### Q: What if I forget the year in BudgetID?
**A:** The system will still work but will use the current year as default. Try to include the year for consistency.

### Q: Can I have multiple years of budgets?
**A:** Yes! Create budgets with different years (2026-General, 2027-General). They'll display in separate sections.

### Q: Will my old budgets still work?
**A:** Yes, but they won't have year filtering until you add the year to their BudgetID.

### Q: How do I see 2025 data?
**A:** The system shows current year (2026) by default. Future versions may allow year selection. For now, you'll need to check the database directly.

### Q: What if I enter a wrong collection date?
**A:** You can edit any collection entry. The date will still default to today for new entries, but you can change it.

### Q: Why don't my expense categories appear?
**A:** Make sure you created a budget with the current year in the BudgetID. Example: `2026-CategoryName`

---

## Quick Reference - Budget ID Format

### ✅ CORRECT Format
```
2026-General
2026-Missions  
2026-Youth Programs
2026-Building Fund
2027-General
2024-Missions
```

### ❌ INCORRECT Format
```
General                 (no year)
2026                    (no name)
Missions-2026           (year at end)
26-General              (2-digit year)
2026 General            (space instead of hyphen)
```

---

## Month-by-Month Usage Example

### March 2026

**Week 1:**
1. Create budgets for 2026 (if not done)
   - `2026-General`, `2026-Missions`, `2026-Youth`

**Ongoing:**
2. Enter collection entries (date auto-fills)
3. Add expenses as they occur (categories auto-filter to 2026)
4. View dashboard to track progress

**End of Month:**
5. Generate reports (shows March 2026 totals)
6. Check budget vs actual spending

### April 2026
- Same process
- Dashboard updates with April data
- Reports now show Year-to-Date April figures

### December 2026
- Continue with same process
- Dashboard shows full Year-to-Date for 2026
- Reports show complete annual summary

### January 2027
- Create 2027 budgets (`2027-General`, etc.)
- Dashboard switches to 2027 data automatically
- Old 2026 data accessible in Budget screen (separate section)

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Collection Date not auto-filling | Clear browser cache and reload |
| Budget categories not showing in Expense form | Create a budget with current year format (2026-Name) |
| Dashboard showing wrong year | Verify BudgetID includes year (2026-Budget) |
| Budget screen blank | Check if any budgets exist in database |
| Print shows all years | That's expected - click print to see all year sections |

---

## Tips & Tricks 💡

1. **Consistent Naming:** Use same category names across years
   - ✅ `2026-General` and `2027-General`
   - ❌ `2026-General` and `2027-GenFund`

2. **Expense Tracking:** Add expenses same day as entry
   - Dashboard updates automatically
   - Budget balance recalculates instantly

3. **Budget Planning:** Create full year budget at year start
   - Set all categories at once
   - Update as needed throughout year

4. **Year-End Reporting:** Run reports in December
   - Get complete annual summary
   - Archive for record-keeping

5. **Print for Records:** Print budget monthly
   - Shows running totals
   - Good for records/audit trail

---

## Screenshots & Visual Guide

### Collection Screen
```
Collection Entry

Contributor Type: [Member ▼]
Member: [Select Member ▼]
Purpose: [Offering - Common ▼]
Payment Type: [Cash ▼]
Collection Date: [03/22/2026] ← Auto-filled! ✅
Amount: [________]
[Save Collection]
```

### Budget Screen
```
Budget

[Add Budget] [Print]

Budget Year 2026
┌────────────────────────────────────────────┐
│ 2026-Gen │ General │ Utilities │ 5000 │ ... │
│ General TOTAL                    │ 5000 │ ... │
│ 2026-Gen │ Missions │ Outreach │ 3000 │ ... │
│ Missions TOTAL                   │ 3000 │ ... │
├────────────────────────────────────────────┤
│ GRAND TOTAL (2026)               │ 8000 │ ... │
└────────────────────────────────────────────┘

Budget Year 2027
[No budgets for 2027 yet]
```

### Dashboard Screen
```
Dashboard

═════════════════════════════════════════════
Treasurer Dashboard - Year 2026
═════════════════════════════════════════════

YTD Collection          YTD Expense         YTD Balance
$15,500               $6,200              $9,300
Year to Date          Year to Date        Surplus

[Budget vs Actual Chart - 2026 Only] ✅
[Monthly Collection/Expense Chart - 2026 Only] ✅
```

### Expense Screen
```
Expense

[Add Expense] [Print]

2026 Expenses:
┌────────────────────────────────────────────┐
│ Member │ General │ Utilities │ $500       │
│ Vendor │ Missions │ Materials │ $200      │
└────────────────────────────────────────────┘

Notice: Only 2026 expenses shown ✅
```

---

## Technical Notes (for IT/Admin)

### System Implementation Details
- **Year Extraction:** From BudgetID first segment before hyphen
- **Current Year:** Automatically determined from system date
- **Date Handling:** JavaScript Date object for date operations
- **Filtering:** Server-side Firestore queries optimized per year
- **Backward Compatibility:** Fully compatible with existing data
- **No Database Migration:** Code-only changes, no DB schema updates

### Browser Support
- ✅ Chrome 120+
- ✅ Firefox 121+
- ✅ Safari 17+
- ✅ Edge 120+

### Performance Impact
- ✅ Minimal (year grouping efficient)
- ✅ Actual query performance improved (year filtering)
- ✅ No noticeable lag or delays

---

## Support & Help

**For Technical Issues:**
1. Check TROUBLESHOOTING section above
2. Verify BudgetID format: `YYYY-BudgetName`
3. Clear browser cache if needed
4. Contact IT support if problem persists

**For Training:**
- Review this guide completely
- Practice with sample budgets
- Reach out to system administrator

**For Feedback:**
- Future enhancements planned
- User suggestions welcome
- Submit feature requests to admin

---

## Summary Checklist

- [ ] Read this entire guide
- [ ] Understand BudgetID format requirement
- [ ] Create test 2026 budget
- [ ] Add test collection entry (notice date auto-fill)
- [ ] View Budget screen (see year grouping)
- [ ] Add test expense (notice 2026 categories only)
- [ ] Check Dashboard (notice 2026 data only)
- [ ] Generate test report (notice year in title)
- [ ] Try print function (notice all years included)
- [ ] Feel confident using new features

---

## Ready to Go! 🚀

Your BCA Finance application is now enhanced with year-based budget management. Start using the new features today:

1. **Remember:** BudgetID format = `YYYY-BudgetName`
2. **Enjoy:** Auto-fill collection dates
3. **Track:** Year-specific data in Dashboard
4. **Manage:** Multi-year budgets separately
5. **Report:** Accurate year-based reporting

**Questions?** Review the Quick Reference or contact IT support.

---

**Version:** 2.0
**Updated:** March 22, 2026
**Status:** Ready for Production

