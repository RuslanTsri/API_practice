import { User, findUserByEmail } from "../models/userModel.js";
import fs from "fs";
import path from "path";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"; // Для генерації токенів (потрібен для логіну)

// Масив для тимчасового збереження активаційних кодів (для демонстрації)
const activationCodes = {};

/**
 * Генерує одноразовий 6-значний активаційний код
 * @returns {string} - Згенерований код
 */
function generateActivationCode() {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
}

/**
 * Зберігає активаційний код у HTML-файл
 * @param {string} userEmail - Email користувача
 * @param {string} activationCode - Активаційний код
 * @returns {Promise<string>} - Шлях до збереженого файлу
 */
async function saveActivationCodeToFile(userEmail, activationCode) {
    const htmlContent = `
<html lang="ua">
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; }
            .container { margin: 20px; padding: 20px; background-color: #f4f4f4; border-radius: 5px; }
            .code { font-size: 20px; font-weight: bold; color: #007bff; }
        </style>
        <title>Активаційний код</title>
    </head>
    <body>
        <div class="container">
            <h2>Активаційний код</h2>
            <p>Ваш активаційний код: <span class="code">${activationCode}</span></p>
        </div>
    </body>
</html>
`;

    const currentDir = path.resolve(); // Шлях до поточної директорії
    const filePath = path.join(currentDir, "src", "temp", "acode", `${userEmail}_activation.html`);

    await fs.promises.mkdir(path.dirname(filePath), { recursive: true }); // Створення директорії, якщо не існує
    await fs.promises.writeFile(filePath, htmlContent, "utf8"); // Запис у файл

    return filePath;
}

// Масив для збереження користувачів (тимчасово)
const users = [];

/**
 * Реєстрація нового користувача
 * @param {object} req - Запит
 * @param {object} res - Відповідь
 */
export const registerUser = async (req, res) => {
    const { email, password, role } = req.body;
    console.log("Реєстрація користувача: ", email);

    // Хешуємо пароль
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Хешований пароль: ", hashedPassword);

    // Генерація активаційного коду
    const activationCode = generateActivationCode();
    console.log("Генерація активаційного коду: ", activationCode);

    // Збереження HTML файлу
    const filePath = await saveActivationCodeToFile(email, activationCode);
    console.log("Шлях до активаційного файлу: ", filePath);

    // Додаємо користувача в масив
    const newUser = { email, password: hashedPassword, isActive: false, role, activationCode };
    users.push(newUser);

    res.status(201).json({
        message: "Користувач зареєстрований, перевірте свою пошту для активації.",
        activationFile: filePath,
    });
};

/**
 * Авторизація користувача
 * @param {object} req - Запит
 * @param {object} res - Відповідь
 */
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log("Логін користувача: ", email);

    // Пошук користувача
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(400).json({ message: "Невірний email або пароль" });
    }

    // Перевірка активації
    if (!user.isActive) {
        return res.status(400).json({ message: "Будь ласка, активуйте акаунт перед входом." });
    }

    // Перевірка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Невірний email або пароль" });
    }

    // Генерація JWT токену
    const token = jwt.sign({ userId: user.email, role: user.role }, "secretkey", { expiresIn: "1h" });
    res.json({ message: "Логін успішний", token });
};

/**
 * Активація акаунту користувача
 * @param {object} req - Запит
 * @param {object} res - Відповідь
 */
export const activateAccount = (req, res) => {
    const { email, activationCode } = req.body;

    // Пошук користувача
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(400).json({ message: "Користувача не знайдено" });
    }

    // Перевірка коду активації
    if (user.activationCode !== activationCode) {
        return res.status(400).json({ message: "Невірний активаційний код" });
    }

    // Активація акаунту
    user.isActive = true;
    user.activationCode = undefined;
    res.status(200).json({ message: "Акаунт успішно активовано" });
};
