// ===== NAVIGATION SYSTEM =====
class NavigationManager {
    constructor() {
        this.currentPage = null;
        this.navigationData = null;
        this.parser = new MarkdownParser();
        this.init();
    }

    // Initialize navigation
    async init() {
        await this.loadNavigationData();
        this.setupEventListeners();
        this.renderNavigation();
        await this.loadInitialPage();
    }

    // Load navigation structure
    async loadNavigationData() {
        this.navigationData = {
            "": {
                title: "Σ βοτ 介紹",
                file: "readme.md",
                icon: "fas fa-home"
            },
            "quick-start": {
                title: "🚀 快速開始",
                icon: "fas fa-rocket",
                children: {
                    "setup": { title: "快速設置指南", file: "quick-start/setup.md", icon: "fas fa-play" },
                    "permissions": { title: "必要權限設定", file: "quick-start/permissions.md", icon: "fas fa-key" }
                }
            },
            "configuration": {
                title: "⚙️ 系統配置",
                icon: "fas fa-cog",
                children: {
                    "unified-settings": { title: "統一設定系統", file: "configuration/unified-settings.md", icon: "fas fa-sliders-h" },
                    "security": { title: "安全防護設定", file: "configuration/security.md", icon: "fas fa-shield-alt" },
                    "channels": { title: "頻道與權限設定", file: "configuration/channels.md", icon: "fas fa-hashtag" },
                    "automation": { title: "自動化功能設定", file: "configuration/automation.md", icon: "fas fa-robot" }
                }
            },
            "commands": {
                title: "📋 指令大全",
                icon: "fas fa-terminal",
                children: {
                    "overview": { title: "所有指令總覽", file: "commands/overview.md", icon: "fas fa-list" },
                    "community": { title: "🏘️ 社群指令", file: "commands/community.md", icon: "fas fa-users" },
                    "moderation": { title: "🛡️ 管理指令", file: "commands/moderation.md", icon: "fas fa-gavel" },
                    "admin": { title: "👑 管理員指令", file: "commands/admin.md", icon: "fas fa-crown" },
                    "music": { title: "🎵 音樂指令", file: "commands/music.md", icon: "fas fa-music" },
                    "roles": { title: "👥 身分組指令", file: "commands/roles.md", icon: "fas fa-user-tag" },
                    "economy": { title: "💰 經濟系統", file: "commands/economy.md", icon: "fas fa-coins" },
                    "gacha": { title: "🎰 扭蛋系統", file: "commands/gacha.md", icon: "fas fa-dice" },
                    "giveaway": { title: "🎁 抽獎系統", file: "commands/giveaway.md", icon: "fas fa-gift" },
                    "leveling": { title: "📊 等級系統", file: "commands/leveling.md", icon: "fas fa-chart-line" }
                }
            },
            "ai-features": {
                title: "🤖 AI 與自動化",
                icon: "fas fa-brain",
                children: {
                    "chatbot": { title: "AI 聊天機器人", file: "ai-features/chatbot.md", icon: "fas fa-comments" },
                    "web-search": { title: "智能搜尋功能", file: "ai-features/web-search.md", icon: "fas fa-search" },
                    "auto-moderation": { title: "自動審核系統", file: "ai-features/auto-moderation.md", icon: "fas fa-eye" },
                    "threat-detection": { title: "威脅偵測", file: "ai-features/threat-detection.md", icon: "fas fa-exclamation-triangle" }
                }
            },
            "protection": {
                title: "🛡️ 防護系統",
                icon: "fas fa-shield",
                children: {
                    "anti-spam": { title: "防洗版系統", file: "protection/anti-spam.md", icon: "fas fa-ban" },
                    "anti-invite": { title: "防邀請連結", file: "protection/anti-invite.md", icon: "fas fa-link" },
                    "anti-mention": { title: "防騷擾提及", file: "protection/anti-mention.md", icon: "fas fa-at" },
                    "anti-raid": { title: "防突襲系統", file: "protection/anti-raid.md", icon: "fas fa-user-shield" },
                    "global-ban": { title: "全域封鎖", file: "protection/global-ban.md", icon: "fas fa-globe" }
                }
            },
            "entertainment": {
                title: "🎮 娛樂功能",
                icon: "fas fa-gamepad",
                children: {
                    "music-system": { title: "音樂播放系統", file: "entertainment/music-system.md", icon: "fas fa-music" },
                    "gacha": { title: "扭蛋抽獎機", file: "entertainment/gacha.md", icon: "fas fa-dice" },
                    "giveaways": { title: "社群抽獎活動", file: "entertainment/giveaways.md", icon: "fas fa-gift" },
                    "leveling": { title: "等級排行系統", file: "entertainment/leveling.md", icon: "fas fa-trophy" },
                    "fun-commands": { title: "趣味指令", file: "entertainment/fun-commands.md", icon: "fas fa-laugh" }
                }
            },
            "advanced": {
                title: "🔧 高級功能",
                icon: "fas fa-tools",
                children: {
                    "ticket-system": { title: "工單系統", file: "advanced/ticket-system.md", icon: "fas fa-ticket-alt" },
                    "reaction-roles": { title: "反應身分組", file: "advanced/reaction-roles.md", icon: "fas fa-smile" },
                    "auto-publisher": { title: "自動發布系統", file: "advanced/auto-publisher.md", icon: "fas fa-broadcast-tower" },
                    "statistics": { title: "統計與分析", file: "advanced/statistics.md", icon: "fas fa-chart-bar" },
                    "monitoring": { title: "系統監控", file: "advanced/monitoring.md", icon: "fas fa-heartbeat" }
                }
            },
            "troubleshooting": {
                title: "🚨 故障排除",
                icon: "fas fa-wrench",
                children: {
                    "faq": { title: "常見問題", file: "troubleshooting/faq.md", icon: "fas fa-question-circle" },
                    "error-codes": { title: "錯誤代碼", file: "troubleshooting/error-codes.md", icon: "fas fa-bug" },
                    "performance": { title: "性能優化", file: "troubleshooting/performance.md", icon: "fas fa-tachometer-alt" }
                }
            },
            "use-cases": {
                title: "💡 使用案例",
                icon: "fas fa-lightbulb",
                children: {
                    "large-community": { title: "大型社群設定", file: "use-cases/large-community.md", icon: "fas fa-building" },
                    "gaming-guild": { title: "遊戲公會配置", file: "use-cases/gaming-guild.md", icon: "fas fa-gamepad" },
                    "study-group": { title: "學習討論群", file: "use-cases/study-group.md", icon: "fas fa-graduation-cap" }
                }
            },
            "policy-and-terms": {
                title: "Policy & Terms",
                icon: "fas fa-file-contract",
                children: {
                    "terms": { title: "服務條款", file: "policy-and-terms/terms.md", icon: "fas fa-file-contract" },
                    "policy": { title: "隱私權政策", file: "policy-and-terms/policy.md", icon: "fas fa-user-secret" }
                }
            },
            "source": {
                title: "Inspiration Source",
                icon: "fas fa-lightbulb",
                children: {
                    "source": { title: "靈感來源", file: "source/source.md", icon: "fas fa-heart" },
                    "changelog": { title: "更新日誌", file: "changelog.md", icon: "fas fa-history" }
                }
            }
        };
    }

