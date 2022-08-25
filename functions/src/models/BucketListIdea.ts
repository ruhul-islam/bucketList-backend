import { ObjectId } from "mongodb";

export default interface BucketListIdea {
  _id?: ObjectId;
  item: string;
}
