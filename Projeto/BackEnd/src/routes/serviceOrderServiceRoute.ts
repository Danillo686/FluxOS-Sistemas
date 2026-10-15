import { Router } from "express"
import {addServiceToOrder, getOrderServices, assignServiceToEmployee, updateOrderServiceStatus} from "../controllers/serviceOrderServiceController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { actionAuthorizationMiddleware } from "../middleware/authorizationMiddleware.js"

const serviceOrderServiceRoute = Router()


serviceOrderServiceRoute.get(
    "/service-orders/:orderId/services",
    authMiddleware,
    getOrderServices
)


serviceOrderServiceRoute.post(
    "/service-orders/services",
    authMiddleware,
    actionAuthorizationMiddleware("add_service_to_order"),
    addServiceToOrder
)

serviceOrderServiceRoute.patch(
    "/service-orders/services/assign",
    authMiddleware,
    actionAuthorizationMiddleware("assign_service"),
    assignServiceToEmployee
)

serviceOrderServiceRoute.patch(
    "/service-orders/services/:orderServiceId/status",
    authMiddleware,
    updateOrderServiceStatus
)


export default serviceOrderServiceRoute
