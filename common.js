const FIREBASE_CONFIG = {
    apiKey: "AIzaSyALmikJZXqjjqPmqZ3PKeERMsKKrxtgr64",
    authDomain: "love-nest-1536d.firebaseapp.com",
    databaseURL: "https://love-nest-1536d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "love-nest-1536d",
    storageBucket: "love-nest-1536d.firebasestorage.app",
    messagingSenderId: "346144764535",
    appId: "1:346144764535:web:0cc944b724bdfce5a38c72"
};

const DEFAULT_SETTINGS = {
    startDate: "2025-06-18T00:00:00",
    yourName: "宝贝",
    partnerName: "乖乖",
    myId: "A"
};

let db = null;
let currentUser = null;

function initFirebase() {
    if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
        db = firebase.database();
    }
}

function checkLogin() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        currentUser = JSON.parse(userData);
    }
    return currentUser;
}

function getCurrentUser() {
    if (!currentUser) {
        currentUser = JSON.parse(localStorage.getItem('userData') || 'null');
    }
    return currentUser;
}

function logout() {
    localStorage.removeItem('userData');
    if (firebase.auth) {
        firebase.auth().signOut();
    }
    window.location.href = 'login.html';
}

function loadSettings(callback) {
    if (!db) {
        callback(DEFAULT_SETTINGS);
        return;
    }
    db.ref('settings').once('value').then((snap) => {
        const settings = snap.val() || DEFAULT_SETTINGS;
        callback(settings);
    }).catch(() => {
        callback(DEFAULT_SETTINGS);
    });
}

function saveSettings(settings) {
    if (!db) return;
    db.ref('settings').set(settings);
}

function startTimer(startDateStr) {
    const startDate = new Date(startDateStr);
    
    function update() {
        const now = new Date();
        const diff = now - startDate;
        if (diff < 0) {
            document.getElementById('days').innerText = '0';
            document.getElementById('hours').innerText = '0';
            document.getElementById('minutes').innerText = '0';
            document.getElementById('seconds').innerText = '0';
            return;
        }
        const totalSec = Math.floor(diff / 1000);
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minEl = document.getElementById('minutes');
        const secEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.innerText = Math.floor(totalSec / 86400);
        if (hoursEl) hoursEl.innerText = Math.floor((totalSec % 86400) / 3600);
        if (minEl) minEl.innerText = Math.floor((totalSec % 3600) / 60);
        if (secEl) secEl.innerText = totalSec % 60;

        const oneYearLater = new Date(startDate);
        oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
        const remain = oneYearLater - now;
        const badge = document.getElementById('anniversaryBadge');
        if (!badge) return;
        
        if (remain <= 0 && remain > -86400000) {
            badge.innerText = "🎉 今天是一周年纪念日！🎉";
            badge.classList.add('today');
        } else if (remain < 0) {
            badge.innerText = `💝 一周年已过 ${Math.floor(Math.abs(remain)/86400000)} 天`;
            badge.classList.remove('today');
        } else {
            badge.innerText = `🎀 距离一周年还有 ${Math.ceil(remain/86400000)} 天`;
            badge.classList.remove('today');
        }
    }
    update();
    setInterval(update, 1000);
}

function setupConnectionStatus() {
    const statusEl = document.getElementById('connectionStatus');
    if (!statusEl) return;
    
    if (!db) {
        statusEl.innerHTML = "🔴 未连接";
        statusEl.className = "status-badge offline";
        return;
    }
    
    // 立即显示连接中
    statusEl.innerHTML = "🟡 连接中...";
    statusEl.className = "status-badge";
    
    db.ref('.info/connected').on('value', (snap) => {
        if (snap.val() === true) {
            statusEl.innerHTML = "🟢 在线";
            statusEl.className = "status-badge online";
        } else {
            statusEl.innerHTML = "🔴 离线";
            statusEl.className = "status-badge offline";
        }
    });
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function(m) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
        return map[m];
    });
}

function setupHeartEffect() {
    function createHeart(x, y) {
        const heart = document.createElement('div');
        heart.innerText = ['💕','💖','💗','🌸','🩷','✨'][Math.floor(Math.random() * 6)];
        heart.style.cssText = `
            position: fixed; left: ${x}px; top: ${y}px; font-size: 28px;
            pointer-events: none; z-index: 99999; opacity: 0.8;
            transition: all 3s ease-out;
        `;
        document.body.appendChild(heart);
        requestAnimationFrame(() => {
            heart.style.transform = 'translateY(-300px) translateX(20px) rotate(15deg)';
            heart.style.opacity = '0';
        });
        setTimeout(() => heart.remove(), 3000);
    }
    document.body.addEventListener('click', (e) => createHeart(e.clientX, e.clientY));
    document.body.addEventListener('touchstart', (e) => {
        if (e.touches.length) createHeart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
}

function getDb() {
    return db;
}