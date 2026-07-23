const fs = require('fs');
const docx = require('docx');
const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, BorderStyle, Table, TableRow, TableCell, WidthType } = docx;

async function generateDocumentation() {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                // Title
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 200, after: 100 },
                    children: [
                        new TextRun({
                            text: "React Deployment and Selenium/Appium E2E Testing Documentation",
                            bold: true,
                            size: 32,
                            color: "0A192F",
                            font: "Segoe UI"
                        })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                    children: [
                        new TextRun({
                            text: "A Step-by-Step Guide to CI/CD Deployment and Automated QA Pipelines for BulkyO",
                            italic: true,
                            size: 20,
                            color: "64748B",
                            font: "Segoe UI"
                        })
                    ]
                }),

                // Step 1
                new Paragraph({
                    text: "Step 1 - Push Your React Project to GitHub",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Initialize your git repository and push to your remote GitHub repository:", size: 22 })
                    ]
                }),
                new Paragraph({
                    spacing: { before: 100, after: 200 },
                    indent: { left: 720 },
                    children: [
                        new TextRun({ text: "git init\ngit add .\ngit commit -m \"Initial frontend upload\"\ngit branch -M main\ngit remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git\ngit push -u origin main", font: "Courier New", color: "A31515", size: 20 })
                    ]
                }),

                // Step 2
                new Paragraph({
                    text: "Step 2 - Install GitHub Pages Package",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Install the GitHub Pages deployment package as a development dependency:", size: 22 })
                    ]
                }),
                new Paragraph({
                    spacing: { before: 100, after: 200 },
                    indent: { left: 720 },
                    children: [
                        new TextRun({ text: "npm install gh-pages --save-dev", font: "Courier New", color: "A31515", size: 20 })
                    ]
                }),

                // Step 3
                new Paragraph({
                    text: "Step 3 - Update package.json",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Configure properties in your package.json to declare your deployment target and commands:", size: 22 })
                    ]
                }),
                new Paragraph({
                    spacing: { before: 100, after: 200 },
                    indent: { left: 720 },
                    children: [
                        new TextRun({ 
                            text: '"homepage": "https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME",\n\n"scripts": {\n  "predeploy": "npm run build",\n  "deploy": "gh-pages -d dist"\n}', 
                            font: "Courier New", 
                            color: "0000FF", 
                            size: 20 
                        })
                    ]
                }),

                // Step 4
                new Paragraph({
                    text: "Step 4 - Deploy React Project to GitHub Pages",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Run the deploy script to compile the production build and upload it to GitHub Pages:", size: 22 })
                    ]
                }),
                new Paragraph({
                    spacing: { before: 100, after: 200 },
                    indent: { left: 720 },
                    children: [
                        new TextRun({ text: "npm run deploy", font: "Courier New", color: "A31515", size: 20 })
                    ]
                }),

                // Step 5
                new Paragraph({
                    text: "Step 5 - Enable GitHub Pages Settings",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ 
                            text: "1. Open your repository on GitHub.\n2. Go to Settings -> Pages.\n3. Verify the Source is set to 'Deploy from a branch'.\n4. Under Branch, select 'gh-pages' and folder '/(root)'.\n5. Save configuration changes.", 
                            size: 22 
                        })
                    ],
                    spacing: { after: 200 }
                }),

                // Step 6
                new Paragraph({
                    text: "Step 6 - Access live application",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Open the live URL printed on your GitHub Pages dashboard to view your application globally.", size: 22 })
                    ]
                }),

                // Step 7
                new Paragraph({
                    text: "Step 7 - Configure React Router for GitHub Pages",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "To support client-side routing on GitHub Pages without 404 failures on manual reload, wrap your application in HashRouter instead of BrowserRouter:", size: 22 })
                    ]
                }),
                new Paragraph({
                    spacing: { before: 100, after: 200 },
                    indent: { left: 720 },
                    children: [
                        new TextRun({ 
                            text: "import { HashRouter as Router } from 'react-router-dom';", 
                            font: "Courier New", 
                            color: "0000FF", 
                            size: 20 
                        })
                    ]
                }),

                // Step 8
                new Paragraph({
                    text: "Step 8 - Rebuild and Redeploy",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Redeploy the application with the updated router config:", size: 22 })
                    ]
                }),
                new Paragraph({
                    spacing: { before: 100, after: 200 },
                    indent: { left: 720 },
                    children: [
                        new TextRun({ text: "npm run deploy", font: "Courier New", color: "A31515", size: 20 })
                    ]
                }),

                // Step 9
                new Paragraph({
                    text: "Step 9 - Verify Deployment",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Test the active site, confirm all dashboard links function, and check the cart state remains active.", size: 22 })
                    ],
                    spacing: { after: 200 }
                }),

                // Step 10
                new Paragraph({
                    text: "Step 10 - Add Selenium & Appium E2E Testing",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Install testing dependencies to support both Web and Android automation testing pipelines:", size: 22 })
                    ]
                }),
                new Paragraph({
                    spacing: { before: 100, after: 200 },
                    indent: { left: 720 },
                    children: [
                        new TextRun({ text: "npm install selenium-webdriver webdriverio --save-dev", font: "Courier New", color: "A31515", size: 20 })
                    ]
                }),

                // Step 11
                new Paragraph({
                    text: "Step 11 - Create Test Directory Structure",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Organize automation scripts under a separate folder:", size: 22 })
                    ]
                }),
                new Paragraph({
                    spacing: { before: 100, after: 200 },
                    indent: { left: 720 },
                    children: [
                        new TextRun({ 
                            text: "|-- automation_tests/\n|   |-- appium/\n|   |   |-- test_bulkyo_android.py\n|   |-- selenium/\n|   |   |-- test_bulkyo_web.py", 
                            font: "Courier New", 
                            color: "2E7D32", 
                            size: 20 
                        })
                    ]
                }),

                // Step 12
                new Paragraph({
                    text: "Step 12 - Add Unique Identifiers / Locators for Automation",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Ensure unique elements have locators targeting email, passwords, and buttons:", size: 22 })
                    ]
                }),
                new Paragraph({
                    spacing: { before: 100, after: 200 },
                    indent: { left: 720 },
                    children: [
                        new TextRun({ 
                            text: "const emailInput = driver.findElement(By.css('input[placeholder=\"Enter email\"]'));\nconst passwordInput = driver.findElement(By.css('input[placeholder=\"Enter password\"]'));\nconst submitButton = driver.findElement(By.css('button[type=\"submit\"]'));", 
                            font: "Courier New", 
                            color: "0000FF", 
                            size: 20 
                        })
                    ]
                }),

                // Step 13
                new Paragraph({
                    text: "Step 13 - Run Tests Locally",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Run local test commands to verify test suites before deployment:", size: 22 })
                    ]
                }),
                new Paragraph({
                    spacing: { before: 100, after: 200 },
                    indent: { left: 720 },
                    children: [
                        new TextRun({ text: "node automation_tests/selenium/test_bulkyo_web.cjs", font: "Courier New", color: "A31515", size: 20 })
                    ]
                }),

                // Step 14
                new Paragraph({
                    text: "Step 14 - Setup GitHub Actions CI/CD Pipeline",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Create a GitHub Actions workflow file under '.github/workflows/e2e-tests.yml' to trigger automatic testing:", size: 22 })
                    ]
                }),
                new Paragraph({
                    spacing: { before: 100, after: 200 },
                    indent: { left: 720 },
                    children: [
                        new TextRun({ 
                            text: "name: BulkyO CI/CD Testing\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - name: Install dependencies\n        run: npm ci\n      - name: Run Web Selenium Tests\n        run: npm run test:web", 
                            font: "Courier New", 
                            color: "0000FF", 
                            size: 20 
                        })
                    ]
                }),

                // Step 15
                new Paragraph({
                    text: "Step 15 - Automatic CI/CD Testing Pipeline Flow",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "The diagram below shows the end-to-end continuous integration and deployment testing pipeline flow:", size: 22 })
                    ],
                    spacing: { after: 200 }
                }),

                // Flowchart represented as a structured table
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1. GitHub Repository\n(Code Push)", bold: true, color: "0A192F" })] })],
                                    width: { size: 20, type: WidthType.PERCENTAGE }
                                }),
                                new TableCell({
                                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "2. GitHub Actions\n(Pipeline Triggered)", bold: true, color: "0A192F" })] })],
                                    width: { size: 20, type: WidthType.PERCENTAGE }
                                }),
                                new TableCell({
                                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "3. Selenium / Appium\n(Automated Testing)", bold: true, color: "0A192F" })] })],
                                    width: { size: 20, type: WidthType.PERCENTAGE }
                                }),
                                new TableCell({
                                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "4. Production Deploy\n(GitHub Pages / APK)", bold: true, color: "0A192F" })] })],
                                    width: { size: 20, type: WidthType.PERCENTAGE }
                                }),
                                new TableCell({
                                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "5. Pass / Fail Report\n(Feedback Loop)", bold: true, color: "0A192F" })] })],
                                    width: { size: 20, type: WidthType.PERCENTAGE }
                                })
                            ]
                        })
                    ]
                }),

                new Paragraph({
                    spacing: { before: 200 },
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: "This pipeline ensures a resilient frontend deployment and comprehensive automated testing cycle.",
                            italic: true,
                            size: 18,
                            color: "64748B"
                        })
                    ]
                })
            ]
        }]
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync('../BulkyO_Deployment_and_Testing_Documentation.docx', buffer);
    console.log("Successfully generated BulkyO_Deployment_and_Testing_Documentation.docx");
}

generateDocumentation().catch(err => console.error(err));
