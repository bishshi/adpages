const targetDateStr = '2026-02-17T00:00:00';
const targetTime = new Date(targetDateStr).getTime();
let isNearMode = false;

function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetTime - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    // 逻辑判定：是否进入“最后七天”模式
    if (days < 7 && !isNearMode) {
        isNearMode = true;
        document.body.classList.add('near-target');
        renderCalendar(); // 切换模式后重新渲染日历
    }

    if (diff <= 0) {
        document.querySelector('.countdown-timer').innerHTML = "新年快乐！马年大吉";
        return;
    }

    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    document.getElementById('d').innerText = days.toString().padStart(2, '0');
    document.getElementById('h').innerText = h.toString().padStart(2, '0');
    document.getElementById('m').innerText = m.toString().padStart(2, '0');
    document.getElementById('s').innerText = s.toString().padStart(2, '0');
}

let viewDate = new Date();
const today = new Date();
const targetDay = new Date(targetDateStr);

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const title = document.getElementById('monthTitle');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    grid.innerHTML = '';

    if (isNearMode) {
        // --- 最后七天模式：只显示 7 个格子 ---
        title.innerText = "新春倒计时周期";
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';

        // 计算从今天开始的 7 天
        for (let i = 0; i < 7; i++) {
            const cur = new Date();
            cur.setDate(today.getDate() + i);
            
            const el = document.createElement('div');
            el.className = 'day';
            el.innerText = cur.getDate();
            
            if (cur.toDateString() === today.toDateString()) el.classList.add('today');
            if (cur.toDateString() === targetDay.toDateString()) el.classList.add('target');
            
            grid.appendChild(el);
        }
    } else {
        // --- 正常日历模式 ---
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        title.innerText = `${year}年 ${month + 1}月`;
        
        ['日','一','二','三','四','五','六'].forEach(w => {
            const div = document.createElement('div'); div.className = 'day';
            div.style.background = 'none'; div.innerText = w; grid.appendChild(div);
        });

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        for(let i=0; i<firstDay; i++) grid.appendChild(document.createElement('div'));

        for(let i=1; i<=lastDate; i++) {
            const el = document.createElement('div');
            el.className = 'day';
            el.innerText = i;
            const cur = new Date(year, month, i);
            if(cur.toDateString() === today.toDateString()) el.classList.add('today');
            if(cur.toDateString() === targetDay.toDateString()) el.classList.add('target');
            if(cur < today && cur.toDateString() !== today.toDateString()) el.classList.add('past');
            grid.appendChild(el);
        }

        prevBtn.disabled = (year === today.getFullYear() && month === today.getMonth());
        nextBtn.disabled = (year === targetDay.getFullYear() && month === targetDay.getMonth());
    }
}

document.getElementById('prev').onclick = () => { viewDate.setMonth(viewDate.getMonth() - 1); renderCalendar(); };
document.getElementById('next').onclick = () => { viewDate.setMonth(viewDate.getMonth() + 1); renderCalendar(); };

setInterval(updateCountdown, 1000);
updateCountdown();
renderCalendar();