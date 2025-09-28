require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 8081;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server", error);
    process.exit(1);
  }
}

startServer();
