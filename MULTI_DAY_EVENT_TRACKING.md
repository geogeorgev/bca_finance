# Multi-Day Event Daily Check-In/Check-Out Tracking

**Date**: April 8, 2026  
**Feature**: Daily attendance tracking for multi-day events  
**Status**: ✅ IMPLEMENTED

---

## Overview

Enhanced event management to support **daily check-in and check-out tracking** for events that span multiple days. Track attendance for each day separately with timestamps.

---

## Features

### Daily Attendance Tracking
✅ Check-in and check-out for each day  
✅ Record time of check-in and check-out  
✅ View attendance history by day  
✅ Calculate overall attendance percentage  
✅ Color-coded status indicators  

### Attendance Status
- ✅ **Checked-in**: Participant present
- 🚪 **Checked-out**: Participant left  
- ⭕ **Absent**: No attendance record

### Attendance Summary
- Daily breakdown of attendance
- Check-in times recorded
- Check-out times recorded
- Attendance percentage over event duration
- Color-coded status (Green=100%, Orange=50-99%, Red=<50%)

---

## How to Use

### Step 1: Go to Event Check-In
1. **Events → Event Management**
2. Click: **View Participants**
3. Scroll to: "Daily Check-In/Check-Out" section

### Step 2: Select Participant
For each participant, you'll see:
- **Name and Guardian info**
- **Attendance Summary**: X/Y days (XX%)
- **📅 Daily Check-In button** (new!)

### Step 3: Record Daily Attendance
1. Click: **📅 Daily Check-In** button
2. Shows calendar of all event days
3. Select date from dropdown
4. Enter **Check-In Time** (HH:MM format)
5. Click: **✅ Check-In** button
6. Later, enter **Check-Out Time**
7. Click: **🚪 Check-Out** button

### Step 4: View Summary
Shows complete attendance table:
- Day of week
- Date
- Status (Checked-in, Checked-out, Absent)
- Check-in time
- Check-out time

---

## Interface

### Check-In/Check-Out Screen

```
📅 PARTICIPANT_NAME - Daily Check-In/Check-Out

Event: CAMP_NAME
Duration: MM/DD/YYYY to MM/DD/YYYY
Participant: John Doe
Guardian: Jane Doe

Today's Check-In/Check-Out:
Select Date: [Monday, April 7, 2026 ▼]

Check-In Time:     Check-Out Time:
[HH:MM input]      [HH:MM input]
[✅ Check-In]      [🚪 Check-Out]

Attendance Summary:
┌──────┬────────────┬────────────────┬───────────┬────────────┐
│ Day  │ Date       │ Status         │ Check-In  │ Check-Out  │
├──────┼────────────┼────────────────┼───────────┼────────────┤
│ Mon  │ 4/7/2026   │ ✅ In          │ 09:00 AM  │ —          │
│ Tue  │ 4/8/2026   │ 🚪 Out         │ 08:30 AM  │ 05:00 PM   │
│ Wed  │ 4/9/2026   │ ⭕ Absent      │ —         │ —          │
└──────┴────────────┴────────────────┴───────────┴────────────┘
```

### Participant List View

```
PARTICIPANTS LIST:

John Doe                              📅 Daily Check-In | 🖨️ Print Badge | ✏️ Edit
Guardian: Jane Doe | Phone: 555-1234
Attendance: 2/3 days (67%)  [Color: Orange]

Mary Smith                            📅 Daily Check-In | 🖨️ Print Badge | ✏️ Edit
Guardian: Bob Smith | Phone: 555-5678
Attendance: 3/3 days (100%)  [Color: Green]
```

---

## Data Structure

### Daily Attendance Object
```javascript
dailyAttendance: {
  "2026-04-07": {
    checkedIn: true,
    checkInTime: "09:00",
    checkedOut: false,
    checkOutTime: null
  },
  "2026-04-08": {
    checkedIn: true,
    checkInTime: "08:30",
    checkedOut: true,
    checkOutTime: "17:00"
  },
  "2026-04-09": {
    checkedIn: false,
    checkInTime: null,
    checkedOut: false,
    checkOutTime: null
  }
}
```

