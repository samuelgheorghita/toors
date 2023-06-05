import express from "express";

import { changeFieldsName, deleteTours, deleteUser } from "../controllers/admin.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.put("/change-fields-name", adminMiddleware, changeFieldsName);
router.delete("/", adminMiddleware, deleteTours);
router.delete("/delete-user", adminMiddleware, deleteUser);

export default router;
