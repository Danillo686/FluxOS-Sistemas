// src/routes.ts
import { Router } from "express";
import { 
    getCustomers, getCustomerById, getCustomerByName,
    getUsers, getUserById, getUserByName,
    getVehicles, getVehicleById, getVehicleByPlate, getVehicleByModel
} from "../controllers/getSystem.js";

const router = Router();

// Rotas de Customers
router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomerById);
router.get("/customer/:name", getCustomerByName)

// Rotas de Users
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.get("/users/:name", getUserByName)

// Rotas de Veículos
router.get("/vehicles", getVehicles);
router.get("/vehicles/:id", getVehicleById);
router.get("/vehicles/plate/:plate", getVehicleByPlate);
router.get("/vehicles/model/:model", getVehicleByModel)
export default router;
