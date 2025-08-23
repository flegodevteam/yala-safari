import express from "express";
import { getAvailability } from "../Controllers/DateController.js";

const router = express.Router();

router.get("/availability", getAvailability);

export default router;