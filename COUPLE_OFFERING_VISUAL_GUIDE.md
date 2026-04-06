# Couple Offering Feature - Visual Guide & Examples

## 🎯 Visual Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    COUPLE OFFERING WORKFLOW                  │
└─────────────────────────────────────────────────────────────┘

STEP 1: Add Couple Member
┌─────────────────────────────────────────────────────────────┐
│ Members → Add Member                                        │
│                                                             │
│ Primary Member Info:                                        │
│  Name: John Smith                                           │
│  Phone: 617-123-4567                                        │
│  Email: john@example.com                                    │
│  Address: 123 Main St, Boston, MA 02101                     │
│                                                             │
│ Spouse Info (NEW):                                          │
│  Spouse Name: Jane Smith          ← NEW FIELD              │
│  Spouse Email: jane@example.com   ← NEW FIELD              │
│  Joint Account: Yes               ← NEW FIELD              │
│                                                             │
│  [Save Button]                                              │
└─────────────────────────────────────────────────────────────┘

STEP 2: Record Offering (Same as Always)
┌─────────────────────────────────────────────────────────────┐
│ Collection Entry                                            │
│                                                             │
│ Contributor Type: Member                                    │
│ Member: John Smith (or Jane - either works)                 │
│ Purpose: Offering - Common                                  │
│ Amount: $100                                                │
│ Check Number: 1234                                          │
│ Date: 4/5/2026                                              │
│ Memo: Joint offering (optional)                             │
│                                                             │
│  [Save Collection]                                          │
└─────────────────────────────────────────────────────────────┘

STEP 3: Generate Annual Statement (Automatic)
┌─────────────────────────────────────────────────────────────┐
│ Reports → Annual Contribution Statement                      │
│                                                             │
│ Member: John Smith                                          │
│ Year: 2026                                                  │
│                                                             │
│  [Generate PDF]                                             │
│         ↓                                                   │
│  PDF Generated with BOTH NAMES!                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📄 Example PDF Statements

### Example 1: Couple Statement

```
┌──────────────────────────────────────────────────────────────┐
│ [BCA Logo] The Boston Christian Assembly                    │
│            26 Wellesley Road, Natick, MA 01760              │
│            Tel: 781-883-9708 | www.bostonchristian.net     │
└──────────────────────────────────────────────────────────────┘

Dear John and Jane,                    ← BOTH NAMES IN SALUTATION

We are grateful for your faithful support for the ongoing
Ministries of the church.

We have prepared the annual contribution for the year 2026
from the records of the church. Please note that item 1 is
the amount of total tax-deductible donations that were
recorded by the church.

It is our prayer that the Lord will continue to bless you
in your commitment to give sacrificially for the needs of
the church.

Yours in His Servants in Christ

_________________          _________________
John Smith                 Jane Smith
Pastor & President         Treasurer

┌────────────────────────────┬───────────┬──────┬──────────┐
│ RECIPIENT ORGANIZATION's   │ 1. Total  │ 2.   │ 3. Ann.  │
│ Name & Address             │ Tax Ded.  │ Year │ Contrib. │
│                            │ Contri.   │      │ Record   │
├────────────────────────────┼───────────┼──────┼──────────┤
│ The Boston Christian       │ $1,000.00 │ 2026 │ $1000.00 │
│ Assembly                   │           │      │          │
│ 26 Wellesley Road,         │           │      │          │
│ Natick, MA 01760           │           │      │          │
├────────────────────────────┴───────────┴──────┴──────────┤
│ RECIPIENT ORGANIZATION's Federal Identification No.      │
│                            Prepared by                   │
│ 04-3144979                 Jane Smith, Treasurer        │
│                        Boston Christian Assembly         │
├──────────────────────────────────────────────────────────┤
│ Donor's Social Security or C.I.D. No.                   │
│                                                         │
│                                                         │
│ Donor's Name (First, Middle, Last):                     │
│ John Smith & Jane Smith    ← BOTH NAMES                 │
├──────────────────────────────────────────────────────────┤
│ Street Address:                                         │
│ 123 Main Street                                         │
├──────────────────────────────────────────────────────────┤
│ City, State and Zip Code:                               │
│ Boston, MA 02101                                        │
└──────────────────────────────────────────────────────────┘

This information has not been submitted to the Internal
Revenue Service. This information is not given with the
intentions of offering tax advice or an explanation of the law.

Form 11(71-1997) Year End Contribution Receipt
File BCA/2026/Receipts
```

