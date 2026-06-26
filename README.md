# 恋爱小窝 - 云同步版配置指南

## 为什么需要云同步？

本地版（index.html）的数据存储在浏览器 localStorage 中：
- ✅ 优点：简单，无需配置
- ❌ 缺点：只能在本机查看，清除浏览器数据会丢失，两人无法实时共享

云同步版（index-online.html）使用 Firebase：
- ✅ 两人可以实时共享数据
- ✅ 手机/电脑数据同步
- ✅ 永久保存，不会丢失
- ✅ 一方添加记录，另一方立即看到

---

## 快速开始（5分钟配置）

### 步骤1：创建 Firebase 项目

1. 打开 https://console.firebase.google.com/
2. 点击「创建项目」
3. 输入项目名称（如：love-site）
4. 按提示完成创建

### 步骤2：启用 Realtime Database

1. 在项目控制台左侧，点击「Build」→「Realtime Database」
2. 点击「创建数据库」
3. 选择位置（建议选最近的服务器，如：asia-east1）
4. **安全规则选择「以测试模式启动」**（后面会改）

### 步骤3：获取配置信息

1. 点击项目设置（左上角齿轮图标）→「项目设置」
2. 滚动到「您的应用」，点击「Web」图标（</>）
3. 输入应用昵称（如：love-web），点击「注册应用」
4. 复制显示的配置信息，类似：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxx",
  authDomain: "love-site-xxxxx.firebaseapp.com",
  databaseURL: "https://love-site-xxxxx-default-rtdb.firebaseio.com",
  projectId: "love-site-xxxxx",
  storageBucket: "love-site-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 步骤4：填写配置

打开 `index-online.html`，找到第 118-126 行，替换为你的配置：

```javascript
const FIREBASE_CONFIG = {
    apiKey: "你的API_KEY",
    authDomain: "你的项目.firebaseapp.com",
    databaseURL: "https://你的项目.firebaseio.com",
    projectId: "你的项目ID",
    storageBucket: "你的项目.appspot.com",
    messagingSenderId: "你的SENDER_ID",
    appId: "你的APP_ID"
};
```

### 步骤5：设置安全规则（重要！）

回到 Firebase 控制台 → Realtime Database → 规则，替换为：

```json
{
  "rules": {
    "loveSite": {
      ".read": true,
      ".write": true
    }
  }
}
```

点击「发布」。

> ⚠️ 注意：这个规则允许任何人读写，仅适合个人使用。如需更安全，可添加认证。

### 步骤6：测试

1. 双击打开 `index-online.html`
2. 如果右上角显示「已连接」绿色圆点，说明成功！
3. 添加一条记录，然后在另一个浏览器/手机打开，看是否同步

---

## 部署到线上（可选）

### 方法1：Firebase Hosting（推荐）

```bash
# 安装 Firebase CLI
npm install -g firebase-tools

# 登录
firebase login

# 初始化
firebase init hosting
# 选择刚创建的项目
# Public directory 输入: .
# Single-page app: No
# Overwrite index.html: No

# 把 index-online.html 重命名为 index.html
# 然后部署
firebase deploy
```

部署后会得到一个 https://xxx.web.app 的链接，可以分享给女朋友。

### 方法2：GitHub Pages

1. 创建 GitHub 仓库
2. 上传 `index-online.html` 并重命名为 `index.html`
3. Settings → Pages → Source: main branch
4. 等待部署完成

---

## 常见问题

### Q: 显示「连接失败」？
A: 检查：
- Firebase 配置是否正确填写
- Realtime Database 是否已启用
- 网络是否能访问 Firebase（部分地区需要代理）

### Q: 数据不同步？
A: 
- 确认右上角状态是「已连接」
- 尝试刷新页面
- 检查 Firebase 控制台是否有数据

### Q: 如何修改起始日期和名字？
A: 第一次打开网站后，数据会保存到 Firebase。可以在控制台直接修改：
- Firebase 控制台 → Realtime Database → loveSite
- 直接编辑 startDate、yourName、partnerName 字段

### Q: 安全吗？
A: 当前配置允许任何人读写数据库 URL。建议：
- 不要公开分享网站链接
- 或添加 Firebase Authentication 进行认证

---

## 数据结构说明

```
loveSite/
├── startDate      # 恋爱开始日期
├── yourName       # 你的名字
├── partnerName    # 对方的名字
├── photos[]       # 照片URL数组
├── photoEmojis[]  # 占位emoji
├── loveQuotes[]   # 情话语录
└── diaryEntries/  # 日常记录
    ├── entry1: { text, timestamp }
    ├── entry2: { text, timestamp }
    └── ...
```

---

## 下一步

- ✅ 配置完成后，两人就可以实时共享数据了
- 📱 在手机浏览器打开效果更好
- 🎨 可以自定义照片、情话内容
- 💕 甜蜜恋爱！