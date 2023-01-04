const express = require("express");
const router = express.Router();

const Color = require("../models/colors");

// @route GET api/colors
// @desc get color
// @access Public
router.get("/", async (req, res) => {
  const productId = req.query.productId;
  try {
    const colors = await Color.find({ productId });
    res.json({ success: true, colors });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});

// @route POST api/colors/create
// @desc create color
// @access Public
router.post("/create", async (req, res) => {
  const { productId, name } = req.body;

  if (!name)
    return res
      .status(400)
      .json({ success: false, message: "Missing name Color" });
  try {
    // Check for existing color
    const color = await Color.findOne({ productId, name });
    if (color)
      return res
        .status(400)
        .json({ success: false, message: "Already exist color" });

    // All Good
    const newColor = new Color({ name, productId });
    await newColor.save();
    return res
      .status(200)
      .json({ success: true, message: "Created Color", newColor });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});

// @route Delete api/colors
// @desc delete all color
// @access Public
router.delete("/byProductId", async (req, res) => {
  const productId = req.query.productId;
  try {
    const deleteColor = await Color.deleteMany({
      productId,
    });
    if (!deleteColor)
      res.status(500).json({
        success: false,
        message: "Color not found",
      });
    res.json({ success: true, message: "Deleted colors" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});

module.exports = router;
