import express from "express";
import testRoute from "./routes/testRoute.js";
import loginRoute from "./routes/loginRoute.js";
import userRoute from "./routes/userRoute.js";
// import getRoute from "./routes/get.js"
import customerRoute from "./routes/customerRoute.js";
import vehicleRoute from "./routes/vehicleRoute.js";
// import {getCustomer}from "./controllers/getCustomer.js"
import router from "./routes/getSystem.js";
const app = express();
app.use(express.json());
app.get("/", (req, res) => { res.json({ message: "API funcionando!" }); }); //Teste pra ver se a api tá funcionando :v
app.use(testRoute);
app.use(loginRoute);
app.use(userRoute);
// app.use(getRoute)
app.use(router);
app.use(customerRoute);
app.use(vehicleRoute);
app.listen(3001, () => {
    console.log("Servidor rodando em http://localhost:3001");
});
