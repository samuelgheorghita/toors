import express from "express";

import { changeFieldsName, deleteTours } from "../controllers/admin.js";

const router = express.Router();

router.put("/change-fields-name", changeFieldsName);
router.delete("/", deleteTours);

export default router;
