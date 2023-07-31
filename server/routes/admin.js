import express from "express";

import { changeFieldsName, deleteTours, deleteUser, deleteAllTours, deleteAllUsers } from "../controllers/admin.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.put("/change-fields-name", adminMiddleware, changeFieldsName);
router.delete("/", adminMiddleware, deleteTours);
router.delete("/delete-user", adminMiddleware, deleteUser);
router.delete("/delete-all-tours", adminMiddleware, deleteAllTours);
router.delete("/delete-all-users", adminMiddleware, deleteAllUsers);

export default router;
