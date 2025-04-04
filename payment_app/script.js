// Получаем параметры из URL
const urlParams = new URLSearchParams(window.location.search);
const tariff = urlParams.get("tariff");
const userId = urlParams.get("user_id") || window.Telegram.WebApp.initDataUnsafe.user?.id;
const price = urlParams.get("price");

// Элементы DOM
const planInfo = document.getElementById("plan-info");
const payBtn = document.getElementById("pay-btn");
const successMessage = document.getElementById("success-message");
const errorMessage = document.getElementById("error-message");

// Инициализация
function init() {
    if (!userId) {
        planInfo.textContent = "Ошибка: пользователь не авторизован";
        payBtn.style.display = "none";
        errorMessage.textContent = "Пользователь не определен";
        errorMessage.style.display = "block";
        return;
    }
    if (tariff === "month" && price) {
        planInfo.textContent = `Тариф: 1 месяц - ${price} рублей`;
    } else if (tariff === "year" && price) {
        planInfo.textContent = `Тариф: 1 год - ${price} рублей`;
    } else {
        planInfo.textContent = "Ошибка: тариф не выбран";
        payBtn.style.display = "none";
        errorMessage.textContent = "Тариф или цена не указаны";
        errorMessage.style.display = "block";
        return;
    }
    console.log("Initialized with:", { userId, tariff, price });
}

// Обработчик кнопки "Оплатить"
payBtn.addEventListener("click", async () => {
    console.log("Pay button clicked");
    errorMessage.style.display = "none"; // Скрываем ошибки перед запросом
    payBtn.disabled = true; // Отключаем кнопку во время запроса
    try {
        const response = await fetch("https://pypistypi.ru/payment_callback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: parseInt(userId), tariff: tariff })
        });
        if (!response.ok) {
            throw new Error(`Сервер ответил ошибкой: ${response.status}`);
        }
        const data = await response.json();
        console.log("Response:", data);
        if (data.status === "success") {
            successMessage.style.display = "block";
            payBtn.style.display = "none";
            setTimeout(() => window.Telegram.WebApp.close(), 1500); // Закрытие через 1.5 сек
        } else {
            throw new Error(data.message || "Неизвестная ошибка оплаты");
        }
    } catch (error) {
        console.error("Error:", error);
        errorMessage.textContent = `Ошибка: ${error.message}`;
        errorMessage.style.display = "block";
        payBtn.disabled = false; // Включаем кнопку обратно
    }
});

// Запуск инициализации
init();
window.Telegram.WebApp.ready();
