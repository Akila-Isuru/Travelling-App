import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routers/authRouter";

dotenv.config();

const app = express();

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL as string;

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRouter);

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
