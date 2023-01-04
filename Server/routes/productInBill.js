const express = require("express");
const router = express.Router();

const ProductInBill = require("../models/productInBills");

// @route GET api/productInBills
// @desc get productInBill
// @access Public
router.get("/", async (req, res) => {
    const billId = req.query.billId;
    try {
        const productInBill = await ProductInBill.find({ billId });
        res.json({ success: true, productInBill });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route POST api/productInBills/create
// @desc create productInFavorite
// @access Public
router.post("/create", async (req, res) => {
    const { billId, productId, count, color } = req.body;

    if (!productId)
        return res
            .status(400)
            .json({ success: false, message: "Missing information" });
    try {
        // All Good
        const newProductInBill = new ProductInBill({
            productId,
            billId,
            count,
            color,
        });
        await newProductInBill.save();
        return res.status(200).json({
            success: true,
            message: "Created productInBill",
            newProductInBill,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route Delete api/productInBills
// @desc delete all productInBills
// @access Public
router.delete("/", async (req, res) => {
    const billId = req.body.billId;
    try {
        const deleteProductInBill = await ProductInBill.deleteMany({ billId });
        if (!deleteProductInBill)
            res.status(500).json({ success: false, message: "Bill not found" });
        res.json({ success: true, message: "Deleted productInBills", billId });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

module.exports = router;
