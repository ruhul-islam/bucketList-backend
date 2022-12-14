import express from "express";
// import { bucket } from "firebase-functions/v1/storage";
import { getClient } from "../db";
import BucketListItem from "../models/BucketListItem";
import User from "../models/User";

const userRouter = express.Router();

const errorResponse = (error: any, res: any) => {
  console.error("FAIL", error);
  res.status(500).json({ message: "Internal Server Error" });
};

userRouter.get("/allUsers", async (req, res) => {
  try {
    const client = await getClient();
    const results = await client
      .db()
      .collection<User[]>("users")
      .find({})
      .toArray();
    console.log(results);
    res.status(200);
    res.json(results);
  } catch (err) {
    errorResponse(err, res);
  }
});

userRouter.get("/:uid", async (req, res) => {
  try {
    const uid: string = req.params.uid;
    const client = await getClient();
    const results = await client
      .db()
      .collection<User>("users")
      .findOne({ uid });
    console.log(results);
    res.status(200);
    res.json(results);
  } catch (err) {
    errorResponse(err, res);
  }
});

///////
userRouter.get("/friends/:uid", async (req, res) => {
  try {
    const uid: string = req.params.uid;
    const client = await getClient();
    const result = await client.db().collection<User>("users").findOne({ uid });
    let results: User[] = [];
    for (let index = 0; index < result?.following?.length!; index++) {
      const element: string | undefined = result?.following![index];
      const singleFriend: User | null = await client
        .db()
        .collection<User>("users")
        .findOne({ uid: element });
      results.push(singleFriend!);
    }
    console.log(results);
    res.status(200);
    res.json(results);
  } catch (err) {
    errorResponse(err, res);
  }
});
///////

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

