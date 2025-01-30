

const generatedNumbers = new Set(); // Зберігаємо використані номери
let currentId = 1;

/**
 * Генерує унікальний UNIT_number у форматі `UNI - XXXXX`,
 * де XXXXX — унікальне 5-значне число.
 * Переконується, що число не повторюється серед вже згенерованих.
 *
 * @returns {string} Унікальний UNIT_number
 */
function generateUniqueUnitNumber() {
    let number;
    do {
        number = Math.floor(10000 + Math.random() * 90000); // Генеруємо 5-значне число
    } while (generatedNumbers.has(number)); // Перевіряємо, чи вже є таке число

    generatedNumbers.add(number);
    return `UNI - ${number}`;
}

/**
 * Клас Lawyer (Адвокат)
 * Представляє об'єкт юриста з унікальним номером.
 */
export class Lawyer {
    /**
     * @param {string} first_name - Ім'я
     * @param {string} last_name - Прізвище
     * @param {string} [middle_name] - По батькові (необов'язкове)
     * @param {string} email - Електронна пошта
     * @param {string} contact - Контактний номер телефону
     * @param {string} experience - Досвід (наприклад, адвокат, прокурор)
     */
    constructor(first_name, last_name, middle_name, email, contact, experience) {
        this.id = currentId++; // Присвоюємо унікальний ID
        this.first_name = first_name;
        this.last_name = last_name;
        this.middle_name = middle_name || "";
        this.email = email;
        this.contact = contact;
        this.experience = experience;
        this.UNIT_number = generateUniqueUnitNumber(); // Генеруємо та присвоюємо унікальний номер
    }
}
