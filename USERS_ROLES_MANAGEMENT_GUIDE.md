# Users & Roles Management System

## Overview

A complete user management system for managing app access and assigning roles to staff members. Links to the members collection for optional member-user relationships.

---

## Collection Structure

### users Collection

```javascript
{
  Name: "John Doe",
  Email: "john@example.com",
  Role: "Treasurer",
  MemberID: "mem_abc123" (optional, links to members collection),
  MemberName: "John Doe" (denormalized for quick access),
  Active: true,
  CreatedDate: Timestamp
}
```

---

## Available Roles

| Role | Access Level | Responsibilities |
|------|---|---|
| **Superuser** | Full Access | Complete system control, can manage users, all features |
| **Admin** | Manage All | Manage members, budgets, events, reports |
| **Treasurer** | Finance | Manage expenses, income, budget, financial reports |
| **Secretary** | Records | Manage member records, events, documentation |
| **Joint Secretary** | Records | Secondary secretary access |
| **Joint Treasurer** | Finance | Secondary treasurer access |

---

## Features

### ✅ Add User
- Create new user with name, email, role
- Optional link to existing member
- Set active status
- Email validation (no duplicates)

### ✅ Edit User
- Update user details
- Change role assignment
- Update member link
- Change active status

### ✅ Delete User
- Remove user from system
- Confirmation required

### ✅ View All Users
- List all users with role color coding
- Search/filter by name or email
- Show member link status
- Show active/inactive status

### ✅ Link to Members
- Optional connection to members collection
- Auto-populate member name
- Can unlink at any time
- Helps identify which users are also members

---

## Role Color Coding

```
Superuser:       🔴 Red (#d32f2f)
Admin:           🟠 Orange (#f57c00)
Treasurer:       🟢 Green (#388e3c)
Secretary:       🔵 Blue (#1976d2)
Joint Secretary: 🟣 Purple (#7b1fa2)
Joint Treasurer: 🩷 Pink (#c2185b)
```

---

## Use Cases

### Scenario 1: Create Staff User (Not a Member)

```
Use Case: New volunteer staff joins to help with finances

1. Go to Users & Roles
2. Click "Add User"
3. Name: Jane Smith
4. Email: jane@church.org
5. Role: Treasurer
6. Member Link: -- Not Linked --
7. Status: Active
8. Save

Result:
├─ User created with email jane@church.org
├─ Role set to Treasurer
├─ Can log in and access finance features
└─ Not linked to any member record
```

### Scenario 2: Create User Linked to Member

```
Use Case: Church member becomes treasurer

1. Go to Users & Roles
2. Click "Add User"
3. Name: John Doe
4. Email: john@church.org
5. Role: Treasurer
6. Member Link: [Select "John Doe" from members list]
7. Status: Active
8. Save

Result:
├─ User created with email john@church.org
├─ Role set to Treasurer
├─ Linked to member "John Doe"
├─ User can log in
└─ Member record updated with this link
```

### Scenario 3: Manage Multiple Roles

```
Use Case: Organization has different people managing different areas

Users Created:
1. John Doe - Treasurer (Finance)
2. Jane Smith - Secretary (Records)
3. Bob Johnson - Admin (Overall)
4. Sarah Lee - Joint Treasurer (Finance)
5. Mike Brown - Joint Secretary (Records)

Each has appropriate access to their area
```

---

## Database Schema

### users Collection

**Collection Name:** `users`

**Fields:**
```
Field              | Type      | Required | Notes
---|---|---|---
Name               | String    | Yes      | User full name
Email              | String    | Yes      | Unique email for login
Role               | String    | Yes      | One of 6 roles
MemberID           | String    | No       | Reference to members doc ID
MemberName         | String    | No       | Member name (denormalized)
Active             | Boolean   | Yes      | User can log in if true
CreatedDate        | Timestamp | Auto     | When user was created
```

---

## User Management Screen

### Main View
```
Users & Roles
[Add User]

Search: [_______]

┌────────────────────────────────────────┐
│ John Doe                               │
│ Email: john@church.org                 │
│ Role: 🟢 Treasurer                     │
│ Member Linked: ✓ Yes                   │
│ Status: Active                         │
│ [Edit] [Delete]                        │
├────────────────────────────────────────┤
│ Jane Smith                             │
│ Email: jane@church.org                 │
│ Role: 🔵 Secretary                     │
│ Member Linked: ✗ No                    │
│ Status: Active                         │
│ [Edit] [Delete]                        │
└────────────────────────────────────────┘
```

### Add/Edit Form
```
Name: [_______________________]
Email: [_______________________]

Role: [▼ Select Role]
  - Superuser (Full Access)
  - Admin (Manage All)
  - Treasurer (Finance)
  - Secretary (Records)
  - Joint Secretary (Records)
  - Joint Treasurer (Finance)

Member Link: [▼ -- Not Linked --]
  Shows: List of existing members

Status: [▼ Active / Inactive]

[Save User] [Cancel]
```

