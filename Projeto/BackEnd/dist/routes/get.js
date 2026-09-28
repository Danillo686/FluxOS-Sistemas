import { Router } from "express";
import { get } from "../controllers/get.js";
const getRoute = Router();
getRoute.get('/get', get);
export default getRoute;
