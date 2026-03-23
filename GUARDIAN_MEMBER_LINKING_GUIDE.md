# Guardian Member Linking - Event Registration Feature Guide

## Overview

You can now link event participant guardians to your members collection, enabling automatic association of event contributions with member records for tax and collection reporting.

---

## ✨ New Features

### 1. Guardian Type Selection
- **Member Guardian** - Select from existing members list
- **Non-Member Guardian** - Enter guardian name manually

### 2. Automatic Member Linking
- Guardian member is automatically linked in the system
- Contribution is added to member's TotalContribution
- Shows on member's annual collection tax report

### 3. Income Tracking
- Income entries linked to guardian member (if member)
- Payment appears under member's record
- Easy to identify for annual reports

---

## 🎯 How It Works

### Scenario 1: Guardian is a Member

```
Register Participant (Child)
  ↓
Guardian Type: "Member"
  ↓
Select Guardian from Member List
  ↓
Enter Contribution: $50
  ↓
Click "Register"
  ↓
RESULTS:
├─ Participant registered in Events ✓
├─ Member's TotalContribution increased by $50 ✓
├─ Income entry linked to Member ✓
└─ Shows in Member's Annual Report ✓
```

### Scenario 2: Guardian is a Non-Member

```
Register Participant (Child)
  ↓
Guardian Type: "Non-Member"
  ↓
Enter Guardian Name
  ↓
Enter Contribution: $50
  ↓
Click "Register"
  ↓
RESULTS:
├─ Participant registered in Events ✓
├─ Guardian name stored as text ✓
├─ Income entry created with guardian name ✓
└─ Does NOT affect member records ✓
```

---

## 📋 Register Participant Screen - Updated

```
Participant Name:        [Full name]

Address:                 [Street address]

Phone Number:            [Phone]

Guardian Type:           ▼ Member ◄─── NEW SELECTOR
                         (shows: Member / Non-Member)

Guardian (Member):       ▼ [Select from list] ◄─── Shows if "Member" selected
                         "Select guardian from member list..."

Guardian Name (Non-Member): [Enter name] ◄─── Shows if "Non-Member" selected

Emergency Contact:       [Number]

Contribution Amount:     [$50]

☑ Record Contribution as Income Entry

Food Coupons:           [3]
```

---

## 🔄 Data Flow

### When Guardian is a Member

```
REGISTRATION FORM
├─ Guardian Type: "member"
├─ Guardian: "John Doe" (selected from members)
├─ Contribution: $50
└─ Record as Income: ☑

         ↓ SAVE

EVENT REGISTRATIONS COLLECTION
├─ eventId: "xyz123"
├─ name: "Jane Doe" (child)
├─ guardian: "John Doe"
├─ guardianType: "member"
├─ guardianMemberId: "mem_abc123" ← LINKED
├─ guardianMemberName: "John Doe"
├─ contribution: 50
└─ createdAt: Timestamp

         ↓ PLUS

MEMBERS COLLECTION (Updated)
├─ MemberId: "mem_abc123"
├─ Name: "John Doe"
├─ TotalContribution: OLD + 50 ← INCREASED
└─ ...other fields

         ↓ PLUS

INCOME COLLECTION
├─ IncomeID: "inc_def456"
├─ MemberID: "mem_abc123" ← LINKED TO MEMBER
├─ MemberName: "John Doe" ← Member name
├─ Amount: 50
├─ Purpose: "Event Contribution - Family Camp 2026"
├─ GuardianType: "member"
├─ GuardianMemberId: "mem_abc123"
├─ GuardianName: "John Doe"
└─ CreateDate: Timestamp
```

### When Guardian is Non-Member

