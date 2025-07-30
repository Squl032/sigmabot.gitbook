// ===== MAIN APPLICATION =====
class SigmaBotDocs {
    constructor() {
        this.isLoaded = false;
        this.components = {};
        this.init();
    }

    // Initialize the application
    async init() {
        try {
            this.showLoadingScreen();
            
            // Initialize core components
            await this.initializeComponents();
            
            // Setup global event listeners
            this.setupGlobalEventListeners();
            
            // Setup accessibility features
            this.setupAccessibility();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            this.isLoaded = true;
            
            // Dispatch ready event
            this.dispatchReadyEvent();
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showErrorScreen(error);
        }
    }

    // Initialize all components
    async initializeComponents() {
        // Wait for required components to be available
        await this.waitForComponents();
        
        // Store component references
        this.components = {
            navigation: window.navigationManager,
            search: window.searchManager,
            theme: window.themeManager
        };
    }

    // Wait for all required components to be loaded
    async waitForComponents() {
        const maxWait = 10000; // 10 seconds
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWait) {
            if (window.navigationManager && 
                window.searchManager && 
                window.themeManager) {
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        throw new Error('Components failed to load within timeout period');
    }

    // Show loading screen
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    }

    // Hide loading screen
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            // Fade out animation
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                loadingScreen.style.opacity = '1'; // Reset for potential reuse
            }, 300);
        }
    }

    // Show error screen
    showErrorScreen(error) {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <div class="error-container">
                    <div class="error-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h2>載入失敗</h2>
                    <p>抱歉，應用程式載入時發生錯誤。</p>
                    <details>
                        <summary>錯誤詳情</summary>
                        <pre>${error.message}\n${error.stack}</pre>
                    </details>
                    <button onclick="window.location.reload()" class="btn btn-primary">
                        <i class="fas fa-redo"></i>
                        重新載入
                    </button>
                </div>
            `;
        }
    }

    // Setup global event listeners
    setupGlobalEventListeners() {
        // Back to top button
        this.setupBackToTop();
        
        // Sidebar toggle for mobile
        this.setupSidebarToggle();
        
        // Smooth scrolling for anchor links
        this.setupSmoothScrolling();
        
        // External link handling
        this.setupExternalLinks();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Window resize handling
        this.setupResizeHandler();
    }

    // Setup back to top functionality
    setupBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;

        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        // Click handler
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Setup sidebar toggle for mobile
    setupSidebarToggle() {
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebar = document.querySelector('.sidebar');
        
        if (!sidebarToggle || !sidebar) return;

        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                !e.target.closest('.sidebar') && 
                !e.target.closest('.sidebar-toggle')) {
                sidebar.classList.remove('open');
            }
        });
    }

    // Setup smooth scrolling for anchor links
    setupSmoothScrolling() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const href = link.getAttribute('href');
            if (href === '#') return;

            const targetId = href.slice(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without triggering navigation
                if (history.replaceState) {
                    const currentUrl = window.location.href.split('#')[0];
                    history.replaceState(null, '', `${currentUrl}#${targetId}`);
                }
            }
        });
    }

    // Setup external link handling
    setupExternalLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="http"]');
            if (!link) return;

            const href = link.getAttribute('href');
            
            // Check if it's an external link (not same domain)
            try {
                const url = new URL(href);
                if (url.hostname !== window.location.hostname) {
                    link.setAttribute('target', '_blank');
                    link.setAttribute('rel', 'noopener noreferrer');
                }
            } catch (error) {
                // Invalid URL, ignore
            }
        });
    }

    // Setup keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Global shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'k':
                    case 'K':
                        // Focus search (Ctrl/Cmd + K)
                        e.preventDefault();
                        const searchInput = document.getElementById('search-input');
                        if (searchInput) {
                            searchInput.focus();
                            searchInput.select();
                        }
                        break;
                        
                    case '/':
                        // Focus search (Ctrl/Cmd + /)
                        e.preventDefault();
                        const searchInput2 = document.getElementById('search-input');
                        if (searchInput2) {
                            searchInput2.focus();
                        }
                        break;
                }
            }
            
            // Escape key handlers
            if (e.key === 'Escape') {
                // Close any open modals, dropdowns, etc.
                const searchResults = document.getElementById('search-results');
                if (searchResults) {
                    searchResults.style.display = 'none';
                }
            }
        });
    }

    // Setup window resize handler
    setupResizeHandler() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 150);
        });
    }

    // Handle window resize
    handleResize() {
        // Close mobile sidebar on desktop
        if (window.innerWidth > 768) {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.remove('open');
            }
        }
        
        // Recalculate layout-dependent components
        if (this.components.search) {
            // Re-position search results if needed
            const searchResults = document.getElementById('search-results');
            if (searchResults && searchResults.style.display !== 'none') {
                // Trigger reposition
                searchResults.style.display = 'none';
                setTimeout(() => {
                    if (document.getElementById('search-input').value) {
                        searchResults.style.display = 'block';
                    }
                }, 10);
            }
        }
    }

    // Setup accessibility features
    setupAccessibility() {
        // Skip link for keyboard navigation
        this.createSkipLink();
        
        // Focus management
        this.setupFocusManagement();
        
        // ARIA live regions
        this.setupAriaLiveRegions();
        
        // High contrast mode detection
        this.setupHighContrastMode();
    }

    // Create skip link for keyboard users
    createSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-article';
        skipLink.textContent = '跳至主要內容';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Setup focus management
    setupFocusManagement() {
        // Focus trap for modals (if any)
        // Focus outline for keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // Setup ARIA live regions
    setupAriaLiveRegions() {
        // Create live region for dynamic content announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
        
        // Store reference for global use
        window.announceToScreenReader = (message) => {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        };
    }

    // Setup high contrast mode detection
    setupHighContrastMode() {
        if (window.matchMedia) {
            const highContrast = window.matchMedia('(prefers-contrast: high)');
            
            const handleHighContrast = (e) => {
                if (e.matches) {
                    document.body.classList.add('high-contrast');
                } else {
                    document.body.classList.remove('high-contrast');
                }
            };
            
            highContrast.addListener(handleHighContrast);
            handleHighContrast(highContrast);
        }
    }

    // Setup performance monitoring
    setupPerformanceMonitoring() {
        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach((entry) => {
                        if (entry.duration > 50) {
                            console.warn('Long task detected:', entry);
                        }
                    });
                });
                
                observer.observe({ entryTypes: ['longtask'] });
            } catch (error) {
                // PerformanceObserver not supported
            }
        }
        
        // Monitor memory usage (Chrome only)
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > memory.totalJSHeapSize * 0.9) {
                    console.warn('High memory usage detected');
                }
            }, 30000); // Check every 30 seconds
        }
    }

    // Dispatch ready event
    dispatchReadyEvent() {
        const event = new CustomEvent('sigmaDocsReady', {
            detail: {
                components: this.components,
                version: '2.0.0'
            }
        });
        document.dispatchEvent(event);
    }

    // Public API methods
    getComponent(name) {
        return this.components[name];
    }

    isReady() {
        return this.isLoaded;
    }

    // Utility methods
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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Additional utility styles
const appStyles = `
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.keyboard-navigation *:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}

.high-contrast {
    filter: contrast(150%);
}

.error-container {
    text-align: center;
    padding: 2rem;
    max-width: 500px;
}

.error-icon {
    font-size: 3rem;
    color: var(--danger-color);
    margin-bottom: 1rem;
}

.error-container h2 {
    margin-bottom: 1rem;
    color: var(--text-primary);
}

.error-container details {
    margin: 1rem 0;
    text-align: left;
    background: var(--surface-color);
    border-radius: var(--border-radius-md);
    padding: 1rem;
}

.error-container pre {
    font-size: 0.8rem;
    overflow-x: auto;
    max-height: 200px;
    background: var(--card-color);
    padding: 0.5rem;
    border-radius: var(--border-radius-sm);
    margin-top: 0.5rem;
}

.theme-transition * {
    transition: none !important;
}

@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
`;

// Inject utility styles
const utilityStyleSheet = document.createElement('style');
utilityStyleSheet.textContent = appStyles;
document.head.appendChild(utilityStyleSheet);

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sigmaBotDocs = new SigmaBotDocs();
});

// Export for global access
window.SigmaBotDocs = SigmaBotDocs;