import express from "express"
import cors from "cors"
import testRoute from "./routes/testRoute.js"
import loginRoute from "./routes/loginRoute.js"
import userRoute from "./routes/userRoute.js"
import getRoute from "./routes/get.js"
import customerRoute from "./routes/customerRoute.js"



const app = express()

// Libera chamadas do frontend local ou da origem definida em FRONTEND_URL.
app.use(cors({
    origin: [process.env.FRONTEND_URL ?? "http://localhost:5173", "http://127.0.0.1:5173"]
}))
app.use(express.json())

app.get("/", (req, res) => {res.json({message: "API funcionando!"})}) //Teste pra ver se a api tá funcionando :v

app.use(testRoute)
app.use(loginRoute)
app.use(userRoute)
app.use(getRoute)
app.use(customerRoute)


app.listen(3001, () => {
    console.log("Servidor rodando em http://localhost:3001")
})