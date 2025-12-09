#!/usr/bin/env node

/**
 * Script to import presentations from Obsidian export directory
 * Usage: node import-presentation.js [date] [description]
 * 
 * If date is not provided, it will prompt for it.
 * If description is not provided, it will use a default.
 * 
 * Example:
 *   node import-presentation.js "December 15th" "Weekly meeting updates"
 */

const fs = require('fs');
const path = require('path');

const EXPORT_DIR = 'C:\\Users\\mctou\\OneDrive\\Documents\\GitHub\\Obsidian-Vault\\export';
const FRASSATI_SLIDES_DIR = __dirname;

function formatDate(dateStr) {
    // Convert various date formats to "Month Day" format
    // e.g., "12/15/2025" -> "December 15th"
    // e.g., "December 15th" -> "December 15th"
    // e.g., "Dec 15" -> "December 15th"
    
    if (!dateStr) return null;
    
    // If it already looks like "December 15th", return as is
    if (/^[A-Za-z]+\s+\d+[a-z]{0,2}$/.test(dateStr.trim())) {
        return dateStr.trim();
    }
    
    // Try to parse as date
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        return dateStr.trim();
    }
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    
    // Add ordinal suffix
    let suffix = 'th';
    if (day % 10 === 1 && day % 100 !== 11) suffix = 'st';
    else if (day % 10 === 2 && day % 100 !== 12) suffix = 'nd';
    else if (day % 10 === 3 && day % 100 !== 13) suffix = 'rd';
    
    return `${month} ${day}${suffix}`;
}

