import { Router } from "express";
import { createUser } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizationMiddleware } from "../middleware/authorizationMiddleware.js";
const userRoute = Router();
userRoute.post("/users", authMiddleware, authorizationMiddleware, createUser);
export default userRoute;
//FLUXO:
/*
POST /users
      ↓
authMiddleware
      ↓
"Quem é você?"
      ↓
createUser
      ↓
"Você pode criar esse role?"
*/ 
