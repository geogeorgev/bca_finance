# Check Number Sequence Validation - Collection Entry

## Overview
The Collection Entry screen now includes automatic check number sequence validation. When members give checks that are part of a series, the system validates that the check number is the next expected sequence number from the last payment.

## Features

### 1. **Automatic Check Number Validation**
When you select "Check" as the payment type and enter a check number, the system:
- Retrieves the last check number from that member
- Verifies if the current check number is the next sequential number
- Shows an alert if there's a mismatch

### 2. **Double-Check Confirmation Dialog**
If the check number is NOT the next sequential number, a confirmation dialog appears:
```
⚠️ Check Number Mismatch!

Last Check: #1001
Expected: #1002
Entered: #1005

Do you want to double-check and proceed anyway?
```

The user can then:
- **Click OK**: Proceed with saving the collection with the entered check number
- **Click Cancel**: Return to the form to correct the check number

### 3. **Automatic Form Reload**
After saving a collection, the form automatically reloads for the next entry, allowing quick consecutive data entry.

## How It Works

### Three New Functions Added:

#### 1. `getLastCheckNumber(memberId)`
- Queries the database for the member's most recent check payment
- Returns the last check number (as an integer)
- Returns `null` if no previous checks exist

#### 2. `validateCheckNumber(memberId, currentCheckNumber)`
- Compares current check number with the last one
- Returns validation object with:
  - `valid`: Boolean (true if sequential)
  - `lastNumber`: Previous check number
  - `expectedNumber`: What number was expected
  - `currentNumber`: What was entered

#### 3. `showCheckNumberConfirmation(validation, callback)`
- Shows a confirmation dialog if check numbers don't match sequentially
- Allows user to confirm they want to proceed
- Calls callback with `true` to save or `false` to cancel

### Modified Function:

#### `addIncome()`
- Now validates check numbers before saving
- Only validates when payment type is "Check"
- Skips validation for guests or non-check payments
- Calls `saveIncomeToDatabase()` to handle the actual save

#### `saveIncomeToDatabase()`
- New function extracted from original `addIncome()`
- Handles all the database operations
- Keeps code organized and reusable

## Usage Example

### Scenario: Member John has given checks #1001 and #1002

1. Go to **Collection Entry**
2. Select **Member**: John
3. Select **Payment Type**: Check
4. Enter **Check Number**: 1003
5. Click **Save Collection**
   - System validates: Last check was 1002, expected 1003, entered 1003 ✓
   - Saves automatically

### Scenario: Member John accidentally enters wrong check number

1. Go to **Collection Entry**
2. Select **Member**: John
3. Select **Payment Type**: Check
4. Enter **Check Number**: 1005 (wrong - should be 1003)
5. Click **Save Collection**
   - Dialog appears showing the mismatch
   - User can click **OK** to proceed (if they verified it's correct)
   - Or click **Cancel** to fix the number

## Technical Details

### Database Query
The validation uses Firestore queries:
```javascript
db.collection("income")
  .where("MemberID", "==", memberId)
  .where("Type", "==", "Check")
  .orderBy("CheckNumber", "desc")
  .limit(1)
  .get()
```

This is efficient because:
- Filters to specific member only
- Filters to Check payments only
- Orders by check number descending
- Gets only the most recent one

### First Check Handling
- If a member has never given a check, the validation returns `valid: true`
- The user can enter any check number for the first check
- Subsequent checks are validated against the first one

### Guest Donations
- Guest donations skip check number validation
- Guests can enter any check number without validation

## Files Modified
- `/js/income.js` - Added validation functions and updated save logic

## Benefits
1. **Reduces Entry Errors**: Catches typos and sequence errors
2. **Maintains Check Records**: Ensures complete series is tracked
3. **Audit Trail**: Complete and accurate check number history
4. **User Friendly**: Clear warnings with option to override if needed
5. **Efficient Data Entry**: Auto-reload form for next entry

