# Expense Pay Date Validation

## Overview
Added validation to the **Add Expense** screen to ensure that the **Pay Date** must fall within the selected **Budget Year**. This prevents accidental entry of expenses with dates outside the intended budget period.

---

## How It Works

### Validation Logic
When you click **Save Expense**, the system checks:

1. **Extract year from Pay Date** - E.g., if you select March 27, 2026, the year is 2026
2. **Compare with Budget Year** - Check if Pay Date year matches selected Budget Year
3. **If no match** - Show error message and block save
4. **If match** - Continue with expense save

### Example Scenarios

#### ✅ Valid (Will Save)
- Budget Year: **2026**
- Pay Date: **March 27, 2026**
- Result: **Saves successfully** ✓

#### ❌ Invalid (Will Show Error)
- Budget Year: **2026**
- Pay Date: **January 5, 2027**
- Result: **Shows error, expense NOT saved** ✗

---

## User Experience

### Error Message

If the Pay Date is outside the Budget Year, you'll see:

```
Alert Box:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pay Date must be in 2026.

You selected: 1/5/2027 (2027)

Please select a date within the Budget Year 2026.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

The expense is **NOT saved** until you:
1. Change the **Budget Year** to match the Pay Date, OR
2. Change the **Pay Date** to match the Budget Year

---

## Validation Order

The system validates in this order:

1. ✅ **Budget Category & SubCategory** selected
   - Error: "Please select Budget Category and SubCategory"

2. ✅ **Amount** is valid (> 0)
   - Error: "Please enter a valid amount"

3. ✅ **Pay Date** is within Budget Year ← **NEW**
   - Error: "Pay Date must be in [YEAR]"

4. ✅ **Receipt** file size valid (if provided)
   - Warning: File too large (but can skip receipt)

5. ✅ **Save to Firestore**

---

## Code Implementation

### Added Validation Code

```javascript
// VALIDATION: Ensure Pay Date is within Budget Year
const payDateObj = new Date(payDate)
const payDateYear = payDateObj.getFullYear().toString()

if(payDateYear !== budgetYear){
  alert(`Pay Date must be in ${budgetYear}.\n\nYou selected: ${payDateObj.toLocaleDateString()} (${payDateYear})\n\nPlease select a date within the Budget Year ${budgetYear}.`)
  return
}
```

**Location:** `expense.js`, line ~257 (in `addExpense()` function)

---

## Database Impact

- ✅ **No database changes** - Uses existing schema
- ✅ **No retroactive changes** - Only validates NEW expenses
- ✅ **Existing data unaffected** - Old expenses remain unchanged

---

## UI Changes

### Add Expense Form

The form already has:
- Budget Year dropdown (e.g., 2026, 2027)
- Pay Date input field

Now with validation:
- If you try to save with mismatched dates → Error alert appears
- Expense does NOT save until dates are corrected

---

## Use Cases

### Scenario 1: Current Year Entry (Normal)
- Date: March 27, 2026
- Budget Year: 2026
- Pay Date: March 27, 2026
- Result: ✓ Saves successfully

### Scenario 2: Previous Year Entry (Catching Errors)
- Date: March 27, 2026
- Budget Year: 2026
- Pay Date: December 31, 2025 (accidentally selected 2025)
- Result: ✗ Error - "Pay Date must be in 2026"
- User corrects to 2026 → Saves successfully

### Scenario 3: Future Year Entry (Catching Errors)
- Date: March 27, 2026
- Budget Year: 2026
- Pay Date: January 15, 2027 (accidentally selected 2027)
- Result: ✗ Error - "Pay Date must be in 2026"
- User either:
  - Changes Pay Date to 2026, OR
  - Changes Budget Year to 2027
- Then saves successfully

---

## Benefits

| Benefit | Details |
|---------|---------|
| **Data Integrity** | Prevents expenses from wrong years in budget |
| **Budget Accuracy** | Ensures budget totals are correct |
| **Error Prevention** | Catches accidental date mistakes early |
| **User-Friendly** | Clear error message explains the problem |
| **No Extra Steps** | Validation is automatic, no additional work |

---

## Limitations

- ✅ Works for any year combination (2025, 2026, 2027, etc.)
- ✅ Compares by year only (not by specific date range)
- ⚠️ Does NOT prevent saving expenses for dates in the past or far future (only checks year match)

---

## Files Modified

**expense.js**
- Location: `addExpense()` function (around line 257)
- Added 4-line validation block before receipt upload

---

## Testing

### Test Case 1: Same Year (Should Pass)
1. Budget Year: 2026
2. Pay Date: March 27, 2026
3. Click Save
4. **Expected:** Expense saves ✓

### Test Case 2: Different Year (Should Fail)
1. Budget Year: 2026
2. Pay Date: January 5, 2027
3. Click Save
4. **Expected:** Error alert appears, expense NOT saved ✗

### Test Case 3: Correct After Error
1. Budget Year: 2026
2. Pay Date: January 5, 2027 (wrong)
3. Click Save → Error appears
4. Change Pay Date to January 5, 2026 (correct)
5. Click Save
6. **Expected:** Expense saves ✓

---

## Future Enhancements

Could add:
- **Custom date range validation** - Allow only specific date range per budget
- **Warning for future dates** - Warn if Pay Date is in the future
- **Cross-year budgets** - Support July-June fiscal year budgets
- **Bulk edit** - Change Pay Date for multiple expenses at once

