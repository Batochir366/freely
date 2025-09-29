"use strict";
const express = require("express");
const cors = require("cors");
const { configDotenv } = require("dotenv");
const connectMongoDB = require("./connectDb").default;
const usersRouter = require("./routes/user").default;
const companyRouter = require("./routes/company").default;
const reviewsRouter = require("./routes/review").default;
const bookingRouter = require("./routes/booking").default;
const categoryRouter = require("./routes/category").default;
const { qrRoutes } = require("./routes/qrRoutes");
const app = express();
const publicRouter = express.Router();
configDotenv();
const port = process.env.PORT || 8000;
connectMongoDB();
app.use(cors());
app.use(express.json());
app.use("/category", categoryRouter);
app.get("/pp", (req, res) => {
    res.send("hello world");
});
app.use(publicRouter);
app.use("/user", usersRouter);
app.use("/company", companyRouter);
app.use("/review", reviewsRouter);
app.use("/booking", bookingRouter);
app.use("/qr", qrRoutes);
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});
module.exports = app;
if (process.env.NODE_ENV !== "production") {
    app.listen(port, () => {
        console.log(`Server running at PORT: http://localhost:${port}`);
    });
}
