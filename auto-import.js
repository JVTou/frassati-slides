#!/usr/bin/env node

/**
 * Script to automatically import all new presentations from the export directory
 * This script finds all folders in the export directory that don't exist in frassati-slides
 * and imports them automatically.
 * 
 * Usage: node auto-import.js [export-dir]
 */

const fs = require('fs');
const path = require('path');
const { importPresentation } = require('./import-presentation');

const FRASSATI_SLIDES_DIR = __dirname;

function getExistingPresentations() {
    // Get all folders in frassati-slides that are presentations
    if (!fs.existsSync(FRASSATI_SLIDES_DIR)) {
        return [];
    }
    
    const entries = fs.readdirSync(FRASSATI_SLIDES_DIR, { withFileTypes: true });
    return entries
        .filter(entry => entry.isDirectory())
        .filter(entry => {
            // Check if it's a presentation folder (has index.html)
            const indexPath = path.join(FRASSATI_SLIDES_DIR, entry.name, 'index.html');
            return fs.existsSync(indexPath);
        })
        .map(entry => entry.name);
}

function getExportFolders(exportDir) {
    if (!fs.existsSync(exportDir)) {
        return [];
    }
    
    const entries = fs.readdirSync(exportDir, { withFileTypes: true });
    return entries
        .filter(entry => entry.isDirectory())
        .filter(entry => {
            // Check if it has an index.html
            const indexPath = path.join(exportDir, entry.name, 'index.html');
            return fs.existsSync(indexPath);
        })
        .map(entry => entry.name);
}

function autoImport(exportDir) {
    console.log('🔍 Scanning for new presentations...\n');
    
    if (!fs.existsSync(exportDir)) {
        console.error(`❌ Export directory not found: ${exportDir}`);
        process.exit(1);
    }
    
    const existing = getExistingPresentations();
    const exports = getExportFolders(exportDir);
    
    console.log(`📂 Found ${existing.length} existing presentations`);
    console.log(`📦 Found ${exports.length} folders in export directory\n`);
    
    // Find folders that exist in export but not in frassati-slides
    const newFolders = exports.filter(folder => !existing.includes(folder));
    
    if (newFolders.length === 0) {
        console.log('✅ No new presentations to import');
        return;
    }
    
    console.log(`🚀 Found ${newFolders.length} new presentation(s) to import:\n`);
    newFolders.forEach(folder => console.log(`   - ${folder}`));
    console.log('');
    
    let successCount = 0;
    let failCount = 0;
    
    for (const folderName of newFolders) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`📅 Importing: ${folderName}`);
        console.log('='.repeat(60));
        
        try {
            // Set the export directory environment variable
            process.env.OBSIDIAN_EXPORT_DIR = exportDir;
            
            // Import using the folder name as the date
            importPresentation(folderName, 'Presentation slides');
            successCount++;
        } catch (error) {
            console.error(`❌ Failed to import ${folderName}:`, error.message);
            failCount++;
        }
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log('📊 Import Summary:');
    console.log(`   ✅ Successfully imported: ${successCount}`);
    if (failCount > 0) {
        console.log(`   ❌ Failed: ${failCount}`);
    }
    console.log('='.repeat(60));
    
    if (failCount > 0) {
        process.exit(1);
    }
}

// Command line interface
if (require.main === module) {
    const exportDir = process.argv[2] || process.env.OBSIDIAN_EXPORT_DIR || 'C:\\Users\\mctou\\OneDrive\\Documents\\GitHub\\Obsidian-Vault\\export';
    autoImport(exportDir);
}

module.exports = { autoImport };

