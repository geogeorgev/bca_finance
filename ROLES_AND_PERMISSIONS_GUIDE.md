# BCA Finance - Roles & Permissions Guide

**Date:** April 4, 2026  
**Status:** ✅ COMPLETE REFERENCE

---

## Overview

BCA Finance has **6 user roles** with hierarchical permissions. Each role has specific access levels and capabilities.

---

## 🏆 Role Hierarchy

```
1. SUPERUSER (Level 10) ← Highest Authority
2. ADMIN (Level 9)
3. TREASURER (Level 8)
4. SECRETARY (Level 7)
5. JOINT SECRETARY (Level 6)
6. JOINT TREASURER (Level 5) ← Lowest Authority
```

**How It Works:**
- Higher level roles can do everything lower level roles can do
- Roles are checked by permission level (numeric)
- Superuser (10) can do everything
- Each role below has fewer permissions

---

## 📋 Role Details

### 1. SUPERUSER (Level 10) 🔴
**Authority:** Highest - Full Access

**Description:**
- Complete system control
- All features accessible
- Can manage everything

**Capabilities:**
- ✅ View Dashboard
- ✅ Manage Members (add, edit, delete)
- ✅ Manage Collections (Income)
- ✅ Manage Expenses
- ✅ Manage Budget
- ✅ Manage Events & Registrations
- ✅ Manage Bank Reconciliation
- ✅ Create & Assign User Roles
- ✅ Edit User Roles
- ✅ Delete User Roles
- ✅ View Audit Trail
- ✅ Run Reports
- ✅ Backup & Restore Database
- ✅ Assign Roles to Members

**Use Case:**
Primary administrator who oversees entire application

---

### 2. ADMIN (Level 9) 🟠
**Authority:** High - Manage All Except Users

**Description:**
- Administrative control
- Manage data and operations
- Cannot directly manage user accounts

**Capabilities:**
- ✅ View Dashboard
- ✅ Manage Members (add, edit)
- ✅ Manage Collections (Income)
- ✅ Manage Expenses
- ✅ Manage Budget
- ✅ Manage Events & Registrations
- ✅ Manage Bank Reconciliation
- ✅ Run Reports
- ✅ Backup & Restore Database
- ❌ Cannot create user accounts
- ❌ Cannot assign roles
- ❌ Cannot view/edit user roles

**Use Case:**
Senior staff member who manages day-to-day operations

---

### 3. TREASURER (Level 8) 💚
**Authority:** Medium-High - Financial Operations

**Description:**
- Finance and accounting focused
- Handles money and collections
- Cannot manage members or users

**Capabilities:**
- ✅ View Dashboard
- ✅ Manage Collections (Income/Donations)
- ✅ Manage Expenses
- ✅ View & Manage Budget
- ✅ View Bank Reconciliation
- ✅ Run Financial Reports
- ✅ Backup Database (data access only)
- ✅ Edit own income entries
- ❌ Cannot add/delete members
- ❌ Cannot manage events
- ❌ Cannot manage users/roles
- ❌ Cannot change budget status

**Use Case:**
Church treasurer handling finances and donations

---

### 4. SECRETARY (Level 7) 🔵
**Authority:** Medium - Records & Events

**Description:**
- Records and information focused
- Manages events and registrations
- Limited financial access

**Capabilities:**
- ✅ View Dashboard
- ✅ View Members List
- ✅ View Collections (Income/Donations)
- ✅ View Expenses
- ✅ View Budget
- ✅ Manage Events
- ✅ Register Participants
- ✅ Check-in Participants
- ✅ Run Reports (view only)
- ✅ Backup Database (view only)
- ❌ Cannot add income entries
- ❌ Cannot add expenses
- ❌ Cannot edit budget
- ❌ Cannot manage users/roles

**Use Case:**
Administrative secretary managing records and events

---

### 5. JOINT SECRETARY (Level 6) 🟣
**Authority:** Medium-Low - Events & Records Assistant

**Description:**
- Assistant to main secretary
- Helps with events and registrations
- Read-mostly access

**Capabilities:**
- ✅ View Dashboard
- ✅ View Members List
- ✅ View Collections (Income/Donations)
- ✅ View Expenses
- ✅ View Budget
- ✅ View Events
- ✅ Register Participants
- ✅ Check-in Participants
- ✅ View Reports (read-only)
- ❌ Cannot add/edit members
- ❌ Cannot add income
- ❌ Cannot add expenses
- ❌ Cannot manage budget
- ❌ Cannot create events
- ❌ Cannot delete data
- ❌ Cannot manage users/roles

