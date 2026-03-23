# Event Management Module - Quick Start Guide

**For:** BCA Finance System Users
**Date:** March 22, 2026
**Version:** 1.0

---

## What's New? 🎉

Your BCA Finance application now includes a complete **Event Management Module** for managing church events like Family Camp, Youth Camp, and VBS!

---

## Key Features 🚀

✅ **Create Events** - Set up events with dates, location, and fees
✅ **Register Participants** - Capture detailed participant information
✅ **Check-In System** - Quick on-site participant check-in
✅ **Badge Printing** - Print participant badges during check-in
✅ **Food Coupon Tracking** - Manage food coupons per participant
✅ **Contribution Tracking** - Record participant fees and payments
✅ **Search & Filter** - Find participants quickly
✅ **Edit Participants** - Update information as needed

---

## Getting Started - 5 Minute Setup

### Step 1️⃣: Access Events Module

**Menu → Click "Events"**

You'll see the Event Management dashboard with a list of all events.

### Step 2️⃣: Create Your First Event

1. Click **➕ Create Event**
2. Fill in:
   - **Event Name:** "Family Camp 2026"
   - **Event Type:** Select "Camp"
   - **Location:** "Camp XYZ"
   - **Start Date:** June 15, 2026
   - **End Date:** June 20, 2026
   - **Event Fee:** $100

3. Click **Create Event**

### Step 3️⃣: Register Participants

1. From event list, click **Register** on your new event
2. Fill in participant info:
   - **Name:** John Doe (required)
   - **Phone:** 555-1234 (required)
   - **Guardian:** Jane Doe (required)
   - **Address:** 123 Main St
   - **Emergency Contact:** 555-5678
   - **Contribution:** $50
   - **Food Coupons:** 3 (default)

3. Click **Register Participant**

Repeat for each participant!

### Step 4️⃣: Check-In Participants

1. Click **Check-In** on your event
2. Find participant:
   - Type name in search box (optional)
   - Or scroll through list

3. Click **✅ Check In** next to participant
4. Click **🖨️ Print Badge** to print badge
5. Badge opens in print window

### Step 5️⃣: View Summary

1. Click **View Participants** to see:
   - Total participants registered
   - Total checked in
   - Total contributions
   - Individual participant details

---

## Common Tasks

### 📋 Register a Participant

```
Events > Click "Register" > Fill Form > Save
```

**Required:** Name, Phone, Guardian
**Optional:** Address, Emergency Contact, Contribution

### ✅ Check-In a Participant

```
Events > Click "Check-In" > Find Name > Click "Check In"
```

### 🖨️ Print Badge

```
Check-In Screen > Click "Print Badge" > Click Print
```

### ✏️ Edit Participant

```
Participant List > Click "Edit" > Update Info > Save
```

### 👁️ View All Participants

```
Events > Click "View Participants" > See Full List
```

### 🔍 Search Participant

```
Check-In Screen > Type Name in Search Box > Auto Filters
```

---

## Screen Walkthroughs

### Events List Screen
```
📋 Event Management

[➕ Create Event]

Events List:
├─ Family Camp 2026
│  • June 15-20, 2026 at Camp XYZ
│  • Fee: $100
│  [View Participants] [Register] [Check-In]
│
├─ Youth VBS 2026
│  • July 6-10, 2026 at Church
│  • Fee: $50
│  [View Participants] [Register] [Check-In]
```

### Check-In Screen
```
✅ FAMILY CAMP 2026 - CHECK-IN

[Search: ____________] (Search participants here)

✅ John Doe
   Guardian: Jane Doe | Phone: 555-1234
   [❌ Check Out] [🖨️ Print Badge] [✏️ Edit]

❌ Mary Smith
   Guardian: Bob Smith | Phone: 555-5678
   [✅ Check In] [🖨️ Print Badge] [✏️ Edit]

[View Details] [Back to Events]
```

### Event Summary Screen
```
📊 FAMILY CAMP 2026 - PARTICIPANTS

Event Summary:
• Dates: June 15-20, 2026
• Location: Camp XYZ
• Total Participants: 45
• Checked In: 38/45
• Total Contributions: $2,250

Participants Table:
[Detailed table of all participants with status]

[Back to Events]
```

---

## Badge Printing

### What Gets Printed?

A professional 4" × 3" badge with:
- "EVENT BADGE" header
- **Participant Name** (large, bold)
- Current date

### How to Print?

1. During Check-In, click **🖨️ Print Badge**
2. Browser print window opens
3. Click **Print** button
4. Select printer and print
5. Badge automatically marked as printed

### Notes
- Print on card stock for durability
- 4×3 badge fits on standard card stock
- Multiple badges per sheet recommended

---

## Data Entry Tips 💡

### Event Names
✅ Use descriptive names: "Family Camp 2026"
❌ Don't use abbreviations: "FC2026"

### Phone Numbers
✅ Any format accepted: "555-1234" or "5551234"
✅ Cell or home phone works

### Contributions
✅ Record payment at registration
✅ Update if participant pays later
✅ Leave blank if no payment yet

