import {} from "dotenv/config";
import app from "./app.js";
import sequelize from "./config/db.js";

const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({alter:true});
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {}
};

startServer();