### Example 2: Single Member (No Changes)

```
Dear John,                             ← SINGLE NAME ONLY

...

Donor's Name (First, Middle, Last):
John Smith                            ← SINGLE NAME ONLY

...
```

---

## 📊 Member Record Examples

### Example 1: John & Jane Smith (Joint Account)

**Database Record**:
```javascript
{
  id: "john_smith_001",
  Name: "John Smith",
  Phone: "617-123-4567",
  Email: "john@example.com",
  Address1: "123 Main Street",
  Address2: "Boston, MA 02101",
  Active: true,
  Spouse: {
    Name: "Jane Smith",
    Email: "jane@example.com",
    Active: true
  },
  IsJointAccount: true
}
```

**Annual Statement Shows**:
- Salutation: "Dear John and Jane,"
- Donor: "John Smith & Jane Smith"
- Amount: Total of all offerings

---

### Example 2: Bob Johnson (Single Member)

**Database Record**:
```javascript
{
  id: "bob_johnson_001",
  Name: "Bob Johnson",
  Phone: "617-555-1234",
  Email: "bob@example.com",
  Address1: "456 Oak Avenue",
  Address2: "Boston, MA 02102",
  Active: true,
  Spouse: null,
  IsJointAccount: false
}
```

**Annual Statement Shows**:
- Salutation: "Dear Bob,"
- Donor: "Bob Johnson"
- Amount: His individual offering

---

### Example 3: Susan & Bob Johnson (Both Members, Separate)

**Database Record 1**:
```javascript
{
  id: "susan_johnson_001",
  Name: "Susan Johnson",
  Phone: "617-555-5678",
  Email: "susan@example.com",
  Address1: "789 Pine Road",
  Address2: "Boston, MA 02103",
  Active: true,
  Spouse: null,
  IsJointAccount: false
}
```

**Database Record 2**:
```javascript
{
  id: "bob_johnson_001",
  Name: "Bob Johnson",
  Phone: "617-555-1234",
  Email: "bob@example.com",
  Address1: "789 Pine Road",
  Address2: "Boston, MA 02103",
  Active: true,
  Spouse: null,
  IsJointAccount: false
}
```

**Annual Statements Show**:
- Susan gets her own statement
- Bob gets his own statement
- Each shows individual offerings only

---

## 🎨 Member Form Visual

### Add Member Form (With New Fields)

```
┌──────────────────────────────────────────────────────┐
│                    ADD MEMBER                        │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Name                                                │
│ [________________________]                          │
│                                                      │
│ Phone                                               │
│ [________________________]                          │
│                                                      │
│ Email                                               │
│ [________________________]                          │
│                                                      │
│ Address1                                            │
│ [________________________]                          │
│                                                      │
│ Address2                                            │
│ [________________________]                          │
│                                                      │
│ Address3                                            │
│ [________________________]                          │
│                                                      │
│ ┌─ SPOUSE INFORMATION (NEW) ──────────────────────┐ │
│ │                                                │ │
│ │ Spouse Name (if applicable)                   │ │
│ │ [________________________]                    │ │
│ │                                                │ │
│ │ Spouse Email                                  │ │
│ │ [________________________]                    │ │
│ │                                                │ │
│ │ Joint Account (Couple offering together)      │ │
│ │ [Yes ▼] [No  ]  (New dropdown)               │ │
│ │                                                │ │
│ └────────────────────────────────────────────────┘ │
│                                                      │
│ Active                                              │
│ [Active ▼]                                          │
│                                                      │
│  [Save]  [Cancel]                                   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 📋 Decision Tree

```
                    NEW MEMBER?
                        │
            ┌───────────┴───────────┐
            │                       │
        SINGLE                   COUPLE
            │                       │
      Fill basic info          Fill basic info +
      Leave spouse blank           Spouse Name
      Active: Yes             Joint Account: Yes
            │                       │
            ▼                       ▼
       [ SAVE ]                 [ SAVE ]
            │                       │
      Generate PDF             Generate PDF
      Shows single name        Shows both names
