# BCA FINANCE - COMPLETE DOCUMENTATION & IMPLEMENTATION GUIDE

**Last Updated**: April 8, 2026  
**Status**: ✅ PRODUCTION READY  
**Version**: Final Consolidated

---

## TABLE OF CONTENTS

1. [Quick Start Guide](#quick-start-guide)
2. [System Overview](#system-overview)
3. [Recent Implementations](#recent-implementations)
4. [Guest Contributions Management](#guest-contributions-management)
5. [Event Management & Daily Check-In](#event-management--daily-check-in)
6. [Timezone & Date Handling](#timezone--date-handling)
7. [Collection Reports](#collection-reports)
8. [Troubleshooting](#troubleshooting)
9. [API Reference](#api-reference)

---

## QUICK START GUIDE

### First Time Setup
1. Clear browser cache: **Ctrl+Shift+Delete**
2. Hard refresh: **Ctrl+F5**
3. Login to application
4. Select your role from dashboard

### Main Menu Navigation
```
Dashboard
  ├─ Income Entry
  ├─ Expense Management
  ├─ Events
  ├─ Reports
  ├─ Members
  ├─ Assets
  ├─ Users
  └─ Backup/Restore
```

### Common Tasks

**Record a Collection**:
1. Go to: Income → Collection Entry
2. Select contributor (Member or Guest)
3. Enter amount and payment method
4. Save

**View Reports**:
1. Go to: Reports
2. Select report type
3. Choose date range if applicable
4. Generate/Export

**Manage Events**:
1. Go to: Events
2. Create or view events
3. Register participants
4. Track daily attendance

---

## SYSTEM OVERVIEW

### Core Modules

**Income Management**
- Track member contributions
- Record guest offerings
- Support multiple payment methods (Cash, Check, PayPal, Stripe)
- Automatic member record updates

**Expense Management**
- Record church expenses
- Category-based organization
- Subcategory support
- Date-based filtering

**Event Management**
- Create multi-day events
- Register participants
- Daily attendance tracking with timestamps
- Guest/member participant support
- Financial tracking per participant

**Reporting**
- Collection reports (members + guests)
- Expense reports
- Annual contribution statements
- Guest contribution statements
- CSV/Excel export capability

**Member Management**
- Member records with contact info
- Contribution tracking
- Annual giving statements
- Tax documentation

**Asset Management**
- Asset registration and tracking
- Category management
- Image upload support
- Asset reports

**User Management**
- Role-based access control (RBAC)
- User creation and management
- Permission levels
- Audit trail

---

## RECENT IMPLEMENTATIONS

### 1. ✅ Guest Contribution Tracking (April 7, 2026)

**What's New**:
- Guests tracked separately from members
- Guest contributions in Collection Report (marked with "(Guest)")
- Professional annual statements for guests
- No member record creation needed

**How to Use**:
```
Recording Guest Offering:
  Income → Collection Entry
  → Select "Guest"
  → Enter name and amount
  → Save

Viewing Guest Contributions:
  Reports → Collection Report
  → Guest names show with "(Guest)" marker
  → Included in totals

Generating Guest Statement:
  Reports → 👥 Guest Contributions Statement
  → Select guest from dropdown
  → Choose tax year
  → Generate professional PDF
```

**Files**: `js/reports.js`, `js/income.js`

---

### 2. ✅ Multi-Day Event Daily Check-In/Check-Out (April 8, 2026)

**What's New**:
- Daily attendance tracking for multi-day events
- Check-in and check-out for each day
- Time recording (24-hour format)
- Attendance percentage calculation
- Color-coded status indicators

**How to Use**:
```
Recording Check-In:
  Events → View Participants
  → Click "📅 Daily Check-In"
  → Select date from dropdown
  → Hover over Check-In Time field (auto-fills)
  → Click ✅ Check-In

Recording Check-Out:
  Same interface
  → Enter Check-Out Time (hover auto-fills)
  → Click 🚪 Check-Out

Viewing Attendance Summary:
  Shows table with:
  • Day name and date
  • Check-in/check-out times
  • Status (✅ In, 🚪 Out, ⭕ Absent)
```

**Features**:
- Automatic current time loading on hover
- Attendance percentage tracked
- Color-coded: 🟢 100%, 🟠 50-99%, 🔴 <50%
- Participant list shows attendance at a glance

---

### 3. ✅ Time Auto-Load on Hover (April 8, 2026)

**What's New**:
- Hover over time input fields to auto-load current system time
- Eliminates need for manual time picker
- Only fills empty fields (doesn't overwrite)

**How to Use**:
```
Hover over Check-In Time → Auto-fills current time
Hover over Check-Out Time → Auto-fills current time
Still editable if needed
```

---

### 4. ✅ Separate eventAttendance Collection (April 8, 2026)

**What's New**:
- Dedicated collection for attendance records
- Complete audit trail with user tracking
- Captures who performed check-in/check-out
- Timestamps for every action
- Better performance and reporting

**Data Structure**:
```javascript
eventAttendance Collection:
{
  eventId: string,
  registrationId: string,
  participantName: string,
  date: "YYYY-MM-DD",
  
  checkInTime: "HH:MM",
  checkInBy: "user@email.com",        ← WHO checked in
  checkInRecordedAt: timestamp,       ← WHEN recorded
  
  checkOutTime: "HH:MM",
  checkOutBy: "user@email.com",       ← WHO checked out
  checkOutRecordedAt: timestamp,      ← WHEN recorded
  
  lastUpdatedBy: "user@email.com"
}
```

**Benefits**:
- Complete accountability
- Easy staff activity reporting
- Better performance (no document bloat)
- Full audit trail
- Advanced queries

---

### 5. ✅ Print Participants List (April 8, 2026)

**What's New**:
- Professional print report for event participants
- Shows total contribution and total balance
- Includes event details
- Check-in status included
- Food coupons tracked

**How to Use**:
```
Events → View Participants
→ Click "🖨️ Print Participants List"
→ Professional preview opens
→ Click Print or Save as PDF
```

**Report Includes**:
- Event details (dates, location, fee)
- Complete participant list
- Individual contributions and balances
- Total collected and pending
- Check-in status

---

### 6. ✅ EST Timezone Standardization (April 7, 2026)

**What's New**:
- All dates use EST (local timezone) instead of UTC
- Fixed CollectionDate timezone bug
- Consistent date handling across entire application

**Files Modified**:
- `js/income.js` - Collection dates
- `js/reports.js` - Report dates and exports
- `js/expense.js` - Expense dates
- `js/events.js` - Event registration dates
- `js/bank_enhanced.js` - Bank reconciliation dates

**Helper Function Added**:
```javascript
function getLocalDateString(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
```

---

## GUEST CONTRIBUTIONS MANAGEMENT

### Recording Guest Offerings

**Step 1: Income Entry**
```
Go to: Income → Collection Entry
Select: Contributor Type = "Guest"
Enter: Guest name
Select: Purpose (Offering, Special Donation, etc.)
Select: Payment Type (Cash, Check, PayPal)
Enter: Amount
Save
```

**Result**: 
- Saved with MemberID = "GUEST"
- No member record created
- Tracked separately

### Viewing Guest Contributions

**Option 1: Collection Report**
```
Reports → Collection Report
→ Select date range
→ Guests show with "(Guest)" marker
→ Example: "Sarah Johnson (Guest) - $25.00"
→ Included in total
```

**Option 2: Guest Contributions Statement**
```
Reports → 👥 Guest Contributions Statement
→ Select guest from dropdown (unique names only)
→ Select tax year
→ Click Generate PDF
→ Professional annual statement downloads
```

**Statement Features**:
- Church letterhead
- Guest name and annual total
- IRS Form 11(71-1997) layout
- Pastor and Treasurer signatures
- Tax-deductible documentation

### Export to Excel

**Collection Report Export**:
1. Generate Collection Report
2. Click "Export to Excel"
3. CSV file downloads
4. Guest contributions marked with "(Guest)"

---

## EVENT MANAGEMENT & DAILY CHECK-IN

### Creating Events

```
Events → Create Event
  ├─ Event Name (e.g., "Family Camp 2026")
  ├─ Event Type (Camp, Retreat, VBS, Conference)
  ├─ Location
  ├─ Start Date
  ├─ End Date
  ├─ Event Fee per Participant
  └─ Save
```

### Registering Participants

```
Events → View Event → Register Participant
  ├─ Participant Name
  ├─ Guardian Type (Member or Non-Member)
  ├─ Address (auto-loads if member)
  ├─ Phone (auto-loads if member)
  ├─ Emergency Contact
  ├─ Contribution Amount (optional)
  ├─ Payment Method
  ├─ Food Coupons (default: 3)
  └─ Record as Income Entry (checkbox)
```

### Daily Check-In/Check-Out

**For Multi-Day Events**:

```
Participant List → Click "📅 Daily Check-In"
  ├─ Select Date from dropdown
  │   └─ Shows all event days
  │   └─ Status indicator (✅ In, 🚪 Out, ⭕ Absent)
  │
  ├─ Check-In Time:
  │   ├─ Hover to auto-fill current time
  │   ├─ Or enter manually (HH:MM format)
  │   └─ Click ✅ Check-In
  │
  ├─ Check-Out Time:
  │   ├─ Hover to auto-fill current time
  │   ├─ Or enter manually
  │   └─ Click 🚪 Check-Out
  │
  └─ Attendance Summary:
      └─ Shows table of all days
      └─ Status for each day
      └─ Check-in and check-out times
```

**Attendance Tracking**:
- Automatically calculates attendance percentage
- Color-coded status (🟢 100%, 🟠 50-99%, 🔴 <50%)
- Shows "X/Y days (XX%)" in participant list
- Complete history maintained

### Participant Editing

```
Event Dashboard → Participant → Click Edit
  ├─ View Audit History
  │   └─ Last modification details
  │   └─ Who modified and when
  │
  ├─ Edit Information
  │   ├─ Name, address, phone
  │   ├─ Guardian, emergency contact
  │   └─ Food coupons
  │
  └─ Pay Outstanding Balance (if balance exists)
      ├─ Shows balance due
      ├─ Enter payment amount
      ├─ Select payment method
      └─ Record as income
```

### Check-In Data Recording

**What Gets Saved to eventAttendance**:
- eventId - Which event
- registrationId - Which participant
- participantName - Name
- date - Date (YYYY-MM-DD)
- checkInTime - Time (HH:MM)
- checkInBy - Email of person who recorded it
- checkInRecordedAt - Timestamp
- checkOutTime - Time (HH:MM)
- checkOutBy - Email of person who recorded it
- checkOutRecordedAt - Timestamp

**Backward Compatibility**:
- Still updates eventRegistrations dailyAttendance
- Existing queries still work
- Gradual migration possible

---

## TIMEZONE & DATE HANDLING

### EST (Eastern Standard Time) Implementation

**All dates use local timezone** (not UTC conversion):

**Fixed Issues**:
- ❌ Before: Collections saved as tomorrow's date
- ✅ After: Collections save with correct local date

**Helper Function**:
```javascript
function getLocalDateString(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
```

**Applied To**:
- Collection entry dates
- Expense entry dates
- Event registration dates
- Report generation dates
- CSV export filenames
- All date calculations

**Result**:
- Consistent EST dates throughout
- No more date shifting
- Accurate financial records

---

## COLLECTION REPORTS

### Report Types

**1. Year to Date**
```
Shows: All collections from Jan 1 to today
Updated: Collection dates now accurate
Guest Contributions: Marked with "(Guest)"
```

**2. Specific Month**
```
Shows: All collections for selected month
Format: Month/Year selector
Guest Contributions: Included with marker
```

**3. Custom Date Range**
```
Shows: Collections for selected date range
Start/End: Selectable dates
Today's collections: Now showing correctly
```

### Report Contents

Each report shows:
- Date of collection
- Create date
- Member/Guest name
- Contribution type (Cash, Check, PayPal, Stripe)
- Purpose
- Check number (if applicable)
- Amount
- Memo
- **TOTALS**: Total collections and count

### Export Options

**Excel Export**:
```
Click: "Export to Excel"
File: Collection_Report_[DATE].csv
Includes: All data with guest markers
Format: CSV (opens in Excel/Sheets)
```

---

## TROUBLESHOOTING

### Issue: Collections showing wrong date

**Solution**:
1. Clear cache: Ctrl+Shift+Delete
2. Hard refresh: Ctrl+F5
3. New entries should have correct EST date
4. Existing entries can be edited

### Issue: Guest not appearing in dropdown

**Solution**:
1. Verify guest was recorded (check Collection Report)
2. Clear cache and refresh
3. Guest must have at least one contribution recorded

### Issue: Check-in/Check-out times not saving

**Solution**:
1. Ensure date is selected
2. Ensure time is entered in HH:MM format
3. Verify eventId matches
4. Check browser console for errors

### Issue: Attendance percentage not calculating

**Solution**:
1. Refresh page
2. Verify event has correct start/end dates
3. Check that check-in has been recorded
4. Percentage updates after check-in saves

### Issue: Print not working

**Solution**:
1. Check pop-up blocker settings
2. Try different browser
3. Try saving as PDF instead of printing
4. Ensure event has participants registered

---

## API REFERENCE

### Collection Structures

**eventRegistrations**
```javascript
{
  eventId: string,
  name: string,
  phone: string,
  guardian: string,
  address: string,
  checkedIn: boolean,
  contribution: number,
  balance: number,
  foodCoupons: number,
  dailyAttendance: {
    [date]: {
      checkedIn: boolean,
      checkInTime: string
    }
  },
  createdAt: timestamp
}
```

**eventAttendance**
```javascript
{
  eventId: string,
  registrationId: string,
  participantName: string,
  date: string (YYYY-MM-DD),
  checkInTime: string (HH:MM),
  checkInBy: string (email),
  checkInRecordedAt: timestamp,
  checkOutTime: string (HH:MM),
  checkOutBy: string (email),
  checkOutRecordedAt: timestamp,
  createdAt: timestamp,
  lastUpdatedAt: timestamp,
  lastUpdatedBy: string (email)
}
```

**income (Contributions)**
```javascript
{
  IncomeID: string,
  MemberID: string ("GUEST" for guests),
  MemberName: string,
  Purpose: string,
  Type: string (Cash, Check, PayPal, Stripe),
  CheckNumber: string,
  Amount: number,
  CollectionDate: string (YYYY-MM-DD),
  Memo: string,
  CreateDate: timestamp
}
```

### Key Functions

**Guest Contributions**:
- `showGuestContributionStatement()` - Guest list interface
- `generateGuestContributionStatement()` - PDF generation

**Event Check-In**:
- `showCheckIn()` - Multi-day interface
- `showDailyCheckIn()` - Daily tracking interface
- `recordCheckIn()` - Save check-in with user tracking
- `recordCheckOut()` - Save check-out with user tracking
- `loadCurrentTime()` - Auto-load time on hover

**Reports**:
- `collectionReport()` - Generate collection report
- `generateCollectionReport()` - Build report HTML
- `exportCollectionToExcel()` - Export to CSV
- `printParticipantsList()` - Print event participants

**Utilities**:
- `getLocalDateString(date)` - Convert to EST date string
- `getPastorAndTreasurerNames()` - Get signers for statements

---

## BEST PRACTICES

### Recording Income

1. **Guest vs Member**: Choose correctly
2. **Purpose**: Be specific (e.g., "Offering-Common", "Special Donation")
3. **Payment Type**: Select accurate method
4. **Check Number**: Required if payment type is Check
5. **Amount**: Verify before saving

### Event Management

1. **Date Setup**: Ensure start date < end date
2. **Participant Registration**: Complete all required fields
3. **Daily Tracking**: Record check-in each day
4. **Balance Payment**: Process before event ends
5. **Final Records**: Print participants list for archives

### Reporting

1. **Date Accuracy**: Verify dates are in EST
2. **Export Format**: Choose CSV for Excel compatibility
3. **Archive**: Keep printed reports for records
4. **Review**: Check totals before sharing

### User Accountability

1. **Check-In Recording**: System captures your email
2. **Timestamps**: Exact times recorded
3. **Audit Trail**: All actions tracked
4. **Corrections**: Update records as needed

---

## SUPPORT & RESOURCES

### Quick References

- **Time Format**: 24-hour (e.g., 09:00, 17:30)
- **Date Format**: YYYY-MM-DD (e.g., 2026-04-07)
- **Currency**: Dollar amounts with .00 (e.g., $50.00)

### Common Keyboard Shortcuts

- Cache clear: **Ctrl+Shift+Delete**
- Hard refresh: **Ctrl+F5**
- Normal refresh: **F5** or **Ctrl+R**
- Print: **Ctrl+P**

### Emergency Actions

1. **Data Issues**: Refresh page
2. **Cache Issues**: Ctrl+Shift+Delete, then Ctrl+F5
3. **Database Backup**: Go to Reports → Backup Database
4. **Check Console**: F12 to open browser developer tools

---

## IMPLEMENTATION SUMMARY

✅ **Guest Contribution System** - Complete tracking for guest offerings  
✅ **Multi-Day Event Management** - Daily attendance with time tracking  
✅ **User Accountability** - Complete audit trail with email/timestamp  
✅ **Professional Reporting** - Print and export capabilities  
✅ **Timezone Standardization** - All dates in EST  
✅ **Time Auto-Load** - Hover to fill current time  

---

### 7. ✅ Email Annual Statements (April 9, 2026)

**What's New**:
- One-click email annual statements to members
- Uses Google Apps Script (completely FREE for non-profits)
- PDF attached to email
- Customizable email subject and message
- No additional costs

**How to Use**:
```
Members → Find member
  → Click "📧 Email Receipt"
  → Select tax year
  → Customize email (optional)
  → Click "📧 Send Email"
  → Member receives PDF attachment

Email From: Your church treasurer/finance Gmail
Email To: Member's email (from members collection)
Attachment: PDF Annual Contribution Statement
```

**Setup** (10 minutes):
1. Create Google Apps Script project
2. Copy provided code
3. Deploy as Web App
4. Add URL to members.js
5. Done! Start emailing

**Files Modified**:
- `js/members.js` - Added email button and functions

---

## FINAL STATUS

**Date**: April 9, 2026  
**Status**: ✅ PRODUCTION READY  
**All Features**: ✅ IMPLEMENTED  
**Documentation**: ✅ CONSOLIDATED  
**Testing**: ✅ COMPLETE

**Ready to Use**: ✅ YES

---

**End of Consolidated Documentation**

For questions or additional features, refer to this master document.
All features are fully implemented and ready for production use.

