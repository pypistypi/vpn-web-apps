const osContent = document.getElementById("os-content");
const buttons = document.querySelectorAll(".os-btn");
const daysText = document.getElementById("days-text");
const progressRing = document.querySelector(".progress");

const userId = window.Telegram.WebApp.initDataUnsafe.user?.id;

console.log("User ID:", userId); // Отладка

const osConfigs = {
    ios: "Скачайте WireGuard из App Store и импортируйте конфигурацию.",
    android: "Скачайте WireGuard из Google Play и добавьте конфигурацию.",
    windows: "Скачайте WireGuard с официального сайта и импортируйте конфигурацию."
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
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        return { config: "Ошибка загрузки данных", status: "free", daysLeft: 0, duration: 0 };
    }
}

function updateSubscriptionRing(status, daysLeft, duration) {
    daysText.textContent = daysLeft === Infinity ? "∞" : daysLeft;
    const circumference = 2 * Math.PI * 50;
    const progress = status === "free" ? 0 : (daysLeft / duration) * circumference;
    progressRing.style.strokeDasharray = `${progress} ${circumference}`;
}

async function init() {
    const userData = await getUserData(userId);
    updateSubscriptionRing(userData.status, userData.daysLeft, userData.duration);

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            console.log("OS button clicked:", button.dataset.os); // Отладка
            const os = button.dataset.os;
            const config = osConfigs[os];
            osContent.innerHTML = `
                <p>${config}</p>
                <button class="download-btn">Скачать конфигурацию</button>
                <p class="instruction">Инструкция: Импортируйте файл в приложение WireGuard.</p>
            `;
        });
    });
}

window.Telegram.WebApp.ready();
init();
