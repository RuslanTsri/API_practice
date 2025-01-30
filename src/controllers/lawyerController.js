import { authenticateUser } from "../middleware/authenticateUser.js"; // Шлях до файлу з middleware
import { checkRole } from "../middleware/roleMiddleware.js";
import {Lawyer} from "../models/lawyerModel.js"; // Шлях до файлу з middleware
const users = [];
const lawyers = [];

/**
 * @route GET /lawyers
 * @description Отримання всіх юристів
 * @access Public
 */
export const getLawyers = (req, res) => {
    console.log("Отримання списку всіх юристів"); // Логування запиту
    res.json(lawyers);
};

/**
 * @route POST /addLawyer
 * @description Додавання нового юриста
 * @access Admin або Lawyer якщо використовує свою пошту
 */
export const createLawyer = [
    authenticateUser, // Перевірка авторизації
    checkRole(["Admin", "Lawyer"]), // Перевірка ролі (Admin або Lawyer)
    (req, res) => {
        console.log("Запит на додавання юриста:", req.body); // Логування даних запиту

        const { first_name, last_name, middle_name, email, contact, experience } = req.body;

        // Якщо користувач - Lawyer, перевіряємо, чи email в запиті співпадає з email користувача з токена
        if (req.user.role === 'Lawyer') {
            // Знаходимо користувача по email з токена
            const user = users.find(user => user.email === req.user.email); // Це ваш email з токена
            if (!user) {
                console.log("Користувач не знайдений:", req.user.email);
                return res.status(400).json({ message: "Користувача не знайдено" });
            }

            // Перевірка, чи email в запиті збігається з email користувача
            if (user.email !== email) {
                console.log("Доступ заборонено: ви не можете додавати юристів з іншим email");
                return res.status(403).json({ message: "Ви можете додавати лише юристів з вашою електронною поштою" });
            }
        }

        if (!first_name || !last_name || !email || !contact || !experience) {
            console.log("Не всі обов'язкові поля вказані"); // Логування помилки
            return res.status(400).json({ error: "Усі поля, крім middle_name, обов'язкові" });
        }

        const newLawyer = new Lawyer(first_name, last_name, middle_name, email, contact, experience);
        lawyers.push(newLawyer);

        console.log("Створено нового юриста:", newLawyer); // Логування створеного юриста

        res.status(201).json(newLawyer);
    }
];

/**
 * @route GET /lawyer/:id
 * @description Отримання юриста за його унікальним ID
 * @access Lawyer (лише власний)
 */
export const getLawyerById = [
    authenticateUser, // Перевірка авторизації
    checkRole(['Admin', 'Lawyer']), // Перевірка ролі (Admin може всі, Lawyer лише власні)
    (req, res) => {
        console.log(`Запит на отримання юриста з ID: ${req.params.id}`); // Логування ID запиту

        // Перевірка, чи це власний юрист для Lawyer
        if (req.user.role === 'Lawyer' && req.user.email !== lawyers.find(l => l.id === Number(req.params.id))?.email) {
            console.log("Немає доступу до цього юриста для користувача:", req.user.email); // Логування заборони доступу
            return res.status(403).json({ message: "Немає доступу до цього юриста" });
        }

        const lawyer = lawyers.find(l => l.id === Number(req.params.id)); // Перетворюємо id на число

        if (!lawyer) {
            console.log("Юриста з таким ID не знайдено:", req.params.id); // Логування відсутності юриста
            return res.status(404).json({ error: "Юриста не знайдено" });
        }

        res.json(lawyer);
    }
];

/**
 * @route PATCH /updateLawyer/:id
 * @description Оновлення інформації про юриста
 * @access Admin
 */
export const updateLawyer = [
    authenticateUser, // Перевірка авторизації
    checkRole(['Admin']), // Перевірка ролі Admin
    (req, res) => {
        console.log(`Запит на оновлення юриста з ID: ${req.params.id}`); // Логування ID запиту

        const { id } = req.params;
        const lawyer = lawyers.find(l => l.id === Number(id)); // Перетворюємо id на число

        if (!lawyer) {
            console.log("Юриста з таким ID не знайдено:", id); // Логування відсутності юриста
            return res.status(404).json({ error: "Юриста не знайдено" });
        }

        Object.assign(lawyer, req.body);
        console.log("Юрист оновлений:", lawyer); // Логування оновленого юриста

        res.json(lawyer);
    }
];

/**
 * @route DELETE /deleteLawyer/:id
 * @description Видалення юриста за його ID
 * @access Admin
 */
export const deleteLawyer = [
    authenticateUser, // Перевірка авторизації
    checkRole(['Admin']), // Перевірка ролі Admin
    (req, res) => {
        console.log(`Запит на видалення юриста з ID: ${req.params.id}`); // Логування ID запиту

        const { id } = req.params;
        const lawyerIndex = lawyers.findIndex(l => l.id === Number(id)); // Знаходимо індекс юриста за ID

        if (lawyerIndex === -1) { // Якщо юриста не знайдено
            console.log("Юриста з таким ID не знайдено для видалення:", id); // Логування відсутності юриста
            return res.status(404).json({ error: "Юриста не знайдено" });
        }

        const deletedLawyer = lawyers.splice(lawyerIndex, 1); // Видаляємо юриста з масиву

        console.log("Юрист видалений:", deletedLawyer[0]); // Логування видаленого юриста

        res.json({ message: "Юрист видалений", deletedLawyer: deletedLawyer[0] });
    }
];
