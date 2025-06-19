import express from "express"
import { createCompany, fetchAllCompanies } from "../controllers/mainSystemAdminController.js";

const router = express.Router();

router.post("/add_company",createCompany)
router.get("/all_registered_companies",fetchAllCompanies)


export default router;