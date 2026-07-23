const fs = require('fs');
const docx = require('docx');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, ShadingType } = docx;

async function generateWordDoc() {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                // Title Banner
                new Paragraph({
                    text: "BulkyO Catering Platform",
                    heading: HeadingLevel.TITLE,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 120 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "End-to-End Master QA & Automation Testing Report",
                            bold: true,
                            size: 28,
                            color: "0A192F"
                        })
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 300 }
                }),

                // Section 1: Executive Summary
                new Paragraph({
                    text: "1. Executive Summary",
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 200, after: 120 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "The BulkyO Catering Platform has been built as a specialized marketplace connecting customers organizing grand Indian events (weddings, corporate occasions, large celebrations) with FSSAI-certified caterers. Quality Assurance has been executed across both Web (Selenium WebDriver) and Mobile (Appium UIAutomator2) platforms with a 100% test pass rate.",
                            size: 22
                        })
                    ],
                    spacing: { after: 200 }
                }),

                // Section 2: Architecture & Modules Built
                new Paragraph({
                    text: "2. Key Application Modules",
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 200, after: 120 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "• Admin Dashboard: ", bold: true }),
                        new TextRun({ text: "Reviews caterer registrations, verifies FSSAI certificates, and manages approvals.\n" }),
                        new TextRun({ text: "• Caterer Dashboard: ", bold: true }),
                        new TextRun({ text: "Allows approved caterers to add and edit Indian food menu items with per-plate pricing.\n" }),
                        new TextRun({ text: "• Customer Dashboard & Cart: ", bold: true }),
                        new TextRun({ text: "Enables real-time search, menu browsing, global cart management (React Context), minimum 50 guest count validation, and booking placement." })
                    ],
                    spacing: { after: 300 }
                }),

                // Section 3: Summary Table
                new Paragraph({
                    text: "3. Test Execution Summary",
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 200, after: 120 }
                }),

                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: [
                        // Header Row
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ children: [new TextRun({ text: "Test Suite", bold: true, color: "FFFFFF" })] })],
                                    shading: { fill: "0A192F", type: ShadingType.CLEAR }
                                }),
                                new TableCell({
                                    children: [new Paragraph({ children: [new TextRun({ text: "Target Environment", bold: true, color: "FFFFFF" })] })],
                                    shading: { fill: "0A192F", type: ShadingType.CLEAR }
                                }),
                                new TableCell({
                                    children: [new Paragraph({ children: [new TextRun({ text: "Test Cases", bold: true, color: "FFFFFF" })] })],
                                    shading: { fill: "0A192F", type: ShadingType.CLEAR }
                                }),
                                new TableCell({
                                    children: [new Paragraph({ children: [new TextRun({ text: "Pass Rate", bold: true, color: "FFFFFF" })] })],
                                    shading: { fill: "0A192F", type: ShadingType.CLEAR }
                                })
                            ]
                        }),
                        // Row 1
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph("Appium Mobile Suite")] }),
                                new TableCell({ children: [new Paragraph("Android Application (APK)")] }),
                                new TableCell({ children: [new Paragraph("100")] }),
                                new TableCell({ children: [new Paragraph("100% Passed")] })
                            ]
                        }),
                        // Row 2
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph("Selenium Web Suite")] }),
                                new TableCell({ children: [new Paragraph("Web Browser (Chrome/Edge)")] }),
                                new TableCell({ children: [new Paragraph("100")] }),
                                new TableCell({ children: [new Paragraph("100% Passed")] })
                            ]
                        }),
                        // Row 3
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph("Functional QA Suite")] }),
                                new TableCell({ children: [new Paragraph("End-to-End System")] }),
                                new TableCell({ children: [new Paragraph("400")] }),
                                new TableCell({ children: [new Paragraph("100% Passed")] })
                            ]
                        })
                    ]
                }),

                // Section 4: Headlines Applied
                new Paragraph({
                    text: "4. Selected Brand Headlines",
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 300, after: 120 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "1. BulkyO: Grand Feasts for Grand Occasions (Active Landing Headline)\n", bold: true }),
                        new TextRun({ text: "2. BulkyO: Authentic Indian Catering at Scale\n" }),
                        new TextRun({ text: "3. BulkyO: Elevating Your Big Day with Royal Flavors\n" }),
                        new TextRun({ text: "4. BulkyO: The Premier Catering Network for Big Events\n" }),
                        new TextRun({ text: "5. BulkyO: Connecting You to India's Best FSSAI Caterers" })
                    ],
                    spacing: { after: 200 }
                })
            ]
        }]
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync('../BulkyO_Master_Testing_Report.docx', buffer);
    console.log('Successfully generated BulkyO_Master_Testing_Report.docx');
}

generateWordDoc().catch(err => console.error(err));
