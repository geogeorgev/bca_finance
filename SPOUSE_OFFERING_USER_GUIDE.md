# Using Spouse/Couple Offering Feature - User Guide

## Overview
The BCA Finance system now supports recording and tracking offerings from married couples. When couples give offerings together, you can link the spouse to the member and track it as a joint offering.

## How It Works

### What Gets Stored
When you add or edit a member, you can now record:
- Spouse's full name
- Spouse's email (optional)
- Mark as "Joint Account" (couple offering together)

### What Gets Displayed in Annual Statement
- Salutation: "Dear John and Jane," (if joint account)
- Donor Name: "John Smith & Jane Smith" (if joint account)
- Total contribution: Shows combined amount from both names on check

## Step-by-Step: Adding a Couple

### Method 1: Add New Couple Member

1. **Go to**: Members → Add Member

2. **Enter Primary Member Info**:
   - Name: John Smith
   - Phone: 617-123-4567
   - Email: john@example.com
   - Address: 123 Main St, Boston, MA 02101

3. **Add Spouse Info**:
   - Spouse Name: Jane Smith
   - Spouse Email: jane@example.com (optional)

4. **Mark as Joint Account**: Yes

5. **Click**: Save

**Result**: System creates one member record for the couple with spouse linked.

### Method 2: Update Existing Member

1. **Go to**: Members → Find member → Click Edit

2. **Scroll to Spouse Section**:
   - Add Spouse Name: Jane Smith
   - Add Spouse Email: jane@example.com (optional)

3. **Mark Joint Account**: Yes

4. **Click**: Update

**Result**: Member record now linked to spouse.

## Recording an Offering from a Couple

### Standard Process (Same as Before)
1. **Go to**: Collection Entry
2. **Contributor Type**: Member (or Guest)
3. **Select Member**: John Smith (or Jane Smith - either works)
4. **Purpose**: Offering - Common
5. **Check Number**: 1234 (if applicable)
6. **Amount**: $100 (full amount from the check)
7. **Click**: Save Collection

**Note**: The system knows John Smith is married (joint account), so when annual statement is generated, it will show both names.

### Optional: Add Note in Memo
In the memo field, you can optionally note:
- "Joint offering from John & Jane Smith"
- "Couple's offering"
- "Check in John's name from couple"

This helps treasurer remember the context.

## Viewing in Annual Statement

### What the Couple Sees

**PDF Statement for John Smith (or Jane Smith)**:

```
Dear John and Jane,

We are grateful for your faithful support...

RECIPIENT ORGANIZATION's Name & Address
The Boston Christian Assembly
26 Wellesley Road, Natick, MA 01760

1. Total Tax Deductible Contributions: $1,000.00
2. Year: 2026
3. Annual Contribution Record: $1,000.00

Donor's Name (First, Middle, Last):
John Smith & Jane Smith

[Rest of receipt...]
```

**Key Changes**:
- ✅ Salutation includes both names
- ✅ Donor name shows both: "John Smith & Jane Smith"
- ✅ Total shows combined amount from couple
- ✅ Professional appearance for tax purposes

## Scenarios & Solutions

### Scenario 1: Check Written to "John & Jane Smith"
**What to do**:
1. Have spouse field filled in member record
2. Record offering under John Smith (or Jane)
3. Amount: Full check amount
4. Optional memo: "Joint check"

**Result**: Statement shows "John Smith & Jane Smith"

### Scenario 2: Check Written to "John Smith Only" (But From Couple)
**What to do**:
1. Have spouse field filled in
2. Record under John Smith
3. Amount: Full check amount
4. Optional memo: "Joint with Jane"

**Result**: Statement shows "John Smith & Jane Smith" - both get recognized

### Scenario 3: Separate Checks from Couple
**If they want separate recognition**:
1. John gives $50 check → Record under John
2. Jane gives $50 check → Create separate member record for Jane OR record under Jane if she's already a member
3. Each gets individual statement

### Scenario 4: Checking if Member is Married
**When editing member**:
- Look at "Joint Account" field
- If "Yes" → Member is married, spouse info is shown
- If "No" or blank → Member is single

## Best Practices

✅ **DO:**
- Add spouse name when member joins/registers
- Use full legal names for both members
- Mark "Joint Account: Yes" if couple gives together
- Include email addresses for both if available
- Be consistent with spelling (important for records)

