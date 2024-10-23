import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};
const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    return;
    console.log("Database already connected !");
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URL || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connection Failed ERRROR: ", error);

    process.exit(1);
  }
}
export default dbConnect;
