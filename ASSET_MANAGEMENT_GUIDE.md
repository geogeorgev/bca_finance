# Asset Management System - Complete Guide

## Overview
The Asset Management system allows you to track and manage all church assets including equipment, furniture, instruments, and other valuable items.

---

## ✨ Features

### ✅ Complete Asset Tracking
- Asset name and description
- Serial number for identification
- Make and model information
- Year purchased and replacement year
- Current location
- Purchase cost
- Condition status
- Notes and maintenance history

### ✅ Full CRUD Operations
- **Add** new assets
- **View** all assets with search
- **Edit** existing asset details
- **Delete** assets

### ✅ Smart Search & Filter
- Search by asset name
- Search by serial number
- Search by make/manufacturer
- Real-time filtering

### ✅ Asset Information
- Track when items need replacement
- Monitor equipment condition
- Document maintenance history
- Track original purchase cost

---

## 📊 Database Structure

### Assets Collection
```javascript
{
  AssetName: "Cordless Microphone",           // Required
  SerialNumber: "MIC-12345",                   // Optional
  Make: "Shure",                               // Manufacturer
  Model: "SM58",                               // Model number
  YearBought: 2020,                            // Purchase year
  ReplaceYear: 2025,                           // Planned replacement year
  Location: "Sanctuary",                       // Where it's stored/used
  Cost: 299.99,                                // Original purchase price
  Condition: "Excellent",                      // Excellent, Good, Fair, Poor, Needs Repair
  Notes: "Microphone for lead vocalist",       // Additional information
  CreateDate: timestamp,                       // Created when
  UpdateDate: timestamp                        // Last updated when
}
```

---

## 🔧 How to Use

### Step 1: Access Asset Management
1. Click "🛠️ Assets" button in menu
2. View all existing assets

### Step 2: Add New Asset
1. Click "➕ Add New Asset"
2. Fill in asset details:
   - **Asset Name** * (required)
   - Serial Number
   - Make (manufacturer)
   - Model
   - Year Bought
   - Replace Year
   - Location
   - Cost
   - Condition
   - Notes
3. Click "Save Asset"

### Step 3: Edit Asset
1. Click "✏️ Edit" on any asset
2. Update details as needed
3. Click "Update Asset"

### Step 4: Delete Asset
1. Click "🗑️ Delete" on asset
2. Confirm deletion
3. Asset is removed

### Step 5: Search Assets
1. Use search box at top
2. Type asset name, serial number, or make
3. Results filter in real-time

---

## 📋 Example Assets

### Example 1: Audio Equipment
```
Asset Name: Cordless Microphone
Serial Number: MIC-12345
Make: Shure
Model: SM58
Year Bought: 2020
Replace Year: 2025
Location: Sanctuary
Cost: $299.99
Condition: Excellent
Notes: Main microphone for lead vocalist
```

### Example 2: Musical Instrument
```
Asset Name: Electronic Organ
Serial Number: ORG-5678
Make: Hammond
Model: B3
Year Bought: 2015
Replace Year: 2028
Location: Sanctuary - Left Side
Cost: $12,000.00
Condition: Good
Notes: Regular maintenance every 6 months
```

### Example 3: Office Equipment
```
Asset Name: Projector
Serial Number: PRJ-9012
Make: Epson
Model: EB-2250U
Year Bought: 2019
Replace Year: 2026
Location: Fellowship Hall
Cost: $1,800.00
Condition: Fair
Notes: Needs lamp replacement soon
```

### Example 4: Furniture
```
Asset Name: Conference Table
Serial Number: TBL-3456
Make: Herman Miller
Model: W.E.T. Table
Year Bought: 2018
Replace Year: None
Location: Conference Room
Cost: $4,500.00
Condition: Excellent
Notes: Custom made for church needs
```

---

## 🔐 Permissions

### Who Can Access?
- ✅ **Superuser** (Level 10)
- ✅ **Admin** (Level 9)
- ❌ **Treasurer** (Level 8) - Cannot access
- ❌ **Secretary** (Level 7) - Cannot access
- ❌ Others - Cannot access

**Note**: Asset Management requires Admin level or above

---

## 📝 Field Reference

### Required Fields
- **Asset Name** - What is this asset called?
  - Examples: Microphone, Projector, Keyboard
  - Cannot be left empty

### Optional Fields

| Field | Purpose | Examples |
|-------|---------|----------|
| **Serial Number** | Identify specific item | MIC-12345, SN001 |
| **Make** | Manufacturer name | Shure, Epson, Hammond |
| **Model** | Model number/type | SM58, EB-2250U, B3 |
| **Year Bought** | When purchased | 2020, 2019, 2021 |
| **Replace Year** | When to replace | 2025, 2026, None |
| **Location** | Where it's kept | Sanctuary, Office, Storage |
| **Cost** | Purchase price | $299.99, $12,000.00 |
| **Condition** | Current state | Excellent, Good, Fair, Poor, Needs Repair |
| **Notes** | Additional info | Maintenance notes, status, special info |

