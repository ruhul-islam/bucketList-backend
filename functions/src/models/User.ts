import { ObjectId } from "mongodb";
import BucketListItem from "./BucketListItem";

export default interface User {
  _id: ObjectId;
  uid: string;
  displayName: string;
  photoURL: string;
  following?: string[];
  bucketList?: BucketListItem[];
}
