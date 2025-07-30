// ===== SEARCH FUNCTIONALITY =====
class SearchManager {
    constructor() {
        this.searchIndex = [];
        this.searchInput = null;
        this.searchResults = null;
        this.isSearchActive = false;
        this.currentResults = [];
        this.selectedIndex = -1;
        this.init();
    }

    // Initialize search
    async init() {
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
        
        if (!this.searchInput || !this.searchResults) return;
        
        await this.buildSearchIndex();
        this.setupEventListeners();
    }

    // Build search index from all content
    async buildSearchIndex() {
        if (!window.navigationManager) return;
        
        const allPages = window.navigationManager.getAllPagesInOrder();
        
        for (const page of allPages) {
            try {
                const response = await fetch(page.file);
                if (response.ok) {
                    const content = await response.text();
                    this.indexPage(page, content);
                }
            } catch (error) {
                console.warn(`Failed to index page: ${page.file}`, error);
            }
        }
    }

    // Index a single page
    indexPage(page, content) {
        // Remove markdown syntax for cleaner indexing
        const cleanContent = this.cleanMarkdown(content);
        
        // Extract headings
        const headings = this.extractHeadings(content);
        
        // Create search entry
        const searchEntry = {
            title: page.title,
            path: page.path,
            file: page.file,
            content: cleanContent,
            headings: headings,
            searchableText: `${page.title} ${cleanContent}`.toLowerCase()
        };
        
        this.searchIndex.push(searchEntry);
        
        // Also index individual headings as separate entries
        headings.forEach(heading => {
            this.searchIndex.push({
                title: `${page.title} - ${heading.text}`,
                path: `${page.path}#${heading.slug}`,
                file: page.file,
                content: heading.text,
                headings: [],
                searchableText: `${page.title} ${heading.text}`.toLowerCase(),
                isHeading: true,
                level: heading.level
            });
        });
    }

