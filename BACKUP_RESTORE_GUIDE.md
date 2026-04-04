# Database Backup & Restore Feature

**Date:** April 4, 2026  
**Status:** ✅ BACKUP READY | ⚠️ RESTORE NEEDS IMPLEMENTATION

---

## Overview

The BCA Finance application includes a database backup feature that allows you to download a complete backup of all data. A restore feature still needs to be implemented to restore from backups.

---

## 📥 How Backup Works

### What Gets Backed Up
The backup includes all data from 4 collections:
1. **Members** - All member information and records
2. **Income** - All collection/donation records
3. **Expense** - All expense records
4. **Budget** - All budget allocations and status

### How to Create a Backup

**Step 1: Go to Reports**
```
Menu → Reports
```

**Step 2: Click Backup Database Button**
```
[Backup Database] button at bottom of Reports screen
```

**Step 3: File Downloads Automatically**
```
A file named "church_backup.json" will download to your computer
```

### What the Backup File Contains

The backup is a JSON file with this structure:
```json
{
  "members": [
    {
      "name": "John Smith",
      "email": "john@email.com",
      "phone": "555-1234",
      "memberid": "M001",
      ...
    }
  ],
  "income": [
    {
      "MemberName": "John Smith",
      "Amount": 100.00,
      "Purpose": "General Offering",
      "Type": "Cash",
      "Date": "2026-04-01",
      ...
    }
  ],
  "expense": [
    {
      "PayeeName": "Acme Corp",
      "Amount": 250.00,
      "Category": "Office Supplies",
      "PaymentDate": "2026-04-01",
      ...
    }
  ],
  "budget": [
    {
      "Category": "Utilities",
      "SubCategory": "Electric",
      "BudgetAmount": 5000.00,
      "Spent": 1200.50,
      ...
    }
  ]
}
```

---

## 💾 How to Backup (Step-by-Step)

### Quick Steps
1. Click **Reports** in menu
2. Click **Backup Database** button
3. File `church_backup.json` downloads
4. Save it to a safe location (USB drive, OneDrive, Google Drive, etc.)

### Backup Best Practices
✅ **Regular backups** - Weekly or monthly  
✅ **Multiple copies** - Keep several backups  
✅ **Different locations** - USB drive + cloud storage  
✅ **Label backups** - Include date: `church_backup_2026-04-04.json`  
✅ **Test restore** - Verify backups work (when restore feature added)  

### Example Backup Schedule
```
Monday   - Backup to USB drive
Thursday - Backup to cloud storage
Monthly  - Archive important backup
```

---

## 🔄 How Restore Would Work (Not Yet Implemented)

### Planned Restore Process

**Step 1: Go to Reports**
```
Menu → Reports
```

**Step 2: Click Restore Database Button**
```
[Restore Database] button (to be added)
```

**Step 3: Select Backup File**
```
Browser dialog opens
Select "church_backup.json" file from your computer
Click Open
```

**Step 4: Confirmation**
```
Dialog asks: "Are you sure you want to restore? This will overwrite current data."
You confirm the restore
```

**Step 5: Restore Process**
```
System reads the JSON file
Verifies data integrity
Uploads all data to Firebase
Shows success message
```

**Step 6: Verification**
```
Check data to confirm restore was successful
Verify all members, collections, expenses, budgets
```

---

## 📝 Backup File Details

### File Name
```
church_backup.json
```

### File Size
- Small databases: 50 KB - 500 KB
- Large databases: 500 KB - 5 MB

### File Format
- Format: JSON (text-based)
- Can be opened in any text editor
- Human-readable

### Creation Timestamp
- Created: When you click the button
- NOT included in filename automatically
- Recommendation: Add date manually to filename

---

## 🎯 Use Cases for Backups

### 1. **Accidental Data Deletion**
If someone accidentally deletes records, you can restore from backup.

### 2. **Data Corruption**
If database becomes corrupted, restore from a clean backup.

### 3. **Regular Maintenance**
Keep regular backups for audit trail and record-keeping.

### 4. **Transition & Migration**
When moving to a new system, use backup to export data.

### 5. **Audit Trail**
Maintain dated backups to show historical data state.

### 6. **Disaster Recovery**
If Firebase database is compromised, restore from local backup.

---

## ⚠️ Important Notes

### Backup Scope
✅ Backs up: Members, Income, Expense, Budget  
❌ Does NOT back up: User accounts, Roles, Permissions  
❌ Does NOT back up: Receipts, Attachments  
❌ Does NOT back up: Email/Message history  

