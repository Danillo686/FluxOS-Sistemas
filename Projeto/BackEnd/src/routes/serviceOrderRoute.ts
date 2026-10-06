import { Router } from "express"
import { createServiceOrder, getServiceOrders } from "../controllers/serviceOrderController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { actionAuthorizationMiddleware } from "../middleware/authorizationMiddleware.js"

const serviceOrderRoute = Router()

// GET protegido para listar as ordens já cadastradas no painel.
serviceOrderRoute.get(
    "/service-orders",
    authMiddleware,
    getServiceOrders
)

serviceOrderRoute.post(
    "/service-orders",
    authMiddleware,
    actionAuthorizationMiddleware("create_service_order"),
    createServiceOrder
)

export default serviceOrderRoute