userRouter.put("/:uid/bucket-list/add", async (req, res) => {
  console.log("here");
  try {
    const uid: string = req.params.uid;
    const client = await getClient();
    req.body["completed"] = false;
    const newBucketListItem: BucketListItem = req.body;
    const results = await client
      .db()
      .collection<User>("users")
      .updateOne(
        { uid },
        {
          $push: {
            bucketList: {
              $each: [newBucketListItem],
              $position: 0,
            },
          },
        }
      );
    console.log(results, newBucketListItem);
    if (results.matchedCount) {
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

userRouter.put("/:uid/bucket-list/remove", async (req, res) => {
  //console.log("idea", req.body);
  try {
    const uid: string = req.params.uid;
    // const index: number = parseInt(req.params.index);
    const idea: string = req.body.idea;
    console.log("my idea", idea);
    const client = await getClient();
    const results = await client
      .db()
      .collection<User>("users")
      .updateOne(
        { uid },
        {
          $pull: { bucketList: { idea: idea } },
        }
      );
    if (results.modifiedCount) {
      res.status(200).json({
        success: true,
        message: "deleted",
      });
    } else {
      res.status(404);
      res.send("User Not Found");
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

userRouter.put("/:uid/bucket-list/complete", async (req, res) => {
  //console.log("idea", req.body);
  try {
    const uid: string = req.params.uid;
    // const index: number = parseInt(req.params.index);
    const idea: string = req.body.idea;
    console.log("my idea", idea);
    const client = await getClient();

    const results1 = await client
      .db()
      .collection<User>("users")
      .findOne({ uid });
    //console.log(results);

    const filtered = results1?.bucketList?.filter((item) => {
      if (item.idea === idea) {
        item.completed = true;
      }
      return item;
    });

    const results = await client
      .db()
      .collection<User>("users")
      .updateOne(
        { uid },
        {
          $set: { bucketList: filtered },
        }
      );
    if (results.modifiedCount) {
      res.status(200).json({
        success: true,
        message: "deleted",
      });
    } else {
      res.status(404);
      res.send("User Not Found");
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

userRouter.put("/:uid/bucket-list/incomplete", async (req, res) => {
  //console.log("idea", req.body);
  try {
    const uid: string = req.params.uid;
    // const index: number = parseInt(req.params.index);
    const idea: string = req.body.idea;
    console.log("my idea", idea);
    const client = await getClient();

    const results1 = await client
      .db()
      .collection<User>("users")
      .findOne({ uid });
    //console.log(results);

    const filtered = results1?.bucketList?.filter((item) => {
      if (item.idea === idea) {
        item.completed = false;
      }
      return item;
    });

    const results = await client
      .db()
      .collection<User>("users")
      .updateOne(
        { uid },
        {
          $set: { bucketList: filtered },
        }
      );
    if (results.modifiedCount) {
      res.status(200).json({
        success: true,
        message: "not completed",
      });
    } else {
      res.status(404);
      res.send("User Not Found");
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

userRouter.put("/:uid/bucket-list/private", async (req, res) => {
  //console.log("idea", req.body);
  try {
    const uid: string = req.params.uid;
    // const index: number = parseInt(req.params.index);
    const idea: string = req.body.idea;
    console.log("my idea", idea);
    const client = await getClient();

    const results1 = await client
      .db()
      .collection<User>("users")
      .findOne({ uid });
    //console.log(results);

    const filtered = results1?.bucketList?.filter((item) => {
      if (item.idea === idea) {
        item.isPrivate = true;
      }
      return item;
    });

    const results = await client
      .db()
      .collection<User>("users")
      .updateOne(
        { uid },
        {
          $set: { bucketList: filtered },
        }
      );
    if (results.modifiedCount) {
      res.status(200).json({
        success: true,
        message: "made private",
      });
    } else {
      res.status(404);
      res.send("User Not Found");
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

userRouter.put("/:uid/bucket-list/public", async (req, res) => {
  //console.log("idea", req.body);
  try {
    const uid: string = req.params.uid;
    // const index: number = parseInt(req.params.index);
    const idea: string = req.body.idea;
    console.log("my idea", idea);
    const client = await getClient();

    const results1 = await client
      .db()
      .collection<User>("users")
      .findOne({ uid });
    //console.log(results);

    const filtered = results1?.bucketList?.filter((item) => {
      if (item.idea === idea) {
        item.isPrivate = false;
      }
      return item;
    });

    const results = await client
      .db()
      .collection<User>("users")
      .updateOne(
        { uid },
        {
          $set: { bucketList: filtered },
        }
      );
    if (results.modifiedCount) {
      res.status(200).json({
        success: true,
        message: "made public",
      });
    } else {
      res.status(404);
      res.send("User Not Found");
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

userRouter.put("/:uid/following", async (req, res) => {
  try {
    const uid: string = req.params.uid;
    const client = await getClient();
    const newFriend: string = req.body.uid;
    const results = await client
      .db()
      .collection<User>("users")
      .updateOne(
        { uid },
        {
          $push: {
            following: {
              $each: [newFriend],
              $position: 0,
            },
          },
        }
      );
    if (results.modifiedCount) {
      res.status(200);
      res.json(newFriend);
    } else {
      res.status(404);
      res.send("User Not Found");
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

userRouter.put("/:myUid/following/:friendUid", async (req, res) => {
  try {
    const myUid: string = req.params.myUid;
    const friendUid: string = req.params.friendUid;
    const client = await getClient();
    const results = await client
      .db()
      .collection<User>("users")
      .updateOne(
        { uid: myUid },
        {
          $pull: { following: friendUid },
        }
      );
    if (results.modifiedCount) {
      res.sendStatus(200);
    } else {
      res.status(404);
      res.send("User Not Found!");
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

userRouter.get("/search/:term", async (req, res) => {
  try {
    const term: string = req.params.term;
    console.log(term);
    const client = await getClient();
    const results = await client
      .db()
      .collection<User[]>("users")
      .find({ displayName: new RegExp(`${term}`, "i") })
      .toArray();

    res.status(200);
    res.json(results);
  } catch (err) {
    errorResponse(err, res);
  }
});

userRouter.get("/:uid/friends/:friendUid", async (req, res) => {
  try {
    const uid: string = req.params.uid;
    const friendUid: string = req.params.friendUid;
    console.log("chris", uid, friendUid);
    const client = await getClient();
    const result = await client
      .db()
      .collection<User[]>("users")
      .findOne({ uid: friendUid });
    res.status(200);
    res.json(result);
  } catch (err) {
    errorResponse(err, res);
  }
});

export default userRouter;
