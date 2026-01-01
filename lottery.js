// --- 1. 参数与初始化 ---
let currentFriendName = "好朋友";

function initParams() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const name = params.get('name');

    if (id) document.getElementById('backToCard').href = `https://newyearpages.biss.click/2026-${id}.html`;
    else document.getElementById('backToCard').style.display = 'none';

    if (name) {
        currentFriendName = decodeURIComponent(name);
        document.getElementById('welcomeMsg').innerText = `祝 ${currentFriendName} 马年大吉！`;
        document.getElementById('friendNameDisplay').innerText = `To ${currentFriendName}：`;
    }
}

// --- 2. 奖项配置 ---
const prizes = [
    { name: "🍎 平安喜乐", weight: 20 },
    { name: "🧧 暴富锦鲤", weight: 15 },
    { name: "🐎 升职加薪", weight: 15 },
    { name: "💪 发量惊人", weight: 10 },
    { name: "✈️ 说走就走", weight: 10 },
    { name: "🍰 只吃不胖", weight: 10 },
    { name: "💑 桃花朵朵", weight: 10 },
    { name: "🦄 绝版好运", weight: 5 }, // 稀有奖
    { name: "🏖️ 带薪休假", weight: 5 }
];

function handleDraw() {
    const btn = document.getElementById('drawBtn');
    btn.disabled = true;
    btn.innerText = "🔮 运势计算中...";
    
    // 播放点击高潮烟花
    for(let i=0; i<5; i++) {
        setTimeout(() => createExplosion(window.innerWidth/2, window.innerHeight/2 + 100), i * 200);
    }

    setTimeout(() => {
        const total = prizes.reduce((s, p) => s + p.weight, 0);
        let random = Math.random() * total;
        let selected = prizes[0].name;
        
        for (const p of prizes) {
            if (random < p.weight) {
                selected = p.name;
                break;
            }
            random -= p.weight;
        }

        document.getElementById('prizeResult').innerText = selected;
        document.getElementById('modalOverlay').classList.add('active');
        btn.disabled = false;
        btn.innerText = "再次抽取";
    }, 1500);
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

// --- 3. 升级版烟花逻辑 (中心爆炸) ---
function createExplosion(x, y) {
    const container = document.getElementById('fireworks-container');
    const particleCount = 30; // 粒子数量
    const colors = ['#FFD700', '#FF4500', '#FFFFFF', '#00FF00', '#00FFFF'];
    
    // 如果未指定坐标，则随机生成
    if (!x) x = Math.random() * window.innerWidth;
    if (!y) y = Math.random() * (window.innerHeight * 0.8);

    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.className = 'firework-particle';
        p.style.backgroundColor = color;
        p.style.left = x + 'px';
        p.style.top = y + 'px';

        // 极坐标计算：让粒子向四面八方散开
        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 150; // 爆炸半径
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity + 100; // +100 是重力下坠感

        p.style.setProperty('--tx', `${tx}px`);
        p.style.setProperty('--ty', `${ty}px`);

        container.appendChild(p);
        
        // 动画结束后移除DOM
        setTimeout(() => p.remove(), 1200);
    }
}

// 自动燃放
setInterval(() => createExplosion(), 800);

// --- 4. 截图保存功能 (html2canvas) ---
function saveImage() {
    const element = document.getElementById('captureArea');
    const saveBtn = document.querySelector('.save-btn');
    
    saveBtn.innerText = "⏳ 生成中...";
    
    html2canvas(element, {
        backgroundColor: null, // 保持透明圆角
        scale: 2, // 提高清晰度
        useCORS: true // 允许跨域图片
    }).then(canvas => {
        // 创建下载链接
        const link = document.createElement('a');
        link.download = `2026马年好运签-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        
        saveBtn.innerText = "✅ 已保存";
        setTimeout(() => { saveBtn.innerHTML = "<span>📥</span> 保存图片"; }, 2000);
    }).catch(err => {
        console.error(err);
        alert("图片生成失败，请尝试截屏保存");
        saveBtn.innerText = "保存失败";
    });
}

// --- 音乐控制 ---
const audio = document.getElementById('bgMusic');
function toggleMusic() {
    if (audio.paused) { 
        audio.play(); 
        document.getElementById('musicIcon').style.animation = 'rotating 2s linear infinite'; 
    } else { 
        audio.pause(); 
        document.getElementById('musicIcon').style.animation = 'none'; 
    }
}
document.addEventListener('click', () => { if(audio.paused) toggleMusic(); }, {once: true});

// 启动初始化
initParams();