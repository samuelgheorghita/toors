import express from "express";

import { changeFieldsName } from "../controllers/admin.js";

const router = express.Router();

router.put("/change-fields-name", changeFieldsName);

export default router;
