import jwt from 'jsonwebtoken';

/**
 * Middleware для перевірки ролі
 * @param {Array} allowedRoles - Масив дозволених ролей для доступу
 */
export const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        // Отримуємо токен з заголовка Authorization
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: "Токен не надано" });
        }

        try {
            // Декодуємо токен і витягуємо дані користувача
            const decoded = jwt.verify(token, 'secretkey'); // Перевірка токена за допомогою секретного ключа
            req.user = decoded; // Додаємо decoded дані в запит

            // Логування декодованих даних для відлагодження
            console.log("Декодовані дані токена: ", decoded);

            // Отримуємо роль користувача з токена
            const userRole = decoded.role;

            if (!userRole) {
                console.log("Роль користувача не визначена в токені");
                return res.status(400).json({ message: "Роль користувача не визначена в токені" });
            }

            // Логування ролі користувача для перевірки
            console.log("Роль користувача з токена: ", userRole);

            // Перевіряємо, чи роль користувача входить до списку дозволених
            if (!allowedRoles.includes(userRole)) {
                console.log(`Доступ заборонено для ролі: ${userRole}`);
                return res.status(403).json({ message: "Доступ заборонено" });
            }

            // Якщо роль дозволена, передаємо контроль далі
            next();
        } catch (error) {
            console.log("Помилка декодування токена:", error.message);
            return res.status(401).json({ message: "Невірний або прострочений токен" });
        }
    };
};
