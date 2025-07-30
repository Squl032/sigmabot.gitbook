// GitBook 自訂插件代碼
// 這個檔案可以在 GitBook 的自訂設定中使用

// 注入我們的自訂 CSS
const customCSS = `
    /* 導入我們的主要樣式 */
    @import url('https://squl032.github.io/sigmabot.gitbook/assets/css/styles.css');
    @import url('https://squl032.github.io/sigmabot.gitbook/assets/css/themes.css');
    
    /* GitBook 覆蓋樣式 */
    .gitbook-root {
        --primary-color: #5865f2;
        --success-color: #57f287;
    }
    
    /* 隱藏 GitBook 的預設搜尋，使用我們的搜尋 */
    .gitbook-search {
        display: none;
    }
    
    /* 添加我們的搜尋界面 */
    .custom-search {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 1000;
    }
`;

// 注入我們的搜尋功能
const customSearchHTML = \`
    <div class="custom-search">
        <div class="search-container">
            <i class="fas fa-search search-icon"></i>
            <input type="text" id="custom-search-input" placeholder="搜尋文檔..." autocomplete="off">
            <div id="custom-search-results" class="search-results"></div>
        </div>
    </div>
\`;

// 主題切換功能
const themeToggleHTML = \`
    <button id="custom-theme-toggle" class="theme-toggle" title="切換深色模式">
        <i class="fas fa-moon"></i>
    </button>
\`;

// 初始化自訂功能
function initCustomFeatures() {
    // 注入樣式
    const styleSheet = document.createElement('style');
    styleSheet.textContent = customCSS;
    document.head.appendChild(styleSheet);
    
    // 注入搜尋界面
    document.body.insertAdjacentHTML('beforeend', customSearchHTML);
    document.body.insertAdjacentHTML('beforeend', themeToggleHTML);
    
    // 載入我們的JavaScript功能
    loadCustomScripts();
}

// 載入自訂腳本
function loadCustomScripts() {
    const scripts = [
        'https://squl032.github.io/sigmabot.gitbook/assets/js/search.js',
        'https://squl032.github.io/sigmabot.gitbook/assets/js/themes.js'
    ];
    
    scripts.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        document.head.appendChild(script);
    });
}

// 當 GitBook 載入完成時執行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomFeatures);
} else {
    initCustomFeatures();
}

// 監聽 GitBook 的頁面變化
window.addEventListener('popstate', () => {
    setTimeout(initCustomFeatures, 100);
});

// 如果是在 GitBook 環境中
if (window.gitbook) {
    window.gitbook.events.bind('page.change', () => {
        setTimeout(initCustomFeatures, 100);
    });
}