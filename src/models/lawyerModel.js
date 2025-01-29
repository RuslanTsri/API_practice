import crypto from "crypto";

const generatedNumbers = new Set(); // Зберігаємо використані номери
let currentId = 1;
function generateUniqueUnitNumber() {
    let number;
    do {
        number = Math.floor(10000 + Math.random() * 90000); // Генеруємо 5-значне число
    } while (generatedNumbers.has(number)); // Перевіряємо, чи вже є таке число

    generatedNumbers.add(number);
    return `UNI - ${number}`;
}

export class Lawyer {
    constructor(first_name, last_name, middle_name, email, contact, experience) {
        this.id = currentId++;
        this.first_name = first_name;
        this.last_name = last_name;
        this.middle_name = middle_name || "";
        this.email = email;
        this.contact = contact;
        this.experience = experience;
        this.UNIT_number = generateUniqueUnitNumber(); // Присвоюємо унікальний номер
    }
}
