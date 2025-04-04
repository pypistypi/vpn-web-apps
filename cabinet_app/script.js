const osContent = document.getElementById("os-content");
const buttons = document.querySelectorAll(".os-btn");
const daysText = document.getElementById("days-text");
const progressRing = document.querySelector(".progress");

const userId = window.Telegram.WebApp.initDataUnsafe.user?.id;

const osConfigs = { ... }; // Конфигурации для iOS, Android, Windows

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
        console.log("User data:", data); // Для отладки
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        return { config: "Ошибка загрузки данных", status: "free", daysLeft: 0, duration: 0 };
    }
}

function updateSubscriptionRing(status, daysLeft, duration) { ... } // Обновление кольца подписки

async function init() {
    const userData = await getUserData(userId);
    updateSubscriptionRing(userData.status, userData.daysLeft, userData.duration);

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const os = button.dataset.os;
            const config = osConfigs[os];
            osContent.innerHTML = `...`; // Кнопки и инструкции
        });
    });
}

window.Telegram.WebApp.ready();
init();