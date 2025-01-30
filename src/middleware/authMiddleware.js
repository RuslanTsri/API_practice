import jwt from "jsonwebtoken";

/**
 * Middleware для перевірки авторизації користувача через JWT токен.
 *
 * @function authMiddleware
 * @param {Object} req - Об'єкт запиту.
 * @param {Object} res - Об'єкт відповіді.
 * @param {Function} next - Функція для передачі управління наступному middleware.
 * @returns {Response|void} У разі помилки повертає відповідь з кодом 401, інакше передає управління далі.
 */
export const authMiddleware = (req, res, next) => {
    // Отримуємо токен з заголовка Authorization та видаляємо префікс "Bearer "
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // Якщо токен не надано, повертаємо помилку авторизації
    if (!token) {
        return res.status(401).json({ message: "Не авторизовано" });
    }

    try {
        // Верифікація JWT токена з використанням секретного ключа
        const decoded = jwt.verify(token, "secretkey");
        req.user = decoded; // Додаємо інформацію про користувача до об'єкта запиту
        next(); // Продовжуємо виконання запиту
    } catch (err) {
        // Помилка верифікації токена
        res.status(401).json({ message: "Не авторизовано" });
    }
};
