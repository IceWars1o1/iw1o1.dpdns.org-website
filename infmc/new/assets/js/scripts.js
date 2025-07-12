// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function () {
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
            <img src="https://infmc.dpdns.org/new/images/logo.jpg" alt="Logo" class="w-full h-full object-cover">
        </div>
        <span class="text-lg font-bold text-gray-900">InfMinecraft</span>
        </div>
        <button id="mobile-close-button" class="p-2 text-gray-600 hover:text-green-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
            <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
        </svg>
        </button>
    </div>
    <nav class="flex flex-col p-4 space-y-2">
        <a href="#home" onclick="scrollToLine('home')"class="nav-btn block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors">首页</a>
        <a href="#features" class="nav-btn block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors">本服特色</a>
        <a href="#rules" class="nav-btn block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors">规则文档</a>
        <a href="#feedback" class="nav-btn block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors">社区反馈</a>
        <a href="#join" class="nav-btn block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors">加入我们</a>
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
    mobileMenuContainer.addEventListener('click', function (e) {
        if (e.target === mobileMenuContainer) {
            closeMobileMenu();
        }
    });

    // 窗口大小改变时重置
    window.addEventListener('resize', function () {
        if (window.innerWidth >= 768) {
            closeMobileMenu();
        }
    });

    // 为所有导航链接添加平滑滚动
    const allNavLinks = document.querySelectorAll('a[href^="#"]');
    allNavLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
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
    showSection('rule-overview');
    const defaultBtn = document.querySelector('button[onclick="showSection(\'rule-overview\')"]');

});
function scrollToLine(lineId) {
    const target = document.getElementById(lineId);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
}

function showSection(id) {
    // 隐藏所有规则区块
    document.querySelectorAll('.rules').forEach(section => {
        section.style.display = 'none';
    });

    // 显示目标区块
    document.getElementById(id).style.display = 'block';

    // 重置所有按钮为初始样式
    document.querySelectorAll('.flex button').forEach(btn => {
        btn.classList.remove('bg-white', 'text-blue-600', 'shadow-md');
        btn.classList.add('text-gray-600', 'hover:text-blue-600');
    });

    // 找到当前按钮并添加激活样式
    const activeBtn = document.querySelector(`button[onclick="showSection('${id}')"]`);
    if (activeBtn) {
        activeBtn.classList.remove('text-gray-600', 'hover:text-blue-600');
        activeBtn.classList.add('bg-white', 'text-blue-600', 'shadow-md');
    }
}
function redirect(urlNum) {
    if (urlNum === 0) {
        window.location.href = "https://iw1o1.dpdns.org/copyright";
    }
    if (urlNum === 1) {
        window.location.href = "https://qm.qq.com/cgi-bin/qm/qr?k=ISFb6sqeNNSE0yd39ONWcTZjVH8oudq3&jump_from=webapi&authKey=N47tZpH/Qe05W/9DL3v5C7O8qXrCYN1BOrOJ8a0yCXZJIzb1r6KkXL8GH1VCDbbE";
    }
    if (urlNum === 2) {
        window.location.href = "https://docs.qq.com/doc/p/6680f8acaf8080ee485f58d1cf88d69223da57d9";
    }
}
const navBtns = document.querySelectorAll('.nav-btn');
const sections = ['home', 'features', 'rules', 'feedback', 'join', 'footer'];

const setActiveNav = () => {
    let current = '';
    const footer = document.getElementById('footer'); // 获取页脚元素
    const footerTop = footer.getBoundingClientRect().top;
    const footerBottom = footer.getBoundingClientRect().bottom;

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