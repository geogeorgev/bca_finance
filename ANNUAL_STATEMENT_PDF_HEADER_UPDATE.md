# Annual Contribution Statement PDF Header Update

## Overview
The Annual Contribution Statement PDF header has been updated to display a professional header with the organization's logo, matching the format shown in the official contribution receipt template.

## Header Design

### Previous Header
- Simple centered text
- Organization name only
- Contact info centered below

### New Header
✅ **Logo on the left side** (25x25mm, positioned at 10mm from top and left edge)
✅ **Organization name** (bold, 13pt) positioned next to logo
✅ **Contact information** (9pt) displayed below organization name
✅ **Professional alignment** with logo on left, text on right

## Header Content

```
[LOGO IMAGE]    The Boston Christian Assembly
(25x25mm)       26 Wellesley Road, Natick, MA 01760  |  Tel: 781-883-9708  |  www.bostonchristian.net
```

### Logo Details
- **Source**: logo.png (existing file in project root)
- **Position**: Top-left (12mm from left, 10mm from top)
- **Size**: 25mm x 25mm
- **Format**: PNG image

### Text Details
- **Organization Name**: 
  - Font size: 13pt
  - Font weight: Bold
  - Position: Next to logo (42mm from left)
  
- **Contact Information**:
  - Font size: 9pt
  - Font weight: Normal
  - Position: Below organization name (42mm from left)

## Files Updated

**js/reports.js**

1. **generateSingleMemberStatement()** function
   - Updated header section (around line 1020)
   - Added logo image loading
   - Changed text positioning and sizing
   - Adjusted yPosition to accommodate new header

2. **generateAllMembersStatement()** function
   - Updated header section (around line 1245)
   - Added logo image loading
   - Changed text positioning and sizing
   - Adjusted yPosition to accommodate new header

## Technical Implementation

### Code Changes

```javascript
// Add logo image
try {
  const logoImg = new Image()
  logoImg.src = 'logo.png'
  
  // Add logo to left side (12mm from left, 10mm from top, 25x25mm)
  pdf.addImage(logoImg, 'PNG', 12, 10, 25, 25)
} catch(e) {
  console.warn("Logo image not found, continuing without logo")
}

// Organization name and contact info positioned next to logo
pdf.setFontSize(13)
pdf.setFont(undefined, "bold")
pdf.text("The Boston Christian Assembly", 42, 12)

pdf.setFontSize(9)
pdf.setFont(undefined, "normal")
pdf.text("26 Wellesley Road, Natick, MA 01760  |  Tel: 781-883-9708  |  www.bostonchristian.net", 42, 18)
```

### Error Handling
- If logo.png is not found, the PDF will still generate with text-only header
- Warning message logged to console for debugging
- No impact on PDF functionality

## Logo Requirements

### File
- **Filename**: logo.png
- **Location**: Project root directory (same level as index.html)
- **Format**: PNG with transparency recommended

### Sizing
- Original image size doesn't matter
- PDF will scale it to exactly 25mm x 25mm
- Ensure logo maintains aspect ratio in its source image

## Testing

### What to Verify
1. ✅ Logo appears in top-left corner of PDF
2. ✅ Organization name is bold and properly positioned
3. ✅ Contact information is properly positioned and readable
4. ✅ Header spacing allows enough room for content below
5. ✅ PDF looks professional and matches the reference template

### How to Test
1. Go to Reports → Annual Contribution Statement
2. Select a member
3. Click "Generate PDF"
4. Open the generated PDF
5. Check that header matches the design

## Troubleshooting

### Issue: Logo not appearing
**Cause**: logo.png file not found or incorrect path
**Solution**: 
1. Verify logo.png exists in project root
2. Check browser console for warning messages
3. PDF will still work without logo

### Issue: Logo distorted
**Cause**: Logo has wrong aspect ratio
**Solution**:
1. Update the size parameters in code if needed
2. Current size: 25x25mm (square)
3. Adjust width/height parameters if logo isn't square

### Issue: Text overlapping logo
**Cause**: Logo or text positioning incorrect
**Solution**:
1. Logo positioned at: x=12mm, y=10mm, width=25mm, height=25mm
2. Text positioned at: x=42mm
3. This gives 5mm gap between logo and text

## Contact Information Update

Note: The phone number was updated from 781-883-9766 to 781-883-9708 to match the reference image.

If this needs to be changed in the future, update these lines in both functions:
```javascript
pdf.text("26 Wellesley Road, Natick, MA 01760  |  Tel: 781-883-9708  |  www.bostonchristian.net", 42, yPosition)
```

## Future Enhancements

Possible improvements:
- Make phone number configurable
- Make organization details editable through settings
- Add email address to header
- Support for different logo sizes
- Mobile-responsive header styling
- Dynamic organization information from database

## Notes

- Both single member and batch PDF generation use the same header format
- Header is consistent across all contribution statements
- Logo is embedded in PDF (no external dependencies)
- Professional appearance matches official church documentation

