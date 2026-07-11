import 'dotenv/config';

import express from "express";

import moongoose from "mongoose";
import cors from "cors";

import authRoutes from "./src/routes/authRoutes.js";
import complaintRoutes from "./src/routes/complaintRoutes.js";
import feedbackRoutes from "./src/routes/feedbackRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/v1/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("Customer Care Registry API is running");
});

moongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
        console.log(`Server running on port  http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});