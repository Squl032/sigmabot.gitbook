// ===== MARKDOWN PARSER =====
class MarkdownParser {
    constructor() {
        this.headingAnchors = [];
    }

    // Parse markdown to HTML
    parse(markdown) {
        let html = markdown;
        
        // Clear previous headings
        this.headingAnchors = [];
        
        // Parse headings with anchors
        html = this.parseHeadings(html);
        
        // Parse links
        html = this.parseLinks(html);
        
        // Parse bold and italic
        html = this.parseEmphasis(html);
        
        // Parse code blocks
        html = this.parseCodeBlocks(html);
        
        // Parse inline code
        html = this.parseInlineCode(html);
        
        // Parse lists
        html = this.parseLists(html);
        
        // Parse blockquotes
        html = this.parseBlockquotes(html);
        
        // Parse tables
        html = this.parseTables(html);
        
        // Parse horizontal rules
        html = this.parseHorizontalRules(html);
        
        // Parse line breaks
        html = this.parseLineBreaks(html);
        
        // Parse paragraphs (must be last)
        html = this.parseParagraphs(html);
        
        return html;
    }

    // Generate slug from text
    generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // Parse headings
    parseHeadings(html) {
        return html.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
            const level = hashes.length;
            const slug = this.generateSlug(text.replace(/[*_`]/g, ''));
            const anchor = `<a href="#${slug}" class="anchor" aria-hidden="true">#</a>`;
            
            // Store heading for TOC
            this.headingAnchors.push({
                level: level,
                text: text.replace(/[*_`]/g, ''),
                slug: slug
            });
            
            return `<h${level} id="${slug}">${anchor}${text}</h${level}>`;
        });
    }

    // Parse links
    parseLinks(html) {
        // Regular links [text](url)
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
        
        // Auto links <url>
        html = html.replace(/<(https?:\/\/[^>]+)>/g, '<a href="$1" target="_blank">$1</a>');
        
        return html;
    }

    // Parse emphasis (bold and italic)
    parseEmphasis(html) {
        // Bold **text** or __text__
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
        
        // Italic *text* or _text_
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
        
        return html;
    }

    // Parse code blocks
    parseCodeBlocks(html) {
        return html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            const language = lang ? ` data-lang="${lang}"` : '';
            return `<pre${language}><code>${this.escapeHtml(code.trim())}</code></pre>`;
        });
    }

    // Parse inline code
    parseInlineCode(html) {
        return html.replace(/`([^`]+)`/g, '<code>$1</code>');
    }

    // Parse lists
    parseLists(html) {
        // Unordered lists
        html = html.replace(/^(\s*)[-*+]\s+(.+)$/gm, '$1<li>$2</li>');
        
        // Ordered lists
        html = html.replace(/^(\s*)\d+\.\s+(.+)$/gm, '$1<li>$2</li>');
        
        // Wrap consecutive list items in ul/ol tags
        html = this.wrapLists(html);
        
        return html;
    }

    // Wrap list items in appropriate list tags
    wrapLists(html) {
        const lines = html.split('\n');
        const result = [];
        let inList = false;
        let listType = null;
        let listDepth = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const listMatch = line.match(/^(\s*)<li>(.+)<\/li>$/);
            
            if (listMatch) {
                const indent = listMatch[1].length;
                const content = listMatch[2];
                
                if (!inList) {
                    // Start new list
                    listType = 'ul'; // Default to unordered
                    result.push(`${listMatch[1]}<ul>`);
                    inList = true;
                    listDepth = indent;
                }
                
                result.push(line);
            } else {
                if (inList) {
                    // End current list
                    result.push(`${''.repeat(listDepth)}</ul>`);
                    inList = false;
                    listType = null;
                    listDepth = 0;
                }
                result.push(line);
            }
        }
        
        // Close any remaining open lists
        if (inList) {
            result.push(`${''.repeat(listDepth)}</ul>`);
        }
        
        return result.join('\n');
    }

    // Parse blockquotes
    parseBlockquotes(html) {
        return html.replace(/^>\s+(.+)$/gm, '<blockquote><p>$1</p></blockquote>');
    }

    // Parse tables
    parseTables(html) {
        const lines = html.split('\n');
        const result = [];
        let inTable = false;
        let tableRows = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line.includes('|') && line.split('|').length > 2) {
                if (!inTable) {
                    inTable = true;
                    tableRows = [];
                }
                
                const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
                
                // Check if this is a separator row
                if (cells.every(cell => /^[-:]+$/.test(cell))) {
                    continue; // Skip separator rows
                }
                
                const isHeader = tableRows.length === 0;
                const tag = isHeader ? 'th' : 'td';
                const row = `<tr>${cells.map(cell => `<${tag}>${cell}</${tag}>`).join('')}</tr>`;
                tableRows.push(row);
            } else {
                if (inTable) {
                    // End table
                    const tableContent = tableRows.length > 0 ? 
                        `<table><thead>${tableRows[0]}</thead><tbody>${tableRows.slice(1).join('')}</tbody></table>` :
                        '';
                    result.push(tableContent);
                    inTable = false;
                    tableRows = [];
                }
                result.push(line);
            }
        }
        
        // Close any remaining table
        if (inTable && tableRows.length > 0) {
            const tableContent = `<table><thead>${tableRows[0]}</thead><tbody>${tableRows.slice(1).join('')}</tbody></table>`;
            result.push(tableContent);
        }
        
        return result.join('\n');
    }

    // Parse horizontal rules
    parseHorizontalRules(html) {
        return html.replace(/^(---|\*\*\*|___)$/gm, '<hr>');
    }

    // Parse line breaks
    parseLineBreaks(html) {
        return html.replace(/  \n/g, '<br>\n');
    }

    // Parse paragraphs
    parseParagraphs(html) {
        const lines = html.split('\n');
        const result = [];
        let paragraph = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line === '') {
                if (paragraph.length > 0) {
                    const content = paragraph.join(' ').trim();
                    if (content && !this.isHtmlBlock(content)) {
                        result.push(`<p>${content}</p>`);
                    } else {
                        result.push(content);
                    }
                    paragraph = [];
                }
                result.push('');
            } else if (this.isHtmlBlock(line)) {
                if (paragraph.length > 0) {
                    const content = paragraph.join(' ').trim();
                    result.push(`<p>${content}</p>`);
                    paragraph = [];
                }
                result.push(line);
            } else {
                paragraph.push(line);
            }
        }
        
        // Handle remaining paragraph
        if (paragraph.length > 0) {
            const content = paragraph.join(' ').trim();
            if (content && !this.isHtmlBlock(content)) {
                result.push(`<p>${content}</p>`);
            } else if (content) {
                result.push(content);
            }
        }
        
        return result.join('\n');
    }

    // Check if a line is an HTML block element
    isHtmlBlock(line) {
        const blockTags = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'pre', 'blockquote', 'ul', 'ol', 'li',
            'table', 'thead', 'tbody', 'tr', 'th', 'td',
            'div', 'hr', 'br'
        ];
        
        return blockTags.some(tag => 
            line.startsWith(`<${tag}`) || 
            line.startsWith(`</${tag}>`) ||
            line.includes(`<${tag}>`) ||
            line.includes(`</${tag}>`)
        );
    }

    // Escape HTML characters
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Get table of contents
    getTableOfContents() {
        return this.headingAnchors;
    }
}

// Export for use in other modules
window.MarkdownParser = MarkdownParser;