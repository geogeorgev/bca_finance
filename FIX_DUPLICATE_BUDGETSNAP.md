# Fix: Duplicate budgetSnap Variable Declaration

## Problem
**Error:** `Uncaught SyntaxError: Identifier 'budgetSnap' has already been declared`

The `addExpense()` function had the variable `budgetSnap` declared **twice** in the same scope, which caused a JavaScript syntax error.

---

## Root Cause

In the `addExpense()` function:

**First Declaration (Line 267)** - Budget Status Check:
```javascript
const budgetSnap = await db.collection("budget")
  .where("Category", "==", category)
  .where("SubCategory", "==", subCategory)
  .get()
```

**Second Declaration (Line 353)** - Budget Balance Update:
```javascript
const budgetSnap = await db.collection("budget")  // ❌ ERROR: Already declared
  .where("Category", "==", category)
  .where("SubCategory", "==", subCategory)
  .get()
```

In JavaScript, you cannot declare the same variable name twice in the same scope using `const` or `let`.

---

## Solution

Renamed the second declaration to `budgetSnapForUpdate`:

```javascript
const budgetSnapForUpdate = await db.collection("budget")
  .where("Category", "==", category)
  .where("SubCategory", "==", subCategory)
  .get()

if(!budgetSnapForUpdate.empty){
  budgetSnapForUpdate.forEach(doc=>{
    // ...rest of code
  })
}
```

---

## Changes Made

### File: expense.js
**Location:** Lines 353-363

**Before:**
```javascript
const budgetSnap = await db.collection("budget")  // ❌ Duplicate name
  .where("Category", "==", category)
  .where("SubCategory", "==", subCategory)
  .get()

if(!budgetSnap.empty){
  budgetSnap.forEach(doc=>{
```

**After:**
```javascript
const budgetSnapForUpdate = await db.collection("budget")  // ✅ Unique name
  .where("Category", "==", category)
  .where("SubCategory", "==", subCategory)
  .get()

if(!budgetSnapForUpdate.empty){
  budgetSnapForUpdate.forEach(doc=>{
```

---

## Verification

To verify the fix works:

1. **Refresh the browser** (Ctrl+F5 or Cmd+Shift+R)
2. Click the **"Expense"** button
3. ✅ The Expense screen loads without syntax errors
4. ✅ Click **"Add Expense"** button
5. ✅ Can add an expense without errors

---

## Impact

✅ **Fixed:** `SyntaxError: Identifier 'budgetSnap' has already been declared`
✅ **Fixed:** Expense screen now loads properly
✅ **Fixed:** `loadExpense is not defined` error resolved
✅ **No data loss:** All existing data unaffected

---

## Files Modified

- **expense.js** - Renamed second `budgetSnap` to `budgetSnapForUpdate` (lines 353-363)

