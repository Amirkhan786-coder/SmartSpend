const express = require("express");
const Budget = require("../models/Budget");

const router = express.Router();

// =========================
// GET ALL BUDGETS
// =========================

router.get("/", async (req, res) => {
  try {
    const budgets = await Budget.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      budgets,
    });
  } catch (error) {
    console.error("Get Budgets Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch budgets",
    });
  }
});

// =========================
// ADD BUDGET
// =========================

router.post("/", async (req, res) => {
  try {
    const {
      category,
      amount,
      month,
      icon,
    } = req.body;

    if (!category || !amount || !month) {
      return res.status(400).json({
        success: false,
        message: "Category, amount and month are required",
      });
    }

    const budget = await Budget.create({
      category,
      amount: Number(amount),
      month,
      icon,
    });

    res.status(201).json({
      success: true,
      message: "Budget added successfully",
      budget,
    });
  } catch (error) {
    console.error("Add Budget Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add budget",
    });
  }
});

// =========================
// UPDATE BUDGET
// =========================

router.put("/:id", async (req, res) => {
  try {
    const {
      category,
      amount,
      month,
      icon,
    } = req.body;

    const budget = await Budget.findByIdAndUpdate(
      req.params.id,
      {
        category,
        amount: Number(amount),
        month,
        icon,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    res.json({
      success: true,
      message: "Budget updated successfully",
      budget,
    });
  } catch (error) {
    console.error("Update Budget Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update budget",
    });
  }
});

// =========================
// DELETE BUDGET
// =========================

router.delete("/:id", async (req, res) => {
  try {
    const budget = await Budget.findByIdAndDelete(
      req.params.id
    );

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    res.json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    console.error("Delete Budget Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete budget",
    });
  }
});

module.exports = router;

