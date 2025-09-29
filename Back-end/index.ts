import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import connectMongoDB from "./connectDb";
import usersRouter from "./routes/user";
import companyRouter from "./routes/company";
import reviewsRouter from "./routes/review";
import bookingRouter from "./routes/booking";
import categoryRouter from "./routes/category";
import { qrRoutes } from "./routes/qrRoutes";

const app = express();

configDotenv();

const port = process.env.PORT || 8000;

// Initialize MongoDB connection
connectMongoDB();

app.use(cors());
app.use(express.json());

app.use("/category", categoryRouter);
app.get("/", (req: any, res: any) => {
  res.send("hello world");
});

app.use("/user", usersRouter);
app.use("/company", companyRouter);
app.use("/review", reviewsRouter);
app.use("/booking", bookingRouter);
app.use("/qr", qrRoutes);

// Health check endpoint for serverless
app.get("/health", (req: any, res: any) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// For local development, start the server
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server running at PORT: http://localhost:${port}`);
  });
}
