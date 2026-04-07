# Asset Management - Image Upload & Report Features

## ✅ Two New Features Added

### 1. Image Upload for Assets
Upload photos/images of each asset just like in the Expense module.

### 2. Asset Report with Category Summary
Print professional reports showing total count of assets by type/category.

---

## 🖼️ Feature 1: Image Upload

### How to Upload Image

#### When Adding Asset
1. Go to **Assets → Add New Asset**
2. Fill in all asset details
3. Scroll to **"Asset Image (Optional)"** section
4. Click to select image file
5. Choose JPG, PNG, or other image format
6. Click **"Save Asset"**
7. Image is stored with the asset

#### When Editing Asset
1. Go to **Assets → Edit Asset**
2. Scroll down to **"Asset Image"** section
3. If asset already has image, it displays
4. To replace, select new image file
5. Click **"Update Asset"**
6. New image replaces old one

### Image Specifications
- **Formats**: JPG, PNG, and other image formats
- **Max Size**: 700KB per image
- **Storage**: Stored as data URL in Firestore
- **Display**: Shows in edit view

### Example Usage
```
Asset: Cordless Microphone
- Upload photo showing the microphone
- Useful for identification
- Can see condition from photo
- Helps with visual inventory checks
```

---

## 📊 Feature 2: Asset Report with Category Totals

### How to Generate Report

1. Go to **Assets** menu
2. Click **"🖨️ Print Report"** button (purple)
3. Professional report opens in new window
4. Shows assets grouped by category with counts

### Report Includes

**Header Section**
- Report title: "Church Asset Report"
- Date and time generated
- Professional branding

**Category Sections**
- Assets grouped by category (Audio Equipment, Furniture, etc.)
- Each category shows count badge
- Lists all assets in that category with details:
  - Asset name
  - Serial number
  - Make and model
  - Year purchased
  - Location
  - Condition status

**Summary Section**
- Table showing each category
- **Total count for each category** (Example: Cordless Mic - 4, Wired Mic - 8)
- Grand total of all assets
- Professional formatting

### Example Report Output

```
CHURCH ASSET REPORT
Generated: 4/6/2026 at 2:30 PM

AUDIO EQUIPMENT [4]
  Cordless Microphone (Serial: MIC-001, Shure/SM58, Location: Sanctuary)
  Cordless Microphone (Serial: MIC-002, Shure/SM58, Location: Fellowship)
  Wired Microphone (Serial: MIC-003, Shure/SM7, Location: Storage)
  Wired Microphone (Serial: MIC-004, Shure/SM7, Location: Sanctuary)

FURNITURE [2]
  Conference Table (Location: Conference Room)
  Folding Table (Location: Storage)

MUSICAL INSTRUMENTS [1]
  Electronic Organ (Serial: ORG-001, Hammond/B3, Location: Sanctuary)

SUMMARY BY CATEGORY
Audio Equipment:        4
Furniture:             2
Musical Instruments:   1
─────────────────
TOTAL ASSETS:          7
```

### Print Options

#### In Report View
- **🖨️ Print Report** button - Prints professionally
- **Back to Assets** button - Returns to asset list

#### Print Features
- Professional formatting
- Page breaks between category sections
- Print-friendly styling
- Hides buttons and controls when printing
- Optimized for paper output

---

## 💾 Database Structure

### New Fields Added to Assets Collection

```javascript
{
  // ...existing fields...
  AssetImage: "data:image/jpeg;base64,...",    // Image as base64 data URL
  AssetImageFileName: "microphone.jpg",        // Original filename
  // ...other fields...
}
```

---

## 🎯 Use Cases

### Use Case 1: Asset Inventory Check
1. Generate report
2. Print report
3. Go through physically with printed list
4. Check off items
5. Verify all assets accounted for

### Use Case 2: Presentation to Board
1. Generate report
2. Print or display on screen
3. Show category totals and breakdown
4. Demonstrate asset inventory
5. Plan for replacements/purchases

### Use Case 3: Insurance Documentation
1. Upload photos of valuable assets
2. Generate report with images available
3. Maintain documentation
4. Shows condition at time of documentation

### Use Case 4: Asset Location Tracking
1. Report shows location of each asset
2. Find where items are stored
3. Identify items needing relocation
4. Manage inventory effectively

---

## 📋 Category Totals Example

### Real Example from User Request
```
Report Output:

AUDIO EQUIPMENT
[Count: 4]
  - Cordless Microphone #1
  - Cordless Microphone #2  
  - Cordless Microphone #3
  - Cordless Microphone #4

WIRED EQUIPMENT  
[Count: 8]
  - Wired Microphone #1
  - Wired Microphone #2
  ... (more items)
  - Wired Microphone #8

SUMMARY:
Audio Equipment (Cordless): 4 ✓
Wired Equipment:            8 ✓
TOTAL:                      12
```

---

## ✨ Features at a Glance

| Feature | Details |
|---------|---------|
| **Image Upload** | Add photos to assets, max 700KB |
| **Image Display** | Shows in edit view |
| **Image Update** | Replace existing image anytime |
| **Report Generation** | Click button to generate |
| **Category Grouping** | Assets automatically grouped |
| **Count Summary** | Totals for each category |
| **Print Friendly** | Professional print formatting |
| **New Window** | Report opens separately |

---

## 🖨️ Printing Tips

### Before Printing
1. Review report preview
2. Check page breaks
3. Verify all data correct
4. Select printer

### Print Settings
- **Orientation**: Portrait or Landscape
- **Paper Size**: Letter (8.5 x 11) or A4
- **Margins**: Normal
- **Color**: Can print in color or B&W

### After Printing
- Keep for records
- Share with board members
- File for documentation
- Use for audits/checks

---

## 🔄 Workflow Examples

### Scenario 1: Add Asset with Photo
```
1. Go to Assets
2. Click "Add New Asset"
3. Enter details (name, category, etc.)
4. Upload photo of the item
5. Click "Save Asset"
6. Asset saved with image
```

### Scenario 2: Generate Report
```
1. Go to Assets
2. Click "Print Report" button
3. Report opens in new window
4. Shows all categories with counts
5. Click "Print Report" to print
6. Or "Back to Assets" to return
```

### Scenario 3: Audit Inventory
```
1. Generate and print report
2. Take list to storage area
3. Check off items physically
4. Verify all items accounted for
5. Note any missing or damaged items
6. Update in system as needed
```

---

## ❓ FAQ

**Q: What image formats are supported?**
A: JPG, PNG, and most common image formats. Must be under 700KB.

**Q: Can I replace an image?**
A: Yes, in edit view. Select new image and it replaces the old one.

**Q: Does the report show images?**
A: Current version shows asset details. Images are stored but not displayed in report (shows details instead).

**Q: Can I export the report?**
A: Print to PDF using browser print function (Ctrl+P → Save as PDF).

**Q: Does the count include all assets?**
A: Yes, shows all assets grouped by their category.

**Q: How often can I generate a report?**
A: As many times as needed. Always current with latest data.

---

## ✅ What's Included

### Image Upload Feature
✅ File input in Add/Edit forms
✅ File size validation (700KB max)
✅ Image format support (JPG, PNG, etc.)
✅ Image preview in edit view
✅ Secure storage in Firestore
✅ Error handling

### Report Feature  
✅ Generate button on main page
✅ Category grouping
✅ Count totals for each category
✅ Grand total summary
✅ Professional formatting
✅ Print button in report
✅ New window display
✅ Print-friendly styling

---

**Version**: 3.0 (Image Upload + Report Feature)
**Date**: April 6, 2026
**Status**: Production Ready
**Files Modified**: js/assets.js

