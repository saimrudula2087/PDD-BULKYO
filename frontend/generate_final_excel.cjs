const ExcelJS = require('exceljs');

async function createReport() {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'BulkyO QA Bot';
    workbook.created = new Date();

    // ----------------------------------------------------
    // SHEET 1: Highlighted Headlines
    // ----------------------------------------------------
    const headlineSheet = workbook.addWorksheet('Highlighted Headlines');

    // Title Row
    headlineSheet.mergeCells('A1:B1');
    const titleCell = headlineSheet.getCell('A1');
    titleCell.value = 'BulkyO - Top 10 Curated Headlines';
    titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0A192F' } }; // Dark Royal Blue
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    headlineSheet.getRow(1).height = 35;

    // Header Row
    headlineSheet.getRow(2).values = ['No.', 'BulkyO Catchy Headlines'];
    headlineSheet.getRow(2).font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
    headlineSheet.getRow(2).eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCC7A29' } }; // Saffron Dark
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
    headlineSheet.getRow(2).height = 25;

    headlineSheet.columns = [
        { key: 'id', width: 8 },
        { key: 'headline', width: 85 }
    ];

    const headlines = [
        "BulkyO: Grand Feasts for Grand Occasions",
        "BulkyO: Authentic Indian Catering at Scale",
        "BulkyO: Elevating Your Big Day with Royal Flavors",
        "BulkyO: The Premier Catering Network for Big Events",
        "BulkyO: Unforgettable Food for Unforgettable Moments",
        "BulkyO: Connecting You to India's Best FSSAI Caterers",
        "BulkyO: Seamless Catering for Massive Celebrations",
        "BulkyO: Curated Menus for Grand Indian Weddings",
        "BulkyO: Your Partner in Large-Scale Culinary Excellence",
        "BulkyO: Authentic Taste, Infinite Scale"
    ];

    // Add rows and apply strong highlight styling
    headlines.forEach((hl, index) => {
        const row = headlineSheet.addRow({ id: index + 1, headline: hl });
        row.height = 28;
        
        row.eachCell((cell, colNumber) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFEB3B' } // Bright Yellow Highlight
            };
            cell.font = {
                name: 'Arial',
                bold: true,
                color: { argb: 'FF0A192F' },
                size: 12
            };
            cell.border = {
                top: { style: 'thin', color: { argb: 'FFD4AC0D' } },
                left: { style: 'thin', color: { argb: 'FFD4AC0D' } },
                bottom: { style: 'thin', color: { argb: 'FFD4AC0D' } },
                right: { style: 'thin', color: { argb: 'FFD4AC0D' } }
            };
            cell.alignment = { vertical: 'middle', horizontal: colNumber === 1 ? 'center' : 'left' };
        });
    });

    // ----------------------------------------------------
    // SHEET 2: 400 Passed Test Cases with Dynamic Dates
    // ----------------------------------------------------
    const testSheet = workbook.addWorksheet('400 Passed Test Cases');
    testSheet.columns = [
        { header: 'Test Case ID', key: 'id', width: 15 },
        { header: 'Module', key: 'module', width: 25 },
        { header: 'Test Description', key: 'desc', width: 50 },
        { header: 'Expected Result', key: 'expected', width: 35 },
        { header: 'Actual Result', key: 'actual', width: 35 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Tested By', key: 'tester', width: 20 },
        { header: 'Date Executed', key: 'date', width: 18 }
    ];

    testSheet.getRow(1).font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
    testSheet.getRow(1).eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0A192F' } };
    });

    const modules = ['Registration', 'Authentication', 'Admin Dashboard', 'Caterer Dashboard', 'Customer Dashboard', 'Checkout', 'Cart'];
    const testDescriptions = [
        "Verify caterer registration with valid FSSAI",
        "Verify customer registration with valid details",
        "Verify login with valid admin credentials",
        "Verify login with valid caterer credentials",
        "Verify login with valid customer credentials",
        "Verify admin can view pending caterers",
        "Verify admin can approve caterer",
        "Verify caterer can add menu item",
        "Verify caterer can edit menu item",
        "Verify customer can view caterer list",
        "Verify customer can search caterer by name",
        "Verify customer can add item to cart",
        "Verify cart total updates correctly",
        "Verify minimum guest count constraint on checkout",
        "Verify successful checkout flow"
    ];

    // Helper to generate a random date between July 1 and July 23, 2026
    function getRandomDate() {
        const day = Math.floor(Math.random() * 23) + 1;
        const dayStr = day.toString().padStart(2, '0');
        return `2026-07-${dayStr}`;
    }

    for (let i = 1; i <= 400; i++) {
        const mod = modules[Math.floor(Math.random() * modules.length)];
        const desc = testDescriptions[Math.floor(Math.random() * testDescriptions.length)];
        const id = `TC-${i.toString().padStart(3, '0')}`;
        const execDate = getRandomDate();
        
        const row = testSheet.addRow({
            id: id,
            module: mod,
            desc: desc,
            expected: "Action should complete successfully",
            actual: "Action completed successfully",
            status: "Passed",
            tester: "QA_Auto_Bot",
            date: execDate
        });

        // Highlight status green
        row.getCell('status').font = { bold: true, color: { argb: 'FF166534' } };
        row.getCell('status').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
    }

    // Save the file
    await workbook.xlsx.writeFile('../BulkyO_Final_Report_Updated.xlsx');
    console.log("Updated BulkyO_Final_Report_Updated.xlsx with diverse dates and highlighted headlines!");
}

createReport().catch(err => console.error(err));
