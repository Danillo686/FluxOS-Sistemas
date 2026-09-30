import { Router } from "express"
import { createVehicle } from "../controllers/vehicleController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { actionAuthorizationMiddleware } from "../middleware/authorizationMiddleware.js"

const vehicleRoute = Router()

vehicleRoute.post(
    "/vehicles",
    authMiddleware,
    actionAuthorizationMiddleware("create_vehicle"),
    createVehicle
)

export default vehicleRoute