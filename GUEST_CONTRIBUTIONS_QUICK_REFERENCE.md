# Quick Reference: Guest Contributions Updates

## ✅ What Changed

### 1. Collection Report - UPDATED
- Now includes guest contributions
- Guests marked with "(Guest)" suffix
- Example: `John Doe (Guest)` appears in the list

**Location**: Reports → Collection Report

**How to see guests**:
1. Click "Collection Report"
2. Select date range
3. All guest offerings show with "(Guest)" tag
4. Can export to Excel with guest indicator

---

### 2. Guest Contributions Statement - RENAMED & UPDATED
- **Old**: "Guest Contributions" button
- **New**: "👥 Guest Contributions Statement" button
- **New Interface**: No more date ranges!

**Location**: Reports → 👥 Guest Contributions Statement

**How to use**:
1. Click "Guest Contributions Statement"
2. Select guest name from dropdown
3. Enter tax year (e.g., 2026)
4. Click "Generate PDF"
5. Download annual contribution statement

---

## 📋 Guest Contribution Statement Features

✅ **No Dates Required** - Just select guest and year  
✅ **Professional PDF** - Same format as member statements  
✅ **IRS Compliant** - Form 11(71-1997) layout  
✅ **Signatures** - Pastor and Treasurer names included  
✅ **Total Calculation** - Auto-sums all guest contributions for year  

**Output**: `GuestName_Guest_Contribution_Receipt_2026.pdf`

---

## 📊 Collection Report - What's Different

### Before Update
- Only showed member contributions
- Guests not visible in report

### After Update
- Shows all contributions (members + guests)
- Guests clearly identified as "(Guest)"
- More accurate financial reporting
- Example row:
  ```
  2026-04-07  | John Doe (Guest)  | Offering-Common  | Cash  | $50.00
  ```

---

## 🔍 Finding What You Need

### I want to see ALL giving (members + guests)
→ Use **Collection Report**

### I want to see one guest's annual total
→ Use **Guest Contributions Statement**

### I need a guest to have IRS documentation
→ Use **Guest Contributions Statement** → Generate PDF

### I need to reconcile Sunday collection
→ Use **Collection Report** → Check "(Guest)" entries

---

## 💾 Database (Behind the Scenes)

Guest contributions stored as:
```
MemberID: "GUEST"
MemberName: "John Doe"
Amount: $50.00
CollectionDate: "2026-04-07"
```

Appears in **Collection Report** table automatically.

---

## 📱 Menu Navigation

```
Main Menu
  └─ Reports
      ├─ Collection Report ← See all (members + guests)
      ├─ Expense Report
      ├─ Annual Contribution Statement ← Members only
      ├─ 👥 Guest Contributions Statement ← NEW! Select guest
      └─ Database Management
```

---

## ✅ Testing the Updates

**Test 1: Collection Report with Guests**
1. Record a guest offering (any amount)
2. Go to Reports → Collection Report
3. Should see guest name with "(Guest)" suffix
4. Total should include guest amount

**Test 2: Generate Guest Statement**
1. Go to Reports → Guest Contributions Statement
2. Should see guest name in dropdown
3. Select guest → Select 2026 → Generate PDF
4. PDF should show guest name and annual total

---

## 📝 Common Scenarios

### Scenario 1: Sunday Offering Collection
```
Members: $500
John Doe (Guest): $25
Sarah Smith (Guest): $15
TOTAL: $540
```
→ Use **Collection Report** to track this

### Scenario 2: Guest Gives Multiple Times
```
Guest: "John Doe"
- April 7: $50
- April 14: $25
- May 5: $100
Annual Total: $175
```
→ Use **Guest Contributions Statement** to generate yearly statement

### Scenario 3: Month-End Close
```
All collections for April
Members + Guests
Exported to Excel for accounting
```
→ Use **Collection Report** → Export to Excel

---

## 🎯 Key Differences: Member vs Guest

| Feature | Member | Guest |
|---------|--------|-------|
| Collection Report | ✅ Shows name | ✅ Shows with "(Guest)" |
| Annual Statement | ✅ Via Member Statement | ✅ Via Guest Statement |
| Updates TotalContribution | ✅ Yes | ❌ No |
| Can have multiple gifts | ✅ One record | ✅ Multiple entries |
| Professional PDF | ✅ Yes | ✅ Yes |

---

**Updated**: April 7, 2026  
**Status**: ✅ Ready to Use

