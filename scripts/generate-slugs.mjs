import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ICTIHAT_DIR = path.join(process.cwd(), 'ictihat');

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if ((file.endsWith('.njk') || file.endsWith('.md')) && file !== 'index.njk') {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Match frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (frontmatterMatch) {
        let frontmatter = frontmatterMatch[1];
        
        // Generate a stable hash based on the filename
        const hash = crypto.createHash('sha256').update(file).digest('hex').substring(0, 8);
        
        // Extract permalink and canonical
        const permalinkMatch = frontmatter.match(/permalink:\s*"(.*?)"/);
        const canonicalMatch = frontmatter.match(/canonical:\s*"(.*?)"/);
        
        if (permalinkMatch) {
          let permalink = permalinkMatch[1];
          // Check if already ends with a hash pattern
          if (!/-[a-f0-9]{8}\/?$/.test(permalink)) {
            // Remove trailing slash if exists
            permalink = permalink.replace(/\/$/, '');
            const newPermalink = `${permalink}-${hash}/`;
            frontmatter = frontmatter.replace(permalinkMatch[0], `permalink: "${newPermalink}"`);
            
            if (canonicalMatch) {
                let canonical = canonicalMatch[1];
                canonical = canonical.replace(/\/$/, '');
                const newCanonical = `${canonical}-${hash}/`;
                frontmatter = frontmatter.replace(canonicalMatch[0], `canonical: "${newCanonical}"`);
            }
            
            content = content.replace(frontmatterMatch[1], frontmatter);
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`Updated slugs for: ${file} -> ${newPermalink}`);
          }
        }
      }
    }
  }
}

processDirectory(ICTIHAT_DIR);
console.log('Slug generation complete.');
