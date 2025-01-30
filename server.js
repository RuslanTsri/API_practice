import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import lawyerRoutes from "./src/routes/lawyerRoutes.js";  // Підключення маршрутів

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Дозволяє обмін даними між різними доменами (CORS)
app.use(bodyParser.json()); // Дозволяє працювати з JSON-форматом у запитах

/**
 * Головний маршрут
 * @route GET /
 * @description Проста відповідь для перевірки роботи API
 */
app.get("/", (req, res) => {
    res.send("API працює!");
});

/**
 * Підключення маршрутів
 * @description Використовує маршрути, визначені у файлі lawyerRoutes.js
 */
app.use("/", lawyerRoutes);  // Тепер всі маршрути з lawyerRoutes.js будуть працювати

/**
 * Запуск сервера
 * @description Сервер запускається на вказаному порту і прослуховує вхідні запити
 */
app.listen(PORT, () => {
    console.log(`Сервер запущено на порті ${PORT}`);
});
