import express from "express"
import { addCompanyCar, getAllCars, getCar } from "../controllers/companyCarController.js"

const router = express.Router()

router.post("/add_car",addCompanyCar)
router.get("/get_cars",getAllCars)
router.get("/search_car:carId",getCar)

export default router;