const express = require("express");
const Income = require("../models/Income");

const router = express.Router();

// =========================
// GET USER INCOME
// =========================
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const incomes = await Income.find({ userId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      incomes,
    });
  } catch (error) {
    console.error("Get Income Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch income",
    });
  }
});

// =========================
// ADD INCOME
// =========================
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      title,
      amount,
      source,
      date,
    } = req.body;

    if (
      !userId ||
      !title ||
      !amount ||
      !source ||
      !date
    ) {
      return res.status(400).json({
        success: false,
        message: "All income fields are required",
      });
    }

    const income = await Income.create({
      userId,
      title: title.trim(),
      amount: Number(amount),
      source: source.trim(),
      date,
    });

    res.status(201).json({
      success: true,
      message: "Income added successfully",
      income,
    });
  } catch (error) {
    console.error("Add Income Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add income",
    });
  }
});

// =========================
// DELETE INCOME
// =========================
router.delete("/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    res.json({
      success: true,
      message: "Income deleted successfully",
    });
  } catch (error) {
    console.error("Delete Income Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete income",
    });
  }
});

module.exports = router;