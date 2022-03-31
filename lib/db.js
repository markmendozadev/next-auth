import { MongoClient } from "mongodb";

export const connectDb = async () => {
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.fuc7q.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  );
  return client;
};
