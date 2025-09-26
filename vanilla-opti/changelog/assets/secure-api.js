// 加密API客户端库
class SecureAPI {
    constructor() {
        // 动态确定正确的baseUrl
        // 根据当前页面路径来确定gateway.php的相对路径
        const currentPath = window.location.pathname;
        let baseUrl;
        
        console.log('Current path:', currentPath);
        
        if (currentPath.includes('/admin/') || 
            currentPath.includes('/log/') || currentPath.includes('/test/') || 
            currentPath.includes('/update/')) {
            // 如果当前在admin、log、test或update目录下
            baseUrl = '../assets/gateway.php';
            console.log('Detected subdirectory, using baseUrl:', baseUrl);
        } else {
            // 默认路径（适用于changelog/index.html和login页面）
            baseUrl = 'assets/gateway.php';
            console.log('Using default baseUrl:', baseUrl);
        }
        
        // 确保baseUrl不为undefined
        if (!baseUrl) {
            baseUrl = 'assets/gateway.php';
        }
        
        this.baseUrl = baseUrl;
        this.apiKey = 'miku_dream_2025_secure_api_v1';
        this.requestQueue = [];
        this.isProcessing = false;
        
        // 调试信息
        console.log('SecureAPI initialized with baseUrl:', this.baseUrl);
    }

    // 生成随机请求ID
    generateRequestId() {
        return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // 添加请求到队列
    async queueRequest(requestType, data = null) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({
                id: this.generateRequestId(),
                type: requestType,
                data: data,
                resolve: resolve,
                reject: reject,
                timestamp: Date.now()
            });

            if (!this.isProcessing) {
                this.processQueue();
            }
        });
    }

    // 处理请求队列
    async processQueue() {
        if (this.isProcessing || this.requestQueue.length === 0) {
            return;
        }

        this.isProcessing = true;

        while (this.requestQueue.length > 0) {
            const request = this.requestQueue.shift();
            
            try {
                const response = await this.makeRequest(request.type, request.data);
                request.resolve(response);
            } catch (error) {
                request.reject(error);
            }

            // 添加延迟防止请求过于频繁
            if (this.requestQueue.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        this.isProcessing = false;
    }

    // 发送请求
    async makeRequest(requestType, data = null) {
        const headers = {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey,
            'X-Request-Type': requestType,
            'X-Request-ID': this.generateRequestId()
        };

        const options = {
            method: 'POST',
            headers: headers,
            credentials: 'same-origin'
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            console.log('Making request to:', this.baseUrl, 'with options:', options);
            const response = await fetch(this.baseUrl, options);
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error text:', errorText);
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('API response result:', result);
            
            // 检查API响应
            if (result.success === false) {
                console.error('API returned success=false:', result.msg);
                throw new Error(result.msg || '请求失败');
            }

            return result;
        } catch (error) {
            console.error('API请求失败:', error);
            console.error('Request URL:', this.baseUrl);
            console.error('Request options:', options);
            throw error;
        }
    }

    // 登录
    async login(username, password) {
        return this.queueRequest('login', { username, password });
    }

    // 检查登录状态
    async checkLogin() {
        return this.queueRequest('check');
    }

    // 登出
    async logout() {
        return this.queueRequest('logout');
    }

    // 添加日志
    async addLog(version, content = '') {
        return this.queueRequest('add_log', { version, content });
    }

    // 删除日志
    async deleteLog(id) {
        return this.queueRequest('del_log', { id });
    }

    // 获取日志列表
    async getLogs() {
        return this.queueRequest('logs');
    }

    // 上传mcpack文件
    async uploadMcpack(file) {
        const formData = new FormData();
        formData.append('file', file);

        const headers = {
            'X-API-Key': this.apiKey,
            'X-Request-Type': 'upload_mcpack',
            'X-Request-ID': this.generateRequestId()
        };

        const options = {
            method: 'POST',
            headers: headers,
            credentials: 'same-origin',
            body: formData
        };

        try {
            const response = await fetch(this.baseUrl, options);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (result.success === false) {
                throw new Error(result.msg || '上传失败');
            }

            return result;
        } catch (error) {
            console.error('文件上传失败:', error);
            throw error;
        }
    }

    // 错误处理
    handleError(error) {
        console.error('API错误:', error);
        
        // 根据错误类型显示不同的消息
        let message = '操作失败';
        
        if (error.message.includes('401')) {
            message = '请先登录';
        } else if (error.message.includes('403')) {
            message = '访问被拒绝';
        } else if (error.message.includes('429')) {
            message = '请求过于频繁，请稍后再试';
        } else if (error.message.includes('500')) {
            message = '服务器错误';
        } else {
            message = error.message || '未知错误';
        }

        // 显示错误消息
        this.showMessage(message, 'error');
    }

    // 显示消息
    showMessage(message, type = 'info') {
        // 创建消息元素
        const messageEl = document.createElement('div');
        messageEl.className = `api-message api-message-${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

        // 设置背景色
        if (type === 'error') {
            messageEl.style.backgroundColor = '#f44336';
        } else if (type === 'success') {
            messageEl.style.backgroundColor = '#4caf50';
        } else {
            messageEl.style.backgroundColor = '#2196f3';
        }

        // 添加到页面
        document.body.appendChild(messageEl);

        // 3秒后自动移除
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (messageEl.parentNode) {
                        messageEl.parentNode.removeChild(messageEl);
                    }
                }, 300);
            }
        }, 3000);
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 创建全局API实例
window.secureAPI = new SecureAPI(); 