**Use Case:**
Assistant to secretary, supports event registration

---

### 6. JOINT TREASURER (Level 5) 🩷
**Authority:** Low - Finance Assistant

**Description:**
- Assistant to main treasurer
- Helps with financial operations
- Limited transaction access

**Capabilities:**
- ✅ View Dashboard
- ✅ View Collections (Income/Donations)
- ✅ View Expenses
- ✅ View Budget
- ✅ View Bank Reconciliation (read-only)
- ✅ Run Financial Reports (read-only)
- ❌ Cannot add income entries
- ❌ Cannot add expenses
- ❌ Cannot edit budget
- ❌ Cannot manage members
- ❌ Cannot manage events
- ❌ Cannot manage users/roles

**Use Case:**
Assistant to treasurer, helps with financial review

---

## 📊 Permission Matrix

| Feature | Superuser | Admin | Treasurer | Secretary | Joint Sec | Joint Treas |
|---------|:---------:|:-----:|:---------:|:---------:|:---------:|:-----------:|
| **Dashboard** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Members** | ✅ | ✅ | ❌ | 👀 | 👀 | ❌ |
| **Edit Members** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Income/Collections** | ✅ | ✅ | ✅ | 👀 | 👀 | 👀 |
| **Add Income** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Expenses** | ✅ | ✅ | ✅ | 👀 | 👀 | 👀 |
| **Add Expense** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Budget** | ✅ | ✅ | ✅ | 👀 | 👀 | 👀 |
| **Edit Budget** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Events** | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| **Register Participant** | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| **Bank Reconciliation** | ✅ | ✅ | ✅ | ❌ | ❌ | 👀 |
| **Reports** | ✅ | ✅ | ✅ | 👀 | 👀 | 👀 |
| **Backup/Restore** | ✅ | ✅ | ✅ | 👀 | ❌ | ❌ |
| **Manage Users** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Assign Roles** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Audit Trail** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

**Legend:**
- ✅ = Full Access (Can add, edit, delete)
- 👀 = Read-Only (Can view, cannot edit)
- ❌ = No Access

---

## How Roles Work

### Role Level System

```javascript
const levels = {
  "Superuser": 10,        // Highest
  "Admin": 9,
  "Treasurer": 8,
  "Secretary": 7,
  "Joint Secretary": 6,
  "Joint Treasurer": 5    // Lowest
}
```

### Access Check

When user tries to access a feature:

```
1. System checks user's role level
2. Compares with required level
3. If user level >= required level → Access granted ✅
4. If user level < required level → Access denied ❌
```

### Example

```
Treasurer trying to access something requiring Treasurer level:
Treasurer Level (8) >= Required (8) → ✅ ACCESS GRANTED

Secretary trying to access Treasurer feature:
Secretary Level (7) < Required (8) → ❌ ACCESS DENIED
```

---

## Typical Team Setup

### Small Church
```
Superuser:        Pastor (1 person)
Admin:            Church Admin (1 person)
Treasurer:        Finance Lead (1 person)
Secretary:        Office Secretary (1 person)
```

### Medium Church
```
Superuser:        Senior Pastor (1 person)
Admin:            Finance Manager (1 person)
Treasurer:        Treasurer (1 person)
Joint Treasurer:  Finance Assistant (1 person)
Secretary:        Admin Secretary (1 person)
Joint Secretary:  Event Coordinator (1 person)
```

### Large Organization
```
Superuser:        Executive Director (1 person)
Admin:            Multiple admins (2-3)
Treasurer:        Finance Team (2-3)
Secretary:        Records Team (2-3)
Joint roles:      Various assistants (2-4)
```

---

## How to Assign Roles

### Step 1: Go to Users & Roles
```
Menu → "👤 Users & Roles" (red button)
```

### Step 2: Create New User or Edit Existing
```
Option A: Click "Add User" → Select Member → Assign Role
Option B: Click Edit on existing user → Change Role
```

### Step 3: Select Role from Dropdown
```
[Superuser (Full Access)] ← Highest
[Admin (Manage All)]
[Treasurer (Finance)]
[Secretary (Records)]
[Joint Secretary (Records)]
[Joint Treasurer (Finance)] ← Lowest
```

