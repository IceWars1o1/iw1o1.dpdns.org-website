let overlay; // 定义全局变量 overlay
let clickCount = 0; // 点击计数器
let clickTimeout; // 用于重置计数的定时器
let users = JSON.parse(localStorage.getItem('users')) || {};
let secretNumber = Math.floor(Math.random() * 100) + 1;
const version = 1.2;
const internalVersion = 20250526001;

function turnToEdgeDownload() {
    const optionsHtml = `
        <div class="overlay" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); width: 300px; text-align: center; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1000;">
            <h3>下载 Microsoft Edge</h3>
            <p>请选择适合您的系统：</p>
            <a href="https://pc.qq.com/detail/2/detail_26342.html" target="_blank" style="display: block; margin: 10px 0; padding: 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
                Windows 10/11 用户请点击下载
            </a>
            <a href="https://sj.qq.com/appdetail/com.microsoft.emmx" target="_blank" style="display: block; margin: 10px 0; padding: 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
                Android (8.0+) 用户请点击下载
            </a>
            <a href="https://www.microsoft.com/zh-cn/edge/download" target="_blank" style="display: block; margin: 10px 0; padding: 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
                Linux 等其他用户点击跳转至微软官网
            </a>
            <button style="position: absolute; top: 10px; right: 10px; padding: 5px 10px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;"
                onclick="overlay.parentNode.removeChild(overlay);">关闭</button>
        </div>
    `;
    overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.innerHTML = optionsHtml;
    document.body.appendChild(overlay);
}

function versionClick() {
    clickCount++;
    
    // 重置计数器（如果3秒内没有再次点击）
    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => {
        clickCount = 0;
    }, 3000); // 3秒内没有再次点击则重置
    
    // 检查是否达到3次点击
    if (clickCount === 3) {
        alert(`version:${version}\ninternalVersion:${internalVersion}`);
        clickCount = 0; // 重置计数器
    }
}

function showRegisterForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('unregister-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

function hideRegisterForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

function showUnregisterForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('unregister-form').style.display = 'block';
}

function hideUnregisterForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('unregister-form').style.display = 'none';
}

function unregister() {
    const unregisterUsername = document.getElementById('unregister-username').value;
    const unregisterPassword = document.getElementById('unregister-password').value;
    if (users[unregisterUsername] && users[unregisterUsername] === unregisterPassword) {
        delete users[unregisterUsername];
        localStorage.setItem('users', JSON.stringify(users));
        alert('账号注销成功！');
        window.location.href = "login.html";
    } else {
        alert('用户名或密码错误！');
    }
}

function register() {
    const registerUsername = document.getElementById('register-username').value;
    const registerPassword = document.getElementById('register-password').value;
    if (users[registerUsername]) {
        alert('用户名已存在！');
    } else {
        users[registerUsername] = registerPassword;
        localStorage.setItem('users', JSON.stringify(users));
        alert('注册成功！');
        window.location.href = "login.html";
    }
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (users[username] && users[username] === password) {
        localStorage.setItem('currentUser', username);
        alert('登录成功！');
        window.location.href = "game.html";
    } else {
        alert('用户名或密码错误！');
    }
}

function guessNumber() {
    const guess = parseInt(document.getElementById('guess').value);
    if (isNaN(guess) || guess < 1 || guess > 100) {
        alert('请输入1到100之间的数字！');
        return;
    }
    
    if (guess === secretNumber) {
        const username = localStorage.getItem('currentUser');
        alert(`恭喜你，猜对了！答案是${secretNumber}`);
        secretNumber = Math.floor(Math.random() * 100) + 1;
    } else if (guess < secretNumber) {
        alert('太小了！');
    } else {
        alert('太大了！');
    }
}