❌ **DON'T:**
- Create separate member records for spouses (unless they give separately)
- Leave spouse field blank if you know the spouse
- Assume all couples want joint statements
- Record double amounts if couple gives one check
- Forget to mark "Joint Account" checkbox

## FAQ

**Q: What if the check is in one name but the couple gives together?**
A: Record it under that member's name, and make sure spouse field is filled. System will show both names on statement.

**Q: Do we need separate statements for husband and wife?**
A: No - one statement is generated for the couple. Both names appear on it.

**Q: What if only one spouse is a member?**
A: Fill in spouse field with spouse's name even if they're not a separate member. They'll appear on the couple's statement.

**Q: Can we have different emails for husband and wife?**
A: Yes - put the primary member's email in Email field, and spouse's email in Spouse Email field.

**Q: How does this work for tax purposes?**
A: All offerings are recorded in one member account. Annual statement shows both names, which is proper for married couples who pool finances.

**Q: What if they're not married but giving together?**
A: Use the memo field to note "Joint offering from [Person A] & [Person B]" instead of spouse field.

## Reporting & Analysis

### How to Find Couples in System
1. Go to Members
2. Look at member cards - if spouse field has data, they're a couple
3. Or filter by "Joint Account: Yes" (if added later)

### Couple's Total Contribution
**Single statement shows**:
- All offerings recorded under primary member's ID
- Includes spouse name
- Shows combined total
- Works for tax reporting

### Tracking by Individual Spouse
**Currently not tracked separately** - couple's offerings are lumped together. If you need individual tracking:
1. Create separate member records for each person
2. Record their individual offerings separately
3. Wife and husband each get their own statement

## Troubleshooting

**Problem**: Spouse name not showing on statement
- **Solution**: Make sure "Joint Account" is marked "Yes" when editing member

**Problem**: Statement shows wrong names
- **Solution**: Check spelling in member record matches what should be on statement

**Problem**: One spouse created as separate member
- **Solution**: Delete duplicate, add spouse field to primary member instead

**Problem**: Historical offering records before spouse was added
- **Solution**: Records are fine - going forward, spouse will be included when regenerating statements

## Examples

### Example 1: John & Jane Smith (Couple)
```
Member Record:
Name: John Smith
Email: john@example.com
Phone: 617-123-4567
Address: 123 Main St, Boston, MA 02101
Spouse Name: Jane Smith
Spouse Email: jane@example.com
Joint Account: Yes

Recording:
- Date: 4/5/2026
- Amount: $100
- Check: 5432
- Memo: Joint offering

Annual Statement Shows:
"Dear John and Jane,
...
Donor's Name: John Smith & Jane Smith
Amount: $100.00
...
Prepared by: [Treasurer]"
```

### Example 2: Single Member with Separate Check from Spouse
```
Member 1:
Name: Bob Johnson
Joint Account: No (single - gives separately)

Member 2:
Name: Susan Johnson
Joint Account: No (single - gives separately)

Recording 1 (Bob's check):
- Bob Johnson: $50 (check 1001)

Recording 2 (Susan's check):
- Susan Johnson: $50 (check 1002)

Result:
- Two separate annual statements
- Bob's shows: Bob Johnson - $50
- Susan's shows: Susan Johnson - $50
```

## Implementation Summary

✅ **Features Implemented**:
- Spouse name field in member record
- Spouse email field (optional)
- Joint Account flag
- Couple names on annual statement
- Spouse name in salutation
- Professional formatting for couples

✅ **Works For**:
- Adding new couple members
- Editing existing members to add spouse
- Batch PDF generation for couples
- Individual PDF generation for couples
- All offering types (check, cash, PayPal, etc.)

✅ **Documentation**:
- User guide (this document)
- System guide (HANDLING_COUPLE_SPOUSE_OFFERINGS.md)
- Code implementation details

## Next Steps

1. ✅ Update member records to add spouse info
2. ✅ Test recording couple offering
3. ✅ Generate test annual statement
4. ✅ Verify couple names appear correctly
5. ✅ Train treasury team on new feature

## Support & Questions

For questions or issues with spouse offerings:
1. Check this user guide
2. Review system documentation
3. Check member record fields are filled correctly
4. Verify "Joint Account" is marked "Yes"
5. Test with sample couple first

---

**Version**: 1.0
**Date**: April 2026
**Status**: Ready for Use

