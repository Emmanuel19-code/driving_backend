import express from 'express'
import cors from 'cors'
import StudentRouter from "./routes/student.js"
import ServiceRouter from "./routes/service.js"

const app = express();

const corsOptions = {
    origin:"*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials:true
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/students', StudentRouter);
app.use("/api/v1/services",ServiceRouter);

export default app;