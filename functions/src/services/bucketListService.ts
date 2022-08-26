import axios from "axios";
import BucketListIdea from "../models/BucketListIdea";

const baseURL: string = "https://api.api-ninjas.com/v1/bucketlist";

// export const fetchBucketList = async (): Promise<BucketListIdea> => {
//     return (await axios.get(baseURL), {
//         headers: {X-Api-Key: "HM9OmkV1/SV/PJWXneA8eg==58pPfU9PN8ty65RU"}
//     }).data;
// }

export const fetchBucketList = (): Promise<BucketListIdea> => {
  return axios
    .get(baseURL, {
      headers: { "X-Api-Key": "HM9OmkV1/SV/PJWXneA8eg==58pPfU9PN8ty65RU" },
    })
    .then((response) => {
      return response.data;
    });
};
