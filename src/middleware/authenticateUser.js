import jwt from 'jsonwebtoken';

/**
 * Middleware для перевірки авторизації (належить чи є токен)
 */
export const authenticateUser = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        console.log("Токен не надано");
        return res.status(401).json({ message: 'Необхідно авторизуватись' });
    }

    try {
        const decoded = jwt.verify(token, 'secretkey'); // Використовуємо секретний ключ
        req.user = decoded; // Додаємо інформацію про користувача до об'єкта запиту
        console.log("Токен валідний. Декодовані дані користувача: ", decoded);
        next(); // Продовжуємо виконання запиту
    } catch (error) {
        console.log("Невірний або прострочений токен", error);
        return res.status(401).json({ message: 'Невірний або прострочений токен' });
    }
};