---

## 🎯 Common Tasks

### Task 1: Create Equipment Inventory
1. Go to Assets
2. Click "Add New Asset" for each item
3. Fill in all relevant details
4. Save each asset

### Task 2: Track Equipment Age
1. Check "Year Bought" and "Replace Year"
2. Know when items need replacement
3. Plan budget for replacements

### Task 3: Document Maintenance
1. Click "Edit" on asset
2. Update "Condition" status
3. Add maintenance notes in "Notes"
4. Save changes

### Task 4: Find Asset Quickly
1. Use search box
2. Type asset name or serial number
3. Instantly find what you need

### Task 5: Plan Asset Replacement
1. Review all assets
2. Check "Replace Year" column
3. Identify items needing replacement soon
4. Budget accordingly

---

## 💡 Best Practices

### DO:
✅ Assign serial numbers to all assets
✅ Keep location information current
✅ Document condition regularly
✅ Note maintenance history
✅ Update replacement year estimates
✅ Include notes about special requirements
✅ Track original costs for accounting
✅ Review assets quarterly

### DON'T:
❌ Leave Asset Name empty
❌ Forget to update when items move
❌ Skip condition assessments
❌ Leave permanent repairs undocumented
❌ Ignore replacement year warnings
❌ Store assets without tracking location
❌ Lose serial number information

---

## 🔍 Asset Condition Levels

### Excellent ⭐⭐⭐⭐⭐
- Like new condition
- Works perfectly
- No maintenance issues
- No wear or damage

### Good ⭐⭐⭐⭐
- Works well
- Minor wear
- Occasional maintenance needed
- Still has good lifespan

### Fair ⭐⭐⭐
- Still functional
- Noticeable wear
- Regular maintenance required
- Getting closer to end of life

### Poor ⭐⭐
- Barely functional
- Significant wear/damage
- Frequent maintenance needed
- Should be replaced soon

### Needs Repair ⚠️
- Not functional
- Broken or damaged
- Requires immediate repair
- Cannot be used until fixed

---

## 📊 Inventory Tracking

### What to Track
- Equipment (microphones, projectors, speakers)
- Furniture (tables, chairs, cabinets)
- Instruments (organs, pianos, guitars)
- Tools & equipment (lawnmower, sound system)
- Office equipment (computers, printers)
- Vehicles (if applicable)
- Technology (monitors, cables, adapters)

### Why Track?
✅ Know what you have
✅ Know location of items
✅ Plan replacements
✅ Track maintenance
✅ Document insurance values
✅ Prevent loss/theft
✅ Budget planning
✅ Accountability

---

## 🆘 Troubleshooting

### Problem: Asset Name field is empty
**Solution**: Asset Name is required - fill it in before saving

### Problem: Can't access Asset Management
**Solution**: You need Admin level or higher
- Contact Superuser to upgrade your role

### Problem: Can't find an asset
**Solution**: 
1. Use search box
2. Try searching by serial number
3. Try searching by make/brand

### Problem: Asset deleted by mistake
**Solution**: 
1. Contact your Superuser
2. They may have database backups
3. Recreate the asset if necessary

---

## 📈 Reports & Analysis

### Suggested Reporting Features (Future)
- Asset inventory list (printable)
- Assets by location
- Assets by condition
- Replacement timeline
- Cost analysis
- Equipment utilization

---

## 🔄 Workflow Example

### Scenario: Audio Equipment Audit

1. **Inventory Time**
   - Go to Assets
   - Add all audio equipment
   - Include serial numbers
   - Record locations

2. **Maintenance Check**
   - Physically inspect each item
   - Update condition status
   - Document any issues
   - Add maintenance notes

3. **Planning**
   - Review Replace Year column
   - Identify aging equipment
   - Plan replacement budget
   - Schedule maintenance

4. **Tracking**
   - Update locations when items move
   - Record maintenance performed
   - Update condition after repairs
   - Keep notes current

---

## 📞 Support

### Questions About:
- **Adding assets**: See "How to Use" section
- **Field meanings**: See "Field Reference"
- **Permissions**: See "Permissions" section
- **Best practices**: See "Best Practices"
- **Troubleshooting**: See "Troubleshooting"

---

## 🎊 Summary

The Asset Management system provides:
- ✅ Complete asset tracking
- ✅ Maintenance documentation
- ✅ Replacement planning
- ✅ Easy search and filter
- ✅ Secure access control
- ✅ Audit trail

**Everything you need to manage church assets in one place!**

---

**Version**: 1.0
**Date**: April 6, 2026
**Status**: Ready to Use

