import { Router } from "express"
import { createServiceOrder } from "../controllers/serviceOrderController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { actionAuthorizationMiddleware } from "../middleware/authorizationMiddleware.js"

const serviceOrderRoute = Router()

serviceOrderRoute.post(
    "/service-orders",
    authMiddleware,
    actionAuthorizationMiddleware("create_service_order"),
    createServiceOrder
)

export default serviceOrderRoute