---

## Features in Detail

### 1. Date Selection
- Dropdown shows all event days
- Format: "Day, Month/Date/Year"
- Status indicator (✅ In, 🚪 Out, ⭕ Absent)

### 2. Time Recording
- 24-hour format (HH:MM)
- Separate fields for check-in and check-out
- Can edit by selecting date and entering new time

### 3. Attendance Summary
- Table view of all days
- Shows status for each day
- Shows times for check-in and check-out
- Color-coded row backgrounds

### 4. Attendance Percentage
- Calculated based on days with check-in
- Shown in participant list
- Color-coded:
  - 🟢 Green: 100% attendance
  - 🟠 Orange: 50-99% attendance
  - 🔴 Red: <50% attendance

### 5. Participant Overview
- Shows attendance percentage at a glance
- Color-coded status bar
- Quick "Daily Check-In" button
- One-click access to daily tracking

---

## Use Cases

### 1. Multi-Day Camp or Retreat
Track daily attendance for participants at a 3-5 day event

### 2. Overnight Event
Record check-in and check-out each day

### 3. Attendance Verification
Verify who attended each day of the event

### 4. Daily Reports
Generate daily attendance summaries

### 5. Excused Absences
Track which days participant was absent

---

## Time Format

- **Input**: 24-hour format (e.g., 09:00, 17:30, 14:00)
- **Display**: 24-hour format or convert to 12-hour AM/PM

Examples:
- 09:00 = 9:00 AM
- 14:30 = 2:30 PM
- 17:00 = 5:00 PM

---

## Editing Attendance

### To Change Check-In Time
1. Select date from dropdown
2. Enter new time
3. Click "Check-In"
4. Previous time is overwritten

### To Add Check-Out Time
1. Select same date
2. Enter check-out time
3. Click "Check-Out"
4. Both times are saved

### To Mark Absent
Leave both fields empty for that date - no record is created

---

## Navigation

- **Back to Check-In**: Back to participant list
- **Back to Events**: Go to main events page

---

## Benefits

✅ **Detailed Tracking**: Know exactly who attended each day  
✅ **Time Records**: Capture arrival and departure times  
✅ **Attendance Reports**: See trends across event duration  
✅ **Easy Management**: Intuitive interface for daily recording  
✅ **Historical Data**: Complete attendance history stored  
✅ **Quick Overview**: Attendance percentage at a glance  

---

## Database Changes

### EventRegistrations Collection
Added new field:
```
dailyAttendance: {
  [dateString]: {
    checkedIn: boolean,
    checkInTime: string,
    checkedOut: boolean,
    checkOutTime: string
  }
}
```

---

## Compatibility

✅ Works with single-day events (1 day)  
✅ Works with multi-day events (2+ days)  
✅ Time tracking included  
✅ Edit/update existing records  
✅ No data loss on updates  

---

## Files Modified

**js/events.js**
- Updated `showCheckIn()` - Multi-day interface with attendance summary
- Replaced `toggleCheckIn()` with:
  - `showDailyCheckIn()` - Daily tracking interface
  - `recordCheckIn()` - Save check-in time
  - `recordCheckOut()` - Save check-out time

---

## Status

**Implementation**: ✅ COMPLETE  
**Testing**: ✅ READY  
**Documentation**: ✅ COMPLETE  
**Production**: ✅ READY

---

## Next Steps

1. Clear cache: **Ctrl+Shift+Delete**
2. Hard refresh: **Ctrl+F5**
3. Test with multi-day event:
   - Create event spanning 2-3 days
   - Register participant
   - Click "📅 Daily Check-In"
   - Test check-in and check-out
   - Verify attendance summary

---

**Feature**: Daily Check-In/Check-Out Tracking  
**Status**: Ready to Use ✅  
**Date Added**: April 8, 2026

