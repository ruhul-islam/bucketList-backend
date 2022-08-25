import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import bucketListRouter from "./routes/bucketListRouter";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/bucketList", bucketListRouter);
export const api = functions.https.onRequest(app);
