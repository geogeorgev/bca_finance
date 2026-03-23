# Event Participant Contribution to Income Integration Guide

## Overview
This guide explains how to integrate event participant contributions with the Income (Collection) module, allowing you to track and record event payments in your financial records.

---

## Features Added

### 1. **Automatic Income Recording During Registration**

When you register a participant with a contribution amount:
- A checkbox appears: **"Record Contribution as Income Entry"** (checked by default)
- If checked and contribution > $0, the contribution is automatically recorded in the Income collection
- Income entry is created with event and participant details

### 2. **Manual Sync Option**

If contributions weren't recorded during registration:
- Go to Event Dashboard
- Click **"💾 Sync Contributions to Income"** button
- Batch sync all participant contributions to Income collection
- System prevents duplicate entries

---

## How to Use

### **Method 1: Automatic Recording (Recommended)**

#### Step 1: Create an Event
1. Events → Click "➕ Create Event"
2. Fill in event details (Name, Type, Location, Dates, Fee)
3. Click "Create Event"

#### Step 2: Register Participant with Contribution
1. Click "Register" button on the event
2. Fill in participant information:
   - Name, Address, Phone, Guardian, Emergency Contact
   - **Contribution Amount ($)** - Enter the amount they paid
3. **Checkbox: "Record Contribution as Income Entry"** - Should be ✓ checked
4. Click "Register Participant"

**Result:**
- Participant is registered in Events
- Contribution is automatically recorded in Income collection
- You see confirmation: "Participant registered successfully! Contribution recorded as income."

#### Step 3: View Event Dashboard
1. Click "View Participants" on the event
2. See Event Dashboard with:
   - Total Registrations
   - Checked In Count
   - **Total Collected** (sum of all contributions)
   - Pending Balance

---

### **Method 2: Manual Sync (Bulk)**

If you need to sync existing contributions to Income:

#### Step 1: Go to Event Dashboard
1. Events → Select event → "View Participants"

#### Step 2: Sync Contributions
1. Click "💾 Sync Contributions to Income" button
2. Review count of unrecorded contributions
3. Click "Sync All Contributions"
4. System creates income entries for all contributions > $0

**Features:**
- Prevents duplicate entries
- Shows how many were synced and skipped
- Safe to run multiple times

---

## Data Structure

### Income Entry Created from Event Contribution

```
{
  IncomeID: "auto-generated",
  MemberID: "EVENT-{eventId}",
  MemberName: "{participantName}",
  Purpose: "Event Contribution - {eventName}",
  Type: "Cash",
  Amount: {contributionAmount},
  CollectionDate: "{today's date}",
  Memo: "Event: {eventName} | Participant: {participantName}",
  
  // Event tracking fields
  EventId: "{eventId}",
  ParticipantName: "{participantName}",
  EventName: "{eventName}",
  IsEventContribution: true,
  
  CreateDate: Timestamp
}
```

### Income Fields Populated:
- ✅ **MemberName** - Participant name
- ✅ **Amount** - Contribution amount
- ✅ **Purpose** - Event Contribution - {Event Name}
- ✅ **CollectionDate** - Today's date
- ✅ **Memo** - Event details for reference
- ✅ **Type** - Cash (default)
- ✅ **EventId** - Link to event
- ✅ **IsEventContribution** - True (identifier flag)

---

## Workflow Examples

### Example 1: Single Event Registration

**Scenario:** You're registering John Doe for Family Camp 2026 with $50 contribution

1. Events → Select "Family Camp 2026"
2. Click "Register"
3. Enter:
   - Name: John Doe
   - Phone: 555-1234
   - Guardian: Jane Doe
   - Contribution: 50
   - Checkbox: ✓ (checked)
4. Click "Register Participant"

**Results:**
- ✅ John Doe registered for Family Camp 2026
- ✅ $50 income entry created automatically
- ✅ Shows in Income collection with Purpose: "Event Contribution - Family Camp 2026"

---

### Example 2: Register Without Recording, Then Sync Later

**Scenario:** You register 10 participants but forget to check the income checkbox

1. Go to Event Dashboard
2. Click "💾 Sync Contributions to Income"
3. System shows: "10 unrecorded contributions will be synced"
4. Click "Sync All Contributions"

**Results:**
- ✅ All 10 contributions recorded in Income collection
- ✅ System prevents duplicates
- ✅ Financial records updated

---

### Example 3: View Income from Events

**Scenario:** You want to see all event contributions in Income collection

1. Go to **Collection** (Income) screen
2. All event contributions are listed with:
   - MemberName: Participant name
   - Amount: Contribution
   - Purpose: Event Contribution - {Event Name}
   - Memo: Event details
   - CreateDate: When registered

---

## Tips & Best Practices

### ✅ Best Practices:
1. **Always check the income box** when registering participants with contributions
2. **Use "Sync" option** if you need to backfill contributions to income
3. **Check Event Dashboard** to see total collected vs. expected revenue
4. **Review Income collection** regularly to track event revenue

### ⚠️ Important Notes:
- Income is recorded with today's date (not event date)
- If you need past dates, edit in Income collection afterward
- Contributions are recorded as "Cash" type
- Each contribution is a separate income entry
- System prevents duplicate entries during sync

### 🔄 Editing Contributions:
1. If you need to change a contribution after recording:
   - Edit in Event Dashboard (Edit button on participant)
   - Go to Income collection to update the corresponding entry
   - Edit Amount, Purpose, or Memo as needed

---

## Integration with Other Modules

### Affects These Areas:

1. **Income (Collection) Module**
   - Event contributions appear in collection list
   - Can be included in reports
   - Contributes to financial tracking

2. **Dashboard**
   - Event contributions show in income totals
   - May appear in financial summaries

3. **Reports**
   - Collection reports include event contributions
   - Can filter by "Event Contribution" purpose
   - Helps track event revenue

---

## FAQ

**Q: Can I record a contribution after registration?**
A: Yes, edit the participant in Event Dashboard and increase contribution, then manually record in Income.

**Q: What if contribution is $0?**
A: No income entry is created. Only contributions > $0 are recorded.

**Q: Can I undo income recording?**
A: Yes, delete the corresponding entry in Income collection. Just search for event name or participant name.

**Q: Can I change contribution amount?**
A: Yes, edit participant in Event Dashboard. You'll need to manually update the corresponding Income entry.

**Q: Will duplicate entries be created if I sync twice?**
A: No, system checks for existing entries before creating new ones.

**Q: How do I know if a contribution was recorded?**
A: Check Income collection - search for participant name or event name.

---

## Summary

The integration makes it easy to:
- ✅ Automatically record event revenue
- ✅ Track contributions in financial records
- ✅ Sync existing contributions anytime
- ✅ View total event revenue on dashboard
- ✅ Generate income reports including event contributions

**Quick Start:**
1. Create Event
2. Register Participant with amount
3. Leave checkbox ✓ checked
4. Income is recorded automatically!

