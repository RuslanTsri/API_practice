import bcrypt from "bcryptjs";

const users = []; // Тимчасова база даних для користувачів

/**
 * Клас для представлення користувача.
 */
export class User {
    /**
     * Створює нового користувача.
     *
     * @constructor
     * @param {string} email - Email користувача.
     * @param {string} password - Пароль користувача.
     * @param {string} role - Роль користувача (Admin або Lawyer).
     */
    constructor(email, password, role) {
        this.email = email;
        this.password = password;
        this.role = role; // Admin або Lawyer
        this.isActive = false; // Спочатку користувач не активований
        this.activationCode = ''; // Код активації
    }

    /**
     * Хешує пароль користувача.
     *
     * @param {string} password - Пароль користувача.
     * @returns {Promise<string>} - Хешований пароль.
     */
    static async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    /**
     * Порівнює введений пароль із хешованим паролем.
     *
     * @param {string} plainPassword - Введений пароль.
     * @param {string} hashedPassword - Хешований пароль у базі даних.
     * @returns {Promise<boolean>} - Результат порівняння.
     */
    static async comparePassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}

/**
 * Шукає користувача за email.
 *
 * @param {string} email - Email користувача.
 * @returns {User|undefined} - Об'єкт користувача або undefined, якщо користувача не знайдено.
 */
export const findUserByEmail = (email) => {
    return users.find(user => user.email === email); // Пошук у тимчасовій базі даних
};
