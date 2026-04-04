# Complete Database Backup & Restore - All Tables

**Date:** April 4, 2026  
**Status:** ✅ COMPLETE & TESTED

---

## Overview

The backup and restore system now backs up **ALL 9 database collections** with timestamp in YYYY-MM-DD-HH:MM:SS format.

---

## 🗂️ All Collections Backed Up

### 1. **Members**
- Member profiles
- Contact information
- Membership details
- Active status

### 2. **Income** 
- Collection entries
- Donation records
- Contribution tracking
- Income sources

### 3. **Expense**
- Expense records
- Payments made
- Budget tracking
- Receipt references

### 4. **Budget**
- Budget allocations
- Budget categories
- Spending limits
- Budget status

### 5. **Users**
- User accounts
- Login credentials
- User roles
- Permission assignments

### 6. **Events**
- Event information
- Event dates
- Event details
- Event management data

### 7. **Event Registrations**
- Participant registrations
- Check-in status
- Contribution tracking
- Guardian information

### 8. **Bank Transactions**
- Bank statements
- Reconciliation data
- Transaction records
- Import history

### 9. **Receipts**
- Receipt files
- Expense receipts
- Document storage
- File metadata

---

## Backup Filename Format

```
church_backup_YYYY-MM-DD-HH-MM-SS.json
```

### Example Filenames

```
church_backup_2026-04-04-09-00-15.json    (April 4, 9:00:15 AM)
church_backup_2026-04-04-14-30-45.json    (April 4, 2:30:45 PM)
church_backup_2026-04-05-08-00-00.json    (April 5, 8:00:00 AM)
```

---

## How to Backup All Data

### Step 1: Go to Reports
```
Menu → Reports
```

### Step 2: Click Backup Button
```
[💾 Backup Database] button at bottom
```

### Step 3: Confirmation
```
Dialog shows:
✅ Complete Database Backup Downloaded!
✅ Lists all 9 collections backed up
✅ Shows filename with timestamp
```

### Step 4: File Downloads
```
Filename: church_backup_2026-04-04-14-30-45.json
Location: Downloads folder
Size: Varies based on data volume
```

---

## How to Restore All Data

### Step 1: Go to Reports
```
Menu → Reports
```

### Step 2: Click Restore Button
```
[⬆️ Restore Database] button at bottom
```

### Step 3: Select Backup File
```
Click "Select Backup File"
Navigate to church_backup_YYYY-MM-DD-HH-MM-SS.json
Click Open
```

### Step 4: Review Preview
```
Shows all collections found in backup:
✅ Members: X records
✅ Income: X records
✅ Expenses: X records
✅ Budgets: X records
✅ Users: X records
✅ Events: X records
✅ Registrations: X records
✅ Bank Transactions: X records
✅ Receipts: X records
```

### Step 5: Confirm Restore
```
Read warning about data replacement
Click [Confirm Restore]
Confirm again in alert dialog
```

### Step 6: Completion
```
✅ Shows restoration summary
✅ Lists all collections restored with counts
✅ Returns to Reports screen
```

---

## Backup Contents Structure

```json
{
  "members": [
    { "name": "John", "email": "john@email.com", ... },
    { "name": "Mary", "email": "mary@email.com", ... }
  ],
  "income": [
    { "Amount": 100, "Purpose": "Offering", ... },
    { "Amount": 250, "Purpose": "Tithe", ... }
  ],
  "expense": [
    { "PayeeName": "Acme", "Amount": 500, ... },
    { "PayeeName": "Office", "Amount": 200, ... }
  ],
  "budget": [
    { "Category": "Utilities", "BudgetAmount": 5000, ... },
    { "Category": "Salary", "BudgetAmount": 20000, ... }
  ],
  "users": [
    { "Name": "Admin", "Email": "admin@church.com", "Role": "Admin", ... },
    { "Name": "Treasurer", "Email": "treasurer@church.com", "Role": "Treasurer", ... }
  ],
  "events": [
    { "name": "Sunday Service", "startDate": "2026-04-05", ... },
    { "name": "Youth Group", "startDate": "2026-04-06", ... }
  ],
  "eventRegistrations": [
    { "eventId": "...", "name": "John", "contribution": 50, ... },
    { "eventId": "...", "name": "Mary", "contribution": 25, ... }
  ],
  "bank_transactions": [
    { "Date": "2026-04-01", "Description": "Deposit", "Credit": 1000, ... },
    { "Date": "2026-04-02", "Description": "Check", "Debit": 500, ... }
  ],
  "receipts": [
    { "FileName": "receipt1.pdf", "FileSizeKB": 250, "Data": "...", ... },
    { "FileName": "receipt2.jpg", "FileSizeKB": 150, "Data": "...", ... }
  ]
}
```

---

## Timestamp Details

### Format Components
```
YYYY-MM-DD-HH-MM-SS
│    │   │  │  │  │
│    │   │  │  │  └─ Seconds (00-59)
│    │   │  │  └───── Minutes (00-59)
│    │   │  └──────── Hours (00-23, 24-hour format)
│    │   └─────────── Day (01-31)
│    └────────────── Month (01-12)
└──────────────────── Year (YYYY)
```

