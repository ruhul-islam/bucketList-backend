import { ObjectId } from "mongodb";
import BucketListIdea from "./BucketListIdea";
import Consequence from "./Consequence";

export default interface BucketListItem {
  _id?: ObjectId;
  idea: string | BucketListIdea;
  date: string;
  category: string;
  consequence: string | Consequence;
}
