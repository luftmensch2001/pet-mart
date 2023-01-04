const express = require("express");
const router = express.Router();

const Address = require("../models/address");

// @route GET api/address
// @desc get address
// @access Public
router.get("/", async (req, res) => {
  try {
    const address = await Address.find({ accountId: req.accountId });
    res.json({ success: true, address });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: " Internal server error" });
  }
});

// @route POST api/address/create
// @desc create address
// @access Public
router.post("/create", async (req, res) => {
  const { accountId, fullName, phoneNumber, city, district, ward } = req.body;

  if (!fullName || !phoneNumber || !city || !district || !ward)
    return res
      .status(400)
      .json({ success: false, message: "Missing information" });
  try {
    // All Good
    const newAddress = new Address({
      accountId,
      fullName,
      phoneNumber,
      city,
      district,
      ward,
    });
    await newAddress.save();
    return res.status(200).json({ success: true, message: "Created Address" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: " Internal server error" });
  }
});

// @route Delete api/address
// @desc create color
// @access Public
router.delete("/", async (req, res) => {
  try {
    const address = await Color.find({ accountId: req.accountId });
    const deleteAddress = await colors.findAndDelete(accounts);
    if (!deleteAddress)
      res.status(500).json({ success: false, message: "Address not found" });
    res.json({ success: true, message: "Deleted address" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: " Internal server error" });
  }
});

module.exports = router;
