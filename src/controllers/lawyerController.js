import { authenticateUser } from "../middleware/authenticateUser.js"; // Middleware для перевірки авторизації
import { checkRole } from "../middleware/roleMiddleware.js"; // Middleware для перевірки ролей
import { Lawyer } from "../models/lawyerModel.js"; // Модель юриста

const users = []; // Тимчасове сховище користувачів
const lawyers = []; // Тимчасове сховище юристів

/**
 * @route GET /lawyers
 * @description Отримання всіх юристів
 * @access Public (Доступ відкритий)
 */
export const getLawyers = (req, res) => {
    console.log("Отримання списку всіх юристів"); // Логування запиту
    res.json(lawyers);
};

/**
 * @route POST /addLawyer
 * @description Додавання нового юриста
 * @access Admin або Lawyer (якщо використовує свою пошту)
 */
export const createLawyer = [
    authenticateUser, // Перевірка авторизації
    checkRole(["Admin", "Lawyer"]), // Перевірка ролі (Admin або Lawyer)
    (req, res) => {
        console.log("Запит на додавання юриста:", req.body); // Логування запиту

        const { first_name, last_name, middle_name, email, contact, experience } = req.body;

        if (req.user.role === 'Lawyer' && req.user.email !== email) {
            console.log("Доступ заборонено: ви не можете додавати юристів з іншим email");
            return res.status(403).json({ message: "Ви можете додавати лише юристів з вашою електронною поштою" });
        }

        if (!first_name || !last_name || !email || !contact || !experience) {
            console.log("Не всі обов'язкові поля вказані");
            return res.status(400).json({ error: "Усі поля, крім middle_name, обов'язкові" });
        }

        const newLawyer = new Lawyer(first_name, last_name, middle_name, email, contact, experience);
        lawyers.push(newLawyer);
        console.log("Створено нового юриста:", newLawyer);

        res.status(201).json(newLawyer);
    }
];

/**
 * @route GET /lawyer/:id
 * @description Отримання юриста за його ID
 * @access Lawyer (лише власний) або Admin (всі)
 */
export const getLawyerById = [
    authenticateUser,
    checkRole(['Admin', 'Lawyer']),
    (req, res) => {
        console.log(`Запит на отримання юриста з ID: ${req.params.id}`);

        if (req.user.role === 'Lawyer' && req.user.email !== lawyers.find(l => l.id === Number(req.params.id))?.email) {
            console.log("Немає доступу до цього юриста для користувача:", req.user.email);
            return res.status(403).json({ message: "Немає доступу до цього юриста" });
        }

        const lawyer = lawyers.find(l => l.id === Number(req.params.id));
        if (!lawyer) {
            console.log("Юриста не знайдено:", req.params.id);
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
    authenticateUser,
    checkRole(['Admin']),
    (req, res) => {
        console.log(`Запит на оновлення юриста з ID: ${req.params.id}`);

        const { id } = req.params;
        const lawyer = lawyers.find(l => l.id === Number(id));
        if (!lawyer) {
            console.log("Юриста не знайдено:", id);
            return res.status(404).json({ error: "Юриста не знайдено" });
        }

        Object.assign(lawyer, req.body);
        console.log("Юрист оновлений:", lawyer);
        res.json(lawyer);
    }
];

/**
 * @route DELETE /deleteLawyer/:id
 * @description Видалення юриста за його ID
 * @access Admin
 */
export const deleteLawyer = [
    authenticateUser,
    checkRole(['Admin']),
    (req, res) => {
        console.log(`Запит на видалення юриста з ID: ${req.params.id}`);

        const { id } = req.params;
        const lawyerIndex = lawyers.findIndex(l => l.id === Number(id));
        if (lawyerIndex === -1) {
            console.log("Юриста не знайдено для видалення:", id);
            return res.status(404).json({ error: "Юриста не знайдено" });
        }

        const deletedLawyer = lawyers.splice(lawyerIndex, 1);
        console.log("Юрист видалений:", deletedLawyer[0]);

        res.json({ message: "Юрист видалений", deletedLawyer: deletedLawyer[0] });
    }
];
