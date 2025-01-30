import express from "express";
import {registerUser, loginUser, activateAccount} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Реєстрація та логін
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post('/activate', activateAccount);
// Доступ до даних для користувачів
router.get("/lawyer/:id", authMiddleware, checkRole("Lawyer"), (req, res) => {
    if (req.user.userId === req.params.id) {
        // Повернення даних користувача
        res.json({ message: "Дані юриста", data: req.user });
    } else {
        res.status(403).json({ message: "Доступ заборонено" });
    }
});

export default router;
