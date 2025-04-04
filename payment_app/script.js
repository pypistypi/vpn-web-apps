const urlParams = new URLSearchParams(window.location.search);
const tariff = urlParams.get("tariff");
const userId = urlParams.get("user_id") || window.Telegram.WebApp.initDataUnsafe.user?.id;

const planInfo = document.getElementById("plan-info");
const payBtn = document.getElementById("pay-btn");
const successMessage = document.getElementById("success-message");

console.log("User ID:", userId, "Tariff:", tariff); // Отладка

if (tariff === "month") {
    planInfo.textContent = "Тариф: 1 месяц - 300 рублей";
} else if (tariff === "year") {
    planInfo.textContent = "Тариф: 1 год - 3000 рублей";
} else {
    planInfo.textContent = "Ошибка: тариф не выбран";
    payBtn.style.display = "none";
}

payBtn.addEventListener("click", async () => {
    console.log("Pay button clicked"); // Отладка
    try {
        const response = await fetch("https://pypistypi.ru/payment_callback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, tariff: tariff })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Payment response:", data);
        if (data.status === "success") {
            payBtn.style.display = "none";
            successMessage.style.display = "block";
        }
    } catch (error) {
        console.error("Payment error:", error);
    }
});

window.Telegram.WebApp.ready();