    // Render navigation tree
    renderNavigation() {
        const navTree = document.getElementById('navigation-tree');
        if (!navTree) return;

        let html = '';
        
        for (const [key, item] of Object.entries(this.navigationData)) {
            if (item.children) {
                // Group with children
                html += `
                    <div class="nav-group">
                        <div class="nav-group-title">
                            <i class="${item.icon}"></i>
                            ${item.title}
                        </div>
                        <div class="nav-items">
                `;
                
                for (const [childKey, child] of Object.entries(item.children)) {
                    const path = key ? `${key}/${childKey}` : childKey;
                    html += `
                        <div class="nav-item">
                            <a href="#${path}" class="nav-link" data-path="${path}">
                                <i class="${child.icon}"></i>
                                ${child.title}
                            </a>
                        </div>
                    `;
                }
                
                html += `
                        </div>
                    </div>
                `;
            } else {
                // Single item
                html += `
                    <div class="nav-item">
                        <a href="#${key}" class="nav-link" data-path="${key}">
                            <i class="${item.icon}"></i>
                            ${item.title}
                        </a>
                    </div>
                `;
            }
        }
        
        navTree.innerHTML = html;
    }

    // Setup event listeners
    setupEventListeners() {
        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('.nav-link');
            if (navLink) {
                e.preventDefault();
                const path = navLink.dataset.path;
                this.navigateToPage(path);
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            const path = this.getPathFromUrl();
            this.navigateToPage(path, false);
        });

