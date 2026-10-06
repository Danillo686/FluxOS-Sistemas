// src/routes.ts
import { Router } from "express";
import { authMiddleware, tokenAuthMiddleware } from "../middleware/authMiddleware.js";
import { 
    getCustomers, getCustomerById, getCustomerByName,
    getUsers, getUserById, getUserByName,
    getVehicles, getMyVehicles, getVehicleById, getVehicleByPlate, getVehicleByModel
} from "../controllers/getSystem.js";

const router = Router();

// Rotas de Customers
// Consultas internas de clientes exigem autenticação de funcionário.
router.get("/customers", authMiddleware, getCustomers);
router.get("/customers/:id", authMiddleware, getCustomerById);
router.get("/customer/:name", authMiddleware, getCustomerByName)

// Rotas de Users
// Consultas da equipe exigem autenticação de funcionário.
router.get("/users", authMiddleware, getUsers);
router.get("/users/:id", authMiddleware, getUserById);
router.get("/users/:name", authMiddleware, getUserByName)

// Rotas de Veículos
// Cliente consulta os próprios veículos; consultas gerais exigem autenticação de funcionário.
router.get("/my/vehicles", tokenAuthMiddleware, getMyVehicles);
router.get("/vehicles", authMiddleware, getVehicles);
router.get("/vehicles/:id", authMiddleware, getVehicleById);
router.get("/vehicles/plate/:plate", authMiddleware, getVehicleByPlate);
router.get("/vehicles/model/:model", authMiddleware, getVehicleByModel)
export default router;
