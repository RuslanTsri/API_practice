import { Lawyer } from "../models/lawyerModel.js";

let lawyers = []; // Тимчасова база даних

/**
 * @route GET /lawyers
 * @description Отримання всіх юристів
 * @access Public
 */
export const getLawyers = (req, res) => {
    res.json(lawyers);
};

/**
 * @route POST /addLawyer
 * @description Додавання нового юриста
 * @access Public
 * @param req
 * @param res
 */
export const createLawyer = (req, res) => {
    const { first_name, last_name, middle_name, email, contact, experience } = req.body;

    if (!first_name || !last_name || !email || !contact || !experience) {
        return res.status(400).json({ error: "Усі поля, крім middle_name, обов'язкові" });
    }

    const newLawyer = new Lawyer(first_name, last_name, middle_name, email, contact, experience);
    lawyers.push(newLawyer);

    console.log("Створено нового юриста:", newLawyer); // Логування створеного юриста

    res.status(201).json(newLawyer);
};

/**
 * @route GET /lawyer/:id
 * @description Отримання юриста за його унікальним ID
 * @access Public
 * @param req
 * @param res
 */
export const getLawyerById = (req, res) => {
    const { id } = req.params;
    console.log("Знайдений ID:", id); // Логування ID запиту

    const lawyer = lawyers.find(l => l.id === Number(id)); // Перетворюємо id на число

    if (!lawyer) {
        return res.status(404).json({ error: "Юриста не знайдено" });
    }

    res.json(lawyer);
};

/**
 * @route PATCH /updateLawyer/:id
 * @description Оновлення інформації про юриста
 * @access Public
 * @param req
 * @param res
 */
export const updateLawyer = (req, res) => {
    const { id } = req.params;
    console.log("Знайдений ID:", id); // Логування ID запиту
    const lawyer = lawyers.find(l => l.id === Number(id)); // Перетворюємо id на число

    if (!lawyer) {
        return res.status(404).json({ error: "Юриста не знайдено" });
    }

    Object.assign(lawyer, req.body);
    res.json(lawyer);
};

/**
 * @route DELETE /deleteLawyer/:id
 * @description Видалення юриста за його ID
 * @access Public
 * @param req
 * @param res
 */
export const deleteLawyer = (req, res) => {
    const { id } = req.params;
    console.log("Знайдений ID:", id); // Логування ID запиту

    const lawyerIndex = lawyers.findIndex(l => l.id === Number(id)); // Знаходимо індекс юриста за ID

    if (lawyerIndex === -1) { // Якщо юриста не знайдено
        return res.status(404).json({ error: "Юриста не знайдено" });
    }

    const deletedLawyer = lawyers.splice(lawyerIndex, 1); // Видаляємо юриста з масиву

    console.log("Юрист видалений:", deletedLawyer[0]); // Логування видаленого юриста

    res.json({ message: "Юрист видалений", deletedLawyer: deletedLawyer[0] });
};
