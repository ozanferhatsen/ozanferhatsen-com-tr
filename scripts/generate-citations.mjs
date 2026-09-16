import fs from 'fs';
import path from 'path';

const ICTIHAT_DIR = path.join(process.cwd(), 'ictihat');

// First pass: gather all decisions and their Esas/Karar numbers
const decisions = {}; // key: "2023/648-2025/512", value: filename

function extractEsasKarar(content) {
  // Look for Esas No: 2023/648<br>Karar No: 2025/512
  const esasMatch = content.match(/Esas No:.*?(\d+\/\d+)/i);
  const kararMatch = content.match(/Karar No:.*?(\d+\/\d+)/i);
  if (esasMatch && kararMatch) {
    return `${esasMatch[1]}-${kararMatch[1]}`;
  }
  return null;
}

function gatherDecisions(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      gatherDecisions(fullPath);
    } else if ((file.endsWith('.njk') || file.endsWith('.md')) && file !== 'index.njk') {
      const content = fs.readFileSync(fullPath, 'utf8');
      const id = extractEsasKarar(content);
      if (id) {
        decisions[id] = { file: fullPath, slug: file.replace(/\.(njk|md)$/, '') };
      }
    }
  }
}

gatherDecisions(ICTIHAT_DIR);
console.log(`Gathered ${Object.keys(decisions).length} decisions with Esas/Karar numbers.`);

// Second pass: read text to find citations
const citationRegex = /E\.\s*(\d+\/\d+)[\s,]*K\.\s*(\d+\/\d+)/gi;

function addCitations(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      addCitations(fullPath);
    } else if ((file.endsWith('.njk') || file.endsWith('.md')) && file !== 'index.njk') {
      let content = fs.readFileSync(fullPath, 'utf8');
      const currentId = extractEsasKarar(content);
      let match;
      const citations = new Set();
      
      while ((match = citationRegex.exec(content)) !== null) {
        const citedId = `${match[1]}-${match[2]}`;
        // Prevent self-citation and check if cited decision exists in our db
        if (citedId !== currentId && decisions[citedId]) {
          citations.add(citedId);
        }
      }
      
      if (citations.size > 0) {
        // Find the cited decisions and add this file to their `cited_by` frontmatter
        for (const citedId of citations) {
            const citedInfo = decisions[citedId];
            let citedContent = fs.readFileSync(citedInfo.file, 'utf8');
            const frontmatterMatch = citedContent.match(/^---\n([\s\S]*?)\n---/);
            if (frontmatterMatch) {
                let fm = frontmatterMatch[1];
                const currentSlug = file.replace(/\.(njk|md)$/, '');
                
                // If it doesn't have cited_by, add it. If it does, append it.
                if (!fm.includes('cited_by:')) {
                    fm += `\ncited_by:\n  - "${currentSlug}"`;
                } else {
                    // Very simple parsing, just append if not exists
                    if (!fm.includes(`- "${currentSlug}"`)) {
                        fm = fm.replace(/(cited_by:.*(\n\s+-.*)*)/, `$1\n  - "${currentSlug}"`);
                    }
                }
                
                citedContent = citedContent.replace(frontmatterMatch[1], fm);
                fs.writeFileSync(citedInfo.file, citedContent, 'utf8');
                console.log(`Added citation to ${citedInfo.file}: Cited by ${currentSlug}`);
            }
        }
      }
    }
  }
}

addCitations(ICTIHAT_DIR);
console.log('Citation mapping complete.');
