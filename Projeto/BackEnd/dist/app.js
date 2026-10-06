import express from "express";
import cors from 'cors';
import testRoute from "./routes/testRoute.js";
import loginRoute from "./routes/loginRoute.js";
import userRoute from "./routes/userRoute.js";
import customerRoute from "./routes/customerRoute.js";
import vehicleRoute from "./routes/vehicleRoute.js";
import router from "./routes/getSystem.js";
import serviceOrderRoute from "./routes/serviceOrderRoute.js";
const app = express();
// CORS restrito às origens locais do frontend ou à origem definida em FRONTEND_URL.
const frontendOrigins = new Set((process.env.FRONTEND_URL || "http://localhost:5173,http://localhost:5174")
    .split(',')
    .map(origin => origin.trim()));
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || frontendOrigins.has(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error('Origem não permitida pelo CORS'));
    }
}));
app.use(express.json());
app.get("/", (req, res) => { res.json({ message: "API funcionando!" }); }); //Teste pra ver se a api tá funcionando :v
app.use(testRoute);
app.use(loginRoute);
app.use(userRoute);
app.use(router);
app.use(customerRoute);
app.use(vehicleRoute);
app.use(serviceOrderRoute);
app.listen(3001, () => {
    console.log("Servidor rodando em http://localhost:3001");
});
