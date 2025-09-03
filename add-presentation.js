#!/usr/bin/env node

/**
 * Script to add new presentations to the main index
 * Usage: node add-presentation.js "Presentation Name" "Description" "folder-name"
 */

const fs = require('fs');
const path = require('path');

function addPresentation(name, description, folderName) {
    const indexPath = './index.html';
    
    if (!fs.existsSync(indexPath)) {
        console.error('❌ index.html not found in current directory');
        return;
    }
    
    if (!fs.existsSync(folderName)) {
        console.error(`❌ Folder "${folderName}" not found`);
        return;
    }
    
    let html = fs.readFileSync(indexPath, 'utf8');
    
    // Create the new presentation card HTML
    const newCard = `            <a href="${folderName}/" class="slide-card">
                <h3>${name}</h3>
                <p>${description}</p>
                <div class="slide-meta">
                    <span>📅 ${new Date().toLocaleDateString()}</span>
                    <span class="view-btn">View Slides</span>
                </div>
            </a>

            <!-- Template for adding new presentations -->`;
    
    // Replace the template comment with the new card and template
    const templateComment = '            <!-- Template for adding new presentations -->';
    if (html.includes(templateComment)) {
        html = html.replace(templateComment, newCard);
        
        // Write the updated HTML back to the file
        fs.writeFileSync(indexPath, html, 'utf8');
        console.log(`✅ Successfully added "${name}" to the index`);
        console.log(`🔗 Link: ${folderName}/`);
    } else {
        console.error('❌ Could not find template comment in index.html');
    }
}

// Command line interface
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length < 3) {
        console.log('Usage: node add-presentation.js "Presentation Name" "Description" "folder-name"');
        console.log('');
        console.log('Example:');
        console.log('  node add-presentation.js "October Meeting" "Monthly updates and announcements" "October-meeting"');
        return;
    }
    
    const [name, description, folderName] = args;
    addPresentation(name, description, folderName);
}

module.exports = { addPresentation };
