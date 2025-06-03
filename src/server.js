import {} from "dotenv/config";
import app from "./app.js";
import initializeDatabase from "./config/db.js";
import { registerModels } from "./models/index.js";
import { swaggerDocs } from "./config/swagger.js";

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    const sequelize = await initializeDatabase()
    await sequelize.authenticate();
    await sequelize.sync();
    registerModels(sequelize)
    
    app.listen(PORT, () => {
      swaggerDocs(app,PORT)
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error); 
  }
};

startServer();
