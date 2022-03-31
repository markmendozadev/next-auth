import { hashPassword } from "../../../lib/auth";
import { connectDb } from "../../../lib/db";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    res.json(405).json({ message: "Method Not Allowed." });
    return;
  }
  const { email, password } = req.body;
  if (!email || !email.includes("@") || !password || password < 7) {
    res.status(422).json({
      message:
        "You should input correct email or password should be more than 7 characters",
    });
    return;
  }
  const client = await connectDb();
  const db = client.db();
  let result;
  try {
    const isDuplicate = await db.collection("users").findOne({ email });
    if (isDuplicate) {
      res.status(422).json({ message: "User Exists already!!" });
      return;
    }
    const hashedPassword = await hashPassword(password);
    result = await db
      .collection("users")
      .insertOne({ email, password: hashedPassword });
  } catch (error) {
    res.status(400).json({ message: error || "Can't Connect" });
    return;
  } finally {
    client.close();
  }
  res.status(201).json({ message: "User Created..", result });
};

export default handler;
