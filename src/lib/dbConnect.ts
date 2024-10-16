import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export default async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to mongoDB");
    return;
  }

  try {
    console.log("new connection initiated");
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.error(error)
    console.log("connection failed");
    process.exit(1);
  }
}
