import { Router } from "express";
import { postCustomer, getIdCustomer, getCustomer, delCustomer, putCustomer } from "../controller/customer.controller.js";
const rota = Router();
rota.post('/Customer', postCustomer);
rota.get('/Customer', getCustomer);
rota.delete('/Customer/:id', delCustomer);
rota.get('/Customer/:id', getIdCustomer);
rota.put('/Customer/:id', putCustomer);
export default rota;
