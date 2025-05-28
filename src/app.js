import express from 'express'
import cors from 'cors'
import StudentRouter from "./routes/student.js"

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/students', StudentRouter);


export default app;