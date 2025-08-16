import "dotenv/config.js";
import { DBConnection } from './config/db.js';
import {app} from './app.js';


const PORT = parseInt(process.env.PORT || "4000", 10);

try {
  DBConnection();
} catch (error) {
  console.error("Database connection failed:", error);
  process.exit(1);
}


app.listen(PORT, "0.0.0.0", () => {
  console.log('server is RUNNING ON', PORT);
})
