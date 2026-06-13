// ========================================
// Tamawatchu - Clock Mascot System
// ========================================

const Clock = (() => {
    let currentDeadlines = [];
    let nearestDeadline = null;

    function renderClock(container) {
        container.innerHTML = '';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('class', 'clock-face');

        // Clock face background
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '50');
        circle.setAttribute('cy', '50');
        circle.setAttribute('r', '45');
        circle.setAttribute('fill', 'white');
        circle.setAttribute('stroke', '#4A4A4A');
        circle.setAttribute('stroke-width', '2');
        svg.appendChild(circle);

        // Hour markers
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30) * Math.PI / 180;
            const x1 = 50 + 40 * Math.cos(angle - Math.PI / 2);
            const y1 = 50 + 40 * Math.sin(angle - Math.PI / 2);
            const x2 = 50 + 35 * Math.cos(angle - Math.PI / 2);
            const y2 = 50 + 35 * Math.sin(angle - Math.PI / 2);

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.setAttribute('stroke', '#4A4A4A');
            line.setAttribute('stroke-width', '2');
            svg.appendChild(line);
        }

        // Hour hand
        const hourHand = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        hourHand.setAttribute('x1', '50');
        hourHand.setAttribute('y1', '50');
        hourHand.setAttribute('x2', '50');
        hourHand.setAttribute('y2', '25');
        hourHand.setAttribute('stroke', '#4A4A4A');
        hourHand.setAttribute('stroke-width', '4');
        hourHand.setAttribute('stroke-linecap', 'round');
        hourHand.setAttribute('class', 'clock-hour-hand');
        svg.appendChild(hourHand);

        // Minute hand
        const minuteHand = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        minuteHand.setAttribute('x1', '50');
        minuteHand.setAttribute('y1', '50');
        minuteHand.setAttribute('x2', '50');
        minuteHand.setAttribute('y2', '15');
        minuteHand.setAttribute('stroke', '#4A4A4A');
        minuteHand.setAttribute('stroke-width', '2');
        minuteHand.setAttribute('stroke-linecap', 'round');
        minuteHand.setAttribute('class', 'clock-minute-hand');
        svg.appendChild(minuteHand);

        // Center dot
        const center = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        center.setAttribute('cx', '50');
        center.setAttribute('cy', '50');
        center.setAttribute('r', '4');
        center.setAttribute('fill', '#4A4A4A');
        svg.appendChild(center);

        container.appendChild(svg);
        updateClockHands();
    }

    function updateClockHands() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        const hourDeg = (hours % 12) * 30 + minutes * 0.5;
        const minuteDeg = minutes * 6 + seconds * 0.1;

        const hourHand = document.querySelector('.clock-hour-hand');
        const minuteHand = document.querySelector('.clock-minute-hand');

        if (hourHand) {
            hourHand.style.transform = `rotate(${hourDeg}deg)`;
            hourHand.style.transformOrigin = '50px 50px';
        }
        if (minuteHand) {
            minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
            minuteHand.style.transformOrigin = '50px 50px';
        }
    }

    function updateDeadlines(tasks) {
        const now = new Date();
        currentDeadlines = tasks
            .filter(t => !t.completed && t.deadline)
            .map(t => ({
                id: t.id,
                deadline: new Date(t.deadline),
                title: t.title
            }))
            .sort((a, b) => a.deadline - b.deadline);

        if (currentDeadlines.length > 0) {
            nearestDeadline = currentDeadlines[0];
        } else {
            nearestDeadline = null;
        }

        updateUrgencyState();
    }

    function updateUrgencyState() {
        const clockContainer = document.getElementById('clockContainer');
        const urgencyMessage = document.getElementById('urgencyMessage');

        if (!clockContainer || !urgencyMessage) return;

        if (!nearestDeadline) {
            clockContainer.classList.remove('urgent');
            urgencyMessage.innerHTML = 'No deadlines';
            return;
        }

        const now = new Date();
        const timeUntil = nearestDeadline.deadline - now;
        const hoursUntil = timeUntil / (1000 * 60 * 60);

        if (hoursUntil < 2) {
            clockContainer.classList.add('urgent');
            const minutesUntil = Math.floor((timeUntil / (1000 * 60)) % 60);
            urgencyMessage.innerHTML = `⏰ ${Math.floor(hoursUntil)}h ${minutesUntil}m left!`;
        } else {
            clockContainer.classList.remove('urgent');
            const daysUntil = Math.floor(hoursUntil / 24);
            if (daysUntil > 0) {
                urgencyMessage.innerHTML = `${daysUntil}d left`;
            } else {
                urgencyMessage.innerHTML = `${Math.floor(hoursUntil)}h left`;
            }
        }
    }

    function getNearestDeadline() {
        return nearestDeadline;
    }

    function getTimeUntilDeadline() {
        if (!nearestDeadline) return null;
        return nearestDeadline.deadline - new Date();
    }

    // Update clock every second
    setInterval(() => {
        updateClockHands();
        updateUrgencyState();
    }, 1000);

    return {
        renderClock,
        updateDeadlines,
        getNearestDeadline,
        getTimeUntilDeadline,
        updateUrgencyState
    };
})();
