import { app } from "./app.js";
import { DBConnection } from './config/db.js';

import "dotenv/config.js";

const PORT = process.env.PORT || 3000;

try {
  DBConnection();
} catch (error) {
  console.error("Database connection failed:", error);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`funkify backend live. port:${PORT}.`, "date:", new Date().toLocaleString(), '.');
})