### What's NOT Backed Up
The backup does NOT include:
- User login accounts
- User permissions and roles
- Document attachments (receipts)
- File storage items
- System settings
- Audit logs

### Data Not Restored
When restore is implemented, be aware:
- Some data like user roles may need to be reconfigured
- Receipts and attachments would need separate backup/restore
- Settings may need to be re-entered

---

## 🔐 Security Considerations

### Backup Security
✅ **Downloaded to local computer** - Not stored in cloud by default  
✅ **Contains sensitive data** - Treat like confidential financial records  
✅ **Store securely** - Password-protect USB drive or cloud folder  
✅ **Access control** - Only trusted people should have copies  

### Best Practices
- ✅ Store backups in secure location
- ✅ Encrypt sensitive backups
- ✅ Use password-protected cloud storage
- ✅ Limit who has access to backups
- ✅ Delete old backups securely

---

## 📋 Implementation Status

### Currently Available
✅ **Backup Database** - Fully functional
- Downloads complete data as JSON file
- Includes all 4 collections
- File is ready to save

### To Be Implemented
⏳ **Restore Database** - In Planning Phase
- Would allow uploading backup file
- Would restore data to database
- Would include safety checks
- Would verify data before restore

---

## 🔧 Technical Details

### Backup Code Location
**File:** `js/reports.js`  
**Function:** `backupDatabase()`  
**Lines:** 447-475  

### Collections Backed Up
1. `members` - User/Member records
2. `income` - Collection/Income entries
3. `expense` - Expense entries
4. `budget` - Budget allocations

### Backup Process
```
1. Get each collection from Firebase
2. Convert documents to JSON format
3. Combine all into single JSON object
4. Create downloadable file
5. Trigger browser download
6. File saved to Downloads folder
```

### File Format
- **Type:** JSON (JavaScript Object Notation)
- **Encoding:** UTF-8
- **Structure:** Nested object with 4 arrays
- **Human-readable:** Yes (formatted with indentation)

---

## 🚀 How to Access Backup

### From Menu
1. Click **Reports** button in top menu
2. Scroll down to see **Backup Database** button
3. Click button
4. File downloads automatically

### File Location After Download
- **Windows:** Downloads folder (usually `C:\Users\YourName\Downloads\`)
- **Mac:** Downloads folder
- **Browser:** Check downloads manager if not visible

---

## 💡 FAQ

### Q: How often should I backup?
**A:** At least weekly, or more frequently if you're doing active data entry. Daily backups are ideal for important financial records.

### Q: Where should I store backups?
**A:** In multiple locations:
- USB drive (external backup)
- Cloud storage (Google Drive, OneDrive, Dropbox)
- External hard drive
- Network drive

### Q: Is the backup encrypted?
**A:** Not automatically. You should:
- Store on encrypted USB drive
- Use password-protected cloud storage
- Encrypt the file manually if needed

### Q: Can I restore to a different database?
**A:** Not yet (restore feature not implemented), but the JSON format is standard so it could be imported to other systems.

### Q: What if my backup file gets corrupted?
**A:** That's why you keep multiple backups in different locations. Always have 2-3 recent backups available.

### Q: Can I manually edit the backup file?
**A:** Yes, it's a text JSON file, but be very careful as incorrect formatting will break the restore process.

### Q: How big is a typical backup?
**A:** Usually 100 KB - 2 MB depending on your database size. Small organizations: ~100-500 KB. Larger: 500 KB - 5 MB.

### Q: Does backup include email addresses and passwords?
**A:** No, passwords are never stored in the database. Email addresses are included. You should still treat backups as confidential.

---

## 📞 Support

### If backup fails:
1. Check internet connection
2. Verify all data exists in application
3. Try again
4. Contact administrator if problem persists

### If you need restore:
1. Contact administrator
2. Provide backup file
3. Restore feature will be implemented in future
4. Currently requires manual data import

---

## 🔄 Current Status & Roadmap

### ✅ Completed
- Backup Database feature (fully functional)
- All collections included
- JSON format download

### ⏳ Planned for Future
- Restore Database feature
- File validation/integrity checking
- Encryption options
- Scheduled automated backups
- Backup history/versioning

---

## Recommendation

**Create your first backup now:**
1. Go to Reports menu
2. Click "Backup Database"
3. Save file with date: `church_backup_2026-04-04.json`
4. Store in safe location
5. Repeat weekly

---

**Current Status:** Backup Feature Active ✅  
**Restore Feature:** Planned for Implementation  
**Last Updated:** April 4, 2026