```

---

## 💾 Offering Recording Flow

```
                  NEW OFFERING
                       │
        ┌──────────────┴──────────────┐
        │                             │
    SINGLE MEMBER              COUPLE MEMBER
        │                             │
   Record under               Record under
   Member name            Primary member name
   (John Smith)          (John or Jane Smith)
        │                             │
   Amount: $100                  Amount: $100
   Check: 5432                   Check: 5432
        │                             │
        ▼                             ▼
   [ SAVE ]                      [ SAVE ]
        │                             │
   Annual Statement         Annual Statement
   Shows: John Smith        Shows: John & Jane
   Amount: $100             Amount: $100
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    DATA FLOW                             │
└─────────────────────────────────────────────────────────┘

MEMBER RECORD
┌────────────────────────────┐
│ Name: John Smith           │
│ Spouse: Jane Smith         │
│ IsJointAccount: true       │
└────────┬───────────────────┘
         │
         ├─→ Add Member Page
         │   ├─→ Show fields
         │   └─→ Edit Member
         │
         ├─→ Collection Entry
         │   ├─→ Select member
         │   └─→ Record offering
         │
         └─→ PDF Generation
             ├─→ Check IsJointAccount
             ├─→ If true, get Spouse name
             ├─→ Show salutation: "Dear John and Jane,"
             ├─→ Show donor: "John Smith & Jane Smith"
             └─→ Generate professional PDF
```

---

## ✅ Checklist for Using Feature

### When Adding Couple Member
- [ ] Enter primary member name
- [ ] Enter phone and email
- [ ] Enter address
- [ ] Enter spouse name (full name)
- [ ] Enter spouse email (optional)
- [ ] Select "Joint Account: Yes"
- [ ] Click Save

### When Recording Couple's Offering
- [ ] Go to Collection Entry
- [ ] Select the couple member (either name works)
- [ ] Enter full check amount
- [ ] Optional: Note "Joint offering" in memo
- [ ] Click Save

### When Generating Statement
- [ ] Go to Annual Contribution Statement
- [ ] Select the couple member
- [ ] Click Generate PDF
- [ ] Verify both names appear
- [ ] Verify total amount is correct
- [ ] Print or download

---

## 🎓 Quick Tips

1. **Only one member record per couple** - Don't create separate records
2. **Either spouse name works** - Can select John or Jane when recording
3. **Spouse field is optional** - Single members work as before
4. **Full amount in one record** - Don't split the offering between records
5. **Automatic on statements** - Names appear automatically if marked as joint

---

## 🆘 Common Scenarios

### Scenario 1: Check in One Name, From Couple
**Solution**:
1. Record under that member (John or Jane)
2. Add spouse name in member record
3. Mark Joint Account: Yes
4. Statement shows both names

### Scenario 2: Couple Gives Separate Checks
**Solution**:
1. Create two separate member records (if both members)
2. Record each offering separately
3. Each gets own annual statement
4. No Joint Account flag needed

### Scenario 3: New Couple Joining
**Solution**:
1. Add as new member with spouse info
2. Spouse Name field filled in
3. Joint Account: Yes
4. Ready to record offerings

### Scenario 4: Existing Member Gets Married
**Solution**:
1. Edit existing member
2. Add spouse name
3. Select Joint Account: Yes
4. Future statements show both names

---

## 📞 Quick Reference Card

| Action | Location | New Field? | Result |
|--------|----------|-----------|--------|
| Add couple member | Members → Add | Yes: Spouse fields | Creates joint account |
| Record offering | Collection Entry | No | Same as always |
| Generate PDF | Reports → PDF | No | Both names on statement |
| View members | Members list | Maybe | Shows spouse if exists |
| Edit couple info | Members → Edit | Yes: Spouse fields | Updates spouse data |

---

## 🎯 Success Indicators

✅ Form shows spouse fields
✅ Spouse data saves to database
✅ PDF shows "Dear John and Jane,"
✅ PDF shows "John & Jane Smith"
✅ Single members unchanged
✅ No errors in console
✅ Professional PDF appearance

---

**Version**: 1.0
**Date**: April 5, 2026
**Status**: Ready for Use

