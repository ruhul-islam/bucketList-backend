import { ObjectId } from "mongodb";
import BucketListIdea from "./BucketListIdea";
import Consequences from "./Consequences";

export default interface BucketListItem {
  _id?: ObjectId;
  idea: string | BucketListIdea;
  date: string;
  category: string;
  consequence: string | Consequences;
}