```
REGISTRATION FORM
├─ Guardian Type: "nonmember"
├─ Guardian Name: "Jane Smith"
├─ Contribution: $30
└─ Record as Income: ☑

         ↓ SAVE

EVENT REGISTRATIONS COLLECTION
├─ eventId: "xyz123"
├─ name: "Tom Smith" (child)
├─ guardian: "Jane Smith"
├─ guardianType: "nonmember"
├─ guardianMemberId: null ← NO LINK
├─ contribution: 30
└─ createdAt: Timestamp

         ↓ MEMBERS COLLECTION (Unchanged)
         (No member record updated)

         ↓ PLUS

INCOME COLLECTION
├─ IncomeID: "inc_ghi789"
├─ MemberID: "EVENT-xyz123" ← EVENT, NOT MEMBER
├─ MemberName: "Jane Smith"
├─ Amount: 30
├─ Purpose: "Event Contribution - Family Camp 2026"
├─ GuardianType: "nonmember"
├─ GuardianMemberId: null
├─ GuardianName: "Jane Smith"
└─ CreateDate: Timestamp
```

---

## 💾 Database Schema

### Event Registrations Collection (New Fields)

```json
{
  "eventId": "event_xyz123",
  "name": "Jane Doe",
  "address": "123 Main St",
  "phone": "555-1234",
  "guardian": "John Doe",
  "guardianType": "member",              ← NEW: "member" or "nonmember"
  "guardianMemberId": "mem_abc123",      ← NEW: Member ID if member
  "guardianMemberName": "John Doe",      ← NEW: Member name if member
  "emergencyContact": "9876543210",
  "contribution": 50,
  "balance": 50,
  "checkedIn": false,
  "badgePrinted": false,
  "foodCoupons": 3,
  "createdAt": Timestamp
}
```

### Income Collection (New Fields)

```json
{
  "IncomeID": "inc_def456",
  "MemberID": "mem_abc123",              ← LINKED TO MEMBER (if member)
  "MemberName": "John Doe",              ← Guardian member name
  "Amount": 50,
  "Purpose": "Event Contribution - Family Camp 2026",
  "Type": "Cash",
  "CollectionDate": "2026-03-23",
  "Memo": "Event: Family Camp 2026 | Participant: Jane Doe | Guardian: John Doe",
  "EventId": "event_xyz123",
  "ParticipantName": "Jane Doe",
  "EventName": "Family Camp 2026",
  "GuardianType": "member",              ← NEW: Guardian type
  "GuardianMemberId": "mem_abc123",      ← NEW: Guardian member ID
  "GuardianName": "John Doe",            ← NEW: Guardian name
  "IsEventContribution": true,
  "CreateDate": Timestamp
}
```

### Members Collection (Updated)

```json
{
  "MemberId": "mem_abc123",
  "Name": "John Doe",
  "TotalContribution": 350,              ← INCREASED (was 300, added 50)
  "Phone": "555-1234",
  ...other fields
}
```

---

## 📊 Tax Reporting Integration

### Annual Collection Tax Report

When you run annual reports for members, you'll now see:

```
Member Report - Year 2026
═════════════════════════

Member Name: John Doe
Total Contribution: $350

Contributions Include:
├─ Direct Collections: $300
├─ Event Contributions: $50
│  └─ Family Camp 2026: $50
└─ Other: $0

Tax Report Shows: $350 ✓
```

---

## 🔍 Query Examples

### Find All Member Event Contributions

```javascript
// Get all event contributions for a specific member
db.collection("income")
  .where("GuardianMemberId", "==", "mem_abc123")
  .where("IsEventContribution", "==", true)
  .get()
```

### Find Event Contributions by Guardian Type

```javascript
// Get all member-linked contributions
db.collection("income")
  .where("GuardianType", "==", "member")
  .where("IsEventContribution", "==", true)
  .get()
```

### Get Member's Event Activity

```javascript
// See all events a member has kids registered in
db.collection("eventRegistrations")
  .where("guardianMemberId", "==", "mem_abc123")
  .get()
```

---

## ✅ Usage Example

### Step 1: Create Event
```
Events → Create Event
Name: Family Camp 2026
Fee: $100
Location: Camp XYZ
Dates: June 15-20, 2026
```

