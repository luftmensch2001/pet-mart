const express = require("express");
const accounts = require("../Models/accounts");
const productInFavorites = require("../models/productInFavorites");
const router = express.Router();

const ProductInFavorites = require("../models/productInFavorites");

// @route GET api/productInFavorites/byAccountId
// @desc get productInFavorites by accountId
// @access Public
router.get("/byAccountId", async (req, res) => {
  const accountId = req.query.accountId;
  try {
    console.log(accountId);
    const productInFavorites = await ProductInFavorites.find({
      accountId: { $in: accountId },
      state: { $ne: "deleted" },
    });
    console.log(productInFavorites);
    res.json({ success: true, productInFavorites });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});

// @route POST api/productInFavorites/create
// @desc create productInFavorites
// @access Public
router.post("/create", async (req, res) => {
  const { accountId, productId } = req.body;

  if (!productId || !accountId)
    return res
      .status(400)
      .json({ success: false, message: "Missing information" });
  try {
    // Check for existing productInFavorite
    const productInFavorites = await ProductInFavorites.findOne({
      productId,
      accountId,
    });
    if (productInFavorites) {
      return res
        .status(200)
        .json({ success: true, message: "Created productInFavorites" });
    }

    // All Good
    const newProductInFavorites = new ProductInFavorites({
      productId,
      accountId,
    });
    await newProductInFavorites.save();
    return res
      .status(200)
      .json({ success: true, message: "Created productFavorites" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});

// @route Delete api/productInFavorites/byAccountId
// @desc delete productInFavorites by accountId
// @access Public
router.delete("/byAccountId", async (req, res) => {
  const { accountId } = req.query;
  try {
    const deleteProductInFavorites = await ProductInFavorites.deleteMany({
      accountId,
    });
    if (!deleteProductInFavorites)
      res.status(500).json({
        success: false,
        message: "ProductInFavorites not found",
      });
    res.json({ success: true, message: "Deleted productInFavorites" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});

// @route Delete api/productInFavorites/byProductIdAndAccountId
// @desc delete productInFavorites by productIdAndAccountId
// @access Public
router.delete("/byProductIdAndAccountId", async (req, res) => {
  const { accountId, productId } = req.query;
  try {
    const deleteProductInFavorites = await ProductInFavorites.deleteMany({
      accountId,
      productId,
    });
    if (!deleteProductInFavorites)
      res.status(500).json({
        success: false,
        message: "ProductInFavorites not found",
      });
    res.json({ success: true, message: "Deleted productInFavorites" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});

module.exports = router;
