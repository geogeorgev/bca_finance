# Guardian Member Linking - Quick Reference Card

## 🎯 What It Does

Links event participant guardians with member records for tax and collection reporting.

---

## ⚡ Quick Start (2 Steps)

### Step 1: Open Register Form
```
Events → Select Event → Click "Register"
```

### Step 2: Select Guardian Type
```
Guardian Type: [▼ Member / Non-Member]

IF Member:
  ├─ Select from member list
  └─ Payment links to member ✓

IF Non-Member:
  ├─ Enter guardian name
  └─ Payment recorded separately
```

---

## 📋 Form Fields

```
Participant Name:        [____________________]
Address:                 [____________________]
Phone Number:            [____________________]

Guardian Type:           [▼ Member/Non-Member] ← NEW
Guardian (Member):       [▼ Select] (if Member)   ← NEW
Guardian Name:           [____________________] (if Non-Member) ← NEW

Emergency Contact:       [____________________]
Contribution Amount:     [50] $
☑ Record Contribution as Income Entry
Food Coupons:           [3]

[Register Participant] [Cancel]
```

---

## ✨ Three Scenarios

### Scenario A: Member Guardian
```
John Doe (Member) registers daughter
├─ Guardian Type: Member
├─ Guardian: Select "John Doe"
├─ Contribution: $50
└─ Result: John's total +$50 ✓
```

### Scenario B: Non-Member Guardian
```
Jane Smith (Not member) registers nephew
├─ Guardian Type: Non-Member
├─ Guardian Name: Enter "Jane Smith"
├─ Contribution: $40
└─ Result: Recorded separately ✓
```

### Scenario C: Annual Report
```
John Doe's 2026 Annual Report:
├─ Direct Collections: $300
├─ Event Contributions: $50 ✓
└─ Total: $350 ✓
```

---

## 🔄 Data Updates

### When Member Guardian:
```
MEMBER RECORD:
TotalContribution: 300 → 350 ✓ (increased by $50)

INCOME RECORD:
MemberID: links to John Doe ✓
MemberName: John Doe ✓
GuardianType: member ✓

RESULT:
Appears in annual tax report ✓
```

### When Non-Member Guardian:
```
MEMBER RECORD:
No changes ✓

INCOME RECORD:
GuardianName: Jane Smith ✓
GuardianType: nonmember ✓
MemberID: EVENT (not linked) ✓

RESULT:
Separate tracking only
```

---

## ✅ Benefits

✅ **Automatic** - No extra steps
✅ **Linked** - Member records updated
✅ **Tracked** - Complete income history
✅ **Reported** - Tax report includes events
✅ **Flexible** - Member and non-member both supported

---

## 💡 Pro Tips

**Tip 1:** Always select "Member" if guardian is a church member
- Payment automatically linked
- Shows in tax report

**Tip 2:** Use "Non-Member" for outside guardians
- Keeps records separate
- No member record affected

**Tip 3:** Check Member Totals Later
- Go to Members section
- Verify TotalContribution increased
- Confirms payment linked

**Tip 4:** Annual Reports
- Event contributions auto-included
- No manual consolidation needed
- Complete financial picture

---

## 🔍 Quick Verification

### Verify It Worked:

```
After registering with member guardian:

1. Check Member Record:
   └─ TotalContribution increased? YES ✓

2. Check Income Collection:
   └─ Entry shows member ID? YES ✓

3. Check Annual Report:
   └─ Event contribution listed? YES ✓
```

---

## 🎯 Decision Tree

```
Is the guardian a church member?

YES → Guardian Type: Member
      Select member from dropdown
      Payment automatically linked ✓

NO → Guardian Type: Non-Member
     Enter guardian name
     Payment recorded separately ✓
```

---

## 📊 Fields to Know

### Guardian Type: "member"
- Shows member dropdown
- Selects from members collection
- Links to member automatically

### Guardian Type: "nonmember"
- Shows text input
- Enter any name
- No member linking

### Contribution Amount
- Links to member (if member guardian)
- Increases member's TotalContribution
- Included in income record

### Member's TotalContribution
- Auto-increased by contribution amount
- Shows in annual tax report
- Includes events + direct collections

---

## 🔐 What's Stored

### In Event Registration:
- Guardian name
- Guardian type (member/non-member)
- Member ID (if member)
- Member name (if member)

### In Income:
- Guardian name
- Guardian type
- Member ID (if member)
- Member name (if member)

### In Member Record:
- TotalContribution (increased if member guardian)

---

## ⚠️ Important Notes

✓ Guardian name always required
✓ Member selection required if "Member" type
✓ Contribution > $0 required for income recording
✓ Non-member doesn't affect member records
✓ Safe - no data loss either way

---

## 🚀 You're Ready!

Just pick:
1. Guardian Type
2. Member or Name
3. Enter contribution
4. Save

Everything else happens automatically! ✓

---

## 📞 Reference

**Full Guides:**
- GUARDIAN_MEMBER_LINKING_GUIDE.md (detailed)
- GUARDIAN_MEMBER_LINKING_CHECKLIST.md (technical)

**This Card:**
Quick reference for common tasks

**Questions?** Check the guides for detailed information!