---

## API Functions

### loadUsers()
- Load and display all users
- Show with role colors
- Enable search

### showAddUser()
- Display add user form
- Populate member dropdown

### addUser()
- Validate input
- Check email uniqueness
- Save to database
- Update member name if linked

### editUser(id)
- Load user data
- Show edit form
- Populate member dropdown

### updateUser(id)
- Validate input
- Check email uniqueness (if changed)
- Update database
- Update member name if linked

### deleteUser(id, name)
- Confirm deletion
- Remove from database
- Refresh list

### filterUsers()
- Search by name or email
- Real-time filtering

---

## Email Validation

**Unique Email Check:**
- When adding: Verify email doesn't exist
- When editing: Allow same email, check for duplicates only if changed
- Prevents multiple users with same email

```javascript
// Check for duplicate email
const existingSnap = await db.collection("users")
  .where("Email", "==", email)
  .get()

if(!existingSnap.empty){
  alert("Email already in use")
  return
}
```

---

## Member Linking

### Benefits
- Track which staff are also members
- Easy identification
- Linked member data available
- Can assign roles to members

### How It Works
```
1. User selects member from dropdown
2. Member ID stored in users.MemberID
3. Member name stored in users.MemberName (denormalized)
4. Can unlink by selecting "-- Not Linked --"
```

### Queries
```javascript
// Find all users linked to a member
const linkedUsers = await db.collection("users")
  .where("MemberID", "==", memberId)
  .get()

// Find user by email
const userSnap = await db.collection("users")
  .where("Email", "==", email)
  .get()

// Find all active Treasurers
const treasurers = await db.collection("users")
  .where("Role", "==", "Treasurer")
  .where("Active", "==", true)
  .get()
```

---

## Role-Based Access Control (Ready for Implementation)

### Can Be Used For:
- Dashboard: Show relevant sections by role
- Expense: Only Treasurer/Admin can approve
- Income: Only Treasurer can reconcile
- Members: Only Secretary/Admin can edit
- Reports: Only appropriate roles can view financial reports

### Implementation Example:
```javascript
// In future, add role checks:
if(currentUser.role !== "Treasurer" && currentUser.role !== "Superuser"){
  alert("Only Treasurer can access this")
  return
}
```

---

## Security Considerations

### Email Unique Constraint
- Prevents duplicate logins
- Enforced at application level
- Should add to Firebase rules

### Role Assignment
- Only admins should be able to change roles
- Currently, anyone can manage users
- Should implement role-based access control

### Member Linking
- Optional, doesn't restrict access
- For organizational purposes
- Helps manage member vs. staff distinction

---

## Future Enhancements

### Phase 1 (Current):
- ✅ User management UI
- ✅ Role assignment
- ✅ Member linking

### Phase 2 (Recommended):
- [ ] Authentication integration
- [ ] Role-based access control
- [ ] Activity logging
- [ ] Permission hierarchy

### Phase 3 (Advanced):
- [ ] Two-factor authentication
- [ ] Password reset via email
- [ ] Role expiration
- [ ] Audit trail

---

## Integration with Members Collection

### One-to-Many Relationship:
```
Member (One)
└── User (Zero to Many)

Example:
John Doe (Member)
├── john@church.org (User - Treasurer)
└── john.backup@church.org (User - Joint Treasurer)
```

### How It Works:
1. User table has optional MemberID
2. Points to member's Firestore document ID
3. Member data can be accessed via MemberID
4. Multiple users can link to same member (but shouldn't in practice)

---

## Database Setup

### Create users Collection (Firebase Console)

1. Firestore Database → Collections
2. Click "Create Collection"
3. Collection ID: `users`
4. First Document: (Add manually or through app)

### Add to Security Rules

```
match /users/{document=**} {
  allow read, write: if request.auth != null;
}
```

---

## Usage in App

### Add to Navigation

Update index.html or navigation menu:
```html
<button onclick="loadUsers()">Users & Roles</button>
```

### Access Function

```javascript
// Call from menu or button
loadUsers()
```

---

## Complete Workflow

### Adding Admin Staff

```
1. New admin joins
2. Go to Users & Roles
3. Add User:
   - Name: Bob Admin
   - Email: bob@church.org
   - Role: Admin
   - Member Link: Optional
   - Status: Active
4. Bob can now log in with bob@church.org
5. Bob has full admin access
```

### Adding Member as Treasurer

```
1. Member joins finance team
2. Go to Users & Roles
3. Add User:
   - Name: John Doe
   - Email: john@church.org
   - Role: Treasurer
   - Member Link: Select "John Doe" member
   - Status: Active
4. John can log in and manage finances
5. John is linked to member record
6. Can track both member contributions and staff role
```

---

## Ready to Use!

The users & roles system is complete and ready for:
✅ Managing app access
✅ Assigning roles to staff
✅ Linking users to members
✅ Organizing team structure
✅ Flexible role management

**No additional setup required - just start using!** 🚀

