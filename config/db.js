const mongoose = require("mongoose");
const URI = process.env.DB_URL;

if (!URI) {
  throw new Error("Missing Database URI");
}

async function connectDb() {
  try {
    await mongoose.connect(URI, {});
    console.log("✅ Connected to MongoDB");
    // Connection event handlers
    mongoose.connection.on("connected", () => {
      console.log("🔌 Mongoose connected to DB");
    });
    mongoose.connection.on("error", (error) => {
      console.error("mongoose connection error", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("mongoose disconnected");
    });
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("mongose connection termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("Error connectiong to mongodb", error.message);
    process.exit(1);
  }
}

module.exports = connectDb;
