import {} from "dotenv/config";
import app from "./app.js";
import initializeDatabase from "./config/db.js";
import { registerModels } from "./models/index.js";
import { swaggerDocs } from "./config/swagger.js";
import logger from "./config/logger.js";
import checkCarDocNotification from "./cronJobs/checkcarDocNotification.js";

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    const sequelize = await initializeDatabase();
    await sequelize.authenticate();
    registerModels(sequelize);
    await sequelize.sync();
    await checkCarDocNotification();
    app.listen(PORT, () => {
      swaggerDocs(app, PORT);
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(error);
    console.error("❌ Failed to start server:", error);
  }
};

startServer();
