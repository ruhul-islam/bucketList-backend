import { ObjectId } from "mongodb";

export default interface Consequences {
  _id?: ObjectId;
  consequences: string[];
}
