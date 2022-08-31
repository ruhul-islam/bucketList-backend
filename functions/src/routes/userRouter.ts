import express from "express";
import { getClient } from "../db";
import BucketListItem from "../models/BucketListItem";
import User from "../models/User";

const userRouter = express.Router();

const errorResponse = (error: any, res: any) => {
  console.error("FAIL", error);
  res.status(500).json({ message: "Internal Server Error" });
};

userRouter.get("/:uid", async (req, res) => {
  try {
    const uid: string = req.params.uid;
    const client = await getClient();
    const cursor = client.db().collection<User>("users").find({ uid });
    const results = await cursor.toArray();
    res.status(200);
    res.json(results);
  } catch (err) {
    errorResponse(err, res);
  }
});

userRouter.post("/", async (req, res) => {
  try {
    const client = await getClient();
    const newUser: User = req.body;
    await client.db().collection<User>("users").insertOne(newUser);
    res.status(201);
    res.json(newUser);
  } catch (err) {
    errorResponse(err, res);
  }
});

userRouter.put("/:uid/bucket-list", async (req, res) => {
  try {
    const uid: string = req.params.uid;
    const client = await getClient();
    const newBucketListItem: BucketListItem = req.body;
    const results = await client
      .db()
      .collection<User>("users")
      .updateOne({ uid }, { $push: { bucketList: newBucketListItem } });
    if (results.modifiedCount) {
      res.status(200);
      res.json(newBucketListItem);
    } else {
      res.status(404);
      res.send("User Not Found");
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

export default userRouter;
