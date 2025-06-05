import express from 'express'
import cors from 'cors'
import StudentRouter from "./routes/student.js"
import ServiceRouter from "./routes/service.js"
import PaymentRouter from "./routes/payments.js"


const app = express();

const corsOptions = {
    origin:"http://localhost:5000/docs",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials:true
}

//app.use(cors(corsOptions));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/students', StudentRouter);
app.use("/api/v1/services",ServiceRouter);
app.use("/api/v1/payment",PaymentRouter)

export default app;