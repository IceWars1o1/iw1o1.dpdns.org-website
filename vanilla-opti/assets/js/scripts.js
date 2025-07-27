// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取移动端菜单按钮和导航菜单
    const mobileMenuButton = document.querySelector('button[class*="md:hidden"]');
    const navMenu = document.querySelector('nav[class*="md:flex"]');

    // 创建移动端菜单容器
    const mobileMenuContainer = document.createElement('div');
    mobileMenuContainer.id = 'mobile-menu';
    mobileMenuContainer.className = 'md:hidden fixed inset-0 z-50 bg-white transform translate-x-full transition-transform duration-300 ease-in-out hidden';
    // 创建菜单内容
    // 替换移动端菜单插入内容
    mobileMenuContainer.innerHTML = `
    <div class="flex justify-between items-center p-4 border-b border-gray-200">
        <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
            <img src="./images/logo.jpg" alt="Logo" class="w-full h-full object-cover">
        </div>
        <span class="text-lg font-bold text-gray-900">原版优化整合包</span>
        </div>
        <button id="mobile-close-button" class="p-2 text-gray-600 hover:text-green-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
            <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
        </svg>
        </button>
    </div>
    <nav class="flex flex-col p-4 space-y-2">
        <a href="#home" onclick="scrollToLine('home')" class="nav-btn block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors">首页</a>
        <a href="#features" class="nav-btn block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors">介绍</a>
        <a href="#feedback" class="nav-btn block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors">问题反馈</a>
        <a href="#join" class="nav-btn block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors">立即使用</a>
        <a href="./changelog" class="nav-btn block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors">更新日志</a>

    </nav>
    `;

    // 将移动端菜单添加到body
    document.body.appendChild(mobileMenuContainer);

    // 打开移动端菜单
    function openMobileMenu() {
        mobileMenuContainer.classList.remove('translate-x-full');
        document.body.classList.add('overflow-hidden');
        mobileMenuContainer.classList.remove('hidden');
    }

    // 关闭移动端菜单
    function closeMobileMenu() {
        mobileMenuContainer.classList.add('translate-x-full', 'hidden');
        document.body.classList.remove('overflow-hidden');
    }


    // 绑定打开菜单事件
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', openMobileMenu);
    }

    // 绑定关闭菜单事件
    const closeButton = document.getElementById('mobile-close-button');
    if (closeButton) {
        closeButton.addEventListener('click', closeMobileMenu);
    }

    // 点击菜单项后关闭菜单
    const mobileMenuLinks = mobileMenuContainer.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // 点击菜单外部关闭菜单
    mobileMenuContainer.addEventListener('click', function(e) {
        if (e.target === mobileMenuContainer) {
            closeMobileMenu();
        }
    });

    // 窗口大小改变时重置
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            closeMobileMenu();
        }
    });

    // 为所有导航链接添加平滑滚动
    const allNavLinks = document.querySelectorAll('a[href^="#"]');
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href')
                .substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = 64; // 考虑固定头部的高度
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});

function scrollToLine(lineId) {
    const target = document.getElementById(lineId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

function redirect(urlNum) {
    if (urlNum === 0) {
        window.location.href = "https://iw1o1.dpdns.org/copyright";
    }
    if (urlNum === 10) {
        window.location.href = "https://qm.qq.com/q/gdgWu3dGmY";
    }
    if (urlNum === 11) {
        window.location.href = "https://space.bilibili.com/482521515/dynamic";
    }
    if (urlNum === 12) {
        window.location.href = "https://www.123pan.com/s/hIA5Vv-Ri0wd.html";
    }
    if (urlNum === 13) {
        window.location.href = "https://share.feijipan.com/s/IMAlO5Fe";
    }
    
    if (urlNum === 20) {
        window.location.href = "./changelog/";
    }
    
}
const navBtns = document.querySelectorAll('.nav-btn');
const sections = ['home', 'features', 'rules', 'feedback', 'join', 'footer'];

const setActiveNav = () => {
    let current = '';
    const footer = document.getElementById('footer'); // 获取页脚元素
    const footerTop = footer.getBoundingClientRect()
        .top;
    const footerBottom = footer.getBoundingClientRect()
        .bottom;

    // 检查是否滚动到页脚区域
    if (footerTop <= 120 && footerBottom >= 120) {
        current = 'join'; // 如果在页脚区域，设置当前激活为“首页”
    } else {
        // 否则，按正常逻辑判断
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const isInView = rect.top <= 120 && rect.bottom >= 120;

            if (isInView) {
                current = id;
            }
        });
    }

    // 更新导航按钮的样式
    navBtns.forEach(btn => {
        // 移除所有激活样式
        btn.classList.remove('bg-green-50', 'text-green-600');
        btn.classList.add('text-gray-600', 'hover:text-green-600', 'hover:bg-green-50');

        // 添加当前激活样式
        if (btn.getAttribute('onclick')?.includes(current)) {
            btn.classList.remove('text-gray-600', 'hover:text-green-600', 'hover:bg-green-50');
            btn.classList.add('bg-green-50', 'text-green-600');
        }
    });
};

window.addEventListener('scroll', setActiveNav);
setActiveNav(); // 初始加载时也触发一次