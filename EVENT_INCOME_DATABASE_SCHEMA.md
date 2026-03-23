# Event to Income Integration - Database Schema

## Overview
This document shows how event participant contributions are stored in Firebase and linked between collections.

---

## Firebase Collections

### 1. Events Collection
```
Collection: "events"

Document: {eventId}
├─ name: "Family Camp 2026"
├─ type: "camp"
├─ location: "Camp XYZ"
├─ startDate: "2026-06-15"
├─ endDate: "2026-06-20"
├─ fee: 100
├─ createdAt: Timestamp
```

### 2. Event Registrations Collection
```
Collection: "eventRegistrations"

Document: {registrationId}
├─ eventId: "xyz123..."
├─ name: "John Doe"
├─ address: "123 Main St"
├─ phone: "555-1234"
├─ guardian: "Jane Doe"
├─ emergencyContact: "9876543210"
├─ contribution: 50
├─ balance: 50
├─ checkedIn: false
├─ badgePrinted: false
├─ foodCoupons: 3
├─ createdAt: Timestamp
```

### 3. Income Collection (NEW FIELDS FROM INTEGRATION)
```
Collection: "income"

Document: {incomeID}
├─ IncomeID: "auto-generated-id"
├─ MemberID: "EVENT-xyz123..."
├─ MemberName: "John Doe"
├─ Purpose: "Event Contribution - Family Camp 2026"
├─ Type: "Cash"
├─ CheckNumber: ""
├─ Amount: 50
├─ CollectionDate: "2026-03-23"
├─ Memo: "Event: Family Camp 2026 | Participant: John Doe"
│
├─ EventId: "xyz123..."           ← NEW: Links to event
├─ ParticipantName: "John Doe"    ← NEW: Participant name
├─ EventName: "Family Camp 2026"  ← NEW: Event name
├─ IsEventContribution: true      ← NEW: Identifier
│
├─ CreateDate: Timestamp
```

---

## Data Relationships

### One-to-One: Event Registration to Income

```
Event Registration                Income
──────────────────────────────────────────

eventId ──┐
name ─────┤
phone ────┤
guardian ─┤
address ──┤
emergency ├──────────────→ IncomeID
contribution ─┐            MemberName
              └──────────→ Amount
                           Purpose
                           EventId
                           ParticipantName
                           EventName
```

### Data Flow During Registration

```
Register Participant Form
          ↓
   ┌─────────────────────────┐
   │ Validate Input          │
   │ - Name required         │
   │ - Phone required        │
   │ - Guardian required     │
   │ - Contribution > 0      │
   │ - Income checkbox ✓     │
   └─────────────────────────┘
          ↓
   YES → Create Event Registration
          ↓
   ┌────────────────────────────────┐
   │ eventRegistrations collection  │
   │ ├─ eventId                     │
   │ ├─ name                        │
   │ ├─ phone                       │
   │ ├─ guardian                    │
   │ ├─ contribution                │
   │ └─ ...other fields             │
   └────────────────────────────────┘
          ↓
   IF (recordAsIncome && contribution > 0)
          ↓
   YES → Call recordParticipantContributionAsIncome()
          ↓
   ┌──────────────────────────────────────┐
   │ Create Income Entry                  │
   │ income collection                    │
   │ ├─ IncomeID (auto)                  │
   │ ├─ MemberName: "John Doe"           │
   │ ├─ Amount: 50                       │
   │ ├─ Purpose: "Event Contribution..." │
   │ ├─ EventId: "xyz123"                │
   │ ├─ ParticipantName: "John Doe"      │
   │ ├─ EventName: "Family Camp 2026"    │
   │ └─ IsEventContribution: true        │
   └──────────────────────────────────────┘
          ↓
   SUCCESS ✓
```

---

## Query Examples

### Find All Event Contributions
```javascript
db.collection("income")
  .where("IsEventContribution", "==", true)
  .get()
```

### Find All Contributions for Specific Event
```javascript
db.collection("income")
  .where("EventId", "==", "xyz123...")
  .get()
```

### Find Duplicate Check (During Sync)
```javascript
db.collection("income")
  .where("EventId", "==", "xyz123...")
  .where("ParticipantName", "==", "John Doe")
  .get()
```

### Find Income by Event Name
```javascript
db.collection("income")
  .where("EventName", "==", "Family Camp 2026")
  .get()
```

### Get Total Event Contributions
```javascript
db.collection("income")
  .where("IsEventContribution", "==", true)
  .get()
  .then(snap => {
    let total = 0
    snap.forEach(doc => total += doc.data().Amount)
    return total
  })
```

---

## Field Reference

### Income Collection Fields for Events

| Field | Type | Source | Purpose | Example |
|-------|------|--------|---------|---------|
| IncomeID | String | Auto | Unique identifier | "abc123xyz..." |
| MemberID | String | Generated | Event marker | "EVENT-xyz123" |
| MemberName | String | eventRegistrations.name | Participant name | "John Doe" |
| Amount | Number | eventRegistrations.contribution | Contribution amount | 50 |
| Purpose | String | Generated | Event info | "Event Contribution - Family Camp 2026" |
| Type | String | Set to "Cash" | Payment type | "Cash" |
| CollectionDate | String | Today's date | When recorded | "2026-03-23" |
| Memo | String | Generated | Full details | "Event: Family Camp 2026 \| Participant: John Doe" |
| **EventId** | String | events.id | Link to event | "xyz123..." |
| **ParticipantName** | String | eventRegistrations.name | Participant | "John Doe" |
| **EventName** | String | events.name | Event name | "Family Camp 2026" |
| **IsEventContribution** | Boolean | Set to true | Identifier | true |
| CreateDate | Timestamp | ServerTimestamp | Creation time | Timestamp |

