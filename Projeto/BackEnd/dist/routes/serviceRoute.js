import { Router } from "express";
import { getService, createService } from "../controllers/serviceController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { actionAuthorizationMiddleware } from "../middleware/authorizationMiddleware.js";
const serviceRoute = Router();
// Qualquer funcionário autenticado pode consultar o catálogo.
serviceRoute.get("/services", authMiddleware, getService);
// Apenas cargos autorizados podem cadastrar serviços.
serviceRoute.post("/services", authMiddleware, actionAuthorizationMiddleware("create_service"), createService);
export default serviceRoute;
