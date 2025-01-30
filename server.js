import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./src/routes/authRoutes.js"; // Маршрути для авторизації
import lawyerRoutes from "./src/routes/lawyerRoutes.js"; // Маршрути для юристів
import { authenticateUser } from "./src/middleware/authenticateUser.js"; // Middleware для авторизації

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

/**
 * @route /auth
 * @description Маршрути для авторизації та аутентифікації користувачів
 */
app.use("/auth", authRoutes);

/**
 * @route /api
 * @description Основні API маршрути для роботи з юристами
 */
app.use("/api", lawyerRoutes);

/**
 * @route /lawyers
 * @description Маршрути для юристів з обов'язковою перевіркою авторизації
 * @middleware authenticateUser - перевірка токена користувача
 */
app.use("/lawyers", authenticateUser, lawyerRoutes);

app.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`);
});
