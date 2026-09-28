import { Router } from "express"
import { createCustomer } from "../controllers/customerController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { actionAuthorizationMiddleware } from "../middleware/authorizationMiddleware.js"

const customerRoute = Router()

customerRoute.post(
    "/customers",
    authMiddleware,
    actionAuthorizationMiddleware("create_customer"),
    createCustomer
)

export default customerRoute