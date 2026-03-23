# Event to Income Integration - Quick Start

## 📌 What Changed

Your Events module now integrates with Income collection. When participants register with contributions, their payments are automatically recorded in your financial records.

---

## 🚀 Quick Start in 3 Steps

### Step 1: Create an Event
```
1. Click "Events" in menu
2. Click "➕ Create Event"
3. Fill in details:
   - Name: "Family Camp 2026"
   - Type: "Camp"
   - Location: "Camp XYZ"
   - Dates: June 15 - June 20, 2026
   - Fee: $100
4. Click "Create Event"
```

### Step 2: Register Participant
```
1. Click "Register" on your event
2. Fill in:
   - Name: "John Doe"
   - Phone: "555-1234"
   - Guardian: "Jane Doe"
   - Contribution Amount: "50"
   
3. IMPORTANT: Checkbox "Record Contribution as Income" should be ✓ CHECKED
4. Click "Register Participant"

RESULT: Contribution automatically saved to Income collection!
```

### Step 3: Verify in Income
```
1. Go to "Collection" (Income menu)
2. You should see a new entry for "John Doe"
   - MemberName: John Doe
   - Amount: $50
   - Purpose: Event Contribution - Family Camp 2026
   - Memo: Event and participant details
```

---

## 📊 Two Features Added

### Feature 1: Auto-Record During Registration
**Where:** Register Participant form
**What:** Checkbox "Record Contribution as Income Entry"
**Status:** Checked by default
**Effect:** When you register someone with $$$, it automatically creates an income entry

### Feature 2: Manual Sync (Batch)
**Where:** Event Dashboard
**Button:** "💾 Sync Contributions to Income"
**Use:** If contributions weren't recorded, sync them all at once
**Safety:** Prevents duplicates

---

## 💡 Example Scenarios

### Scenario 1: Normal Flow (Recommended)
```
Register Participant with Contribution → Automatic Income Entry Created ✓
```

### Scenario 2: Batch Sync (If Needed)
```
1. Registered participants but forgot to check income box
2. Event Dashboard → "Sync Contributions to Income"
3. All contributions recorded at once ✓
```

### Scenario 3: Multiple Registrations
```
Register 10 participants → 10 income entries created automatically ✓
```

---

## 📋 What Gets Recorded

When you register a participant with $50 contribution:

**In Events Collection:**
- Participant name, phone, guardian
- Contribution amount ($50)
- Event details

**In Income Collection:**
- MemberName: Participant name
- Amount: $50
- Purpose: Event Contribution - {Event Name}
- Memo: Event and participant details
- EventId: Link back to event
- IsEventContribution: true (identifier)

---

## ✅ Key Points

✓ **Automatic** - No extra work, just check the box
✓ **Real-time** - Income recorded immediately  
✓ **Safe** - No duplicates even if synced multiple times
✓ **Trackable** - Can see which income came from events
✓ **Flexible** - Can still manually record if needed

---

## ❓ Common Questions

**Q: What if I uncheck the box?**
A: Contribution won't be recorded. You can use sync button later to record it.

**Q: Can I change contribution after registering?**
A: Yes, edit participant in Event Dashboard. You'll need to update the income entry separately.

**Q: What if contribution is $0?**
A: Nothing is recorded. Only contributions > $0 are recorded as income.

**Q: Does this work for events in the past?**
A: Yes, sync will record all contributions regardless of when event was created.

**Q: Can I delete an income entry?**
A: Yes, go to Income collection and delete it. Then re-sync if needed.

---

## 🎯 Best Practice Workflow

### For Each Event:

1. **Create Event**
   - Set up event details, dates, fee

2. **Register Participants**
   - Fill in participant info + contribution
   - **Keep checkbox ✓ CHECKED**
   - Income will be recorded automatically

3. **View Dashboard**
   - Check Total Collected
   - See pending balance
   - Verify all contributions recorded

4. **End of Event**
   - If any contributions weren't recorded:
   - Click "💾 Sync Contributions to Income"
   - All will be recorded safely

5. **Financial Reporting**
   - Event contributions show in Income/Collection
   - Include in reports and financial summaries

---

## 🔗 Related Areas

**Income/Collection:**
- Shows all event contributions
- Can export to Excel
- Included in financial reports

**Dashboard:**
- Event revenue appears in income totals

**Reports:**
- Event contributions filter by "Event Contribution" purpose

---

## ✨ That's It!

You're all set! The integration is automatic and working.

**Just remember:**
✓ Check the income box when registering = automatic recording
✓ Use sync button if you need to record existing contributions
✓ All contributions show up in Income collection
✓ Complete financial tracking!

**Ready to try it?**
1. Create an event
2. Register a participant with contribution
3. Check Collection (Income) to see it recorded!