### Step 4: Save
```
Click Save → Role assigned ✅
```

---

## Special Notes

### Superuser Privilege
- Only Superuser can create/manage users
- Only Superuser can view Audit Trail
- Superuser has no restrictions
- One person should be Superuser

### Admin vs Superuser
```
Admin:
- Manages all data operations
- Cannot touch user accounts
- Cannot see audit trail
- Good for trusted managers

Superuser:
- Has admin capabilities
- Plus user management
- Can see everything
- Ultimate authority
```

### Treasurer Privileges
- Full financial access
- Can add income entries
- Can add expenses
- Can view/manage budgets
- Cannot manage members or events

### Secretary Privileges
- Manages events and registrations
- Can register participants
- Can check-in attendees
- Read-only to financial data
- Cannot make changes to records

### Joint Roles
- Assistant-level access
- Limited capabilities
- Good for trainees or part-time staff
- Can participate but not initiate

---

## Security Principles

### 1. Principle of Least Privilege
- Give users only necessary access
- New staff → Joint role first
- Promote after training

### 2. Separation of Duties
```
Treasurer handles money
Secretary handles records
Admin handles overall operations
Superuser oversees everything
```

### 3. Role Review
- Review roles quarterly
- Remove unnecessary access
- Promote/demote as needed
- Track changes in audit trail

### 4. Audit Trail
- All changes logged in Audit Trail
- Who made changes
- When changes were made
- What was changed

---

## Common Scenarios

### Scenario 1: New Volunteer
```
1. Create as Member (Members screen)
2. Assign "Joint Secretary" role
3. Let them help with events
4. After training → Promote to Secretary
```

### Scenario 2: Promote Treasurer
```
1. Create as Member
2. Start with "Joint Treasurer"
3. Train on finances
4. Promote to "Treasurer"
```

### Scenario 3: Manage Multiple Admins
```
Superuser assigns:
- Admin 1: Focuses on finance
- Admin 2: Focuses on members
- Both have full data access
```

---

## Frequently Asked Questions

### Q: Can I have multiple Superusers?
**A:** Yes, but not recommended. Superuser is high authority. Better to have 1-2 Superusers and more Admins.

### Q: What happens when I delete a role?
**A:** User loses access to that role's features. They can still login if they have another role, or are downgraded to read-only.

### Q: Can I create custom roles?
**A:** Currently, 6 predefined roles exist. Custom roles would require code changes.

### Q: How do I know what someone with a role can do?
**A:** Refer to the Permission Matrix above - shows exactly what each role can access.

### Q: Can I temporarily revoke someone's role?
**A:** Yes - set their status to "Inactive" instead of deleting. They can't login but role is preserved.

### Q: What's the difference between Secretary and Joint Secretary?
**A:** Secretary can create/edit, Joint Secretary can only view and assist. Good for:
- Secretary = Full event management
- Joint Secretary = Helper/assistant level

---

## Best Practices

✅ **DO:**
- Assign roles based on job responsibilities
- Start new staff with lower roles
- Review roles regularly
- Keep audit trail enabled
- Have clear role assignments

❌ **DON'T:**
- Give everyone Superuser access
- Assign roles without training
- Keep old roles assigned after staff leaves
- Forget to document role assignments
- Ignore security warnings

---

## Role Colors

For quick visual identification:

```
🔴 Superuser    - Red
🟠 Admin        - Orange
💚 Treasurer    - Green
🔵 Secretary    - Blue
🟣 Joint Sec    - Purple
🩷 Joint Treas  - Pink
```

---

## Summary

| Role | Level | Purpose | Best For |
|------|:-----:|---------|----------|
| **Superuser** | 10 | Full Control | Primary Admin |
| **Admin** | 9 | Manage All Data | Senior Staff |
| **Treasurer** | 8 | Finance | Finance Team |
| **Secretary** | 7 | Events & Records | Office Admin |
| **Joint Sec** | 6 | Events Helper | Assistants |
| **Joint Treas** | 5 | Finance Helper | Finance Assistants |

---

**Documentation Date:** April 4, 2026  
**Status:** ✅ COMPLETE REFERENCE  
**Version:** 1.0

All roles and permissions are clearly defined and hierarchical.

