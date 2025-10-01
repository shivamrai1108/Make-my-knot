const fs = require('fs');
const path = require('path');

// Check if html2canvas and jspdf are available (already in package.json)
const htmlFile = path.join(__dirname, 'PROJECT_HANDOVER_DOCUMENTATION.html');
const pdfFile = path.join(__dirname, 'PROJECT_HANDOVER_DOCUMENTATION.pdf');

// Since we have html2canvas and jspdf in package.json, let's create a browser-based solution
const htmlContent = fs.readFileSync(htmlFile, 'utf8');

// Enhanced HTML with better print styles
const enhancedHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Make My Knot - Project Handover Documentation</title>
    <style>
        @page {
            margin: 1in;
            size: A4;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #2d3748;
            max-width: none;
            margin: 0;
            padding: 0;
        }
        
        h1 {
            color: #1a202c;
            font-size: 28px;
            border-bottom: 3px solid #4f46e5;
            padding-bottom: 10px;
            page-break-after: avoid;
        }
        
        h2 {
            color: #2d3748;
            font-size: 22px;
            margin-top: 30px;
            page-break-after: avoid;
        }
        
        h3 {
            color: #4a5568;
            font-size: 18px;
            margin-top: 25px;
            page-break-after: avoid;
        }
        
        h4 {
            color: #4a5568;
            font-size: 16px;
            margin-top: 20px;
            page-break-after: avoid;
        }
        
        pre {
            background: #f7fafc;
            padding: 16px;
            border-radius: 8px;
            overflow-x: auto;
            border-left: 4px solid #4f46e5;
            font-size: 12px;
            page-break-inside: avoid;
        }
        
        code {
            background: #edf2f7;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 13px;
        }
        
        .toc {
            background: #f7fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #4f46e5;
            page-break-inside: avoid;
        }
        
        .toc ul {
            list-style-type: none;
            padding-left: 20px;
        }
        
        .toc li {
            margin: 8px 0;
        }
        
        .toc a {
            color: #4f46e5;
            text-decoration: none;
        }
        
        .toc a:hover {
            text-decoration: underline;
        }
        
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
            page-break-inside: avoid;
        }
        
        th, td {
            border: 1px solid #e2e8f0;
            padding: 12px;
            text-align: left;
        }
        
        th {
            background: #f7fafc;
            font-weight: 600;
        }
        
        .section-break {
            page-break-before: always;
        }
        
        .no-break {
            page-break-inside: avoid;
        }
        
        ul, ol {
            margin: 15px 0;
            padding-left: 30px;
        }
        
        li {
            margin: 8px 0;
        }
        
        blockquote {
            border-left: 4px solid #4f46e5;
            margin: 20px 0;
            padding: 15px 20px;
            background: #f7fafc;
            font-style: italic;
        }
        
        .checklist {
            list-style-type: none;
            padding-left: 0;
        }
        
        .checklist li::before {
            content: "✅ ";
            color: #48bb78;
            font-weight: bold;
            margin-right: 5px;
        }
        
        .todo-list {
            list-style-type: none;
            padding-left: 0;
        }
        
        .todo-list li::before {
            content: "☐ ";
            color: #a0aec0;
            font-weight: bold;
            margin-right: 5px;
        }
        
        /* Print-specific styles */
        @media print {
            body {
                font-size: 12px;
            }
            
            h1 {
                font-size: 24px;
            }
            
            h2 {
                font-size: 20px;
            }
            
            h3 {
                font-size: 16px;
            }
            
            pre {
                font-size: 10px;
            }
            
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
${htmlContent.replace(/<body[^>]*>([\s\S]*?)<\/body>/i, '$1')}
</body>
</html>
`;

// Write the enhanced HTML
fs.writeFileSync(path.join(__dirname, 'PROJECT_HANDOVER_DOCUMENTATION_ENHANCED.html'), enhancedHtml);

console.log('Enhanced HTML file created: PROJECT_HANDOVER_DOCUMENTATION_ENHANCED.html');
console.log('');
console.log('To convert to PDF:');
console.log('1. Open PROJECT_HANDOVER_DOCUMENTATION_ENHANCED.html in Chrome/Safari');
console.log('2. Press Cmd+P (Mac) or Ctrl+P (Windows)');
console.log('3. Select "Save as PDF" as destination');
console.log('4. Choose "More settings" and select:');
console.log('   - Paper size: A4');
console.log('   - Margins: Default');
console.log('   - Options: Background graphics (checked)');
console.log('5. Save as PROJECT_HANDOVER_DOCUMENTATION.pdf');
console.log('');
console.log('Alternative: Use Chrome headless:');
console.log('google-chrome --headless --disable-gpu --print-to-pdf=PROJECT_HANDOVER_DOCUMENTATION.pdf PROJECT_HANDOVER_DOCUMENTATION_ENHANCED.html');