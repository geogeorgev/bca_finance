# Fix: Firebase Undefined Value Error in Audit Trail

## Problem
**Error:** `FirebaseError: Function DocumentReference.update() called with invalid data. Unsupported field value: undefined (found in field deleted_by in document users/...)`

Firestore doesn't allow `undefined` values in documents. The error occurred when trying to save audit trail fields where the value was `undefined`.

---

## Root Cause

The issue occurred in three places:

1. **addUser()** - `auditEmail` could be `undefined` if `getCurrentUser()` returns `null` or doesn't have an `email` property
2. **updateUser()** - Same issue with `auditEmail`, plus `changes` object had `null` values which Firestore also rejects
3. **deleteUser()** - `auditEmail` could be `undefined`

**Example of problematic code:**
```javascript
const currentUser = getCurrentUser()
const auditEmail = currentUser ? currentUser.email : "system"
// If currentUser.email is undefined, auditEmail becomes undefined

await db.collection("users").add({
  created_by: auditEmail  // ❌ Could be undefined
})
```

---

## Solution

### 1. Ensure auditEmail Always Has a Value

**Changed from:**
```javascript
const auditEmail = currentUser ? currentUser.email : "system"
```

**Changed to:**
```javascript
const auditEmail = (currentUser && currentUser.email) ? currentUser.email : "system"
```

This ensures `auditEmail` is never `undefined`.

### 2. Add Fallback When Setting Fields

```javascript
created_by: auditEmail || "system"  // Double fallback
updated_by: auditEmail || "system"
deleted_by: auditEmail || "system"
```

### 3. Remove Null Values from Changes Object

**Before (problematic):**
```javascript
changes: {
  role: oldData.Role !== role ? {old: oldData.Role, new: role} : null,  // ❌ null value
  active: oldData.Active !== active ? {old: oldData.Active, new: active} : null,
  member: oldData.MemberID !== memberId ? {old: oldData.MemberID, new: memberId} : null
}
```

**After (fixed):**
```javascript
const changes = {}
if(oldData.Role !== role) changes.role = {old: oldData.Role, new: role}
if(oldData.Active !== active) changes.active = {old: oldData.Active, new: active}
if(oldData.MemberID !== memberId) changes.member = {old: oldData.MemberID, new: memberId}
// changes now only contains fields that actually changed (no null entries)
```

---

## Changes Made

### File: users.js

**1. addUser() - Lines 232-248**
- Improved auditEmail check to prevent undefined
- Added fallback `|| "system"` to all audit fields

**2. updateUser() - Lines 368-405**
- Improved auditEmail check to prevent undefined
- Rebuilt changes object to only include actual changes (no null values)
- Added fallback `|| "system"` to all audit fields

**3. deleteUser() - Lines 415-437**
- Improved auditEmail check to prevent undefined
- Added fallback `|| "system"` to audit fields

---

## Why This Matters

Firestore has strict data validation:
- ❌ `undefined` - NOT allowed
- ❌ `null` mixed with other values in same object - Can cause issues
- ✅ `null` when intentionally storing null - Allowed
- ✅ String values - Allowed
- ✅ Empty object `{}` - Allowed (just no properties)

---

## Testing

After the fix:

1. **Add User** - Should work without errors
   - Capture user email
   - Set audit fields correctly
   
2. **Update User** - Should work without errors
   - Mark old record as inactive
   - Create new record with changes tracked
   
3. **Remove User** - Should work without errors
   - Mark record as deleted
   - Set deleted_by with email or "system"

4. **Audit Trail** - Should show all changes correctly

---

## Verification

**Before Fix:**
```
❌ FirebaseError: Unsupported field value: undefined
```

**After Fix:**
```
✅ User added successfully!
✅ User updated successfully!
✅ Role removed for [Name]. Audit trail recorded.
```

---

## Summary

All audit trail fields now have guaranteed values:
- `auditEmail` is always a string (email or "system")
- `changes` object contains only actual changes (no null/undefined)
- `deleted_by`, `created_by`, `updated_by` always have values
- Firestore can now properly save all documents

---

## Prevention

Going forward, remember Firestore rules:
1. Never set fields to `undefined` - use `null` or omit the field
2. Use defensive checks: `(obj && obj.property) ? obj.property : fallback`
3. Build objects conditionally rather than with `null` values
4. Test with Firestore rules enabled to catch these errors early

