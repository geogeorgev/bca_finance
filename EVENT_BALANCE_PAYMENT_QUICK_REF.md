# Event Balance Payment & Edit Tracking - Quick Reference

## Quick Start (30 seconds)

### Process a Balance Payment
1. **Events** → Select Event → **View Participants**
2. Find participant with balance
3. Click **Edit** → See "⚠️ Outstanding Balance" box
4. Click **💳 Pay Balance Now**
5. Enter/confirm amount, select payment method
6. Click **✅ Process Payment**
7. Done! ✓ Payment recorded as income

### View Who Edited What
- **Quick:** Check "Last Edited" column in participants table
- **Detailed:** Click Edit on participant → Scroll to "Edit History" section

---

## Feature Comparison

| Feature | Before | After |
|---------|--------|-------|
| Balance visibility | Only in calculation | Prominent alert on edit screen |
| Balance payment | Must use separate form | Direct from participant edit |
| Income tracking | Manual entry | Automatic |
| Edit history | None | Full email + timestamp |
| Accountability | Unknown | Complete audit trail |

---

## Common Workflows

### Workflow 1: Participant Hasn't Paid Full Fee
```
View Participants
    ↓
Click Edit on participant
    ↓
See "⚠️ Outstanding Balance: $250.00"
    ↓
Click "💳 Pay Balance Now"
    ↓
Confirm amount, select Cash/Check
    ↓
Click "Process Payment"
    ↓
✓ Contribution updated
✓ Income recorded
✓ Edit history logged
```

### Workflow 2: Multiple Partial Payments
```
First Payment:
View Participants → Edit → Pay Balance ($100) → Done
    ↓
Second Payment:
View Participants → Edit (balance now $150) → Pay Balance ($150) → Done
    ↓
Edit History shows both payments:
• 3/30/2026 2:45 PM - Balance payment: $150.00
• 3/30/2026 1:30 PM - Balance payment: $100.00
```

### Workflow 3: Audit Trail Investigation
```
"Who edited this participant?"
    ↓
Click Edit button
    ↓
Check "Edit History" section at top
    ↓
See all edits with user email + timestamp
```

---

## Important Fields

### In Balance Payment Form
| Field | Purpose | Example |
|-------|---------|---------|
| Payment Amount | Amount being collected | $250.00 (pre-filled) |
| Payment Method | How payment received | Cash or Check |
| Check Number | Check ID (if check) | 1024 |
| Record as Income | Auto-create income entry | ☑ Checked |
| Payment Notes | Optional notes | "Partial payment" |

### In Edit History
| Field | Shows | Example |
|-------|-------|---------|
| editedAt | When the edit happened | 3/30/2026, 2:45:30 PM |
| editedBy | Who made the edit | admin@church.com |
| action | What they did | Balance payment: $250.00 |

---

## Payment Methods Supported

### Cash
- Select: "Cash"
- Check # field: Hidden (not needed)
- Income Type: "Cash"

### Check
- Select: "Check"
- Check # field: Required (must enter)
- Income Type: "Check"
- Validation: Must be valid number

---

## Edit History Examples

### Type 1: Participant Info Update
```
editedAt: "3/30/2026, 1:30:00 PM"
editedBy: "volunteer@church.com"
action: "Participant information updated"
```

### Type 2: Balance Payment
```
editedAt: "3/30/2026, 2:45:30 PM"
editedBy: "admin@church.com"
action: "Balance payment: $250.00"
```

### Type 3: Contribution Change
```
editedAt: "3/30/2026, 3:00:00 PM"
editedBy: "treasurer@church.com"
action: "Participant information updated"
```

---

## Data Flow - Balance Payment

```
Pay Balance Form
    ↓
Process Balance Payment()
    ├─→ Update eventRegistrations
    │   ├─ contribution += paymentAmount
    │   └─ editHistory.push(newEntry)
    │
    └─→ Record as Income (if checked)
        └─ Create income entry
            ├─ amount: paymentAmount
            ├─ purpose: eventName
            ├─ type: paymentMethod
            └─ memo: "Event Contribution"
    ↓
Return to Event Dashboard
├─ Participants table updated
├─ "Last Edited" column refreshed
└─ Income menu shows new entry
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't see "Pay Balance" button | Participant has $0 balance (fully paid) |
| Check number field not showing | Payment method set to "Cash" - change to "Check" |
| Payment not recorded as income | Uncheck "Record as Income" - it's enabled by default |
| History shows "N/A" | Participant has never been edited |
| Can't modify payment amount | Change it in the form - defaults to balance but is editable |

---

## User Permissions Needed

✅ Must be logged in  
✅ Must have permission to edit participant  
✅ Check number validation automatic (no special permission)  
✅ Income recording automatic (uses existing income system)  

---

## Integration Points

### With Income Module
- New income entries created automatically
- Shows in Collection/Income menu
- Included in financial reports
- Balance payment method recorded (Cash/Check)

### With Members Module
- If participant is member: updates member record
- Total contribution tracked
- Used in contribution statements

### With Dashboard
- Event totals update immediately
- "Total Collected" includes balance payments
- "Pending Balance" reduced by payment amount

---

## Best Practices

✅ **DO:**
- Record all payments to income (default behavior)
- Add payment notes for complex situations
- Review edit history regularly for accountability
- Process payments same day when possible

❌ **DON'T:**
- Try to modify balance directly (use payment form)
- Disable income recording unless required
- Process payment without verifying amount
- Rely on memory (check edit history for facts)

---

## Key Benefits at a Glance

🎯 **Faster:** Reduce steps to process balance payment  
📊 **Transparent:** Know exactly who edited what when  
💰 **Accurate:** Automatic income recording  
🔐 **Secure:** Complete audit trail  
📱 **Convenient:** All in one screen  

---

## Support Scenarios

### Scenario 1: "Did John pay his balance?"
→ View Participants  
→ Find John in list  
→ Check "Last Edited" column  
→ Check "Contribution" column  
→ If balance = $0, fully paid ✓

### Scenario 2: "Who processed that payment?"
→ Click Edit on participant  
→ View "Edit History" section  
→ See user email and timestamp  
→ Know exactly who did it

### Scenario 3: "Can we accept a partial payment now?"
→ Yes! Edit participant  
→ Click "Pay Balance Now"  
→ Enter amount they can pay now  
→ Process  
→ Balance automatically recalculates  
→ They can pay remainder later

---

## Stats & Tracking

### Captured in Edit History
- ✓ Email of person who edited
- ✓ Date and time of edit
- ✓ Type of action (info update, payment)
- ✓ If payment: exact amount
- ✓ Complete chronological timeline

### Visible in Participants Table
- ✓ Last editor's email
- ✓ Last edit date and time
- ✓ Current contribution amount
- ✓ Remaining balance

---

## Success Indicators

✅ Balance payment processed when "Processing..." clears  
✅ Success alert appears with payment amount  
✅ "Last Edited" column updates in table  
✅ Edit History includes new payment entry  
✅ Income entry visible in Collection menu  

---

**Version:** 1.0  
**Status:** Production Ready ✅  
**Last Updated:** March 30, 2026

