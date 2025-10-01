import express, { json } from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import connectMongoDB from "./connectDb";
import usersRouter from "./routes/user";
import companyRouter from "./routes/company";
import reviewsRouter from "./routes/review";
import bookingRouter from "./routes/booking";
import categoryRouter from "./routes/category";
import { qrRoutes } from "./routes/qrRoutes";
import { initWebSocket } from "./websocket";
import http from "http";

const app = express();
const publicRouter = express.Router();

configDotenv();

const port = 8080;

connectMongoDB();

app.use(cors());
app.use(json());
app.use("/uploads", express.static("uploads"));

app.use("/category", categoryRouter);
app.get("/pp", (req, res) => {
  res.send("hello world");
});

app.use(publicRouter);
// app.use(clerkMiddleware());
app.use("/user", usersRouter);
app.use("/company", companyRouter);
app.use("/review", reviewsRouter);
app.use("/booking", bookingRouter);
app.use("/qr", qrRoutes);

const server = http.createServer(app);
initWebSocket(server);

server.listen(port, () => {
  console.log(`Server running at PORT: ${port}`);
});
