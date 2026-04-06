# 📌 ROLE ACCESS QUICK REFERENCE

## What Role Can Do What?

### At a Glance

| Role | Can Login | Can Manage Members | Can Manage Finances | Can Manage Events | Can Create Roles | Can Delete |
|------|-----------|-------------------|-------------------|------------------|-----------------|-----------|
| **Superuser** | ✅ YES | ✅ Full | ✅ Full | ✅ Full | ✅ YES | ✅ YES |
| **Admin** | ✅ YES | ✅ Add/Edit | ✅ Full | ✅ Full | ❌ NO | ❌ NO |
| **Treasurer** | ✅ YES | ❌ No | ✅ Full | ❌ No | ❌ NO | ❌ NO |
| **Secretary** | ✅ YES | ❌ View only | ❌ View only | ✅ Full | ❌ NO | ❌ NO |
| **Joint Secretary** | ✅ YES | ❌ View only | ❌ View only | ✅ Register | ❌ NO | ❌ NO |
| **Joint Treasurer** | ✅ YES | ❌ View only | ❌ View only | ❌ No | ❌ NO | ❌ NO |
| **No Role** | ❌ **LOCKED OUT** | ❌ NO | ❌ NO | ❌ NO | ❌ NO | ❌ NO |

---

## Quick Lookup by Task

### Who can...

**Record a donation?**
→ Superuser, Admin, Treasurer

**Add a member?**
→ Superuser, Admin

**Delete a member?**
→ Superuser ONLY

**Create an event?**
→ Superuser, Admin, Secretary

**Register participant?**
→ Secretary, Joint Secretary

**Assign a role?**
→ Superuser ONLY

**View finances?**
→ Superuser, Admin, Treasurer, Secretary (read-only), Joint Treasurer (read-only)

**Backup database?**
→ Superuser, Admin

---

## Role By Permission Level

```
Level 10 = Superuser (Everything)
Level 9  = Admin (Most things)
Level 8  = Treasurer (Finance only)
Level 7  = Secretary (Records & Events)
Level 6  = Joint Secretary (Helper)
Level 5  = Joint Treasurer (View-only Finance)
Level 0  = NO ROLE (NOTHING - LOCKED OUT)
```

---

## If User Can't Login

**Error Message: "User role not configured"**

**Solution:**
1. Superuser logs in
2. Go to Members
3. Look for red: "✗ No role assigned"
4. Click "🔐 Assign Role"
5. Select a role
6. User can now login

---

## Most Common Roles

### For Small Church
- **Pastor**: Superuser
- **Treasurer**: Treasurer  
- **Secretary**: Secretary
- **Helper**: Joint Treasurer

### For Medium Church
- **Senior Pastor**: Superuser
- **Associate Pastor**: Admin
- **Treasurer**: Treasurer
- **Secretary**: Secretary
- **Bookkeeper**: Joint Treasurer
- **Event Coordinator**: Secretary

### For Large Church
- **Lead Pastor**: Superuser
- **Operations Manager**: Admin
- **Finance Manager**: Treasurer
- **Admin Secretary**: Secretary
- **Event Planner**: Secretary
- **Bookkeeper**: Joint Treasurer
- **Assistant Secretary**: Joint Secretary
- **Treasurer Assistant**: Joint Treasurer

---

## Emergency Access

**If Superuser account is locked/disabled:**
1. Contact Firebase support
2. Reset password for Superuser account
3. Superuser can then re-assign all roles

**If someone is locked out:**
1. Have any Superuser or Admin login
2. Go to Members
3. Find the locked out user
4. Assign/reassign their role
5. They can login again

---

**For complete details, read: ROLE_BASED_ACCESS_CONTROL_COMPLETE.md**

