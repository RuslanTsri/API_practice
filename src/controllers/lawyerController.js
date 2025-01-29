import { Lawyer } from "../models/lawyerModel.js";

let lawyers = []; // Тимчасова база даних

export const getLawyers = (req, res) => {
    res.json(lawyers);
};

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


export const getLawyerById = (req, res) => {
    const { id } = req.params;
    console.log("Знайдений ID:", id); // Логування ID запиту

    const lawyer = lawyers.find(l => l.id === Number(id)); // Перетворюємо id на число

    if (!lawyer) {
        return res.status(404).json({ error: "Юриста не знайдено" });
    }

    res.json(lawyer);
};




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

export const deleteLawyer = (req, res) => {
    const { id } = req.params;
    console.log("Знайдений ID:", id); // Логування ID запиту

    const lawyer = lawyers.find(l => l.id === Number(id)); // Знаходимо індекс юриста за ID

    if (lawyer === -1) { // Якщо юриста не знайдено
        return res.status(404).json({ error: "Юриста не знайдено" });
    }

    const deletedLawyer = lawyers.splice(lawyer, 1); // Видаляємо юриста з масиву

    console.log("Юрист видалений:", deletedLawyer[0]); // Логування видаленого юриста

    res.json({ message: "Юрист видалений", deletedLawyer: deletedLawyer[0] });
};

