import express from "express";
import { registerUser, loginUser, activateAccount } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * @route POST /register
 * @description Реєстрація нового користувача
 * @access Public
 */
router.post("/register", registerUser);

/**
 * @route POST /login
 * @description Вхід користувача в систему
 * @access Public
 */
router.post("/login", loginUser);

/**
 * @route POST /activate
 * @description Активація облікового запису за допомогою коду активації
 * @access Public
 */
router.post("/activate", activateAccount);

/**
 * @route GET /lawyer/:id
 * @description Отримання даних про конкретного юриста
 * @access Lawyer (лише власні дані)
 */
router.get("/lawyer/:id", authMiddleware, checkRole("Lawyer"), (req, res) => {
    if (req.user.userId === req.params.id) {
        // Повернення даних користувача
        res.json({ message: "Дані юриста", data: req.user });
    } else {
        res.status(403).json({ message: "Доступ заборонено" });
    }
});

export default router;
