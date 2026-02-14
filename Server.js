import express from "express";
import cors from "cors";
import TodoRoutes from "./routes/TodoRoutes.js"
import { connectDB } from "./config/db.js";
import dotenv from 'dotenv'

const app = express();

//load env file
dotenv.config()

//middleware
app.use(express.json());
app.use(cors());

//connect Database
connectDB();

app.use('/api/todos', TodoRoutes )

//start server 
const port = process.env.port || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
}) 