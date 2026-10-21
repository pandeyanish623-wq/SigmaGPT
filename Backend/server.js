import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import chatRoutes from "./routes/chat.js";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
