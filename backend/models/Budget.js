const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    month: {
      type: String,
      required: true,
    },

    icon: {
      type: String,
      default: "💰",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Budget", budgetSchema);

