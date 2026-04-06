# BCA Finance - Role-Based Access Control (RBAC) Guide

## Quick Answer

### What Happens When NO Role is Assigned?

**❌ User CANNOT Login**
- If a member has no role assigned, they cannot access the system
- Login will show: `"User role not configured"` error
- They are locked out of the application
- An admin/superuser must assign them a role first

---

## 📊 Role Hierarchy & Permissions

### Level System (Higher = More Permissions)

```
SUPERUSER      Level 10  (Highest Authority)
ADMIN          Level 9   (Administrative Control)
TREASURER      Level 8   (Financial Operations)
SECRETARY      Level 7   (Records & Events)
JOINT SECRETARY Level 6   (Events Assistant)
JOINT TREASURER Level 5   (Finance Assistant - Lowest)
NONE           Level 0   (NO ACCESS - LOCKED OUT)
```

---

## 🔐 Complete Role Permissions

### 1. SUPERUSER (Level 10) 🔴
**Red - Highest Authority**

**Who Can Have This:**
- Pastor/Senior Pastor
- Executive Director
- Senior Leadership

**What They Can Do:**
```
✅ Dashboard - Full access
✅ Members - Add, Edit, Delete ALL
✅ Collections (Income) - Add, Edit, Delete ALL
✅ Expenses - Add, Edit, Delete ALL
✅ Budget - Create, Edit, Manage
✅ Events - Create, Manage, Delete
✅ Bank Reconciliation - Full access
✅ Create User Accounts - YES
✅ Assign Roles - YES (Create/Edit roles)
✅ Delete Roles - YES
✅ Delete Members - YES
✅ Reports - Generate all
✅ Backup & Restore - YES
✅ View Audit Trail - YES
✅ Manage Everything - YES
```

**What They CANNOT Do:**
- ❌ Nothing - They can do everything

**Use Case:**
Church's senior leader with complete system control

---

### 2. ADMIN (Level 9) 🟠
**Orange - Administrative Control**

**Who Can Have This:**
- Associate Pastor
- Administrative Manager
- Church Administrator

**What They Can Do:**
```
✅ Dashboard - Full access
✅ Members - Add, Edit (but NOT delete)
✅ Collections (Income) - Add, Edit, View
✅ Expenses - Add, Edit, View
✅ Budget - View, Edit
✅ Events - Create, Manage
✅ Bank Reconciliation - Full access
✅ Reports - Generate all
✅ Backup & Restore - YES
```

**What They CANNOT Do:**
```
❌ Delete Members
❌ Delete Expenses
❌ Create/Assign User Roles
❌ Manage User Accounts
❌ View Audit Trail (restricted)
```

**Use Case:**
Administrative staff managing day-to-day operations

---

### 3. TREASURER (Level 8) 💚
**Green - Financial Operations**

**Who Can Have This:**
- Church Treasurer
- Financial Secretary
- Accounting Staff

**What They Can Do:**
```
✅ Dashboard - Full access
✅ Collections (Income) - Add, Edit, View ALL
✅ Expenses - Add, Edit, View
✅ Budget - View, Edit financial aspects
✅ Bank Reconciliation - Full access
✅ Financial Reports - Generate all
✅ Edit own income entries - YES
✅ Backup Database - YES
```

**What They CANNOT Do:**
```
❌ Add/Edit/Delete Members
❌ Manage Events
❌ Create/Assign Roles
❌ Delete Financial Records
❌ Change Budget Status
❌ Access Member personal info beyond finances
```

**Use Case:**
Church treasurer handling all financial transactions

---

### 4. SECRETARY (Level 7) 🔵
**Blue - Records & Events**

**Who Can Have This:**
- Church Secretary
- Administrative Assistant
- Records Keeper

**What They Can Do:**
```
✅ Dashboard - Limited access
✅ Members - View list ONLY
✅ Collections - View ONLY
✅ Expenses - View ONLY
✅ Budget - View ONLY
✅ Events - Create, Manage, Delete
✅ Registrations - Add, Manage
✅ Participant Check-in - YES
✅ Reports - View ONLY
✅ Backup - View ONLY
```

**What They CANNOT Do:**
```
❌ Add Income/Donations
❌ Add Expenses
❌ Edit Budget
❌ Manage Members
❌ Manage Roles
❌ Create/Delete Records
```

