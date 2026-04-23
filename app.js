import express from "express"
import authRouter from "./src/routes/auth.route.js"
import chatRouter from "./src/routes/chat.route.js"
import cors from "cors"

const app = express()

app.use(express.json())

app.use(cors({
    origin: "*",
    credentials: true,
}))
app.use("/api/auth" ,authRouter)
app.use("/api/chat",chatRouter)

app.use("/helth" , (req, res)=>{
    res.send("Hello world ! we are working good")
})

export default app;