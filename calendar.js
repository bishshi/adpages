document.addEventListener('DOMContentLoaded', () => {
    // --- 倒计时部分 ---
    const targetNewYearDate = new Date('2026-02-17T00:00:00').getTime(); // 2026年春节
    let countdownInterval;

    const daysSpan = document.getElementById('days');
    const hoursSpan = document.getElementById('hours');
    const minutesSpan = document.getElementById('minutes');
    const secondsSpan = document.getElementById('seconds');
    const countdownTitle = document.querySelector('.countdown-title');
    const countdownTimerDisplay = document.querySelector('.countdown-timer');

    function updateCountdown() {
        const now = new Date().getTime();
        const gap = targetNewYearDate - now;

        if (gap <= 0) {
            countdownTitle.innerText = "新年快乐！";
            countdownTimerDisplay.innerHTML = "<span>2026</span> 马年大吉 · 万事如意";
            clearInterval(countdownInterval);
            return;
        }

        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        const d = Math.floor(gap / day);
        const h = Math.floor((gap % day) / hour);
        const m = Math.floor((gap % hour) / minute);
        const s = Math.floor((gap % minute) / second);

        daysSpan.innerText = d.toString().padStart(2, '0');
        hoursSpan.innerText = h.toString().padStart(2, '0');
        minutesSpan.innerText = m.toString().padStart(2, '0');
        secondsSpan.innerText = s.toString().padStart(2, '0');
    }

    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // 立即执行一次避免空白

    // --- 日历部分 ---
    const calendarGrid = document.querySelector('.calendar-grid');
    const currentMonthYearHeader = document.getElementById('currentMonthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const calendarWrapper = document.getElementById('calendar-wrapper');

    let currentDate = new Date(); // 当前视图的月份
    const today = new Date(); // 今天的日期
    const targetDate = new Date(targetNewYearDate); // 目标日期 (春节)

    // 月份名称数组
    const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

    function renderCalendar() {
        calendarGrid.innerHTML = ''; // 清空旧的日历
        // 添加星期几的标题
        const dayNames = ["日", "一", "二", "三", "四", "五", "六"];
        dayNames.forEach(name => {
            const dayNameDiv = document.createElement('div');
            dayNameDiv.classList.add('day-name');
            dayNameDiv.innerText = name;
            calendarGrid.appendChild(dayNameDiv);
        });

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        currentMonthYearHeader.innerText = `${year}年 ${monthNames[month]}`;

        // 获取当前月的第一天是星期几 (0-6, 0是周日)
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        // 获取当前月的天数
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // 填充上个月的空白
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('calendar-day', 'empty');
            calendarGrid.appendChild(emptyDiv);
        }

        // 填充当前月的天数
        for (let i = 1; i <= daysInMonth; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('calendar-day');
            dayDiv.innerText = i;

            const currentDay = new Date(year, month, i);

            // 标记今天
            if (currentDay.getDate() === today.getDate() &&
                currentDay.getMonth() === today.getMonth() &&
                currentDay.getFullYear() === today.getFullYear()) {
                dayDiv.classList.add('today');
            }

            // 标记已过去的天数 (用小灯笼遮盖)
            if (currentDay < today && (currentDay.getMonth() === today.getMonth() && currentDay.getFullYear() === today.getFullYear() || currentDay.getFullYear() < today.getFullYear() || (currentDay.getFullYear() === today.getFullYear() && currentDay.getMonth() < today.getMonth()))) {
                dayDiv.classList.add('past-day');
            }


            // 标记目标日期 (春节)
            if (currentDay.getDate() === targetDate.getDate() &&
                currentDay.getMonth() === targetDate.getMonth() &&
                currentDay.getFullYear() === targetDate.getFullYear()) {
                dayDiv.classList.add('target-date');
            }

            calendarGrid.appendChild(dayDiv);
        }

        updateNavigationButtons();
    }

    function updateNavigationButtons() {
        const diffMonths = (targetDate.getFullYear() - today.getFullYear()) * 12 + (targetDate.getMonth() - today.getMonth());
        const currentMonthDiffFromToday = (currentDate.getFullYear() - today.getFullYear()) * 12 + (currentDate.getMonth() - today.getMonth());

        // 如果距离目标日期不足一个月（即当前月就是目标月，或者目标月是下一个月但不到28天），禁用所有导航
        // 这里简化为：如果当前月或下一个月包含目标日期，且总的月份跨度小，则禁用
        const isTargetMonthInView = (currentDate.getMonth() === targetDate.getMonth() && currentDate.getFullYear() === targetDate.getFullYear());
        const isNextMonthTarget = (currentDate.getMonth() + 1 === targetDate.getMonth() && currentDate.getFullYear() === targetDate.getFullYear()) || (currentDate.getMonth() === 11 && targetDate.getMonth() === 0 && currentDate.getFullYear() + 1 === targetDate.getFullYear());

        // 判断是否应该禁用滑动：
        // 1. 如果当前日历视图是“今天”所在的月份，且“今天”到“目标日期”的跨度小于等于 1 个月
        // 2. 避免用户滑到今天之前
        const totalMonthsToTarget = (targetDate.getFullYear() - today.getFullYear()) * 12 + targetDate.getMonth() - today.getMonth();

        if (totalMonthsToTarget <= 1) { // 如果总共只有1-2个月的范围
            prevMonthBtn.disabled = true;
            nextMonthBtn.disabled = true;
        } else {
            // 确保不能滑到当前月份之前 (即不能看到比today所在的月份更早的月份)
            const currentViewMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const todayMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

            prevMonthBtn.disabled = (currentViewMonthStart <= todayMonthStart);

            // 确保不能滑到包含目标日期之后的月份
            // 例子：目标是2月，那么3月就不能再滑了
            const nextMonthAfterTarget = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 1);
            nextMonthBtn.disabled = (currentViewMonthStart >= nextMonthAfterTarget);
        }
    }


    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar(); // 初始化日历

    // 绘制一个示例的背景图，你可以用图片替换
    function drawBackgroundDecorations() {
        const decorationsDiv = document.querySelector('.background-decorations');
        if (!decorationsDiv) return;

        for (let i = 0; i < 8; i++) { // 随机生成8个灯笼
            const lantern = document.createElement('div');
            lantern.classList.add('lantern');
            lantern.style.top = `${Math.random() * 90}%`;
            lantern.style.left = `${Math.random() * 90}%`;
            lantern.style.animationDelay = `${Math.random() * 5}s`;
            decorationsDiv.appendChild(lantern);
        }
    }
    drawBackgroundDecorations();
});