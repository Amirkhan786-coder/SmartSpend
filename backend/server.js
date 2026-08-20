const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// =========================
// LOAD ENVIRONMENT VARIABLES
// =========================

dotenv.config();

// =========================
// IMPORT ROUTES
// =========================

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

// =========================
// CREATE APP
// =========================

const app = express();

// =========================
// MIDDLEWARE
// =========================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://smart-spend-exfkt2vhp-md-amir-khan.vercel.app",
      "https://smart-spend-q555i9ewl-md-amir-khan.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

// =========================
// BASIC TEST ROUTE
// =========================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SmartSpend Backend is running 🚀",
  });
});

// =========================
// API ROUTES
// =========================

app.use("/api/auth", authRoutes);

app.use("/api/expenses", expenseRoutes);

app.use("/api/income", incomeRoutes);

app.use("/api/budgets", budgetRoutes);

app.use("/api/settings", settingsRoutes);

// =========================
// 404 HANDLER
// =========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// =========================
// ERROR HANDLER
// =========================

app.use((error, req, res, next) => {
  console.error("Server Error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: error.message,
  });
});

// =========================
// DATABASE + SERVER
// =========================

const PORT = process.env.PORT || 10000;

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully 🚀");

    app.listen(PORT, () => {
      console.log(
        `SmartSpend Backend running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  });