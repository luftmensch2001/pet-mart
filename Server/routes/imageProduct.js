const express = require("express");
const router = express.Router();

const ImageProduct = require("../models/imageProducts");

// @route GET api/imageProducts
// @desc get image
// @access Public
router.get("/", async (req, res) => {
  const { productId } = req.body;
  try {
    const images = await ImageProduct.find({ productId });
    res.json({ success: true, images });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});

// @route POST api/imagesProducts/create
// @desc create imageProduct
// @access Public
router.post("/create", async (req, res) => {
  const { productId, imageURL, isMainImage } = req.body;
  try {
    // Check for existing main image
    const image1 = await ImageProduct.findOne({ productId, isMainImage });
    if (image1 && isMainImage)
      return res
        .status(400)
        .json({ success: false, message: "Already exist main image" });

    // Check for existing image
    // const image2 = await ImageProduct.findOne({ productId, imageURL });
    // if (image2)
    //     return res
    //         .status(400)
    //         .json({ success: false, message: "Already exist imageURL" });

    // All Good
    const newImage = new ImageProduct({ imageURL, productId, isMainImage });
    await newImage.save();
    return res.status(200).json({
      success: true,
      message: "CreatedImage",
      imageProduct: newImage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});

// @route DELETE api/imagesProducts
// @desc Delete all imageProduct
// @access Public
router.delete("/", async (req, res) => {
  try {
    const images = await ImageProduct.find({ productId: req.productId });
    const deleteImages = await colors.findAndDelete(images);
    if (!deleteImages)
      res.status(500).json({
        success: false,
        message: "Color not found",
      });
    res.json({ success: true, message: "Deleted images" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});

module.exports = router;
