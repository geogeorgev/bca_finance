# Multi-Day Event Check-In/Check-Out - Quick Reference

**Feature**: Daily attendance tracking for multi-day events  
**Status**: ✅ IMPLEMENTED

---

## Quick Overview

For events lasting **2+ days**, track check-in and check-out **for each day separately**:

- ✅ **Daily Check-In**: Record arrival time each day
- 🚪 **Daily Check-Out**: Record departure time each day
- 📊 **Attendance Summary**: View all-day attendance table
- 📈 **Percentage Calculation**: Overall attendance rate shown

---

## Step-by-Step

### 1. Go to Event Check-In
```
Events → View Participants → "Daily Check-In/Check-Out"
```

### 2. For Each Participant
Shows:
- Name and guardian
- **Attendance: X/Y days (XX%)**  ← Overall attendance
- **📅 Daily Check-In button** ← Click to track daily

### 3. Click Daily Check-In Button
Opens daily tracking interface showing:
- All event days in dropdown
- Check-in time field
- Check-out time field
- Attendance summary table

### 4. Record Attendance
**For Check-In:**
1. Select date from dropdown
2. Enter time (e.g., 09:00)
3. Click ✅ Check-In

**For Check-Out:**
1. Select same date
2. Enter time (e.g., 17:00)
3. Click 🚪 Check-Out

### 5. View Summary
Table shows for each day:
- Day name (Mon, Tue, Wed...)
- Date (4/7/2026)
- Status (✅ In, 🚪 Out, ⭕ Absent)
- Check-in time
- Check-out time

---

## Status Indicators

| Symbol | Meaning | Color |
|--------|---------|-------|
| ✅ | Checked-In | Green |
| 🚪 | Checked-Out | Gray |
| ⭕ | Absent | Red |

---

## Attendance Percentage

Shown at participant level:
- 🟢 **100%**: All days present
- 🟠 **50-99%**: Most days present  
- 🔴 **<50%**: Less than half present

Example: "Attendance: 2/3 days (67%)" = 2 out of 3 days attended

---

## Time Format

Use **24-hour format**:
- 09:00 = 9:00 AM
- 14:30 = 2:30 PM
- 17:00 = 5:00 PM

---

## Example: 3-Day Camp

**Camp Duration**: April 7-9, 2026

**John Doe Attendance:**
```
Day 1 (Mon, 4/7): 09:00 Check-In, (no check-out)
Day 2 (Tue, 4/8): 08:30 Check-In, 17:00 Check-Out
Day 3 (Wed, 4/9): (absent)

Result: 2/3 days (67%) attendance
```

---

## Key Features

✅ **Per-Day Tracking**: Check-in/out for each day  
✅ **Time Records**: Capture exact arrival/departure  
✅ **Summary View**: See all attendance at a glance  
✅ **Edit-Friendly**: Select any date and update time  
✅ **Automatic %**: Attendance percentage calculated  
✅ **Color-Coded**: Quick visual status  

---

## Navigation

- **Back to Check-In**: Return to participant list
- **Back to Events**: Go to main events page

---

## Tips

1. **Edit Times**: Select date again, enter new time, click button
2. **Mark Absent**: Leave both fields empty for that date
3. **Check Summary**: Scroll down to see attendance table
4. **Print Badge**: Still available from participant list
5. **View Percentage**: Shown in participant card at top

---

## Data Stored

For each participant and date:
```
Date: 2026-04-07
  ✅ Check-In: 09:00
  🚪 Check-Out: (empty/time)
```

---

**The system automatically:**
- Calculates attendance %
- Color-codes status
- Stores all records
- Allows editing
- Generates summary

---

**Start tracking multi-day event attendance today!** 📅

Clear cache (Ctrl+Shift+Delete), refresh (Ctrl+F5), and test! ✅