    // Clean markdown content
    cleanMarkdown(markdown) {
        return markdown
            // Remove code blocks
            .replace(/```[\s\S]*?```/g, '')
            // Remove inline code
            .replace(/`[^`]+`/g, '')
            // Remove links but keep text
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            // Remove emphasis
            .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1')
            // Remove headings markers
            .replace(/^#+\s*/gm, '')
            // Remove horizontal rules
            .replace(/^[-*_]{3,}$/gm, '')
            // Remove blockquote markers
            .replace(/^>\s*/gm, '')
            // Remove list markers
            .replace(/^[\s]*[-*+]\s*/gm, '')
            .replace(/^[\s]*\d+\.\s*/gm, '')
            // Clean up extra whitespace
            .replace(/\s+/g, ' ')
            .trim();
    }

    // Extract headings from markdown
    extractHeadings(markdown) {
        const headings = [];
        const headingRegex = /^(#{1,6})\s+(.+)$/gm;
        let match;
        
        while ((match = headingRegex.exec(markdown)) !== null) {
            const level = match[1].length;
            const text = match[2].replace(/[*_`]/g, '');
            const slug = this.generateSlug(text);
            
            headings.push({
                level: level,
                text: text,
                slug: slug
            });
        }
        
        return headings;
    }

    // Generate slug from text
    generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // Setup event listeners
    setupEventListeners() {
        // Search input events
        this.searchInput.addEventListener('input', this.debounce((e) => {
            this.handleSearch(e.target.value);
        }, 300));

        // Keyboard navigation
        this.searchInput.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Focus events
        this.searchInput.addEventListener('focus', () => {
            if (this.currentResults.length > 0) {
                this.showResults();
            }
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideResults();
            }
        });

        // Result click handler
        this.searchResults.addEventListener('click', (e) => {
            const resultItem = e.target.closest('.search-result-item');
            if (resultItem) {
                const path = resultItem.dataset.path;
                this.selectResult(path);
            }
        });
    }

    // Handle search input
    handleSearch(query) {
        if (!query || query.length < 2) {
            this.hideResults();
            return;
        }

        this.currentResults = this.performSearch(query);
        this.displayResults(this.currentResults);
        this.selectedIndex = -1;
    }

    // Perform search
    performSearch(query) {
        const searchTerms = query.toLowerCase().split(/\s+/);
        const results = [];

        for (const entry of this.searchIndex) {
            let score = 0;
            let matchedTerms = 0;

            for (const term of searchTerms) {
                if (entry.searchableText.includes(term)) {
                    matchedTerms++;
                    
                    // Title matches get higher score
                    if (entry.title.toLowerCase().includes(term)) {
                        score += 10;
                    }
                    
                    // Exact matches get higher score
                    if (entry.searchableText.includes(` ${term} `) || 
                        entry.searchableText.startsWith(term) || 
                        entry.searchableText.endsWith(term)) {
                        score += 5;
                    } else {
                        score += 1;
                    }
                    
                    // Heading matches get bonus
                    if (entry.isHeading) {
                        score += 3;
                    }
                }
            }

            // Only include results that match all terms
            if (matchedTerms === searchTerms.length) {
                results.push({
                    ...entry,
                    score: score,
                    matchedTerms: matchedTerms
                });
            }
        }

        // Sort by score (descending) and then by title
        results.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return a.title.localeCompare(b.title);
        });

        return results.slice(0, 10); // Limit to top 10 results
    }

    // Display search results
    displayResults(results) {
        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="search-no-results">
                    <p>找不到相關結果</p>
                </div>
            `;
        } else {
            let html = '';
            
            results.forEach((result, index) => {
                const isHeading = result.isHeading;
                const headingIcon = isHeading ? `<i class="fas fa-hashtag text-muted"></i>` : '';
                const headingClass = isHeading ? 'search-heading-result' : '';
                
                html += `
                    <div class="search-result-item ${headingClass}" data-path="${result.path}" data-index="${index}">
                        <div class="search-result-title">
                            ${headingIcon}
                            ${this.highlightText(result.title, this.searchInput.value)}
                        </div>
                        <div class="search-result-content">
                            ${this.getResultPreview(result, this.searchInput.value)}
                        </div>
                        <div class="search-result-path">
                            <i class="fas fa-file-alt"></i>
                            ${result.file}
                        </div>
                    </div>
                `;
            });
            
            this.searchResults.innerHTML = html;
        }
        
        this.showResults();
    }

    // Get result preview with context
    getResultPreview(result, query) {
        const content = result.content;
        const queryLowerCase = query.toLowerCase();
        const queryIndex = content.toLowerCase().indexOf(queryLowerCase);
        
        if (queryIndex === -1) {
            return content.substring(0, 150) + (content.length > 150 ? '...' : '');
        }
        
        const start = Math.max(0, queryIndex - 50);
        const end = Math.min(content.length, queryIndex + query.length + 100);
        
        let preview = content.substring(start, end);
        
        if (start > 0) preview = '...' + preview;
        if (end < content.length) preview = preview + '...';
        
        return this.highlightText(preview, query);
    }

    // Highlight search terms in text
    highlightText(text, query) {
        if (!query) return text;
        
        const terms = query.split(/\s+/).filter(term => term.length > 0);
        let highlightedText = text;
        
        terms.forEach(term => {
            const regex = new RegExp(`(${this.escapeRegex(term)})`, 'gi');
            highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
        });
        
        return highlightedText;
    }

    // Escape regex special characters
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Handle keyboard navigation
    handleKeyboardNavigation(e) {
        if (!this.isSearchActive || this.currentResults.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, this.currentResults.length - 1);
                this.updateSelection();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelection();
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0 && this.selectedIndex < this.currentResults.length) {
                    const result = this.currentResults[this.selectedIndex];
                    this.selectResult(result.path);
                }
                break;
                
            case 'Escape':
                this.hideResults();
                this.searchInput.blur();
                break;
        }
    }

    // Update visual selection
    updateSelection() {
        const items = this.searchResults.querySelectorAll('.search-result-item');
        
        items.forEach((item, index) => {
            if (index === this.selectedIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }

    // Select a search result
    selectResult(path) {
        this.hideResults();
        this.searchInput.value = '';
        
        if (window.navigationManager) {
            window.navigationManager.navigateToPage(path);
        }
    }

    // Show search results
    showResults() {
        this.searchResults.style.display = 'block';
        this.isSearchActive = true;
    }

    // Hide search results
    hideResults() {
        this.searchResults.style.display = 'none';
        this.isSearchActive = false;
        this.selectedIndex = -1;
    }

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Add search result styles
const searchStyles = `
.search-results {
    background: var(--card-color);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-lg);
    max-height: 400px;
    overflow-y: auto;
    z-index: 1001;
}

.search-result-item {
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    cursor: pointer;
    transition: var(--transition);
}

.search-result-item:last-child {
    border-bottom: none;
}

.search-result-item:hover,
.search-result-item.selected {
    background: var(--surface-color);
}

.search-result-title {
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.search-result-content {
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.4;
    margin-bottom: 0.5rem;
}

.search-result-path {
    font-size: 0.75rem;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.search-heading-result .search-result-title {
    font-size: 0.9rem;
}

.search-no-results {
    padding: 2rem;
    text-align: center;
    color: var(--text-muted);
}

.search-result-content mark {
    background: rgba(255, 235, 59, 0.3);
    color: var(--text-primary);
    padding: 0.1rem 0.2rem;
    border-radius: 2px;
}

[data-theme="dark"] .search-result-content mark {
    background: rgba(255, 193, 7, 0.3);
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = searchStyles;
document.head.appendChild(styleSheet);

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for navigation manager to be ready
    const initSearch = () => {
        if (window.navigationManager && window.navigationManager.navigationData) {
            window.searchManager = new SearchManager();
        } else {
            setTimeout(initSearch, 100);
        }
    };
    initSearch();
});