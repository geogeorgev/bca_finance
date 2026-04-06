# Handling Couple/Spouse Offerings - System Guide

## Problem Statement
When married couples give offerings, the check might be:
- In the husband's name only
- In the wife's name only
- In both names (e.g., "John & Jane Smith")

Current system requires selecting a single member, which doesn't capture joint offerings properly.

## Solution Options

### Option 1: Link Spouse to Existing Member (RECOMMENDED)
**Best for**: Most churches, maintains one-to-one relationship

**How it works**:
1. Add a "Spouse" field to member record
2. When recording offering, if payment is from couple, enter it under primary member
3. Both spouses' annual statements will show the combined offering
4. Need to modify:
   - Member form (add spouse field)
   - Income entry (note if joint offering)
   - Annual statement (show if offering is joint)

**Pros**:
- Maintains clean member structure
- Simple to implement
- One statement per couple
- Easy to track spouse relationship

**Cons**:
- Requires spouse to also be a member
- Need to modify database schema

### Option 2: Use "Memo" Field for Spouse Name (SIMPLEST)
**Best for**: Quick implementation, minimal changes

**How it works**:
1. Keep current member-based system
2. In income collection, add note in memo: "Joint with [Spouse Name]"
3. When generating annual statement, check memo for spouse
4. Display on statement as: "Member Name & [Spouse Name]"

**Pros**:
- No database changes needed
- Works immediately
- Flexible
- Easy to track

**Cons**:
- Spouse doesn't get individual statement
- Manual tracking
- Memo field used for tracking

### Option 3: Create "Family" or "Household" Account
**Best for**: Larger families, complex setups

**How it works**:
1. Create a "Household" or "Family" member record
2. Link individual members (spouse1, spouse2, children)
3. Offerings recorded at household level
4. Annual statement shows all household members

**Pros**:
- Comprehensive
- Can handle families with multiple members
- Professional approach

**Cons**:
- Major database restructuring
- Complex implementation
- More coding required

---

## RECOMMENDED APPROACH: Option 1 + Option 2 Hybrid

**Implementation**:
1. Add "Spouse" field to member record (optional)
2. Allow noting joint offerings in memo/notes
3. Update annual statement to show spouse info if present
4. Display on statement: "John Smith & Jane Smith" or "John Smith (with spouse Jane)"

---

## Implementation Steps

### Step 1: Modify Member Record

Add to member document in Firestore:
```javascript
{
  Name: "John Smith",
  Phone: "617-123-4567",
  Email: "john@example.com",
  Address1: "123 Main St",
  Address2: "Boston, MA 02101",
  Active: true,
  Spouse: {                    // NEW FIELD
    Name: "Jane Smith",
    Active: true
  },
  IsJointAccount: true         // NEW FIELD - marks this as joint
}
```

### Step 2: Update Member Form

Add spouse fields to the edit member form.

### Step 3: Update Income Entry

When recording an offering, include option to mark as "Joint with spouse" or note spouse name.

### Step 4: Update Annual Statement

Modify statement to show:
- "John Smith & Jane Smith" if joint account
- "John Smith (with spouse Jane)" if spouse field filled
- Track joint offerings

---

## Database Structure Updates

### Current Members Collection
```
members/
  ├── doc1/
  │   ├── Name: "John Smith"
  │   ├── Phone: "617-123-4567"
  │   ├── Email: "john@example.com"
  │   ├── Address1: "123 Main St"
  │   ├── Address2: "Boston, MA 02101"
  │   ├── Active: true
```

### Updated Members Collection (With Spouse Support)
```
members/
  ├── doc1/
  │   ├── Name: "John Smith"
  │   ├── Phone: "617-123-4567"
  │   ├── Email: "john@example.com"
  │   ├── Address1: "123 Main St"
  │   ├── Address2: "Boston, MA 02101"
  │   ├── Active: true
  │   ├── Spouse: {                    ✅ NEW
  │   │   ├── Name: "Jane Smith"
  │   │   ├── Email: "jane@example.com"
  │   │   ├── Active: true
  │   │ }
  │   ├── IsJointAccount: true         ✅ NEW (marks as joint)
```

