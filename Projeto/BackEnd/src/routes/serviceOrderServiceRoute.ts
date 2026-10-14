import { Router } from "express"
import {addServiceToOrder, getOrderServices, assingServiceToEmployee} from "../controllers/serviceOrderServiceController.js"
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
    assingServiceToEmployee
)


export default serviceOrderServiceRoute
