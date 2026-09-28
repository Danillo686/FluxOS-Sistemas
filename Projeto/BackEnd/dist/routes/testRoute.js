import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
const testRoute = Router();
testRoute.get("/test-auth", authMiddleware, (req, res) => {
    res.json({
        message: "Você passou pela autorização!",
        user: req.employee
    });
});
export default testRoute;
