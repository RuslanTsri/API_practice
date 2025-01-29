import express from "express";
import { getLawyers, createLawyer, getLawyerById, updateLawyer, deleteLawyer } from "../controllers/lawyerController.js";

const router = express.Router();

// Отримання всіх юристів
router.get("/lawyers", getLawyers);

// Додавання нового юриста
router.post("/addLawyer", createLawyer);

// Отримання юриста по id
router.get("/lawyer/:id", getLawyerById);


// Оновлення інформації про юриста
router.patch("/updateLawyer/:id", updateLawyer);

// Видалення юриста
router.delete("/deleteLawyer/:id", deleteLawyer);

export default router;
