# IceWars1o1 索引网站

这是一个层级目录导航网站，提供清晰的结构化导航体验。

## 🌟 功能特性

### 核心功能
- **层级导航结构**：支持展开/折叠的子目录系统
- **返回上层目录**：每个子目录都有返回功能
- **响应式设计**：适配桌面、平板和手机设备
- **现代化UI**：使用渐变背景和卡片式布局
- **键盘导航**：支持键盘操作和无障碍性
- **流畅动画**：CSS3动画效果提升用户体验

### 网站结构
```
IceWars1o1 索引
├── 游戏列表/
│   ├── 猜数字游戏（SingleFile）
│   └── 猜数字游戏（MultiFile）
├── InfMC介绍/
│   ├── 个人（infmc.iw1o1.dpdns.org）
│   └── 集体（infmc.dpdns.org）
├── 小王子笔记
└── 每日一句
```

## 📁 文件结构

```
icewars1o1-index/
├── index.html          # 主HTML文件
├── css/
│   └── styles.css      # 样式文件
├── js/
│   └── main.js         # JavaScript交互功能
├── images/             # 图片资源目录（预留）
└── README.md           # 项目说明文档
```

## 🚀 使用方法

1. **直接使用**：双击 `index.html` 在浏览器中打开
2. **本地服务器**：使用任何HTTP服务器托管文件夹
3. **部署**：将整个文件夹上传到Web服务器

## 🔧 自定义和扩展

### 添加新的目录项
在 `index.html` 中找到相应位置，按照以下模板添加：

```html
<!-- 可展开的目录 -->
<div class="directory-item">
    <div class="directory-header" data-target="new-submenu" tabindex="0" role="button" aria-expanded="false">
        <i class="fas fa-folder directory-icon"></i>
        <i class="fas fa-folder-open directory-icon-open"></i>
        <span class="directory-name">新目录名称</span>
        <i class="fas fa-chevron-right expand-icon"></i>
    </div>
    
    <div class="submenu" id="new-submenu">
        <div class="submenu-header">
            <button class="back-button" onclick="closeSubmenu('new-submenu')">
                <i class="fas fa-arrow-left"></i>
                返回上层目录
            </button>
            <h2>新目录标题</h2>
        </div>
        
        <div class="link-list">
            <a href="https://example.com" class="nav-link" target="_blank">
                <i class="fas fa-link"></i>
                <span>链接名称</span>
                <i class="fas fa-external-link-alt external-icon"></i>
            </a>
        </div>
    </div>
</div>

<!-- 直接链接 -->
<a href="https://example.com" class="nav-link direct-link" target="_blank">
    <i class="fas fa-link"></i>
    <span>直接链接名称</span>
    <i class="fas fa-external-link-alt external-icon"></i>
</a>
```

### 修改样式
编辑 `css/styles.css` 文件来自定义外观：
- 修改颜色主题
- 调整布局间距
- 更改字体和图标

### 添加功能
编辑 `js/main.js` 文件来扩展交互功能：
- 添加新的动画效果
- 实现额外的键盘快捷键
- 添加统计或分析功能

## 🎨 设计特色

- **现代渐变背景**：蓝紫色渐变营造科技感
- **卡片式布局**：清晰的视觉层次
- **图标系统**：Font Awesome图标提升视觉效果
- **动画反馈**：悬停和点击动画提升交互体验
- **无障碍性**：支持屏幕阅读器和键盘导航

## 📱 兼容性

- **浏览器**：支持所有现代浏览器（Chrome、Firefox、Safari、Edge）
- **设备**：完全响应式，适配桌面、平板、手机
- **辅助功能**：符合WCAG 2.1 AA标准

## 📄 许可证

Copyright (C) IceWars1o1 2025.  
This website is licensed under the [MIT LICENSE](https://iw1o1.dpdns.org/copyright).

## 🛠️ 技术栈

- **HTML5**：语义化标签和现代结构
- **CSS3**：Flexbox布局、动画、响应式设计
- **JavaScript ES6+**：模块化代码和现代语法
- **Font Awesome**：图标库

---

*创建者：MiniMax Agent*  
*创建时间：2025-07-10*
