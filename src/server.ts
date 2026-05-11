import express, { Application } from "express"
import cors from "cors"
import { errorHandler } from "./middleware/errorHandler"
import { initialize } from "./_helpers/db"
import userController from "./users/users.controller"
import swaggerRouter from "./_helpers/swagger"
import accountsController from "./accounts/account.controller"
import cookieParser from "cookie-parser"

const app: Application = express()


const corsOptions = {
    origin: [
        'http://localhost:4200',
        'https://galan-lab7-intprog.onrender.com'], //<-- deployed frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions))
app.use(cookieParser()) // <-------- the change 

app.use("/accounts", accountsController)
app.use("/api-docs", swaggerRouter)
app.use("/users", userController)

app.use(errorHandler)

const PORT = process.env.PORT || 4000


initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`SERVER IS RUNNING ON http://localhost:${PORT}`)
        })
    }).catch((err) => {
        console.log(`Failed to initialize database::`, err)
        process.exit(1)
    })