---

## Sample Data

### Sample Event
```json
{
  "name": "Family Camp 2026",
  "type": "camp",
  "location": "Camp XYZ",
  "startDate": "2026-06-15",
  "endDate": "2026-06-20",
  "fee": 100,
  "createdAt": "2026-03-23T10:30:00Z"
}
// ID: "event_abc123xyz"
```

### Sample Event Registration
```json
{
  "eventId": "event_abc123xyz",
  "name": "John Doe",
  "address": "123 Main Street",
  "phone": "555-1234",
  "guardian": "Jane Doe",
  "emergencyContact": "9876543210",
  "contribution": 50,
  "balance": 50,
  "checkedIn": false,
  "badgePrinted": false,
  "foodCoupons": 3,
  "createdAt": "2026-03-23T10:35:00Z"
}
// ID: "reg_def456uvw"
```

### Sample Income Entry (Created from Event)
```json
{
  "IncomeID": "income_ghi789xyz",
  "MemberID": "EVENT-event_abc123xyz",
  "MemberName": "John Doe",
  "Purpose": "Event Contribution - Family Camp 2026",
  "Type": "Cash",
  "CheckNumber": "",
  "Amount": 50,
  "CollectionDate": "2026-03-23",
  "Memo": "Event: Family Camp 2026 | Participant: John Doe",
  "EventId": "event_abc123xyz",
  "ParticipantName": "John Doe",
  "EventName": "Family Camp 2026",
  "IsEventContribution": true,
  "CreateDate": "2026-03-23T10:35:15Z"
}
// ID: "income_ghi789xyz"
```

---

## Sync Operation

### Sync Function Logic
```
syncAllContributionsToIncome(eventId)
  ├─ Get all registrations for eventId
  │
  ├─ FOR EACH registration:
  │  ├─ IF contribution > 0:
  │  │  ├─ Check if income entry already exists:
  │  │  │  └─ Query: EventId = eventId AND ParticipantName = name
  │  │  │
  │  │  ├─ IF NOT exists (empty):
  │  │  │  └─ Call recordParticipantContributionAsIncome()
  │  │  │     └─ Create new income entry
  │  │  │        └─ syncedCount++
  │  │  │
  │  │  └─ IF exists (NOT empty):
  │  │     └─ Skip (already recorded)
  │  │        └─ skippedCount++
  │  │
  │  └─ ELSE:
  │     └─ Skip (contribution = 0)
  │
  └─ Return results: { synced: X, skipped: Y }
```

### Duplicate Prevention
```
Before creating income entry:
  1. Query income collection
  2. Where: EventId = eventId AND ParticipantName = name
  3. If result is empty → Create entry
  4. If result exists → Skip (already recorded)

Result: No duplicate entries!
```

---

## Reporting & Analysis

### Get Event Revenue Summary
```javascript
async function getEventRevenueSummary(eventId) {
  const income = await db.collection("income")
    .where("EventId", "==", eventId)
    .get()
  
  let total = 0
  let count = 0
  
  income.forEach(doc => {
    total += doc.data().Amount
    count++
  })
  
  return { totalCollected: total, contributorCount: count }
}
```

### Get All Event Contributions by Purpose
```javascript
db.collection("income")
  .where("IsEventContribution", "==", true)
  .get()
  .then(snap => {
    let byEvent = {}
    snap.forEach(doc => {
      const d = doc.data()
      if (!byEvent[d.EventName]) byEvent[d.EventName] = 0
      byEvent[d.EventName] += d.Amount
    })
    return byEvent
  })
```

---

## Integration Points

### Dashboard
- Includes event contributions in total income
- Shows event revenue tracking

### Reports
- Event contributions filter by "IsEventContribution: true"
- Can group by EventName
- Export includes event contribution details

### Collection (Income) Screen
- Shows all event contributions
- Can search by event name or participant name
- Includes in income totals

---

## Security Notes

- EventId stored for audit trail
- ParticipantName allows correlation back to event
- IsEventContribution flag for easy filtering
- Memo includes all relevant details
- Timestamp tracks when recorded

---

## Migration / Backwards Compatibility

### New Collections Created: None
### New Fields Added: 5
- EventId
- ParticipantName
- EventName
- IsEventContribution
- (Amount, Purpose, Memo modified for event context)

### Existing Data: Not affected
- Old income entries remain unchanged
- Only new event-sourced entries have event fields
- Filter by IsEventContribution to identify event contributions

---

## Troubleshooting

### Income Entry Not Created
- ✓ Check if contribution amount > 0
- ✓ Check if checkbox was checked
- ✓ Check Firebase console for entries

### Duplicate Income Entries
- ✓ Sync function prevents new duplicates
- ✓ If duplicate exists, delete in Income collection
- ✓ Re-sync if needed (system prevents new duplicates)

### Can't Find Event Income
- Query: EventId = {eventId}
- Filter: IsEventContribution = true
- Search: EventName = {name}

---

## Summary

✅ Event registrations linked to income entries via EventId
✅ All contributions tracked with event context
✅ Duplicate prevention active during sync
✅ Backwards compatible with existing income data
✅ Easy to audit and reconcile
✅ Complete financial tracking for events

