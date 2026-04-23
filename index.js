import app from "./app.js";
import dotenv from "dotenv" ;
import { connectDB } from "./src/lib/db.js";

dotenv.config();

await connectDB();

const PORT = 5055;

app.listen(PORT ,'0.0.0.0', ()=>{
    console.log(`App is listening on ${PORT}`)
})

