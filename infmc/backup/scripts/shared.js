function showSection(id) {
    // 隐藏所有section
    document.querySelectorAll('.hidden-section')
        .forEach(section => {
        section.style.display = 'none';
    });

    // 显示目标section
    document.getElementById(id)
        .style.display = 'block';

    // 移除所有导航链接的高亮样式
    document.querySelectorAll('.navbar ul li a')
        .forEach(link => {
        link.classList.remove('active');
    });

    // 为当前导航链接添加高亮样式
    if (id !== 'top') {
        document.getElementById(id + '-link')
            .classList.add('active');
    }
}

// 滚动到页面顶部
function scrollToTop() {
    window.scrollTo({
        top: 0, // 滚动到页面顶部
        behavior: 'smooth' // 平滑滚动
    });
}

let currentIndex = 0;
const slides = document.querySelectorAll('.carousel-item');
const totalSlides = slides.length;

// 自动轮播函数
function autoSlide() {
    currentIndex = (currentIndex + 1) % totalSlides; // 计算下一张图片的索引
    updateCarousel(); // 更新轮播图
}

// 更新轮播图位置
function updateCarousel() {
    const offset = -currentIndex * 100; // 计算偏移量
    document.querySelector('.carousel-inner')
        .style.transform = `translateX(${offset}%)`; // 设置偏移
}

function redirectToDonate() {
    window.location.href = "https://afdian.tv/a/infmc";
}
document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");
    const toggleButton = document.querySelector(".toggle-sidebar");

    // 切换折叠状态
    toggleButton.addEventListener("click", function () {
        sidebar.classList.toggle("collapsed");
        mainContent.classList.toggle("collapsed");
    });

    // 在 DOMContentLoaded 时显示 home 标签
    showSection('home');
});