import { Router } from "express";
import { register } from "../controller/userController.js";
import { loginMiddleware } from "../middleware/loginMiddleware.js";
import { authorizationMiddleware } from "../middleware/authorizationMiddleware.js";
const rota = Router();
rota.post('/register', loginMiddleware, authorizationMiddleware, register);
export default rota;
