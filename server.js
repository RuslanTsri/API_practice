import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import lawyerRoutes from "./src/routes/lawyerRoutes.js";  // Підключення маршрутів

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Головний маршрут
app.get("/", (req, res) => {
    res.send("API працює!");
});

// Підключення маршрутів (вже з роутами для різних CRUD операцій)
app.use("/", lawyerRoutes);  // Тепер всі маршрути з lawyerRoutes.js будуть працювати

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущено на порті ${PORT}`);
});
