import express from "express";
import { getLawyers, createLawyer, getLawyerById, updateLawyer, deleteLawyer } from "../controllers/lawyerController.js";

const router = express.Router();

/**
 * @route GET /lawyers
 * @description Отримання всіх юристів
 * @access Public
 */
router.get("/lawyers", getLawyers);

/**
 * @route GET /lawyer/:id
 * @description Отримання юриста за його унікальним ID
 * @param {string} id - Ідентифікатор юриста
 * @access Public
 */
router.get("/lawyer/:id", getLawyerById);

/**
 * @route POST /addLawyer
 * @description Додавання нового юриста
 * @access Public
 */
router.post("/addLawyer", createLawyer);

/**
 * @route PATCH /updateLawyer/:id
 * @description Оновлення інформації про юриста
 * @param {string} id - Ідентифікатор юриста
 * @access Public
 */
router.patch("/updateLawyer/:id", updateLawyer);

/**
 * @route DELETE /deleteLawyer/:id
 * @description Видалення юриста за його ID
 * @param {string} id - Ідентифікатор юриста
 * @access Public
 */
router.delete("/deleteLawyer/:id", deleteLawyer);

export default router;
