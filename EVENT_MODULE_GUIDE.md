# Event Management Module - Documentation

**Version:** 1.0
**Date:** March 22, 2026
**Status:** Complete & Ready for Use

---

## Overview

The Event Management Module is a comprehensive solution for managing church events such as Family Camp, Youth Camp, and VBS (Vacation Bible School). It provides streamlined participant registration, check-in functionality, and contribution tracking.

---

## Features

### 1. **Event Creation**
- Create events with details:
  - Event Name
  - Event Type (Camp, Retreat, VBS, Conference, Other)
  - Location
  - Start Date & End Date
  - Event Fee
- Events automatically organized by date (newest first)

### 2. **Participant Registration**
- Register participants with:
  - Name
  - Address
  - Phone Number
  - Guardian Name
  - Emergency Contact
  - Contribution Amount
  - Food Coupons (default: 3)
- Track balance and contributions
- All data saved to Firebase

### 3. **Participant Management**
- View all participants for an event
- See registration summary:
  - Total participants
  - Total checked in
  - Total contributions
- Search and filter participants
- Edit participant information
- Track participant status

### 4. **Check-In Functionality**
- Quick check-in interface
- Search participants by name
- Toggle check-in status
- Visual indicators for checked-in participants
- Real-time status updates

### 5. **Badge Printing**
- Print participant badges on demand
- Professional badge layout (4" x 3")
- Displays:
  - "EVENT BADGE" header
  - Participant name (large, prominent)
  - Current date
- Automatic badge tracking (badgePrinted flag)

### 6. **Food Coupon Tracking**
- Assign food coupons per participant
- Default: 3 coupons per participant
- Editable per participant
- Displayed in participant list

### 7. **Contribution Tracking**
- Record participant contributions at registration
- Track contribution amount
- Calculate balance (if needed for future features)
- View total contributions per event
- Export data for financial tracking

---

## Firebase Collections Structure

### Collection: `events`
```javascript
{
  name: "Family Camp 2026",           // Event name
  type: "camp",                       // camp, retreat, vbs, conference, other
  location: "Camp XYZ",               // Event location
  startDate: "2026-06-15",            // Start date (YYYY-MM-DD)
  endDate: "2026-06-20",              // End date (YYYY-MM-DD)
  fee: 100,                           // Event fee per participant
  createdAt: Timestamp                // Creation timestamp
}
```

### Collection: `eventRegistrations`
```javascript
{
  eventId: "event123",                // Reference to event
  name: "John Doe",                   // Participant name
  address: "123 Main St",             // Address
  phone: "1234567890",                // Phone number
  guardian: "Jane Doe",               // Guardian/Parent name
  emergencyContact: "9876543210",     // Emergency contact number
  checkedIn: false,                   // Check-in status (true/false)
  contribution: 50,                   // Contribution amount
  balance: 50,                        // Balance due
  badgePrinted: false,                // Badge printed status
  foodCoupons: 3,                     // Number of food coupons
  createdAt: Timestamp                // Registration timestamp
}
```

---

## How to Use

### Create an Event

1. Click **Events** in the menu
2. Click **➕ Create Event**
3. Fill in event details:
   - Event Name
   - Event Type (select from dropdown)
   - Location
   - Start Date
   - End Date
   - Event Fee (optional)
4. Click **Create Event**

**Example:**
- Name: Family Camp 2026
- Type: Camp
- Location: Camp XYZ
- Dates: June 15-20, 2026
- Fee: $100

### Register Participants

1. From **Events** list, click **Register** on desired event
2. Fill in participant details:
   - Name (required)
   - Address
   - Phone (required)
   - Guardian (required)
   - Emergency Contact
   - Contribution Amount
   - Food Coupons (default: 3)
3. Click **Register Participant**

### View Event Participants

1. From **Events** list, click **View Participants**
2. See participant summary:
   - Total participants
   - Checked in count
   - Total contributions
3. View participant table with columns:
   - Name
   - Phone
   - Guardian
   - Check-in status
   - Badge print status
   - Contribution
   - Balance
   - Food Coupons
4. Click **Edit** to modify participant info

### Check-In Participants

1. From **Events** list, click **Check-In**
2. Search for participant by name (optional)
3. For each participant:
   - Click **✅ Check In** to mark checked in
   - Click **❌ Check Out** to uncheck
   - Click **🖨️ Print Badge** to print badge
   - Click **✏️ Edit** to modify details

### Print Badges

1. During check-in, click **🖨️ Print Badge** next to participant
2. Badge print window opens
3. Click **Print** in browser print dialog
4. Badge automatically marked as printed in database

### Edit Participant

1. From participant list or check-in screen, click **Edit**
2. Update participant information:
   - Name, Address, Phone
   - Guardian, Emergency Contact
   - Contribution, Food Coupons
3. Click **Update**

---

## Screen Workflows

### Event Management Dashboard

```
📋 Event Management
├─ ➕ Create Event
└─ 📅 Events List
   ├─ Event 1: Family Camp 2026
   │  ├─ View Participants
   │  ├─ Register
   │  └─ Check-In
   ├─ Event 2: Youth VBS 2026
   │  ├─ View Participants
   │  ├─ Register
   │  └─ Check-In
   └─ Event 3: Annual Retreat
      ├─ View Participants
      ├─ Register
      └─ Check-In
```

