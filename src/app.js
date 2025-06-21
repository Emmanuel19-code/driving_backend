import express from 'express'
import cors from 'cors'
import StudentRouter from "./routes/student.js"
import ServiceRouter from "./routes/service.js"
import PaymentRouter from "./routes/payments.js"
import CompanyCarRouter from "./routes/companyCar.js"
import BookandHandleSchedules from "./routes/bookSchedule.js"
import StaffRouter from "./routes/staff.js"
import TenantRouter from "./routes/systemAdmin.js"
import AllAuthRouter from "./routes/authSystem.js"
import {  globalRateLimiter } from './middlewares/rateLimiter.js'
import helmet from "helmet"
import cookieParser from "cookie-parser";


const app = express();

//const corsOptions = {
//    origin:"http://localhost:5000/docs",
//    methods: ["GET", "POST", "PUT", "DELETE"],
//    allowedHeaders: ["Content-Type", "Authorization"],
//    credentials:true
//}

const corsOptions = {
  origin: "http://localhost:3000", // 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // 
};

app.use(cors(corsOptions));
app.use(cookieParser())

//app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(globalRateLimiter)
//app.use(failedAttemptLimiter)
app.use(helmet())

app.disable("x-powered-by")

app.use('/api/v1/students', StudentRouter);
app.use("/api/v1/services",ServiceRouter);
app.use("/api/v1/payment",PaymentRouter)
app.use("/api/v1/companycar",CompanyCarRouter)
app.use("/api/v1/bookingAndslots",BookandHandleSchedules)
app.use("/api/v1/staff",StaffRouter)
app.use("/api/v1/tenants",TenantRouter)
app.use("/api/v1/system_security",AllAuthRouter)


export default app;