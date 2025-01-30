import { User, findUserByEmail } from "../models/userModel.js";
import fs from "fs";
import path from "path";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"; // Для генерації токенів (потрібен для логіну)

// Масив для тимчасового збереження активаційних кодів (для демонстрації)
const activationCodes = {};

// Генерація одноразового коду активації
function generateActivationCode() {
    return Math.random().toString(36).substr(2, 6).toUpperCase(); // Генерація 6-значного коду
}

// Функція для збереження активаційного коду в HTML-файлі
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

    // Створюємо директорію, якщо вона не існує
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

    // Записуємо HTML в файл
    await fs.promises.writeFile(filePath, htmlContent, "utf8");

    return filePath;
}

/**
 * Реєстрація користувача
 * @param req
 * @param res
 */
const users = [];

// Реєстрація користувача
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

    // Додаємо користувача в масив (тимчасово)
    const newUser = {
        email,
        password: hashedPassword, // Зберігаємо хешований пароль
        isActive: false, // Статус неактивний
        role: role,
        activationCode, // Збереження коду активації
    };
    users.push(newUser); // Зберігаємо користувача

    // Відповідь з посиланням на збережений файл
    res.status(201).json({
        message: "Користувач зареєстрований, перевірте свою пошту для активації.",
        activationFile: filePath, // Відправляємо шлях до файлу
    });
};

// Логін користувача
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log("Логін користувача: ", email);

    // Знаходимо користувача по email
    const user = users.find(user => user.email === email);
    if (!user) {
        console.log("Користувач не знайдений:", email);
        return res.status(400).json({ message: "Невірний email або пароль" });
    }

    // Перевірка, чи акаунт активовано
    if (!user.isActive) {
        console.log("Акаунт не активовано для користувача:", email);
        return res.status(400).json({ message: "Будь ласка, активуйте акаунт перед входом." });
    }

    // Перевірка пароля
    console.log("Введений пароль: ", password);
    console.log("Хешований пароль користувача: ", user.password);
    //Перевірка ролі
    console.log("Ваша роль:", user.role);

    const isMatch = await bcrypt.compare(password, user.password); // Порівнюємо введений пароль з хешованим
    if (!isMatch) {
        console.log("Пароль невірний для користувача:", email);
        return res.status(400).json({ message: "Невірний email або пароль" });
    }

    // Генерація JWT токену з роллю
    const token = jwt.sign(
        { userId: user.email, role: user.role },  // Тепер додаємо роль в токен
        "secretkey",
        { expiresIn: "1h" }  // Термін дії токену
    );

    console.log("JWT токен: ", token);

    res.json({ message: "Логін успішний", token });
};


// Функція для активації акаунту
export const activateAccount = (req, res) => {
    const { email, activationCode } = req.body;

    // Знаходимо користувача по email
    const user = users.find(user => user.email === email);
    if (!user) {
        console.log("Користувач не знайдений для активації:", email);
        return res.status(400).json({ message: "Користувача не знайдено" });
    }

    // Перевіряємо правильність коду
    if (user.activationCode !== activationCode) {
        console.log("Невірний активаційний код для користувача:", email);
        return res.status(400).json({ message: "Невірний активаційний код" });
    }

    // Активуємо акаунт
    user.isActive = true;
    user.activationCode = undefined; // Видаляємо активаційний код після активації

    console.log("Акаунт активовано для користувача:", email);

    res.status(200).json({ message: "Акаунт успішно активовано" });
};