function copyDirectory(src, dest) {
    if (!fs.existsSync(src)) {
        throw new Error(`Source directory does not exist: ${src}`);
    }
    
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function fixPathsInHtml(htmlContent) {
    // Replace paths that don't have ../ prefix
    // dist/ -> ../dist/
    // plugin/ -> ../plugin/
    // css/ -> ../css/
    
    let fixed = htmlContent;
    
    // Fix dist paths (but not if already has ../)
    // Captures: attribute, quote type, and path
    fixed = fixed.replace(/(href|src)=(["'])(?!\.\.\/)(dist\/)/g, '$1=$2../$3');
    
    // Fix plugin paths
    fixed = fixed.replace(/(href|src)=(["'])(?!\.\.\/)(plugin\/)/g, '$1=$2../$3');
    
    // Fix css paths
    fixed = fixed.replace(/(href|src)=(["'])(?!\.\.\/)(css\/)/g, '$1=$2../$3');
    
    // Fix mathjax path in the mathjax config (handles both single and double quotes)
    fixed = fixed.replace(/mathjax:\s*(["'])(?!\.\.\/)(plugin\/math\/mathjax\/)/g, 'mathjax: $1../$2');
    
    return fixed;
}

function addToMainIndex(folderName, dateStr, description) {
    const indexPath = path.join(FRASSATI_SLIDES_DIR, 'index.html');
    
    if (!fs.existsSync(indexPath)) {
        throw new Error('Main index.html not found');
    }
    
    let html = fs.readFileSync(indexPath, 'utf8');
    
    // Format date for display (e.g., "December 15th" -> "📅 12/15/2025")
    let displayDate = dateStr;
    const dateMatch = dateStr.match(/(\w+)\s+(\d+)/);
    if (dateMatch) {
        const month = dateMatch[1];
        const day = dateMatch[2];
        const monthNum = new Date(`${month} 1, 2025`).getMonth() + 1;
        const currentYear = new Date().getFullYear();
        displayDate = `📅 ${monthNum}/${day}/${currentYear}`;
    }
    
    // Create the new presentation card HTML
    const newCard = `            <a href="${folderName}/" class="slide-card">
                <h3>${dateStr}</h3>
                <p>${description}</p>
                <div class="slide-meta">
                    <span>${displayDate}</span>
                    <span class="view-btn">View Slides</span>
                </div>
            </a>

            <!-- Template for adding new presentations -->`;
    
    // Replace the template comment with the new card and template
    const templateComment = '            <!-- Template for adding new presentations -->';
    if (html.includes(templateComment)) {
        html = html.replace(templateComment, newCard);
        fs.writeFileSync(indexPath, html, 'utf8');
        return true;
    } else {
        throw new Error('Could not find template comment in index.html');
    }
}

function findExportFolder(dateStr) {
    // Look for a folder matching the date in the export directory
    if (!fs.existsSync(EXPORT_DIR)) {
        return null;
    }
    
    const entries = fs.readdirSync(EXPORT_DIR, { withFileTypes: true });
    
    // Try exact match first
    for (const entry of entries) {
        if (entry.isDirectory() && entry.name === dateStr) {
            return path.join(EXPORT_DIR, entry.name);
        }
    }
    
    // Try case-insensitive match
    for (const entry of entries) {
        if (entry.isDirectory() && entry.name.toLowerCase() === dateStr.toLowerCase()) {
            return path.join(EXPORT_DIR, entry.name);
        }
    }
    
    return null;
}

function listAvailableExports() {
    if (!fs.existsSync(EXPORT_DIR)) {
        return [];
    }
    
    const entries = fs.readdirSync(EXPORT_DIR, { withFileTypes: true });
    return entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
        .sort();
}

function importPresentation(dateInput, description) {
    console.log('🚀 Starting presentation import...\n');
    
    // Check if export directory exists
    if (!fs.existsSync(EXPORT_DIR)) {
        console.error(`❌ Export directory not found: ${EXPORT_DIR}`);
        console.error('   Please check the path in import-presentation.js');
        return;
    }
    
    // Format the date
    const dateStr = formatDate(dateInput || new Date().toLocaleDateString());
    if (!dateStr) {
        console.error('❌ Invalid date format');
        return;
    }
    
    // Find the export folder with this date name
    const exportFolder = findExportFolder(dateStr);
    if (!exportFolder) {
        console.error(`❌ Export folder not found: "${dateStr}"`);
        console.error(`\n   Available export folders:`);
        const available = listAvailableExports();
        if (available.length > 0) {
            available.forEach(folder => console.error(`     - ${folder}`));
        } else {
            console.error('     (no folders found)');
        }
        console.error(`\n   Please check the export directory: ${EXPORT_DIR}`);
        return;
    }
    
    // Check for index.html in the export folder
    const exportIndexPath = path.join(exportFolder, 'index.html');
    if (!fs.existsSync(exportIndexPath)) {
        console.error(`❌ index.html not found in: ${exportFolder}`);
        return;
    }
    
    // Use date as folder name
    const folderName = dateStr;
    const targetFolder = path.join(FRASSATI_SLIDES_DIR, folderName);
    
    // Check if folder already exists
    if (fs.existsSync(targetFolder)) {
        console.error(`❌ Folder "${folderName}" already exists in frassati-slides`);
        console.error('   Please remove it first or use a different date');
        return;
    }
    
    console.log(`📅 Date: ${dateStr}`);
    console.log(`📁 Source: ${exportFolder}`);
    console.log(`📁 Target: ${folderName}`);
    console.log(`📝 Description: ${description || 'No description provided'}\n`);
    
    try {
        // Create target folder
        console.log('📦 Creating folder...');
        fs.mkdirSync(targetFolder, { recursive: true });
        
        // Copy index.html
        console.log('📄 Copying index.html...');
        const targetIndexPath = path.join(targetFolder, 'index.html');
        fs.copyFileSync(exportIndexPath, targetIndexPath);
        
        // Fix paths in index.html
        console.log('🔧 Fixing paths in index.html...');
        let htmlContent = fs.readFileSync(targetIndexPath, 'utf8');
        htmlContent = fixPathsInHtml(htmlContent);
        fs.writeFileSync(targetIndexPath, htmlContent, 'utf8');
        
        // Copy Attachments folder if it exists
        const exportAttachmentsPath = path.join(exportFolder, 'Attachments');
        const targetAttachmentsPath = path.join(targetFolder, 'Attachments');
        if (fs.existsSync(exportAttachmentsPath)) {
            console.log('📎 Copying Attachments folder...');
            copyDirectory(exportAttachmentsPath, targetAttachmentsPath);
        } else {
            console.log('⚠️  Attachments folder not found (skipping)');
        }
        
        // Add to main index.html
        console.log('📋 Adding to main index.html...');
        addToMainIndex(folderName, dateStr, description || 'Presentation slides');
        
        console.log('\n✅ Successfully imported presentation!');
        console.log(`\n🔗 View at: ${folderName}/index.html`);
        console.log(`📂 Files copied to: ${targetFolder}`);
        
    } catch (error) {
        console.error('\n❌ Error during import:', error.message);
        // Clean up on error
        if (fs.existsSync(targetFolder)) {
            console.log('🧹 Cleaning up...');
            fs.rmSync(targetFolder, { recursive: true, force: true });
        }
        process.exit(1);
    }
}

// Command line interface
if (require.main === module) {
    const args = process.argv.slice(2);
    
    let dateInput = null;
    let description = null;
    
    if (args.length > 0) {
        dateInput = args[0];
    }
    if (args.length > 1) {
        description = args.slice(1).join(' ');
    }
    
    // If no date provided, list available exports
    if (!dateInput) {
        console.log('ℹ️  No date provided. Available exports:\n');
        const available = listAvailableExports();
        if (available.length > 0) {
            available.forEach(folder => console.log(`   - ${folder}`));
            console.log('\n   Usage: node import-presentation.js "December 9th" "Description"');
        } else {
            console.log('   (no export folders found)');
            console.log(`\n   Export directory: ${EXPORT_DIR}`);
        }
        return;
    }
    
    // If no description provided, use default
    if (!description) {
        description = 'Presentation slides';
    }
    
    importPresentation(dateInput, description);
}

module.exports = { importPresentation, formatDate, fixPathsInHtml };

