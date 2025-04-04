const urlParams = new URLSearchParams(window.location.search);
const tariff = urlParams.get("tariff");
const userId = urlParams.get("user_id") || window.Telegram.WebApp.initDataUnsafe.user?.id;
const price = urlParams.get("price");

const planInfo = document.getElementById("plan-info");
const payBtn = document.getElementById("pay-btn");
const successMessage = document.getElementById("success-message");

console.log("User ID:", userId, "Tariff:", tariff, "Price:", price);

if (!userId) {
    planInfo.textContent = "Ошибка: пользователь не авторизован";
    payBtn.style.display = "none";
} else if (tariff === "month" && price) {
    planInfo.textContent = `Тариф: 1 месяц - ${price} рублей`;
} else if (tariff === "year" && price) {
    planInfo.textContent = `Тариф: 1 год - ${price} рублей`;
} else {
    planInfo.textContent = "Ошибка: тариф не выбран";
    payBtn.style.display = "none";
}

payBtn.addEventListener("click", async () => {
    console.log("Pay button clicked");
    try {
        const response = await fetch("https://pypistypi.ru/payment_callback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: parseInt(userId), tariff: tariff })
        });
        const data = await response.json();
        console.log("Payment response:", data);
        if (data.status === "success") {
            payBtn.style.display = "none";
            successMessage.style.display = "block";
            setTimeout(() => window.Telegram.WebApp.close(), 1000); // Закрытие через 1 сек
        } else {
            console.error("Payment failed:", data);
            alert("Ошибка оплаты: " + (data.message || "неизвестная ошибка"));
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Ошибка подключения к серверу");
    }
});

window.Telegram.WebApp.ready();