### Time Zone
- Uses computer's local time
- 24-hour format (00:00 to 23:59)
- Preserves exact timestamp of backup

---

## Best Practices

### Backup Schedule
```
Weekly Minimum:
  Monday (9 AM):   USB drive
  Thursday (2 PM): Cloud storage
  Monthly: Archive
```

### Storage Locations
```
Location 1: USB drive (offline)
Location 2: Google Drive (cloud)
Location 3: OneDrive (backup)
Location 4: External hard drive (archive)
```

### File Organization
```
📁 Church Backups
  📁 Weekly
    ├─ church_backup_2026-04-01-09-00-00.json
    ├─ church_backup_2026-04-08-09-00-00.json
    └─ church_backup_2026-04-15-09-00-00.json
  📁 Monthly Archive
    └─ church_backup_2026-04-30-17-00-00.json
```

### Security
```
✅ Use password-protected USB drives
✅ Encrypt cloud storage folders
✅ Limit access to authorized people
✅ Keep offline copies
✅ Test restore process quarterly
```

---

## Collections Details

### Members Collection
**Contains:** All member records  
**Records:** Each person in database  
**Includes:** Name, email, phone, address, etc.  
**Backed Up:** ✅ Yes  

### Income Collection
**Contains:** All income/donation records  
**Records:** Each collection entry  
**Includes:** Amount, date, purpose, member, etc.  
**Backed Up:** ✅ Yes  

### Expense Collection
**Contains:** All expense records  
**Records:** Each payment made  
**Includes:** Payee, amount, category, date, etc.  
**Backed Up:** ✅ Yes  

### Budget Collection
**Contains:** All budget allocations  
**Records:** Each budget line item  
**Includes:** Category, amount, spent, status, etc.  
**Backed Up:** ✅ Yes  

### Users Collection
**Contains:** User accounts and roles  
**Records:** Login users  
**Includes:** Email, name, role, permissions, etc.  
**Backed Up:** ✅ Yes  

### Events Collection
**Contains:** Event information  
**Records:** Each event  
**Includes:** Name, dates, fee, description, etc.  
**Backed Up:** ✅ Yes  

### Event Registrations Collection
**Contains:** Event participant registrations  
**Records:** Each participant per event  
**Includes:** Name, contact, contribution, status, etc.  
**Backed Up:** ✅ Yes  

### Bank Transactions Collection
**Contains:** Bank statement data  
**Records:** Each transaction  
**Includes:** Date, description, debit, credit, balance, etc.  
**Backed Up:** ✅ Yes  

### Receipts Collection
**Contains:** Receipt files  
**Records:** Each receipt  
**Includes:** File name, file data, upload date, etc.  
**Backed Up:** ✅ Yes  

---

## File Size Estimates

### Small Database (< 1 year)
```
Members: 5-50 records
Income: 100-500 records
Expenses: 50-200 records
Budget: 20-50 records
Users: 2-10 records
Events: 5-20 records
Registrations: 50-500 records
Transactions: 50-200 records
Receipts: 10-100 files

Total Size: 200 KB - 2 MB
```

### Medium Database (1-3 years)
```
Similar growth proportional to usage
Total Size: 2 MB - 10 MB
```

### Large Database (3+ years)
```
Similar growth proportional to usage
Total Size: 10 MB - 50 MB+
```

---

## Testing Verification

### Test Backup
```
✅ Click [Backup Database]
✅ Verify filename format with timestamp
✅ Verify all 9 collections backed up message
✅ Check Downloads folder for file
✅ Verify file size reasonable
```

### Test Restore
```
✅ Click [Restore Database]
✅ Select backup file
✅ Verify preview shows all 9 collections
✅ Confirm restore
✅ Verify all data restored correctly
```

### Verify Data
```
✅ Check members count matches
✅ Check income entries restored
✅ Check expenses visible
✅ Check user roles intact
✅ Check events and registrations
✅ Check bank transactions
✅ Check receipts accessible
```

---

## Implementation Details

**File Modified:** `js/reports.js`

**Functions Updated:**
1. `backupDatabase()` - Now backs up all 9 collections
2. `restoreDatabase()` - Now restores all 9 collections

**Backup Collections:**
```javascript
const collections=["members","income","expense","budget","users","events","eventRegistrations","bank_transactions","receipts"]
```

**Timestamp Format:**
```javascript
const timestamp = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`
```

---

## Status

```
✅ All Collections: INCLUDED
✅ Timestamp Format: YYYY-MM-DD-HH-MM-SS
✅ Backup Function: COMPLETE
✅ Restore Function: COMPLETE
✅ Error Handling: COMPLETE
✅ Testing: VERIFIED
✅ Documentation: COMPREHENSIVE
```

---

## Summary

**What's Backed Up:** All 9 database collections  
**Filename:** church_backup_YYYY-MM-DD-HH-MM-SS.json  
**Size:** 200 KB - 50 MB (varies by data)  
**Locations:** Reports → Backup & Restore buttons  
**Restore:** Upload same file and confirm  
**Status:** ✅ Production Ready  

---

**Implementation Date:** April 4, 2026  
**Status:** ✅ COMPLETE & TESTED

