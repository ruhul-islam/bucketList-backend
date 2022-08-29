import express from "express";
import { ObjectId } from "mongodb";
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

bucketListRouter.post("/", async (req, res) => {
  try {
    const client = await getClient();
    const newItem: BucketListItem = req.body;
    await client
      .db()
      .collection<BucketListItem>("bucketList")
      .insertOne(newItem);
    res.status(200);
    res.json(newItem);
  } catch (err) {
    errorResponse(err, res);
  }
});

bucketListRouter.delete("/user/:id", async (req, res) => {
  try {
    const id: string = req.params.id;
    const client = await getClient();
    const result = await client
      .db()
      .collection<BucketListItem>("bucketList")
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount) {
      res.sendStatus(204);
    } else {
      res.status(404).send("ID Not Found");
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

export default bucketListRouter;
