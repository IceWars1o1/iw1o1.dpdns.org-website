// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

// 初始化页面
function initializePage() {
    displayCurrentDate();
    loadDailyQuote();
}

// 显示当前日期
function displayCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    const now = new Date();
    
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    };
    
    const formattedDate = now.toLocaleDateString('zh-CN', options);
    dateElement.textContent = formattedDate;
}

// 加载每日名言
async function loadDailyQuote() {
    try {
        // 显示加载状态
        const quoteText = document.getElementById('quoteText');
        const quoteAuthor = document.getElementById('quoteAuthor');
        
        quoteText.classList.add('loading');
        quoteText.textContent = '正在加载今日名言...';
        quoteAuthor.textContent = '';
        
        // 从JSON文件加载名言数据
        const response = await fetch('quotes.json');
        if (!response.ok) {
            throw new Error('无法加载名言数据');
        }
        
        const data = await response.json();
        const quotes = data.quotes;
        
        if (!quotes || quotes.length === 0) {
            throw new Error('名言数据为空');
        }
        
        // 根据当前日期计算索引
        const today = new Date();
        const dayOfYear = getDayOfYear(today);
        const quoteIndex = dayOfYear % quotes.length;
        
        // 获取今日名言
        const todayQuote = quotes[quoteIndex];
        
        // 延迟显示以增加用户体验
        setTimeout(() => {
            displayQuote(todayQuote);
        }, 500);
        
    } catch (error) {
        console.error('加载名言时出错:', error);
        displayError();
    }
}

// 显示名言
function displayQuote(quote) {
    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');
    
    quoteText.classList.remove('loading');
    quoteText.textContent = quote.text;
    quoteAuthor.textContent = quote.author;
    
    // 添加淡入动画
    quoteText.style.opacity = '0';
    quoteAuthor.style.opacity = '0';
    
    setTimeout(() => {
        quoteText.style.transition = 'opacity 0.8s ease-in';
        quoteAuthor.style.transition = 'opacity 0.8s ease-in';
        quoteText.style.opacity = '1';
        quoteAuthor.style.opacity = '1';
    }, 100);
}

// 显示错误信息
function displayError() {
    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');
    
    quoteText.classList.remove('loading');
    quoteText.textContent = '今天也要保持美好的心情哦！';
    quoteAuthor.textContent = '系统提醒';
}

// 计算一年中的第几天
function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

// 添加键盘事件监听（可选功能）
document.addEventListener('keydown', function(event) {
    // 按空格键重新加载名言（用于测试）
    if (event.code === 'Space' && event.ctrlKey) {
        event.preventDefault();
        loadDailyQuote();
    }
});

// 添加页面可见性变化监听
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // 页面重新可见时，检查是否需要更新日期
        const currentDateElement = document.getElementById('currentDate');
        const now = new Date();
        const displayedDate = currentDateElement.textContent;
        
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        };
        
        const currentFormattedDate = now.toLocaleDateString('zh-CN', options);
        
        // 如果日期发生变化，重新加载页面
        if (displayedDate !== currentFormattedDate) {
            initializePage();
        }
    }
});

// 错误处理
window.addEventListener('error', function(event) {
    console.error('页面出现错误:', event.error);
});

// 未处理的Promise拒绝
window.addEventListener('unhandledrejection', function(event) {
    console.error('未处理的Promise拒绝:', event.reason);
    event.preventDefault();
});