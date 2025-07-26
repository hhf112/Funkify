import jwt from 'jsonwebtoken';
import express from 'express';

import { DBConnection } from './db.js';
import auth from './routes/auth.js';
import cookieParser from 'cookie-parser';
import cors from "cors"

try {
  DBConnection();
  console.log("connecting db ...")
} catch (error) {
  console.error("Database connection failed:", error);
  process.exit(1);
}

const app = express();
app.use(cors({
  origin: process.env.FRONTEND,
  // methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/', auth);
app.get('/', (req, res) => {
  res.status(200).json({
    status: true,
    message: "working"
  })
})

app.listen(5000, () => console.log("Server is running on port 5000"));

