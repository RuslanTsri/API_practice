import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./src/routes/authRoutes.js"; // Маршрути для авторизації
import lawyerRoutes from "./src/routes/lawyerRoutes.js"; // Маршрути для юристів
import { authenticateUser } from "./src/middleware/authenticateUser.js"; // middleware для авторизації

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Підключаємо маршрути для авторизації
app.use("/auth", authRoutes);
app.use("/api", lawyerRoutes);

// Підключаємо маршрути для юристів, з middleware для перевірки авторизації
app.use("/lawyers", authenticateUser, lawyerRoutes); // Перевірка авторизації для всіх маршрутів юристів

app.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`);
});
