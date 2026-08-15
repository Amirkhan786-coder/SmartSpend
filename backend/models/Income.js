const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    // =========================
    // USER ID
    // =========================
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =========================
    // INCOME TITLE
    // =========================
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // =========================
    // AMOUNT
    // =========================
    amount: {
      type: Number,
      required: true,
    },

    // =========================
    // SOURCE
    // =========================
    source: {
      type: String,
      required: true,
      trim: true,
    },

    // =========================
    // DATE
    // =========================
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Income", incomeSchema);