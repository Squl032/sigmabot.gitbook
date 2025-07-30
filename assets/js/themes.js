// ===== THEME MANAGER =====
class ThemeManager {
    constructor() {
        this.currentTheme = null;
        this.themeToggle = null;
        this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        this.init();
    }

    // Initialize theme manager
    init() {
        this.themeToggle = document.getElementById('theme-toggle');
        if (!this.themeToggle) return;

        // Load saved theme or detect system preference
        this.loadTheme();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Apply initial theme
        this.applyTheme(this.currentTheme);
    }

    // Load theme from localStorage or system preference
    loadTheme() {
        const savedTheme = localStorage.getItem('sigma-docs-theme');
        
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            this.currentTheme = savedTheme;
        } else {
            // Use system preference
            this.currentTheme = this.prefersDark.matches ? 'dark' : 'light';
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Theme toggle button
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // System theme change detection
        this.prefersDark.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem('sigma-docs-theme')) {
                this.currentTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(this.currentTheme);
            }
        });

        // Keyboard shortcut (Ctrl/Cmd + Shift + L)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    // Toggle between light and dark themes
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.saveTheme();
        
        // Provide haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    // Apply theme to document
    applyTheme(theme) {
        // Add transition class to prevent flash
        document.body.classList.add('theme-transition');
        
        // Set theme attribute
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update toggle button
        this.updateToggleButton(theme);
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
        
        // Remove transition class after animation
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 200);
        
        // Dispatch theme change event
        this.dispatchThemeChangeEvent(theme);
    }

    // Update theme toggle button
    updateToggleButton(theme) {
        if (!this.themeToggle) return;

        const icon = this.themeToggle.querySelector('i');
        if (!icon) return;

        // Update icon
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            this.themeToggle.title = '切換淺色模式';
            this.themeToggle.setAttribute('aria-label', '切換淺色模式');
        } else {
            icon.className = 'fas fa-moon';
            this.themeToggle.title = '切換深色模式';
            this.themeToggle.setAttribute('aria-label', '切換深色模式');
        }
    }

    // Update meta theme-color for mobile browsers
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }

        const colors = {
            light: '#ffffff',
            dark: '#0d1117'
        };

        metaThemeColor.content = colors[theme];
    }

    // Save theme preference
    saveTheme() {
        localStorage.setItem('sigma-docs-theme', this.currentTheme);
    }

    // Dispatch theme change event
    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themechange', {
            detail: { theme: theme }
        });
        document.dispatchEvent(event);
    }

    // Get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Set theme programmatically
    setTheme(theme) {
        if (theme !== 'light' && theme !== 'dark') return;
        
        this.currentTheme = theme;
        this.applyTheme(theme);
        this.saveTheme();
    }

    // Check if system prefers dark theme
    systemPrefersDark() {
        return this.prefersDark.matches;
    }

    // Reset to system preference
    resetToSystemPreference() {
        localStorage.removeItem('sigma-docs-theme');
        this.currentTheme = this.systemPrefersDark() ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
    }
}

// ===== ADDITIONAL THEME UTILITIES =====

// Theme-aware code syntax highlighting
class SyntaxHighlighter {
    constructor() {
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        // Listen for theme changes
        document.addEventListener('themechange', (e) => {
            this.currentTheme = e.detail.theme;
            this.updateCodeBlocks();
        });

        // Initial highlight
        this.updateCodeBlocks();
    }

    updateCodeBlocks() {
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach(block => {
            this.highlightBlock(block);
        });
    }

    highlightBlock(block) {
        // Simple syntax highlighting for common languages
        const language = this.detectLanguage(block);
        
        if (language) {
            this.applyHighlighting(block, language);
        }
    }

    detectLanguage(block) {
        const pre = block.parentElement;
        const langAttr = pre.getAttribute('data-lang');
        
        if (langAttr) {
            return langAttr.toLowerCase();
        }

        // Try to detect from content
        const content = block.textContent;
        
        if (content.includes('function') && content.includes('{')) {
            return 'javascript';
        }
        if (content.includes('def ') && content.includes(':')) {
            return 'python';
        }
        if (content.includes('<?php')) {
            return 'php';
        }
        if (content.includes('#include') || content.includes('int main')) {
            return 'cpp';
        }
        
        return null;
    }

    applyHighlighting(block, language) {
        let content = block.innerHTML;
        
        // Basic JavaScript highlighting
        if (language === 'javascript' || language === 'js') {
            content = content
                .replace(/(function|const|let|var|if|else|for|while|return|class|import|export)\b/g, 
                    '<span class="hljs-keyword">$1</span>')
                .replace(/(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, 
                    '<span class="hljs-string">$1$2$1</span>')
                .replace(/\/\*([\s\S]*?)\*\//g, 
                    '<span class="hljs-comment">/*$1*/</span>')
                .replace(/\/\/(.*)$/gm, 
                    '<span class="hljs-comment">//$1</span>')
                .replace(/\b(\d+)\b/g, 
                    '<span class="hljs-number">$1</span>');
        }
        
        // Basic Python highlighting
        else if (language === 'python' || language === 'py') {
            content = content
                .replace(/(def|class|if|elif|else|for|while|import|from|return|try|except|with|as)\b/g, 
                    '<span class="hljs-keyword">$1</span>')
                .replace(/(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, 
                    '<span class="hljs-string">$1$2$1</span>')
                .replace(/#(.*)$/gm, 
                    '<span class="hljs-comment">#$1</span>')
                .replace(/\b(\d+)\b/g, 
                    '<span class="hljs-number">$1</span>');
        }
        
        block.innerHTML = content;
    }
}

// Theme-aware image handling
class ImageThemeManager {
    constructor() {
        this.init();
    }

    init() {
        // Listen for theme changes
        document.addEventListener('themechange', (e) => {
            this.updateImages(e.detail.theme);
        });
    }

    updateImages(theme) {
        const images = document.querySelectorAll('img[data-theme-src]');
        
        images.forEach(img => {
            const themeSrc = JSON.parse(img.getAttribute('data-theme-src'));
            if (themeSrc[theme]) {
                img.src = themeSrc[theme];
            }
        });
    }
}

// Performance optimizations for theme switching
class ThemePerformanceOptimizer {
    constructor() {
        this.transitionElements = [];
        this.init();
    }

    init() {
        // Collect elements that should have transitions disabled during theme switch
        this.transitionElements = document.querySelectorAll('*');
        
        document.addEventListener('themechange', () => {
            this.optimizeThemeTransition();
        });
    }

    optimizeThemeTransition() {
        // Disable transitions temporarily
        this.disableTransitions();
        
        // Re-enable after theme has been applied
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.enableTransitions();
            });
        });
    }

    disableTransitions() {
        document.body.classList.add('theme-transition');
    }

    enableTransitions() {
        document.body.classList.remove('theme-transition');
    }
}

// Initialize theme management when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    window.syntaxHighlighter = new SyntaxHighlighter();
    window.imageThemeManager = new ImageThemeManager();
    window.themePerformanceOptimizer = new ThemePerformanceOptimizer();
});