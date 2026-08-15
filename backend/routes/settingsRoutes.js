const express = require("express");
const router = express.Router();

const UserSettings = require("../models/UserSettings");
const User = require("../models/User");

// =====================================
// GET SETTINGS
// =====================================

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find settings for this specific user
    let settings = await UserSettings.findOne({
      userId,
    });

    // If settings do not exist, create them
    // using the actual user's information
    if (!settings) {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      settings = await UserSettings.create({
        userId: user._id,
        name: user.name || "User",
        email: user.email || "",
        notifications: true,
        darkMode: true,
      });
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error(
      "Get settings error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to get settings",
      error: error.message,
    });
  }
});

// =====================================
// UPDATE SETTINGS
// =====================================

router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      name,
      email,
      notifications,
      darkMode,
    } = req.body;

    const settings =
      await UserSettings.findOneAndUpdate(
        { userId },
        {
          name,
          email,
          notifications,
          darkMode,
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error(
      "Update settings error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update settings",
      error: error.message,
    });
  }
});

// =====================================
// DELETE SETTINGS
// =====================================

router.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    await UserSettings.findOneAndDelete({
      userId,
    });

    res.status(200).json({
      success: true,
      message: "Settings deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete settings error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete settings",
      error: error.message,
    });
  }
});

module.exports = router;