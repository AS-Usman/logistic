const navLinks = document.getElementById('navLinks');
const menuBtn = document.getElementById('menuBtn');
const themeToggle = document.getElementById('themeToggle');
const heroGreeting = document.getElementById('heroGreeting');
const contactForm = document.getElementById('contactForm');
const dashboardTabs = document.querySelectorAll('.dashboard-tab');
const dashboardTitle = document.getElementById('dashboardTitle');
const dashboardValue = document.getElementById('dashboardValue');
const dashboardChange = document.getElementById('dashboardChange');
const secondaryLabel = document.getElementById('secondaryLabel');
const dashboardSecondary = document.getElementById('dashboardSecondary');
const dashboardSecondaryChange = document.getElementById('dashboardSecondaryChange');
const tertiaryLabel = document.getElementById('tertiaryLabel');
const dashboardTertiary = document.getElementById('dashboardTertiary');
const dashboardTertiaryChange = document.getElementById('dashboardTertiaryChange');
const chartTitle = document.getElementById('chartTitle');
const chartBars = document.getElementById('chartBars');
const revealElements = document.querySelectorAll('.reveal');
const scrollTopBtn = document.createElement('button');

const dashboardData = {
    operations: {
        title: 'Total Deliveries',
        value: '1,200',
        change: '+8% vs last week',
        secondary: { label: 'On-time Score', value: '94%', change: '+4% quality gain' },
        tertiary: { label: 'Active Routes', value: '300', change: '+12 routes' },
        chartTitle: 'Weekly route throughput',
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [62, 70, 84, 76, 90, 105, 95],
    },
    risk: {
        title: 'Risk Exposure',
        value: '27%',
        change: '-12% high-risk routes',
        secondary: { label: 'Critical Alerts', value: '12', change: '-3 alerts' },
        tertiary: { label: 'Safe Corridors', value: '82%', change: '+6% improvement' },
        chartTitle: 'Risk signal frequency',
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [18, 16, 22, 11, 14, 9, 7],
    },
    fleet: {
        title: 'Fleet Readiness',
        value: '88%',
        change: '+5% availability',
        secondary: { label: 'Fuel Efficiency', value: '17.8 km/l', change: '+0.8 km/l' },
        tertiary: { label: 'Active Vehicles', value: '42', change: '+3 vehicles' },
        chartTitle: 'Fleet utilization trend',
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [75, 82, 88, 90, 86, 84, 80],
    },
    weather: {
        title: 'Weather Impact',
        value: '14%',
        change: 'Light delay risk',
        secondary: { label: 'Storm Alerts', value: '3', change: '-1 alert' },
        tertiary: { label: 'Clear Windows', value: '63%', change: '+10% smooth travel' },
        chartTitle: 'Weather-related route alerts',
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [8, 12, 9, 14, 7, 10, 6],
    },
};

const renderDashboard = (key) => {
    const data = dashboardData[key];
    if (!data) return;

    dashboardTitle.textContent = data.title;
    dashboardValue.textContent = data.value;
    dashboardChange.textContent = data.change;
    secondaryLabel.textContent = data.secondary.label;
    dashboardSecondary.textContent = data.secondary.value;
    dashboardSecondaryChange.textContent = data.secondary.change;
    tertiaryLabel.textContent = data.tertiary.label;
    dashboardTertiary.textContent = data.tertiary.value;
    dashboardTertiaryChange.textContent = data.tertiary.change;
    chartTitle.textContent = data.chartTitle;

    chartBars.innerHTML = data.values
        .map((value, index) => `
            <div class="chart-bar">
                <div class="bar-fill" style="height:${value}%;"></div>
                <span class="bar-value">${value}</span>
                <span class="bar-label">${data.labels[index]}</span>
            </div>
        `)
        .join('');
};

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuBtn.querySelector('i').classList.toggle('fa-times');
});

const setTheme = (theme) => {
    document.body.dataset.theme = theme;
    localStorage.setItem('preferredTheme', theme);
    themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
};

const preferredTheme = localStorage.getItem('preferredTheme') || 'light';
setTheme(preferredTheme);

themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
});

const greetings = ['Hello, Usman', 'Welcome Back, Usman', 'Track smarter routes', 'Predict with confidence'];
let greetingIndex = 0;
setInterval(() => {
    greetingIndex = (greetingIndex + 1) % greetings.length;
    heroGreeting.textContent = greetings[greetingIndex];
}, 4500);

if (dashboardTabs.length) {
    dashboardTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            dashboardTabs.forEach((btn) => btn.classList.remove('active'));
            tab.classList.add('active');
            renderDashboard(tab.dataset.key);
        });
    });

    renderDashboard('operations');
}

const toast = (message, type = 'success') => {
    const toastBox = document.createElement('div');
    toastBox.className = `toast ${type}`;
    toastBox.textContent = message;
    document.body.appendChild(toastBox);
    setTimeout(() => toastBox.classList.add('visible'), 100);
    setTimeout(() => toastBox.classList.remove('visible'), 3400);
    setTimeout(() => toastBox.remove(), 4000);
};

contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    toast('Message sent successfully!', 'success');
    contactForm.reset();
});

const animateNumbers = () => {
    revealElements.forEach((el) => {
        const num = el.querySelector('h3');
        if (!num || num.dataset.animated) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            const target = Number(num.dataset.target || 0);
            const suffix = num.dataset.suffix || '';
            let current = 0;
            const step = Math.max(1, Math.floor(target / 50));
            const interval = setInterval(() => {
                current += step;
                if (current >= target) {
                    num.textContent = `${target}${suffix}`;
                    clearInterval(interval);
                } else {
                    num.textContent = `${current}${suffix}`;
                }
            }, 20);
            num.dataset.animated = 'true';
        }
    });
};

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
    animateNumbers();
});

scrollTopBtn.className = 'scroll-top';
scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.body.appendChild(scrollTopBtn);

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.2 });

revealElements.forEach((el) => observer.observe(el));

window.addEventListener('load', animateNumbers);
