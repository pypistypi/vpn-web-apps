const osContent = document.getElementById("os-content");
const buttons = document.querySelectorAll(".os-btn");
const daysText = document.getElementById("days-text");
const progressRing = document.querySelector(".progress");

const userId = window.Telegram.WebApp.initDataUnsafe.user?.id;

console.log("User ID:", userId);

const osConfigs = {
    ios: {
        app: "Streisand",
        storeLink: "https://apps.apple.com/us/app/streisand/id6450534064",
        instruction: `
            <p>1. Скачайте Streisand из App Store.</p>
            <p>2. Скопируйте конфигурацию через "Получить VPN".</p>
            <p>3. Вставьте конфиг в приложение.</p>
            <img src="assets/ios-screenshot1.png" class="screenshot" alt="Добавление конфига">
            <img src="assets/ios-screenshot2.png" class="screenshot" alt="Профиль VPN">
        `
    },
    android: {
        app: "NekoBox",
        storeLink: "https://play.google.com/store/apps/details?id=moe.nb4a&hl=ru",
        instruction: `
            <p>1. Скачайте NekoBox из Google Play.</p>
            <p>2. Скопируйте конфигурацию через "Получить VPN".</p>
            <p>3. Вставьте конфиг в приложение.</p>
            <img src="assets/android-screenshot1.png" class="screenshot" alt="Создание профиля">
            <img src="assets/android-screenshot2.png" class="screenshot" alt="Подключение">
        `
    },
    windows: {
        app: "Hiddify",
        downloadLink: "https://hiddify.com/",
        instruction: `
            <p>1. Скачайте Hiddify с официального сайта.</p>
            <p>2. Скопируйте конфигурацию через "Получить VPN".</p>
            <p>3. Вставьте конфиг в приложение.</p>
            <img src="assets/windows-screenshot1.png" class="screenshot" alt="Добавление сервера">
            <img src="assets/windows-screenshot2.png" class="screenshot" alt="Подключение">
        `
    }
};

async function getUserData(userId) {
    if (!userId) {
        console.error("No user ID provided");
        return { config: "Ошибка: пользователь не авторизован", status: "free", daysLeft: 0, duration: 0 };
    }
    try {
        const response = await fetch(`https://pypistypi.ru/get_config?user_id=${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("User data:", data);
        return {
            config: data.config || "Подписка неактивна",
            status: data.status || "free",
            daysLeft: data.days_left || 0,
            duration: data.duration || 0
        };
    } catch (error) {
        console.error("Fetch error:", error);
        return { config: "Ошибка подключения", status: "free", daysLeft: 0, duration: 0 };
    }
}

function updateSubscriptionRing(status, daysLeft, duration) {
    if (status === "free") {
        daysText.textContent = "∞";
        progressRing.style.strokeDasharray = "314 314";
    } else {
        daysText.textContent = daysLeft;
        const totalDays = duration === 30 ? 30 : 365;
        const percentage = (daysLeft / totalDays) * 100;
        const dashLength = (percentage / 100) * 314;
        progressRing.style.strokeDasharray = `${dashLength} 314`;
    }
}

async function init() {
    const userData = await getUserData(userId);
    updateSubscriptionRing(userData.status, userData.daysLeft, userData.duration);

    buttons.forEach(button => {
        button.addEventListener("click", async () => {
            console.log("OS button clicked:", button.dataset.os);
            const os = button.dataset.os;
            const config = osConfigs[os];
            osContent.innerHTML = `
                <button class="download-btn" onclick="window.open('${config.storeLink || config.downloadLink}', '_blank')">
                    Скачать ${config.app}
                </button>
                <button class="vpn-btn" onclick="navigator.clipboard.writeText('${userData.config}'); alert('Конфигурация скопирована!')">
                    Получить VPN
                </button>
                <div class="instruction">${config.instruction}</div>
            `;
        });
    });
}

window.Telegram.WebApp.ready();
init();
