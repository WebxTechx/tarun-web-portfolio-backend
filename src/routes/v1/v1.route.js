import express from "express";
import { createUser, loginUser } from "../../controllers/v1/users.controller.js";
const router = express.Router();

// Define v1 routes : USER
router.post("/register", createUser);
router.post("/login", loginUser);


// Define v1 routes : heroSection
export default router;