**Use Case:**
Administrative secretary managing events and records

---

### 5. JOINT SECRETARY (Level 6) 🟣
**Purple - Events Assistant**

**Who Can Have This:**
- Assistant Secretary
- Event Coordinator Assistant
- Administrative Helper

**What They Can Do:**
```
✅ Dashboard - Limited access
✅ Members - View list ONLY
✅ Collections - View ONLY
✅ Expenses - View ONLY
✅ Budget - View ONLY
✅ Events - View & register participants
✅ Registrations - Add, Manage
✅ Participant Check-in - YES
✅ Reports - View ONLY
```

**What They CANNOT Do:**
```
❌ Create Events
❌ Add Income/Donations
❌ Add Expenses
❌ Edit Members
❌ Manage Budget
❌ Manage Roles
❌ Delete Records
```

**Use Case:**
Assistant helping with event registration and check-ins

---

### 6. JOINT TREASURER (Level 5) 🩷
**Pink - Finance Assistant**

**Who Can Have This:**
- Treasurer's Assistant
- Finance Helper
- Bookkeeping Assistant

**What They Can Do:**
```
✅ Dashboard - Limited access
✅ Collections - View ONLY
✅ Expenses - View ONLY
✅ Budget - View ONLY
✅ Bank Reconciliation - View ONLY
✅ Financial Reports - View ONLY
```

**What They CANNOT Do:**
```
❌ Add Income/Donations
❌ Add Expenses
❌ Edit Budget
❌ Edit Members
❌ Manage Events
❌ Manage Roles
❌ Create/Delete Records
❌ Backup Database
```

**Use Case:**
Assistant treasurer helping with financial review

---

## ❌ NO ROLE (Level 0) - LOCKED OUT

**Status:** Member exists but NO role assigned

**What They Can Do:**
```
❌ NOTHING - Complete lockout
```

**What Happens:**
1. User tries to login
2. System checks for role assignment
3. Role NOT found
4. Login error: `"User role not configured"`
5. User is locked out of system
6. Only Admin/Superuser can assign role

**How to Fix:**
1. Superuser logs in
2. Go to Members
3. Find member with "No role assigned"
4. Click "🔐 Assign Role"
5. Select appropriate role
6. User can now login

---

## 📋 Access Control Flow

```
User Attempts Login
        ↓
Firebase authenticates email/password
        ↓
System searches "users" collection for user record
        ↓
┌─────────────────────────────────────────┐
│ User record found?                      │
└─────────────────────────────────────────┘
        ↙                                  ↘
    YES (Role exists)                  NO (No role)
        ↓                                   ↓
   Get user role                     Show error:
        ↓                         "User role not configured"
   Check if Active                        ↓
        ↓                            LOGIN DENIED
    ✅ Active                         (LOCKED OUT)
        ↓
   Create Session with:
   - User Info
   - Role Name
   - Permission Level (1-10)
        ↓
   User logged in
   Full access based on role level
```

---

## 🔒 Permission Hierarchy

### Principle: Higher Level = All Lower Permissions

```
Superuser (10)
    ├── Everything Admin can do
    ├── Everything Treasurer can do
    ├── Everything Secretary can do
    ├── Everything Joint Secretary can do
    └── Everything Joint Treasurer can do

Admin (9)
    ├── Everything Treasurer can do
    ├── Everything Secretary can do
    ├── Everything Joint Secretary can do
    └── Everything Joint Treasurer can do

Treasurer (8)
    ├── Everything Secretary can do (read-only)
    ├── Everything Joint Secretary can do
    └── Everything Joint Treasurer can do

Secretary (7)
    ├── Everything Joint Secretary can do
    └── Everything Joint Treasurer can do (read-only)

Joint Secretary (6)
    └── Read-only like Joint Treasurer

Joint Treasurer (5)
    └── Read-only financial access

No Role (0)
    └── COMPLETE LOCKOUT - NO ACCESS
```

---

## 👤 Role Assignment Process

### How Roles are Assigned

1. **Superuser Access Only**
   - Only Superuser can assign/manage roles
   
2. **Step-by-Step**:
   ```
   Members list
   └── Find member "No role assigned"
   └── Click "🔐 Assign Role"
   └── Select role from dropdown
   └── Confirm assignment
   └── User can now login
   ```