### Food Coupons
✅ Default is 3 per participant
✅ Adjust based on event needs
✅ Edit anytime

### Guardian Names
✅ Parent or responsible adult name
✅ Required for liability
✅ Should match emergency contact if possible

---

## Search & Filter Features

### Quick Search in Check-In

As you type participant name:
```
Search: "Jo" → Shows only "John Doe"
Search: "Mar" → Shows only "Mary Smith"
Search: "" → Shows all participants
```

### Participant List

View all participants by:
- Checking in status (✅/❌)
- Badge printing status (🖨️/❌)
- Contribution amount
- Food coupons
- Emergency contact info

---

## Status Indicators

### Check-In Status
- **✅ Checked In** - Participant arrived (green border)
- **❌ Not Checked In** - Participant not yet here (gray border)

### Badge Status
- **🖨️ Badge Printed** - Badge was printed
- **❌ Not Printed** - Badge not printed yet

---

## Multi-Event Management

### Managing Multiple Events

The Event Module supports:
- ✅ Unlimited events
- ✅ Separate participant lists per event
- ✅ Independent check-in tracking
- ✅ Isolated data (no cross-event mixing)

### Example

```
JUNE 2026:
├─ Family Camp (June 15-20) - 45 participants
├─ Youth VBS (June 22-26) - 30 participants
└─ Youth Retreat (June 28-30) - 25 participants

JULY 2026:
├─ Leaders Conference (July 8-9) - 15 participants
```

Each event is completely separate!

---

## Data That's Tracked

### Per Event
- Event name, type, location
- Start and end dates
- Event fee
- Creation timestamp

### Per Participant
- Full name
- Address
- Phone number
- Guardian name
- Emergency contact
- Check-in status ✅/❌
- Badge print status 🖨️/❌
- Contribution amount
- Food coupons count
- Registration timestamp

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't create event | Make sure all fields are filled and start date is before end date |
| Can't register participant | Name, Phone, and Guardian are required |
| Search not working | Check spelling of participant name |
| Badge won't print | Try again or check browser print settings |
| Participant not showing | Refresh page and check event name |
| Edit not saving | Ensure all required fields are filled |

---

## Step-by-Step Event Day Setup

### Before Event
1. ✅ Create event (1 week before)
2. ✅ Register participants (ongoing)
3. ✅ Confirm final count (1 day before)

### Event Day Morning
1. ✅ Set up check-in table
2. ✅ Have printer ready
3. ✅ Open Events > Check-In screen

### During Check-In
1. ✅ Find participant by name
2. ✅ Click "Check In"
3. ✅ Click "Print Badge"
4. ✅ Hand badge to participant

### After Event
1. ✅ View final statistics
2. ✅ Record any last-minute contributions
3. ✅ Print summary report (future feature)

---

## Integration with Other Modules

### Collections Module
- Contributions recorded separately
- Can be reconciled with Collection entries
- Future integration planned

### Members Module
- Event participants separate from members
- Both systems independent
- Can link if needed

### Reports Module
- Event data stays in Events module
- Can generate event-specific reports
- Export capability planned

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Search | Click search box and type |
| Filter | Just start typing name |
| Back | Click navigation buttons |
| Save | Click Create/Update buttons |

---

## Tips & Tricks 🎯

### Tip 1: Pre-Register Participants
Create participant list before event for faster check-in day.

### Tip 2: Search as You Go
Type participant name during check-in to find quickly.

### Tip 3: Print Badges Immediately
Don't wait - print as each participant checks in.

### Tip 4: Update Changes Quickly
Edit participant info if they update phone/address at event.

### Tip 5: Track Contributions
Record all payments at check-in for accurate accounting.

---

## Contact & Support

**Have Questions?**
1. Review this guide
2. Check EVENT_MODULE_GUIDE.md for detailed docs
3. Contact system administrator

**Found a Bug?**
1. Note the exact steps to reproduce
2. Include participant/event names
3. Report to IT support

---

## Quick Reference

```
EVENT WORKFLOW:
1. Create Event     → Fill event details
2. Register People  → Add participants
3. Check-In         → Mark arrivals
4. Print Badges     → Hand out badges
5. View Report      → See summary

REQUIRED FIELDS:
• Event: Name, Location, Dates
• Participant: Name, Phone, Guardian
• Everything else is optional!

BUTTONS:
➕ Create Event    - Make new event
Register           - Add participant
Check-In          - Mark as arrived
✅ Check In       - Mark checked in
❌ Check Out      - Mark left
🖨️ Print Badge    - Print participant badge
✏️ Edit           - Update information
```

---

## Ready to Start! 🚀

1. Go to **Menu → Events**
2. Click **➕ Create Event**
3. Fill in event details
4. Start registering participants!
5. On event day, use Check-In to welcome participants

**Questions?** See EVENT_MODULE_GUIDE.md for detailed documentation.

---

**Version:** 1.0
**Status:** ✅ Complete & Ready to Use
**Last Updated:** March 22, 2026