### Event Workflow

```
CREATE EVENT
    ↓
VIEW EVENT DETAILS
    ↓
REGISTER PARTICIPANTS
    ↓
CHECK-IN PARTICIPANTS
    ├─ Print Badges
    ├─ Track Status
    └─ Update Info
    ↓
VIEW FINAL REPORT
```

---

## Key Features in Detail

### Smart Search in Check-In
- Real-time filtering as you type
- Search by participant name
- Quickly find participants in large events

### Visual Status Indicators
- ✅ Checked In (green border)
- ❌ Not Checked In (gray border)
- 🖨️ Badge Printed (indicates printed status)

### Automatic Timestamps
- Event creation time tracked
- Registration creation time tracked
- Useful for audit trails

### Professional Badge Printing
- Pre-formatted 4" x 3" badge
- Professional layout with borders
- Includes event date
- Large, readable participant name
- Print-ready format

---

## Firebase Integration

All event and registration data is automatically saved to Firebase:

**Events Collection:**
- Stores all event details
- Indexed by start date for quick access
- Timestamped for audit trail

**Event Registrations Collection:**
- Linked to events via eventId
- Complete participant information
- Check-in status tracking
- Badge printing status
- Contribution tracking
- All timestamped

---

## Data Entry Best Practices

### Event Creation
✅ Use consistent naming: "Family Camp 2026" not "FC2026"
✅ Use full location names: "Camp XYZ, County State"
✅ Set accurate date range
✅ Include event fee even if $0

### Participant Registration
✅ Require all mandatory fields: Name, Phone, Guardian
✅ Collect emergency contact for safety
✅ Record contributions at registration
✅ Assign food coupons based on event needs

### Check-In Process
✅ Print badges immediately on check-in
✅ Mark as checked in when participant arrives
✅ Update any last-minute changes
✅ Verify phone and emergency contact

---

## Reporting & Analytics

### Summary Information Available
- Total participants per event
- Check-in count and percentage
- Total contributions
- Badge printing status
- Food coupon distribution

### Integration with Other Modules
- Contributions tracked separately
- Can be integrated with Collection module later
- Participant data separate from Members module
- Event-specific registration data

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Event not appearing | Check event dates are valid (start before end) |
| Participant not showing | Verify registration was saved successfully |
| Badge print failed | Try printing again or use browser's print function |
| Search not working | Check participant name spelling |
| Can't register participant | Ensure Name, Phone, and Guardian fields are filled |

---

## Common Tasks Quick Reference

| Task | Steps |
|------|-------|
| Create Event | Events > Create Event > Fill details > Save |
| Register Participant | Event > Register > Fill info > Save |
| Check In | Event > Check-In > Find participant > Click Check In |
| Print Badge | Check-In > Find participant > Print Badge |
| Edit Participant | Participant list > Edit > Update > Save |
| View Summary | Event > View Participants > See summary stats |
| Search Participant | Check-In > Type name in search > Auto filters |

---

## Data Validation

### Required Fields
- **Event:** Name, Type, Location, Start Date, End Date
- **Participant:** Name, Phone, Guardian
- **Fee:** Automatically defaults to 0 if not entered

### Format Requirements
- Phone: Any format (automatically trimmed)
- Contribution: Numeric value
- Food Coupons: Numeric value (default: 3)
- Dates: YYYY-MM-DD format (auto-validated by date picker)

### Date Validation
- Start Date must be before End Date
- Past dates allowed for historical records
- Future dates supported for planning

---

## Advanced Features

### Multiple Events Management
- Manage unlimited events simultaneously
- Separate registration lists per event
- Independent check-in tracking
- Isolate data by event ID

### Participant Data Integrity
- All timestamps recorded
- Check-in status tracked
- Badge printing logged
- Contribution recorded

### Scalability
- Designed for large events (100+ participants)
- Efficient search and filtering
- Real-time updates
- Firebase cloud database support

---

## Future Enhancement Possibilities

1. **Event Statistics Dashboard**
   - Pie charts for check-in rates
   - Revenue tracking
   - No-show analysis

2. **Automated Reminders**
   - SMS/Email to participants before event
   - Reminder for outstanding contributions

3. **Bulk Import**
   - Import participants from CSV
   - Update multiple registrations at once

4. **QR Code Check-In**
   - Generate QR codes for badges
   - Scan during check-in

5. **Food Service Integration**
   - Track meal counts
   - Dietary restrictions
   - Food coupon redemption

6. **Payment Integration**
   - Online payment for event fees
   - Payment tracking
   - Invoice generation

7. **Mobile App**
   - Check-in on mobile device
   - Badge printing via mobile
   - Real-time sync

---

## File Structure

```
bca_finance/
├─ js/
│  ├─ events.js (NEW - Event Management Module)
│  └─ ...other files...
├─ index.html (UPDATED - Added Events button)
└─ ...other files...
```

---

## Version History

**v1.0 - March 22, 2026**
- Initial release
- Event creation
- Participant registration
- Check-in functionality
- Badge printing
- Food coupon tracking
- Contribution tracking

---

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Verify data format matches requirements
3. Ensure all required fields are completed
4. Check Firebase connection
5. Contact system administrator

---

**Status:** ✅ **COMPLETE & READY FOR USE**

The Event Management Module is fully functional and integrated with your BCA Finance system.

