# Pastor and Treasurer Names Auto-Population Implementation

## Summary
The Annual Contribution Receipt PDF now automatically populates with the actual names of the "Pastor and President" and "Treasurer" from the system instead of displaying blank signature lines.

## Changes Made

### 1. New Helper Function Added
**Function:** `getPastorAndTreasurerNames()`
- **Location:** `js/reports.js` (line 1402)
- **Purpose:** Fetches the names of users with roles "Pastor and President" and "Treasurer"
- **Returns:** Object with `pastorAndPresident` and `treasurer` names
- **Fallback:** If roles not found, returns placeholder lines: `"____________________"`

### 2. Updated `generateSingleMemberStatement()` 
**Changes:**
- Added call to `getPastorAndTreasurerNames()` before PDF generation
- Uses fetched names instead of hardcoded titles "Pastor and President" and "Treasurer"
- Names now display below signature lines in the PDF

### 3. Updated `generateAllMembersStatement()`
**Changes:**
- Added call to `getPastorAndTreasurerNames()` inside the loop for each member
- Each member's PDF gets the current pastor and treasurer names
- Names now display below signature lines in the PDF

## How It Works

### Database Integration
1. System queries the `users` collection for active records (`current_record === true`)
2. Searches for users with role "Pastor and President" and role "Treasurer"
3. Retrieves their names from the database
4. If roles don't exist, uses placeholder lines

### PDF Generation Flow
```
Generate PDF Request
    ↓
Fetch Member Data
    ↓
Fetch Income Data
    ↓
Fetch Pastor and Treasurer Names ← NEW
    ↓
Create PDF with Names
    ↓
Download PDF
```

## PDF Signature Section

### Before:
```
____________________          ____________________
Pastor and President           Treasurer
```

### After:
```
____________________          ____________________
[Actual Name]                  [Actual Name]
```

Example:
```
____________________          ____________________
John Smith                     Maria Garcia
```

## User Setup

For the names to auto-populate:

1. **Assign "Pastor and President" Role:**
   - Go to Users & Roles → Add User
   - Select a member
   - Select role: "Pastor and President"
   - Click Save

2. **Assign "Treasurer" Role:**
   - Go to Users & Roles → Add User
   - Select a member
   - Select role: "Treasurer"
   - Click Save

Once assigned, all generated PDFs will automatically include these names.

## Features

✅ **Automatic:** Names are fetched from database each time PDF is generated
✅ **Dynamic:** If roles change, new PDFs reflect the updates
✅ **Error Handling:** Falls back to placeholder lines if roles aren't set
✅ **Batch Support:** Works for both single member and all members PDF generation
✅ **Audit Trail:** Uses current active users (current_record = true)

## Technical Details

### Function Signature
```javascript
async function getPastorAndTreasurerNames(){
  // Returns: { pastorAndPresident: string, treasurer: string }
}
```

### Database Query
```javascript
db.collection("users")
  .where("current_record", "==", true)
  .get()
```

### Default Fallback
If no users with these roles exist:
- pastorAndPresident: `"____________________"`
- treasurer: `"____________________"`

## Error Handling

- If database query fails: Gracefully returns placeholder lines
- If multiple users have same role: Uses the last matching user
- If no user has a role: Shows placeholder line for that position

## Testing

To verify the implementation:

1. Assign "Pastor and President" role to a member (e.g., "John Smith")
2. Assign "Treasurer" role to another member (e.g., "Maria Garcia")
3. Go to Reports → Annual Contribution Statement
4. Select a member and generate PDF
5. Open the PDF and check the signature lines
6. Should show:
   - Left signature: "John Smith"
   - Right signature: "Maria Garcia"

## Notes

- Names are fetched fresh each time a PDF is generated
- The system only considers current roles (`current_record = true`)
- Audit trail is automatically maintained for role changes
- If a user record is deleted/archived, a new PDF will show placeholder lines

## Files Modified

- **js/reports.js**: Added function and updated both PDF generation functions
  - Line 931: Call in `generateSingleMemberStatement()`
  - Line 1148: Call in `generateAllMembersStatement()`
  - Line 1402: New `getPastorAndTreasurerNames()` function

No changes needed to:
- HTML structure
- Database schema
- User management
- Role assignment logic

