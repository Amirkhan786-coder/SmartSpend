const express = require("express");
const mongoose = require("mongoose");
const Expense = require("../models/Expense");

const router = express.Router();

// =========================
// GET ALL USER EXPENSES
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

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const expenses = await Expense.find({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      expenses,
    });
  } catch (error) {
    console.error("Get Expenses Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch expenses",
    });
  }
});

// =========================
// ADD EXPENSE
// =========================

router.post("/", async (req, res) => {
  try {
    const {
      userId,
      title,
      amount,
      category,
      date,
      icon,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (!title || !amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "Title, amount, category and date are required",
      });
    }

    const expense = await Expense.create({
      user: userId,
      title,
      amount: Number(amount),
      category,
      date,
      icon,
    });

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.error("Add Expense Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add expense",
    });
  }
});

// =========================
// UPDATE EXPENSE
// =========================

router.put("/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    const {
      title,
      amount,
      category,
      date,
      icon,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const expense = await Expense.findOneAndUpdate(
      {
        _id: req.params.id,
        user: userId,
      },
      {
        title,
        amount: Number(amount),
        category,
        date,
        icon,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.json({
      success: true,
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    console.error("Update Expense Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update expense",
    });
  }
});

// =========================
// DELETE EXPENSE
// =========================

router.delete("/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Delete Expense Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete expense",
    });
  }
});

module.exports = router;