### Step 2: Register Participant with Member Guardian

```
Events → Select "Family Camp 2026" → Click "Register"

Participant Name: Jane Doe
Address: 123 Main Street
Phone: 555-1234

Guardian Type: [Member ▼]  ← Select Member

Guardian (Member): [John Doe ▼]  ← Select from member list
(Shows: "Select guardian from member list - payment will be linked for tax reporting")

Emergency Contact: 9876543210
Contribution: $50
☑ Record Contribution as Income Entry
Food Coupons: 3

Click "Register Participant"
```

### Step 3: Results

**In Events:**
- Jane Doe registered for Family Camp 2026
- Guardian: John Doe (Member)
- Contribution: $50

**In Members:**
- John Doe's TotalContribution increased by $50
- Will appear in annual collection tax report

**In Income:**
- Entry created showing:
  - MemberName: John Doe
  - Amount: $50
  - Guardian Type: member
  - Linked to Member ID

---

## 📈 Benefits

✅ **Tax Reporting**
- Event contributions automatically included in member's annual report
- No manual tracking needed
- Complete financial picture

✅ **Member Accountability**
- See all member contributions in one place
- Direct collections + Event contributions
- Audit trail maintained

✅ **Financial Tracking**
- Know which members have children in events
- Track their total giving (collections + events)
- Identify major contributors

✅ **Report Generation**
- Annual reports include event contributions
- Total contribution accurate
- Easier tax documentation

---

## 🔄 Workflow Examples

### Example 1: Single Child Registration

```
John Doe (Member) registers his daughter Jane for Family Camp
Guardian Type: Member → Select "John Doe"
Contribution: $50
Income recorded under John Doe
John's annual contribution increases by $50
```

### Example 2: Multiple Children

```
John Doe has 2 children at camp:
├─ Register Jane: $50 contribution (Guardian: John Doe)
├─ Register Tom: $75 contribution (Guardian: John Doe)

Results:
└─ John Doe's TotalContribution increased by $125
   (Shows in annual report)
```

### Example 3: Non-Member Guardian

```
Jane Smith (Non-Member) registers her nephew for camp
Guardian Type: Non-Member → Enter "Jane Smith"
Contribution: $40
Income recorded with guardian name only
No member record updated
```

---

## 🎯 Key Features Summary

| Feature | Benefit | Use Case |
|---------|---------|----------|
| **Member Guardian** | Auto-link to member record | Family with membership |
| **Non-Member Guardian** | Manual entry | Casual participant |
| **Auto Contribution Update** | Member TotalContribution increases | Tax reporting |
| **Income Linking** | Income tied to member | Financial tracking |
| **Guardian Info Stored** | Full audit trail | Reporting & reference |
| **Annual Reports** | Total showing events + collections | Tax documentation |

---

## 🔐 Data Integrity

✅ Guardian type stored with registration (member or non-member)
✅ Member ID stored for member guardians (for linking)
✅ Guardian name always stored
✅ Income linked to correct member (if applicable)
✅ No data loss on member updates
✅ Sync function handles both member and non-member guardians
✅ Backward compatible with existing registrations

---

## 📋 Support & Troubleshooting

### Q: What if I select wrong member as guardian?
A: Edit participant and change guardian, then manually update member contributions.

### Q: Does non-member guardian affect anything?
A: No - only stored as text, doesn't link to member records.

### Q: How do I see total member contributions?
A: Go to Members collection - check TotalContribution field (includes events).

### Q: Can I sync existing registrations?
A: Yes - use "Sync Contributions to Income" button.

### Q: Will this work for annual tax reports?
A: Yes - income entries linked to member, shows in reports automatically.

---

## ✨ Next Steps

1. ✅ Test with a member guardian
2. ✅ Verify income entry shows member ID
3. ✅ Check member's TotalContribution increased
4. ✅ Test annual report includes event contribution
5. ✅ Use for all new event registrations

**The integration is complete and ready to use!**

