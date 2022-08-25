import express from "express";
import { getClient } from "../db";
import BucketListItem from "../models/BucketListItem";

const bucketListRouter = express.Router();

const errorResponse = (error: any, res: any) => {
  console.error("FAIL", error);
  res.status(500).json({ message: "Internal Server Error" });
};

bucketListRouter.get("/", async (req, res) => {
  try {
    const client = await getClient();
    const results = await client
      .db()
      .collection<BucketListItem>("bucketList")
      .find()
      .toArray();
    res.json(results);
  } catch (err) {
    errorResponse(err, res);
  }
});

export default bucketListRouter;
