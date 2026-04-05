# Database Management Audit Trail

## Overview
The Database Management Audit Trail tracks all backup and restore operations performed on the database, providing a complete history of who did what, when, and what data was affected.

## Features

### ✅ What Gets Tracked

**For Every Backup:**
- Who performed the backup (user name & email)
- When the backup was created (date & time)
- Filename of the backup
- Which tables were backed up
- Number of records in each table
- Success/failure status

**For Every Restore:**
- Who performed the restore (user name & email)
- When the restore was performed (date & time)
- Which backup file was restored
- Which tables were restored
- Number of records restored per table
- Success/failure status (including error messages if failed)

### ✅ How to Access

1. **Go to Reports** → Click "📋 Backup Audit Trail" button
2. View all backup and restore operations in a detailed table
3. See exactly who did what and when

## Data Collection

### Backup Operations
When you click "💾 Backup Database":
- Creates backup file
- Downloads backup to your computer
- Logs operation to `backup_audit_trail` collection with:
  - Action: "BACKUP"
  - User name and email
  - Timestamp
  - Filename
  - Table record counts

### Restore Operations
When you click "⬆️ Restore Database":
- Uploads and validates backup file
- Restores all data
- Logs successful restore with:
  - Action: "RESTORE"
  - User name and email
  - Timestamp
  - Filename
  - Tables restored and record counts
- If restore fails, logs failure with error message

## Audit Trail Display

### View in UI
Go to **Reports → 📋 Backup Audit Trail** to see:

```
Action      | Date & Time           | Performed By      | Email           | Status  | File                         | Details
------------|----------------------|------------------|-----------------|---------|------------------------------|------------------
BACKUP      | 4/4/2026 2:30:45 PM  | John Smith       | john@example.com| SUCCESS | church_backup_2026-04-04... | Database backup created...
RESTORE     | 4/3/2026 11:15:30 AM | Maria Garcia     | maria@example.com| SUCCESS | church_backup_2026-04-03... | Database restore completed...
BACKUP      | 4/2/2026 3:45:20 PM  | John Smith       | john@example.com| SUCCESS | church_backup_2026-04-02... | Database backup created...
```

### Table Details Row
Below each operation, you can see detailed record counts:

**BACKUP:**
```
Tables Backed Up: Members: 45, Income: 234, Expense: 89, Budget: 12, Users: 8, 
Events: 5, Registrations: 23, Bank Transactions: 156, Receipts: 0
```

**RESTORE:**
```
Tables Restored: Members: 45, Income: 234, Expense: 89, Budget: 12, Users: 8, 
Events: 5, Registrations: 23, Bank Transactions: 156, Receipts: 0
```

## Database Structure

### backup_audit_trail Collection

Each document contains:

```javascript
{
  action: "BACKUP" | "RESTORE",           // Type of operation
  timestamp: Date,                         // When operation occurred
  performed_by: "John Smith",              // User name
  performed_by_email: "john@example.com", // User email
  filename: "church_backup_2026-04-04-14-30-45.json", // Backup filename
  status: "success" | "failed",            // Operation result
  details: "Database backup created successfully", // Additional info
  
  // For backups/restores only:
  tables_backed_up: [...],                 // Array of table names
  tables_restored: [...],                  // Array of table names
  
  // Record counts per table
  table_record_counts: {
    members: 45,
    income: 234,
    expense: 89,
    budget: 12,
    users: 8,
    events: 5,
    eventRegistrations: 23,
    bank_transactions: 156,
    receipts: 0
  }
}
```

## Implementation Details

### Code Changes

**File: js/reports.js**

1. **backupDatabase()** function (line ~452)
   - Added code to log backup to `backup_audit_trail` collection
   - Captures table record counts
   - Logs success status

2. **restoreDatabase()** function (line ~598)
   - Added code to log restore to `backup_audit_trail` collection
   - Logs table record counts
   - Logs both success and failure cases with error messages

3. **showBackupAuditTrail()** function (NEW)
   - Reads all records from `backup_audit_trail` collection
   - Displays in formatted table
   - Shows table record counts below each entry
   - Ordered by most recent first

4. **loadReports()** function (updated)
   - Added button to access audit trail
   - Button: "📋 Backup Audit Trail" (orange color)

## Use Cases

### 1. Track Database Backups
See when backups were created and who created them:
- Daily backup schedule verification
- Responsibility tracking
- Storage management

### 2. Track Database Restores
Monitor all restore operations:
- Who restored data and when
- What data was restored
- Success/failure history

### 3. Compliance & Audit
Demonstrate backup/restore procedures:
- Show business continuity practices
- Document data protection measures
- Maintain compliance records

### 4. Troubleshooting
Identify issues with backups/restores:
- Failed restore attempts
- Error messages
- Timeline of operations

## Security & Access

### Who Can Access Audit Trail
Currently, anyone can view the audit trail from the Reports screen.

### Recommendation
The audit trail information should be restricted to authorized users only. Consider limiting access to:
- Superusers
- Admins
- Treasurers

### Current Behavior
- ✅ All backup/restore operations are logged
- ✅ User identity is captured
- ✅ Timestamps are recorded
- ✅ Detailed record counts tracked
- ✅ Failed attempts are logged

## Best Practices

1. **Regular Backups**
   - Backup daily or weekly
   - Check audit trail to confirm backups are happening
   - Note who is creating backups

2. **Restore Testing**
   - Periodically restore backups to test
   - Verify all tables are restored
   - Check audit trail for confirmation

3. **Access Control**
   - Only authorized users should perform backups/restores
   - Review audit trail regularly
   - Document reason for restores

4. **Retention**
   - Keep audit trail records indefinitely
   - Delete old backups after verification
   - Archive important restore records

## Troubleshooting

### Issue: Audit Trail is Empty
- **Cause:** No backups/restores have been performed yet
- **Solution:** Create a backup to start the audit trail

### Issue: Can't View Audit Trail
- **Cause:** May require database read permissions
- **Solution:** Check user permissions in Firebase

### Issue: Record Counts Don't Match
- **Cause:** Data may have been deleted or modified
- **Solution:** This is normal; counts reflect data at time of backup/restore

## Future Enhancements

Possible improvements:
- Export audit trail to CSV/Excel
- Filter by date range
- Filter by user
- Search by filename
- Automatic backup scheduling with audit tracking
- Email notifications for backup failures
- Retention policies for audit logs

## Technical Notes

- Audit trail uses Firestore `backup_audit_trail` collection
- Timestamps use UTC format
- User email is required (from getCurrentUser() function)
- All operations are logged before completion
- Failed operations are logged with error messages
- No personal data is logged except name and email

## Files Modified

**js/reports.js**
- Updated `backupDatabase()` function (added audit logging)
- Updated `restoreDatabase()` function (added audit logging)
- Added new `showBackupAuditTrail()` function
- Updated `loadReports()` to add audit trail button
- Lines affected: ~452, ~598, ~1500+ (new function)

