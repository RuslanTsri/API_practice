import bcrypt from "bcryptjs";

const users = []; // Тимчасова база даних для користувачів


export class User {
    constructor(email, password, role) {
        this.email = email;
        this.password = password;
        this.role = role; // Admin or Lawyer
        this.isActive = false; // Спочатку не активований
        this.activationCode = ''; // Код активації
    }

    static async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    static async comparePassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}

// Функція для знаходження користувача за email
// Приклад функції findUserByEmail, яка шукає користувача в масиві або базі даних
export const findUserByEmail = (email) => {
    // Якщо користувач зберігається у масиві (тимчасово)
    return users.find(user => user.email === email);  // або зверніться до вашої бази даних
};
