import { Router } from "express";
import { registerCustomer } from "../controller/customerController.js";
const rota = Router();
rota.post("/customer", registerCustomer);
export default rota;