3. **Member Record Info**:
   ```
   users collection:
   {
     Name: "John Smith"
     Email: "john@example.com"
     Role: "Treasurer" ← This determines access
     MemberID: "member_123"
     Active: true/false
     current_record: true/false
   }
   ```

---

## ⚠️ What Happens in Each Scenario

### Scenario 1: New Member Added (No Role)
```
Result: LOCKED OUT ❌
└─ Cannot login
└─ System shows: "User role not configured"
└─ Superuser must assign role
└─ Then user can login
```

### Scenario 2: Member with Wrong Active Status
```
Result: LOCKED OUT ❌
└─ Active: false
└─ System shows: "Account is disabled"
└─ Admin must activate (set Active: true)
```

### Scenario 3: Member with Expired Session
```
Result: LOGGED OUT ⏰
└─ Must login again
└─ Session expires after 24 hours
└─ Can choose "Remember Me" to extend
```

### Scenario 4: Member Tries Feature Above Their Level
```
Result: PERMISSION DENIED ❌
└─ Alert: "You don't have permission to access this feature"
└─ Example: Secretary tries to add expense
└─ They're blocked by role check
```

---

## 🔍 Role Level Codes

```javascript
const levels = {
  "Superuser": 10,
  "Admin": 9,
  "Treasurer": 8,
  "Secretary": 7,
  "Joint Secretary": 6,
  "Joint Treasurer": 5,
  // undefined = 0 (NO ROLE)
}
```

**Permission Check Logic:**
```
if (userLevel >= requiredLevel) {
  Allow access
} else {
  Deny access
}
```

---

## 📊 Common Role Assignments

### Church Structure Example

```
Senior Pastor
└── Role: Superuser (Level 10)
    └── Full system control

Associate Pastor
└── Role: Admin (Level 9)
    └── Manage members, events, operations

Church Treasurer
└── Role: Treasurer (Level 8)
    └── Handle all finances

Church Secretary
└── Role: Secretary (Level 7)
    └── Manage records and events

Bookkeeper
└── Role: Joint Treasurer (Level 5)
    └── View financial records only

Event Coordinator
└── Role: Secretary (Level 7)
    └── Manage event registrations
```

---

## 🆘 Troubleshooting

### Problem: User Gets "User role not configured"
**Solution:**
1. Superuser checks Members list
2. Look for red "✗ No role assigned"
3. Click "🔐 Assign Role" button
4. Select appropriate role
5. User can now login

### Problem: User Gets "You don't have permission"
**Solution:**
1. Check their role (it's correct role, but too low level)
2. Superuser can upgrade role
3. Or they should ask someone with higher permissions
4. This is intentional security measure

### Problem: User Account Disabled
**Solution:**
1. Superuser goes to Members
2. Find member
3. Edit member
4. Set Active: true
5. User can login again

### Problem: User Session Expired
**Solution:**
1. User logs in again
2. Check "Remember Me" to stay logged in 24 hours
3. Login page will reappear if session expires

---

## 📝 Summary Table

| Role | Level | Can Create | Can Edit | Can Delete | Can Assign Roles |
|------|-------|-----------|----------|-----------|------------------|
| Superuser | 10 | ✅ All | ✅ All | ✅ All | ✅ YES |
| Admin | 9 | ✅ Most | ✅ Most | ❌ No | ❌ NO |
| Treasurer | 8 | ✅ Finances | ✅ Finances | ❌ No | ❌ NO |
| Secretary | 7 | ✅ Events | ✅ Events | ✅ Events | ❌ NO |
| Joint Secretary | 6 | ❌ No | ❌ No | ❌ No | ❌ NO |
| Joint Treasurer | 5 | ❌ No | ❌ No | ❌ No | ❌ NO |
| No Role | 0 | ❌ NO | ❌ NO | ❌ NO | ❌ NO |

---

## 🎯 Best Practices

1. **Assign roles immediately** - Don't leave members without roles
2. **Use least privilege** - Give only permissions needed
3. **Regularly review roles** - Update when responsibilities change
4. **Keep Superuser limited** - Only give to trusted leaders
5. **Monitor access** - Check audit trail for suspicious activity
6. **Activate new users** - Remember to set Active: true
7. **Remember Me sparingly** - Don't use on shared computers

---

**Version:** 1.0
**Date:** April 6, 2026
**Status:** Current & Complete

