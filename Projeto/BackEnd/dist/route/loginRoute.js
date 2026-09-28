import { Router } from "express";
import { login } from "../controller/loginController.js";
const rota = Router();
rota.post("/login", login);
export default rota;
