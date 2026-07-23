const XLSX = require('xlsx');

const headlines = [
    { Category: "The Big Fat Indian Wedding & Grandeur", Headline: "BulkyO: The Big Fat Indian Wedding Catering Platform" },
    { Category: "The Big Fat Indian Wedding & Grandeur", Headline: "BulkyO: Premium Catering Connections for Monumental Celebrations" },
    { Category: "The Big Fat Indian Wedding & Grandeur", Headline: "BulkyO: Where Massive Events Meet Magnificent Menus" },
    { Category: "The Big Fat Indian Wedding & Grandeur", Headline: "BulkyO: Uniting Top Caterers with Epic Indian Weddings" },
    { Category: "The Big Fat Indian Wedding & Grandeur", Headline: "BulkyO: Because Indian Weddings Deserve the Best Food" },
    { Category: "Scale & Bulk Ordering", Headline: "BulkyO: Scaling Authentic Indian Flavors for Your Grand Events" },
    { Category: "Scale & Bulk Ordering", Headline: "BulkyO: Bulk Orders, Royal Tastes" },
    { Category: "Scale & Bulk Ordering", Headline: "BulkyO: Massive Menus for Magical Moments" },
    { Category: "Scale & Bulk Ordering", Headline: "BulkyO: Feasting at Scale – Discover Catering Giants" },
    { Category: "Scale & Bulk Ordering", Headline: "BulkyO: The Grand Scale of Indian Culinary Excellence" },
    { Category: "Trust, Quality & FSSAI", Headline: "BulkyO: Your Gateway to Certified Indian Catering Masters" },
    { Category: "Trust, Quality & FSSAI", Headline: "BulkyO: Feeding the Multitudes with Certified Perfection" },
    { Category: "Trust, Quality & FSSAI", Headline: "BulkyO: Safe, Certified, and Spectacular Catering" },
    { Category: "Trust, Quality & FSSAI", Headline: "BulkyO: Trusted Catering for Life’s Biggest Celebrations" },
    { Category: "Trust, Quality & FSSAI", Headline: "BulkyO: Verified Caterers. Unforgettable Food." }
];

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(headlines);

// Adjust column widths
ws['!cols'] = [ { wch: 40 }, { wch: 80 } ];

XLSX.utils.book_append_sheet(wb, ws, "Headlines");
XLSX.writeFile(wb, '../BulkyO_Headlines.xlsx');
console.log("Generated BulkyO_Headlines.xlsx");
