import express from "express";
import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL as string;

app.use(cors());
app.use(express.json());

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("connect to mongoDB");
  })
  .catch((error) => {
    console.error("Error :", error);
  });

app.listen(PORT, () => {
  console.log("Server is running ", PORT);
});