### Income Entry (Optional Enhancement)
```
income/
  ├── doc1/
  │   ├── MemberID: "john_smith_123"
  │   ├── Amount: 100
  │   ├── CollectionDate: "2026-04-05"
  │   ├── Purpose: "Offering-Common"
  │   ├── Type: "Check"
  │   ├── Memo: "Joint offering from John & Jane"
  │   ├── IsJointOffering: true        ✅ OPTIONAL
  │   ├── SpouseNames: ["Jane Smith"]  ✅ OPTIONAL
```

---

## Annual Statement Display Options

### Option A: Combined Names
```
Dear John and Jane,

We are grateful for your faithful support...

RECIPIENT ORGANIZATION's Name & Address
The Boston Christian Assembly
26 Wellesley Road, Natick, MA 01760

1. Total Tax Deductible Contributions: $1,342.00
2. Year: 2026
3. Annual Contribution Record: $1,342.00

Prepared by
[Treasurer Name]
Boston Christian Assembly
```

### Option B: Separate Line
```
Donor's Name (First, Middle, Last):
John Smith & Jane Smith
```

### Option C: With Notation
```
Donor's Name (First, Middle, Last):
John Smith (and spouse Jane Smith)
```

---

## Code Changes Needed

### 1. Member Form (members.js)

Add spouse section to edit form:
```javascript
// In editMember() function, add:

Spouse Name<br>
<input id="spouseName" value="${m.Spouse?.Name || ''}"><br><br>

Spouse Email<br>
<input id="spouseEmail" value="${m.Spouse?.Email || ''}"><br><br>

Joint Account
<select id="isJoint">
<option value="false" ${!m.IsJointAccount ? 'selected':''}>No</option>
<option value="true" ${m.IsJointAccount ? 'selected':''}>Yes</option>
</select>
```

### 2. Update Member Function (members.js)

```javascript
async function updateMember(id){
  const spouse = document.getElementById("spouseName").value ? {
    Name: document.getElementById("spouseName").value,
    Email: document.getElementById("spouseEmail").value,
    Active: true
  } : null

  await db.collection("members").doc(id).update({
    Name: document.getElementById("name").value,
    Phone: document.getElementById("phone").value,
    Email: document.getElementById("email").value,
    Address1: document.getElementById("addr1").value,
    Address2: document.getElementById("addr2").value,
    Address3: document.getElementById("addr3").value,
    Spouse: spouse,
    IsJointAccount: document.getElementById("isJoint").value === "true",
    Active: document.getElementById("active").value === "true"
  })
}
```

### 3. Annual Statement (reports.js)

Update the member name display:
```javascript
// In generateSingleMemberStatement() function:

// Get member data
const memberDoc = await db.collection("members").doc(memberId).get()
const member = memberDoc.data()

// Determine display name
let displayName = member.Name
if(member.IsJointAccount && member.Spouse?.Name) {
  displayName = `${member.Name} and ${member.Spouse.Name}`
}

// Use displayName in PDF:
pdf.text("Dear " + displayName.split(" ")[0] + " and " + (member.Spouse?.Name?.split(" ")[0] || ""), 20, yPosition)

// In donor name section:
pdf.text(displayName, tableStartX + 2, tableStartY + 64)
```

### 4. Income Entry Enhancement (Optional)

Add note to memo field about joint offerings:
```javascript
// In addIncome() function, add option for joint:

<label>Joint Offering</label>
<select id="isJointOffering">
<option value="false">Single</option>
<option value="true">Joint with Spouse</option>
</select>

// When saving:
const isJoint = document.getElementById("isJointOffering").value === "true"
const member = /* get member data */
let memo = document.getElementById("memo").value

if(isJoint && member.Spouse?.Name) {
  memo += ` [Joint offering from ${member.Name} & ${member.Spouse.Name}]`
}
```

