// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    initializeDirectoryNavigation();
    initializeKeyboardNavigation();
    initializeAccessibility();
    addSmoothScrolling();
});

// 初始化目录导航功能
function initializeDirectoryNavigation() {
    const directoryHeaders = document.querySelectorAll('.directory-header');
    
    directoryHeaders.forEach(header => {
        header.addEventListener('click', function() {
            toggleDirectory(this);
        });
        
        // 添加Enter和Space键支持
        header.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDirectory(this);
            }
        });
    });
}

// 切换目录展开/折叠状态
function toggleDirectory(headerElement) {
    const targetId = headerElement.getAttribute('data-target');
    const submenu = document.getElementById(targetId);
    const isExpanded = headerElement.classList.contains('expanded');
    
    // 关闭所有其他展开的目录
    closeAllDirectories();
    
    if (!isExpanded) {
        // 展开当前目录
        headerElement.classList.add('expanded');
        headerElement.setAttribute('aria-expanded', 'true');
        submenu.classList.add('active');
        
        // 添加展开动画
        submenu.style.maxHeight = '0';
        submenu.style.opacity = '0';
        
        // 强制重绘
        submenu.offsetHeight;
        
        // 应用展开动画
        submenu.style.transition = 'max-height 0.3s ease-out, opacity 0.3s ease-out';
        submenu.style.maxHeight = submenu.scrollHeight + 'px';
        submenu.style.opacity = '1';
        
        // 滚动到视图中
        setTimeout(() => {
            headerElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 100);
        
        // 焦点管理
        const firstFocusableElement = submenu.querySelector('.back-button');
        if (firstFocusableElement) {
            setTimeout(() => {
                firstFocusableElement.focus();
            }, 300);
        }
    }
}

// 关闭所有展开的目录
function closeAllDirectories() {
    const expandedHeaders = document.querySelectorAll('.directory-header.expanded');
    const activeSubmenus = document.querySelectorAll('.submenu.active');
    
    expandedHeaders.forEach(header => {
        header.classList.remove('expanded');
        header.setAttribute('aria-expanded', 'false');
    });
    
    activeSubmenus.forEach(submenu => {
        submenu.style.maxHeight = '0';
        submenu.style.opacity = '0';
        
        setTimeout(() => {
            submenu.classList.remove('active');
            submenu.style.maxHeight = '';
            submenu.style.opacity = '';
            submenu.style.transition = '';
        }, 300);
    });
}

// 关闭指定的子菜单
function closeSubmenu(submenuId) {
    const submenu = document.getElementById(submenuId);
    const header = document.querySelector(`[data-target="${submenuId}"]`);
    
    if (submenu && header) {
        header.classList.remove('expanded');
        header.setAttribute('aria-expanded', 'false');
        
        submenu.style.maxHeight = '0';
        submenu.style.opacity = '0';
        
        setTimeout(() => {
            submenu.classList.remove('active');
            submenu.style.maxHeight = '';
            submenu.style.opacity = '';
            submenu.style.transition = '';
            
            // 将焦点返回到目录标题
            header.focus();
        }, 300);
    }
}

// 初始化键盘导航
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // ESC键关闭所有展开的目录
        if (e.key === 'Escape') {
            closeAllDirectories();
        }
        
        // Tab键增强导航
        if (e.key === 'Tab') {
            handleTabNavigation(e);
        }
    });
}

// 处理Tab键导航
function handleTabNavigation(e) {
    const focusableElements = document.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), .directory-header'
    );
    
    const focusableArray = Array.from(focusableElements);
    const currentIndex = focusableArray.indexOf(document.activeElement);
    
    // 实现循环导航
    if (e.shiftKey) {
        // Shift+Tab: 向前导航
        if (currentIndex === 0) {
            e.preventDefault();
            focusableArray[focusableArray.length - 1].focus();
        }
    } else {
        // Tab: 向后导航
        if (currentIndex === focusableArray.length - 1) {
            e.preventDefault();
            focusableArray[0].focus();
        }
    }
}

// 初始化无障碍性功能
function initializeAccessibility() {
    // 为链接添加描述性标签
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        const linkText = link.querySelector('span').textContent;
        link.setAttribute('aria-label', `${linkText} (在新窗口中打开)`);
        
        // 添加视觉指示器说明
        link.setAttribute('title', '点击在新窗口中打开');
    });
    
    // 为目录标题添加描述
    const directoryHeaders = document.querySelectorAll('.directory-header');
    directoryHeaders.forEach(header => {
        const directoryName = header.querySelector('.directory-name').textContent;
        header.setAttribute('aria-label', `展开或折叠 ${directoryName} 目录`);
    });
    
    // 为返回按钮添加描述
    const backButtons = document.querySelectorAll('.back-button');
    backButtons.forEach(button => {
        button.setAttribute('aria-label', '返回上层目录');
    });
}

// 添加平滑滚动
function addSmoothScrolling() {
    // 确保页面滚动平滑
    document.documentElement.style.scrollBehavior = 'smooth';
}

// 链接点击跟踪（可选）
function trackLinkClick(linkElement) {
    const linkText = linkElement.querySelector('span').textContent;
    const linkUrl = linkElement.href;
    
    // 这里可以添加分析代码
    console.log(`链接点击: ${linkText} -> ${linkUrl}`);
    
    // 添加点击反馈
    linkElement.style.transform = 'scale(0.98)';
    setTimeout(() => {
        linkElement.style.transform = '';
    }, 150);
}

// 为所有链接添加点击跟踪
document.addEventListener('DOMContentLoaded', function() {
    const allLinks = document.querySelectorAll('.nav-link');
    allLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackLinkClick(this);
        });
    });
});

// 错误处理和回退功能
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
    
    // 简单的错误恢复
    const expandedElements = document.querySelectorAll('.expanded');
    expandedElements.forEach(element => {
        element.classList.remove('expanded');
    });
    
    const activeSubmenus = document.querySelectorAll('.submenu.active');
    activeSubmenus.forEach(submenu => {
        submenu.classList.remove('active');
    });
});

// 性能优化：防抖函数
function debounce(func, wait) {
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

// 响应式处理
function handleResize() {
    const isMobile = window.innerWidth <= 768;
    const container = document.querySelector('.container');
    
    if (isMobile) {
        container.classList.add('mobile-layout');
    } else {
        container.classList.remove('mobile-layout');
    }
}

// 防抖的resize处理器
const debouncedResize = debounce(handleResize, 250);
window.addEventListener('resize', debouncedResize);

// 初始化时检查屏幕尺寸
handleResize();

// 预加载功能（可选）
function preloadCriticalResources() {
    // 预加载Font Awesome图标
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
}

// 页面加载完成后执行预加载
window.addEventListener('load', preloadCriticalResources);

// 导出函数以供外部使用
window.DirectoryNavigation = {
    closeSubmenu: closeSubmenu,
    toggleDirectory: toggleDirectory,
    closeAllDirectories: closeAllDirectories
};