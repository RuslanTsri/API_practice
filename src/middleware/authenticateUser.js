import jwt from 'jsonwebtoken';

/**
 * Middleware для перевірки авторизації (наявність та валідність токена).
 *
 * @function authenticateUser
 * @param {Object} req - Об'єкт запиту.
 * @param {Object} res - Об'єкт відповіді.
 * @param {Function} next - Функція для передачі управління наступному middleware.
 * @returns {Response|void} У разі помилки повертає відповідь з кодом 401, інакше передає управління далі.
 */
export const authenticateUser = (req, res, next) => {
    // Отримання токена з заголовка Authorization
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        console.log("Токен не надано"); // Логування відсутності токена
        return res.status(401).json({ message: 'Необхідно авторизуватись' });
    }

    try {
        // Верифікація JWT токена з використанням секретного ключа
        const decoded = jwt.verify(token, 'secretkey');
        req.user = decoded; // Додаємо інформацію про користувача до об'єкта запиту

        console.log("Токен валідний. Декодовані дані користувача: ", decoded); // Логування успішної верифікації
        next(); // Продовжуємо виконання запиту
    } catch (error) {
        console.log("Невірний або прострочений токен", error); // Логування помилки верифікації
        return res.status(401).json({ message: 'Невірний або прострочений токен' });
    }
};
