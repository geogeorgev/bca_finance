# Register Participant Screen - Reorganization Complete ✅

## Changes Made

### Form Order Updated
The Register Participant form has been reorganized for better UX:

```
NEW FORM ORDER:
1. Participant Name
2. Guardian Type (Member/Non-Member) ← MOVED UP
3. Guardian Selection (dropdown or text input)
4. Address ← Auto-loaded from member if member selected
5. Phone Number ← Auto-loaded from member if member selected
6. Emergency Contact
7. Contribution Amount
8. Record as Income checkbox
9. Food Coupons
```

### Key Features

#### 1. Guardian Type Right After Participant Name
- Dropdown with "Member" or "Non-Member" options
- Determines what fields appear below

#### 2. Auto-Load Member Data
**When "Member" is selected:**
- Shows member dropdown
- When member is selected, auto-loads:
  - Address from Members.Address
  - Phone from Members.Phone
- Fields are pre-populated and editable

**When "Non-Member" is selected:**
- Shows text input for guardian name
- Address and phone fields are blank (user enters manually)

#### 3. Functions Added

```javascript
toggleGuardianFieldAndLoadData()
├─ Toggles member/non-member field display
├─ Clears address/phone when switching to non-member
└─ Called on Guardian Type change

loadMemberAddressPhone()
├─ Gets selected member ID
├─ Fetches member data from Members collection
├─ Loads Address and Phone into form fields
└─ Called when member is selected
```

---

## Data Flow

### When Member Guardian Selected

```
Form Load:
1. User selects Guardian Type: "Member"
   ↓
2. Member dropdown appears
   ↓
3. User selects member from dropdown
   ↓
4. loadMemberAddressPhone() called
   ↓
5. Fetches member from Firebase Members collection
   ↓
6. Auto-fills:
   ├─ Address field ← from Members.Address
   ├─ Phone field ← from Members.Phone
   └─ User can edit if needed
   ↓
7. User enters:
   ├─ Contribution
   └─ Emergency Contact
   ↓
8. Click "Register Participant"
   ↓
Saves to eventRegistrations:
├─ name: Participant Name
├─ address: Member's address (or edited)
├─ phone: Member's phone (or edited)
├─ guardian: Member name
├─ guardianType: "member"
├─ guardianMemberId: Member ID
└─ ...other fields
```

### When Non-Member Guardian Selected

```
Form Load:
1. User selects Guardian Type: "Non-Member"
   ↓
2. Guardian name text input appears
   ↓
3. Address and Phone fields cleared
   ↓
4. User enters:
   ├─ Guardian Name
   ├─ Address
   ├─ Phone
   └─ Emergency Contact
   ↓
5. Click "Register Participant"
   ↓
Saves to eventRegistrations:
├─ name: Participant Name
├─ address: User-entered address
├─ phone: User-entered phone
├─ guardian: Guardian name (text)
├─ guardianType: "nonmember"
├─ guardianMemberId: null
└─ ...other fields
```

---

## Database Impact

### Data Saved to eventRegistrations

**For Member Guardian:**
```json
{
  "name": "Jane Doe",
  "address": "123 Main St",        ← From member
  "phone": "555-1234",             ← From member
  "guardian": "John Doe",
  "guardianType": "member",
  "guardianMemberId": "mem_abc123",
  "guardianMemberName": "John Doe",
  "emergencyContact": "9876543210"
}
```

**For Non-Member Guardian:**
```json
{
  "name": "Tom Smith",
  "address": "456 Oak Ave",        ← User entered
  "phone": "555-5678",             ← User entered
  "guardian": "Jane Smith",
  "guardianType": "nonmember",
  "guardianMemberId": null,
  "guardianMemberName": null,
  "emergencyContact": "5551111111"
}
```

---

## User Experience

### Before
```
Form Order:
1. Participant Name
2. Address (must enter manually)
3. Phone (must enter manually)
4. Guardian Type
5. Guardian Selection
...

❌ Guardian type comes after address/phone
❌ Must manually enter address/phone
```

### After
```
Form Order:
1. Participant Name
2. Guardian Type ← FIRST DECISION
3. Guardian Selection
4. Address ← Auto-filled if member
5. Phone ← Auto-filled if member
...

✅ Guardian type comes first
✅ Address/phone auto-loaded from member
✅ Clearer flow
```

---

## Testing Checklist

- [ ] Open Register Participant form
- [ ] Fill Participant Name: "Jane Doe"
- [ ] Guardian Type: Select "Member"
  - [ ] Member dropdown appears
  - [ ] Non-member input hidden
- [ ] Select member from dropdown: "John Doe"
  - [ ] Address field auto-fills ✓
  - [ ] Phone field auto-fills ✓
- [ ] Verify fields are editable (can change if needed)
- [ ] Fill Emergency Contact
- [ ] Enter Contribution
- [ ] Click "Register"
  - [ ] Participant saved with member's address/phone ✓
  - [ ] Member linked ✓
  - [ ] TotalContribution updated ✓

### Test Non-Member Flow

- [ ] Open Register Participant form
- [ ] Fill Participant Name: "Tom Smith"
- [ ] Guardian Type: Select "Non-Member"
  - [ ] Non-member text input appears
  - [ ] Member dropdown hidden
  - [ ] Address/Phone fields cleared
- [ ] Fill Guardian Name: "Jane Smith"
- [ ] Fill Address: "456 Oak Ave"
- [ ] Fill Phone: "555-5678"
- [ ] Click "Register"
  - [ ] Participant saved with entered data ✓
  - [ ] No member linked ✓

---

## Code Changes

### File: events.js

**Functions Updated:**
1. `showRegisterParticipant()` - Reorganized form layout
2. `toggleGuardianFieldAndLoadData()` - NEW, replaces old toggleGuardianField()
3. `loadMemberAddressPhone()` - NEW, loads member data

**Key Improvements:**
- Form order optimized
- Auto-load reduces manual entry
- Clear separation of member vs non-member flow
- Editable fields allow overrides if needed

---

## Benefits

✅ **Better UX** - Guardian type selected first
✅ **Less Data Entry** - Address/phone auto-loaded for members
✅ **Flexible** - Fields are editable if user wants to change
✅ **Clear Flow** - Member vs non-member clearly distinguished
✅ **Accurate Data** - Uses real member data when available
✅ **Time Saving** - No need to manually type member info

---

## How Member Data is Used

### In eventRegistrations
- Address and Phone from member are stored
- Participant can be registered with member's known information
- Data can be edited if participant lives elsewhere

### In Members Collection
- Member's TotalContribution still updated
- Address and Phone unchanged in member record
- Used only for convenience in registration

### In Income
- Links to member when member guardian
- Guardian info included in memo
- Tax tracking works as before

---

## Next Steps

1. Test the form with member and non-member guardians
2. Verify address/phone auto-load works
3. Confirm data saves correctly
4. Check member TotalContribution updates
5. Use for all new event registrations

---

## Support

If address/phone fields don't auto-load:
- Verify Members collection has Address and Phone fields
- Check that selected member has data in these fields
- Try selecting different member to test

If form doesn't toggle correctly:
- Clear browser cache
- Reload the page
- Try selecting different Guardian Type

---

## Summary

The Register Participant screen is now optimized with:
✅ Guardian Type selector right after Participant Name
✅ Auto-loading of member address/phone from Members collection
✅ Clear member vs non-member workflow
✅ Time-saving automation with editable override option
✅ Complete data tracking for all scenarios

**Ready to use! 🚀**

