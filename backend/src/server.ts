import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { MONGO_URI, PORT } from "./config";
import authRouter from "./routes/auth.routes";
import collectionsRouter from "./routes/collection.routes";
import requestsRouter from "./routes/request.routes";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/collections", collectionsRouter);
app.use("/api/requests", requestsRouter);

app.get("/", (req, res) => res.json({ message: "API is running" }));

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
