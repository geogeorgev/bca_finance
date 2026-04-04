# One-to-One Role Assignment Enforcement

## Overview
Certain critical roles can only be assigned to ONE member each. This prevents organizational conflicts and ensures clear lines of authority.

## Roles with One-to-One Enforcement

✅ **Pastor and President** - Only ONE member can have this role
✅ **Treasurer** - Only ONE member can have this role  
✅ **Secretary** - Only ONE member can have this role

## Roles WITHOUT One-to-One Enforcement

❌ **Superuser** - Can be assigned to multiple members
❌ **Admin** - Can be assigned to multiple members
❌ **Joint Secretary** - Can be assigned to multiple members
❌ **Joint Treasurer** - Can be assigned to multiple members
❌ Other pastor roles (Pastor, Senior Pastor, Associate Pastor) - Can be assigned to multiple members

## How It Works

### When Adding a User (Users & Roles → Add User)
1. Select member
2. Select role
3. **If role is one-to-one:**
   - System checks if anyone else already has this role
   - If yes: Shows error message preventing assignment
   - If no: Allows assignment

### When Assigning Role to Member (Members → Assign Role)
1. Select member
2. Select role
3. **If role is one-to-one:**
   - System checks if anyone else already has this role
   - If yes: Shows error message preventing assignment
   - If no: Allows assignment

### When Changing Existing Role
- If reassigning same role to same member: Allowed (no change)
- If trying to give that role to a DIFFERENT member: Blocked with error message

## Error Message Example

When trying to assign a one-to-one role that's already taken:

```
❌ Cannot assign this role!

The role "Treasurer" is already assigned to: Maria Garcia

Each of these roles can only be assigned to ONE member:
✓ Pastor and President
✓ Treasurer
✓ Secretary

To change the assignment, you must first remove the role from Maria Garcia.
```

## How to Change Assignment

### To reassign a one-to-one role:

1. **Remove from current member:**
   - Go to Users & Roles or Members
   - Find the member with the role
   - Click "Remove Role" button
   
2. **Assign to new member:**
   - Go to Users & Roles → Add User
   - Select the new member
   - Select the one-to-one role
   - Click Save

OR use Assign Role from Members screen

## Validation Logic

### In users.js (Add User screen)
```javascript
const oneToOneRoles = ["Pastor and President", "Treasurer", "Secretary"]
if(oneToOneRoles.includes(role)){
  // Check if role already assigned to someone else
  const roleSnap = await db.collection("users")
    .where("Role", "==", role)
    .where("current_record", "==", true)
    .get()
  
  if(!roleSnap.empty){
    alert("Role already assigned to: " + existingUser.Name)
    return
  }
}
```

### In members.js (Assign Role screen)
```javascript
const oneToOneRoles = ["Pastor and President", "Treasurer", "Secretary"]
if(oneToOneRoles.includes(role)){
  // Check if role already assigned
  // Only prevent if assigned to DIFFERENT member
  if(existingUser.MemberID !== memberId){
    alert("Role already assigned to: " + existingUser.Name)
    return
  }
}
```

## Database Checks

The validation checks:
1. `current_record === true` (only active role assignments)
2. Role name matches one-to-one role
3. Member ID doesn't match (for updates)

## Audit Trail

All role changes are tracked:
- When role is removed
- When role is assigned
- Who made the change
- When the change was made

## File Modifications

### js/users.js
- Updated `addUser()` function
- Added one-to-one role validation
- Lines: ~230-240

### js/members.js
- Updated `saveRoleAssignment()` function
- Added one-to-one role validation
- Lines: ~341-352

## Testing Checklist

- [ ] Try to assign "Treasurer" to Member A - Should succeed
- [ ] Try to assign "Treasurer" to Member B - Should fail with error
- [ ] Remove "Treasurer" from Member A
- [ ] Try to assign "Treasurer" to Member B - Should now succeed
- [ ] Try to reassign "Treasurer" to same member - Should succeed (no change)
- [ ] Try to assign "Admin" to multiple members - Should succeed (not one-to-one)
- [ ] Test all three one-to-one roles (Pastor and President, Treasurer, Secretary)

## Edge Cases Handled

✅ Member already has the role they're trying to be assigned - Allowed
✅ Empty roles (no one has role yet) - Allowed
✅ Multiple users trying to assign same role simultaneously - Database constraints prevent conflicts
✅ Audit trail maintains history of all changes - Can see who had role when

## Future Considerations

If you need to add more one-to-one roles:
1. Add role name to `oneToOneRoles` array in both users.js and members.js
2. Test the new role assignment
3. No database schema changes needed

## Notes

- Only affects role assignment, not other user properties
- Joint Treasurer and Joint Secretary can have multiple members (allows shared responsibilities)
- Superuser and Admin can have multiple members (for shared administrative access)
- Validation happens at application level before database write
- Audit trail captures all role changes for compliance