---

## Tracking & Reporting

### Query Joint Offerings
```javascript
// Get all joint offerings for a member
const snap = await db.collection("income")
  .where("MemberID", "==", memberId)
  .where("IsJointOffering", "==", true)
  .orderBy("CollectionDate")
  .get()
```

### Annual Statement Report
```javascript
// In annual statement, show:
Total Individual Offerings: $500
Total Joint Offerings: $342
Total: $842
```

---

## Migration Guide (If Updating Existing Database)

### Step 1: Backup Database
```bash
# Backup all members collection
# Backup all income collection
```

### Step 2: Add Fields to Existing Members
```javascript
// For members currently married, add spouse info:
// This can be done manually or via script

async function addSpouseToMembers() {
  const knownCouples = [
    { memberId: "john123", spouseName: "Jane Smith" },
    { memberId: "bob456", spouseName: "Susan Jones" }
  ]

  for(const couple of knownCouples) {
    await db.collection("members").doc(couple.memberId).update({
      Spouse: {
        Name: couple.spouseName,
        Active: true
      },
      IsJointAccount: true
    })
  }
}
```

### Step 3: Update Historical Data (Optional)
```javascript
// If memos contain spouse names, extract them:

async function migrateSpouseFromMemo() {
  const snap = await db.collection("income").get()
  
  for(const doc of snap.docs) {
    const data = doc.data()
    if(data.Memo && data.Memo.includes("&")) {
      // Extract spouse name from memo
      // Update member record if spouse info missing
    }
  }
}
```

---

## Example Workflow

### Recording a Couple's Offering

1. **Collection Entry**:
   - Contributor Type: Member
   - Member: John Smith (or Jane Smith)
   - Purpose: Offering - Common
   - Amount: $100
   - Check Number: 1234
   - **Notes**: "Joint offering from John & Jane" or select "Joint with Spouse"

2. **System Processing**:
   - Records under John Smith's account
   - Notes that it's joint
   - Marks Spouse field: Jane Smith

3. **Annual Statement**:
   - Generates for "John Smith and Jane Smith"
   - Shows total contribution: $100
   - Shows offering as joint

---

## Best Practices

✅ **Do**:
- Add spouse info when first available
- Use consistent naming (full first and last names)
- Mark joint account flag clearly
- Track joint vs individual offerings
- Include spouse in salutation of annual statement

❌ **Don't**:
- Create separate member records for spouses (unless they give separately)
- Duplicate offerings between spouse records
- Leave spouse field blank if spouse is active member
- Assume check is for one person - ask during collection

---

## FAQ

**Q: What if only one spouse wants a statement?**
A: Generate for the primary member, note spouse in memo. Can create separate statements if needed.

**Q: What if they divorce?**
A: Update spouse field to null or remove. Historical records preserved.

**Q: What if both spouses want individual statements?**
A: Create separate member accounts for each, track joint offerings separately.

**Q: How do we handle children in household?**
A: Currently unsupported. Would require "Household" structure (Option 3).

---

## Next Steps

1. ✅ Decide on implementation approach (Hybrid Option 1+2 recommended)
2. ☐ Modify member form to add spouse fields
3. ☐ Update member update function
4. ☐ Modify income entry form (optional)
5. ☐ Update annual statement display
6. ☐ Test with sample couple offering
7. ☐ Migrate existing couples' data
8. ☐ Train treasurer on new process

---

## Summary

**Recommended Solution**: Add optional Spouse field to member record + use memo for tracking joint offerings.

**Benefits**:
- Minimal code changes
- No major database restructuring
- Flexible and adaptable
- Clear tracking of joint offerings
- Professional annual statements for couples

**Implementation Time**: 2-3 hours
**Complexity**: Low to Medium
**Cost**: Free (in-house development)

