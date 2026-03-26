# Date Display Issue - Timezone Fix

## Problem
Collection dates were displaying one day earlier than the date stored in Firebase.
- **Firebase stored**: "2026-01-04"
- **Report displayed**: "1/3/2026" (January 3, 2026)

## Root Cause
The issue was a **timezone offset problem**. When date strings (e.g., "2026-01-04") were passed directly to the `new Date()` constructor, JavaScript was interpreting them as UTC times. When `toLocaleDateString()` was called, it converted from UTC to the user's local timezone, which resulted in showing the previous day.

This typically happens when the user's timezone is west of UTC (e.g., EST, PST).

## Solution
Instead of parsing the date string as UTC, we now parse it as a **local date** by:
1. Splitting the date string into year, month, and day components
2. Creating a new Date object with the local timezone: `new Date(year, month - 1, day)`

### Files Modified

#### 1. **reports.js** (3 locations)
- **Line 102-116**: Collection Report generation - Fixed date parsing for filtering by date range
- **Line 611-623**: Contribution statement generation (first instance) - Fixed year filtering
- **Line 795-807**: Single member contribution statement - Fixed year filtering

**Before:**
```javascript
const collectionDate = new Date(d.CollectionDate)
```

**After:**
```javascript
const dateStr = d.CollectionDate
const [year, month, day] = dateStr.split('-')
const collectionDate = new Date(year, month - 1, day)
```

#### 2. **dashboard.js** (1 location)
- **Line 45-60**: Dashboard income processing - Fixed YTD calculation

**Before:**
```javascript
const date = new Date(d.CollectionDate)
const year = date.getFullYear()
```

**After:**
```javascript
const dateStr = d.CollectionDate
const [year, month, day] = dateStr.split('-')
const date = new Date(year, month - 1, day)
const year_val = date.getFullYear()
```

#### 3. **bank_enhanced.js** (1 location)
- **Line 723-733**: Transaction sorting - Fixed date parsing for sorting

**Before:**
```javascript
const dateA = new Date(a.data().CollectionDate)
const dateB = new Date(b.data().CollectionDate)
```

**After:**
```javascript
const dateStrA = a.data().CollectionDate
const dateStrB = b.data().CollectionDate
const [yearA, monthA, dayA] = dateStrA.split('-')
const [yearB, monthB, dayB] = dateStrB.split('-')
const dateA = new Date(yearA, monthA - 1, dayA)
const dateB = new Date(yearB, monthB - 1, dayB)
```

## Testing
After these changes:
1. Dates in the Collection Report should display correctly (matching Firebase dates)
2. Year filtering in contribution statements should work correctly
3. Dashboard YTD calculations should use the correct dates
4. Transaction sorting in bank reconciliation should be accurate

## Note
The expense report was not affected because it uses Firebase Timestamps with `.toDate()` conversion, which already handles timezone properly.

