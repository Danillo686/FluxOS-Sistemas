import { Router } from "express";
import { createServiceOrder, getServiceOrders } from "../controllers/serviceOrderController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { actionAuthorizationMiddleware } from "../middleware/authorizationMiddleware.js";
const serviceOrderRoute = Router();
// Lista as ordens de serviço.
serviceOrderRoute.get("/service-orders", authMiddleware, getServiceOrders);
// Cria uma ordem de serviço.
serviceOrderRoute.post("/service-orders", authMiddleware, actionAuthorizationMiddleware("create_service_order"), createServiceOrder);
export default serviceOrderRoute;