        // Handle hash changes
        window.addEventListener('hashchange', () => {
            const path = this.getPathFromUrl();
            this.navigateToPage(path, false);
        });
    }

    // Get current path from URL
    getPathFromUrl() {
        const hash = window.location.hash.slice(1);
        return hash || '';
    }

    // Navigate to a page
    async navigateToPage(path, pushState = true) {
        try {
            // Update URL
            if (pushState) {
                history.pushState(null, '', path ? `#${path}` : '#');
            }

            // Find the page data
            const pageData = this.findPageData(path);
            if (!pageData) {
                console.error('Page not found:', path);
                return;
            }

            // Load and render the page
            await this.loadPage(pageData, path);
            
            // Update navigation state
            this.updateActiveNavigation(path);
            
            // Update breadcrumb
            this.updateBreadcrumb(path);
            
            // Scroll to top
            window.scrollTo(0, 0);
            
        } catch (error) {
            console.error('Navigation error:', error);
        }
    }

    // Find page data by path
    findPageData(path) {
        if (!path) {
            return this.navigationData[''];
        }

        const parts = path.split('/');
        let current = this.navigationData;
        
        for (const part of parts) {
            if (current[part]) {
                current = current[part];
            } else if (current.children && current.children[part]) {
                current = current.children[part];
            } else {
                return null;
            }
        }
        
        return current;
    }

    // Load and render page content
    async loadPage(pageData, path) {
        try {
            const response = await fetch(pageData.file);
            if (!response.ok) {
                throw new Error(`Failed to load ${pageData.file}`);
            }
            
            const markdown = await response.text();
            const html = this.parser.parse(markdown);
            
            // Render content
            const article = document.getElementById('main-article');
            if (article) {
                article.innerHTML = html;
            }
            
            // Update page title
            document.title = `${pageData.title} - Sigma Bot 文檔`;
            
            // Generate table of contents
            this.generateTableOfContents();
            
            // Generate page navigation
            this.generatePageNavigation(path);
            
            this.currentPage = path;
            
        } catch (error) {
            console.error('Error loading page:', error);
            this.showErrorPage(error);
        }
    }

    // Show error page
    showErrorPage(error) {
        const article = document.getElementById('main-article');
        if (article) {
            article.innerHTML = `
                <div class="error-page">
                    <h1>📄 頁面載入失敗</h1>
                    <p>抱歉，無法載入此頁面內容。</p>
                    <p><strong>錯誤詳情:</strong> ${error.message}</p>
                    <p><a href="#" class="btn btn-primary">返回首頁</a></p>
                </div>
            `;
        }
    }

    // Update active navigation item
    updateActiveNavigation(path) {
        // Remove all active classes
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current page
        const activeLink = document.querySelector(`[data-path="${path}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Update breadcrumb
    updateBreadcrumb(path) {
        const breadcrumb = document.getElementById('breadcrumb');
        if (!breadcrumb) return;

        const parts = path.split('/').filter(Boolean);
        let breadcrumbHtml = '<ol class="breadcrumb-list">';
        
        // Home link
        breadcrumbHtml += `
            <li class="breadcrumb-item">
                <a href="#" class="breadcrumb-link">
                    <i class="fas fa-home"></i>
                    首頁
                </a>
            </li>
        `;
        
        // Build breadcrumb path
        let currentPath = '';
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            currentPath += (currentPath ? '/' : '') + part;
            
            const pageData = this.findPageData(currentPath);
            const isLast = i === parts.length - 1;
            
            breadcrumbHtml += `
                <li class="breadcrumb-item">
                    <span class="breadcrumb-separator">
                        <i class="fas fa-chevron-right"></i>
                    </span>
                    ${isLast 
                        ? `<span>${pageData?.title || part}</span>`
                        : `<a href="#${currentPath}" class="breadcrumb-link">${pageData?.title || part}</a>`
                    }
                </li>
            `;
        }
        
        breadcrumbHtml += '</ol>';
        breadcrumb.innerHTML = breadcrumbHtml;
    }

    // Generate table of contents
    generateTableOfContents() {
        const toc = this.parser.getTableOfContents();
        const tocNav = document.getElementById('toc-nav');
        
        if (!tocNav || toc.length === 0) {
            if (tocNav) tocNav.innerHTML = '<p class="text-muted">此頁面沒有標題</p>';
            return;
        }

        let html = '';
        for (const heading of toc) {
            html += `
                <div class="toc-item">
                    <a href="#${heading.slug}" class="toc-link toc-level-${heading.level}">
                        ${heading.text}
                    </a>
                </div>
            `;
        }
        
        tocNav.innerHTML = html;
        
        // Setup TOC scroll spy
        this.setupTocScrollSpy(toc);
    }

    // Setup table of contents scroll spy
    setupTocScrollSpy(toc) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.id;
                const tocLink = document.querySelector(`[href="#${id}"]`);
                
                if (entry.isIntersecting) {
                    // Remove active from all TOC links
                    document.querySelectorAll('.toc-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Add active to current
                    if (tocLink) {
                        tocLink.classList.add('active');
                    }
                }
            });
        }, {
            rootMargin: '-100px 0px -80% 0px'
        });

        toc.forEach(heading => {
            const element = document.getElementById(heading.slug);
            if (element) {
                observer.observe(element);
            }
        });
    }

    // Generate page navigation (prev/next)
    generatePageNavigation(currentPath) {
        const pageNav = document.getElementById('page-navigation');
        if (!pageNav) return;

        // Get all pages in order
        const allPages = this.getAllPagesInOrder();
        const currentIndex = allPages.findIndex(page => page.path === currentPath);
        
        if (currentIndex === -1) {
            pageNav.innerHTML = '';
            return;
        }

        const prevPage = currentIndex > 0 ? allPages[currentIndex - 1] : null;
        const nextPage = currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null;

        let html = '';
        
        if (prevPage) {
            html += `
                <a href="#${prevPage.path}" class="page-nav-link page-nav-prev">
                    <div class="page-nav-direction">
                        <i class="fas fa-chevron-left"></i>
                        上一頁
                    </div>
                    <div class="page-nav-title">${prevPage.title}</div>
                </a>
            `;
        }
        
        if (nextPage) {
            html += `
                <a href="#${nextPage.path}" class="page-nav-link page-nav-next">
                    <div class="page-nav-direction">
                        下一頁
                        <i class="fas fa-chevron-right"></i>
                    </div>
                    <div class="page-nav-title">${nextPage.title}</div>
                </a>
            `;
        }
        
        pageNav.innerHTML = html;
    }

    // Get all pages in reading order
    getAllPagesInOrder() {
        const pages = [];
        
        // Helper function to add pages recursively
        const addPages = (data, basePath = '') => {
            for (const [key, item] of Object.entries(data)) {
                const path = basePath ? `${basePath}/${key}` : key;
                
                if (item.file) {
                    pages.push({
                        path: path,
                        title: item.title,
                        file: item.file
                    });
                }
                
                if (item.children) {
                    addPages(item.children, path);
                }
            }
        };
        
        addPages(this.navigationData);
        return pages;
    }

    // Load initial page
    async loadInitialPage() {
        const path = this.getPathFromUrl();
        await this.navigateToPage(path, false);
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigationManager = new NavigationManager();
});