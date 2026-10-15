import { Router } from "express";
import { createServiceStep, getServiceSteps } from "../controllers/serviceStepController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const serviceStepRoute = Router();
serviceStepRoute.post("/services/steps", authMiddleware, createServiceStep);
serviceStepRoute.get("/services/:serviceId/steps", authMiddleware, getServiceSteps);
export default serviceStepRoute;
