import { Router } from "express";
import { login } from "../controllers/loginController.js";
const loginRoute = Router();
loginRoute.post('/login', login);
export default loginRoute;
