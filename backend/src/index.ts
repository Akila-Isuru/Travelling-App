import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routers/authRouter";
import destinationRouter from "./routers/destinationRouter";
import bookingRouter from "./routers/bookingRouter";
import reviewRouter from "./routers/reviewRouter";
import paymentRouter from "./routers/paymentRouter";
import adminRouter from "./routers/adminRouter";
import passport from "passport";
import "./config/passport";

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL as string;

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/destinations", destinationRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/admin", adminRouter);

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Connected to MongoDB successfully! ");
  })
  .catch((error) => {
    console.error("MongoDB Connection Error :", error);
  });

app.listen(PORT, () => {
  console.log(`Server is running beautifully on port ${PORT} `);
});
