# Annual Contribution Statement - Tabular Receipt Format

## Overview
The Annual Contribution Statement PDF now includes a professional tabular receipt format that matches formal tax contribution documentation standards.

## Receipt Table Layout

### Visual Structure
The receipt section is organized in a grid layout with:
- **Left Column**: Recipient organization details and donor information
- **Right Column**: Contribution amounts, year, and prepared by information

### Components

#### Top Section - Organization & Contributions
```
┌─────────────────────────────────────┬──────────────────────────────────┐
│ RECIPIENT ORGANIZATION's Name &     │ 1. Total Tax  │ 2. Year │ 3. Ann │
│ Address:                            │    Deductible │         │ ual   │
│ The Boston Christian Assembly       │    Contrib.   │         │ Contr │
│ 26 Wellesley Road,                  │               │         │ ibutil│
│ Natick, MA 01760                    │ $1,400.00     │ 2025    │ $1,400│
└─────────────────────────────────────┴──────────────────────────────────┘
```

#### Federal ID Section
```
┌─────────────────────────────────────┬──────────────────────────────────┐
│ RECIPIENT ORGANIZATION's Federal    │ Prepared by                       │
│ Identification No.                  │                                   │
│ 04-3144979                          │ Treasurer                         │
│                                     │ Boston Christian Assembly         │
└─────────────────────────────────────┴──────────────────────────────────┘
```

#### Donor Information Section
```
┌─────────────────────────────────────┬──────────────────────────────────┐
│ Donor's Social Security or C.I.D.   │                                   │
│ No.                                 │                                   │
│                                     │                                   │
│ Donor's Name (First, Middle, Last): │                                   │
│ Abraham Vazhayi                     │                                   │
│                                     │                                   │
│ Street Address:                     │                                   │
│ 123 Main Street                     │                                   │
│                                     │                                   │
│ City, State and Zip Code:           │                                   │
│ Boston, MA 02101                    │                                   │
└─────────────────────────────────────┴──────────────────────────────────┘
```

## Features

### ✅ Professional Table Grid
- Visible borders around all sections
- Clear column divisions
- Professional spacing

### ✅ Organized Information
- Organization details on left
- Contribution summary on right
- Federal ID clearly displayed
- Prepared by information included
- Donor personal information clearly labeled

### ✅ Three-Column Contribution Summary
1. **Total Tax Deductible Contributions** - Amount of tax-deductible donations
2. **Year** - Tax year (e.g., 2025)
3. **Annual Contribution Record** - Total annual contributions

### ✅ Prepared By Section
Shows who prepared the receipt:
- Title (Treasurer)
- Organization (Boston Christian Assembly)

## Technical Implementation

### PDF Table Drawing
The table uses:
- **pdf.rect()** - Draw rectangular boxes
- **pdf.line()** - Draw dividing lines
- **pdf.text()** - Place text within table cells

### Measurements
- **Left Column Width**: 50% of page width
- **Right Column Width**: 50% of page width
- **Table Height**: Approximately 95mm
- **Left Margin**: 20mm
- **Row Heights**: Vary based on content

### Code Structure
```javascript
// Table dimensions
const tableStartX = 20
const tableStartY = 40  // Varies based on content
const tableWidth = pageWidth - 40
const leftColWidth = tableWidth / 2

// Draw outer borders
pdf.rect(tableStartX, tableStartY, leftColWidth, 95)
pdf.rect(tableStartX + leftColWidth, tableStartY, leftColWidth, 95)

// Draw internal dividing lines
pdf.line(...) // Horizontal and vertical lines

// Add text in specific positions
pdf.text("Text content", xPosition, yPosition)
```

## Data Fields Displayed

### Left Column
- Organization name
- Organization address (street, city, state, zip)
- Federal ID number
- Donor's name
- Donor's street address
- Donor's city, state, zip code

### Right Column
- Total tax-deductible contributions amount
- Tax year
- Annual contribution record amount
- Preparer name
- Preparer title
- Organization name (preparer location)

## Customization

### To Change Organization Details
Edit these lines in the table drawing code:
```javascript
// Organization name
pdf.text("The Boston Christian Assembly", tableStartX + 2, tableStartY + 10)
// Address
pdf.text("26 Wellesley Road,", tableStartX + 2, tableStartY + 14)
pdf.text("Natick, MA 01760", tableStartX + 2, tableStartY + 18)
// Federal ID
pdf.text("04-3144979", tableStartX + 2, tableStartY + 38)
```

### To Change Table Styling
Modify these parameters:
```javascript
// Border width (default: 0.5)
pdf.setLineWidth(0.5)

// Font sizes
pdf.setFontSize(9)   // Labels
pdf.setFontSize(10)  // Values
pdf.setFontSize(8)   // Small text
```

## Compatibility

### Works With:
- Single member PDF generation
- Batch (all members) PDF generation
- Dynamic member data
- Dynamic contribution amounts
- Dynamic years

### Automatically Populates:
- Member name (Donor's Name)
- Member address (Street, City/State/Zip)
- Contribution total
- Tax year
- Treasurer name (when assigned)

## Advantages Over Previous Format

| Feature | Previous | New |
|---------|----------|-----|
| Visual Structure | Text-based | Professional table |
| Organization Clarity | Simple text | Clear grid layout |
| Prepared By Info | Side by side | Organized in table |
| Contribution Summary | Split across page | Organized columns |
| Professional Appearance | Basic | Tax form style |
| Readability | Good | Excellent |

## Testing

### What to Verify
1. ✅ Table borders are visible and properly aligned
2. ✅ All organization details appear correctly
3. ✅ Contribution amounts are displayed
4. ✅ Year is shown
5. ✅ Donor information is properly placed
6. ✅ Prepared by section shows correctly
7. ✅ No text overlaps with borders
8. ✅ Table is centered on page

### How to Test
1. Go to Reports → Annual Contribution Statement
2. Select a member
3. Click "Generate PDF"
4. Open the PDF
5. Verify table structure and content

## Files Modified

**js/reports.js**
- `generateSingleMemberStatement()` function - Lines ~1100-1170
- `generateAllMembersStatement()` function - Lines ~1370-1490

## Future Enhancements

Possible improvements:
- Configurable table borders and styling
- Dynamic column widths
- Additional fields (phone, email)
- QR code for verification
- Signature lines in table
- Multiple contribution records in table format
- Logo inclusion in table
- Conditional formatting based on contribution amount

## Notes

- Both single and batch PDF generation use identical table format
- Table automatically scales with page width
- Text wrapping handled automatically for long names/addresses
- Professional appearance matches IRS Form 1098-C style
- All financial data properly formatted with currency

