import { Router } from "express";
import { getCustomer } from "../controllers/getCustomer.js";
const customerRouter = Router();
customerRouter.get('/getC', getCustomer);
export default customerRouter;
