const express = require("express");
const router = express.Router();

const Bill = require("../models/bills");
const Product = require("../models/products");

// @route GET api/bills
// @desc get 1 bill
// @access Public
router.get("/byBillId", async (req, res) => {
    const { billId } = req.query;
    try {
        const bill = await Bill.findOne({ _id: billId });
        res.json({ success: true, message: "Got bill", bill });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});
// @route GET api/bills
// @desc get all bill buyer
// @access Public
router.get("/buyer", async (req, res) => {
    const { accountBuyerId } = req.query;
    try {
        const bills = await Bill.find({ accountBuyerId });
        res.json({ success: true, message: "All bill of buyer", bills });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});
// @route GET api/bills
// @des get all bill seller
// @access Public
router.get("/seller", async (req, res) => {
    const { accountSellerId } = req.query;
    try {
        const bills = await Bill.find({ accountSellerId });
        res.json({ success: true, message: "All bill of seller", bills });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route POST api/bills/create
// @desc create bill
// @access Public
router.post("/create", async (req, res) => {
    const {
        accountBuyerId,
        productId,
        state,
        paymentMethod,
        totalPrice,
        discount,
        fullName,
        phoneNumber,
        email,
        city,
        district,
        ward,
        detail,
        note,
        orderFor,
        fullName2,
        phoneNumber2,
        email2,
    } = req.body;

    if (!accountBuyerId || !productId || !state || !paymentMethod)
        return res
            .status(400)
            .json({ success: false, message: "Missing information" });
    try {
        // All Good
        const accountSellerId = (await Product.findOne({ _id: productId }))
            .accountId;
        console.log(accountSellerId);
        const newBill = new Bill({
            accountBuyerId,
            accountSellerId,
            state,
            paymentMethod,
            totalPrice,
            discount,
            fullName,
            phoneNumber,
            email,
            city,
            district,
            ward,
            detail,
            note,
            orderFor,
            fullName2,
            phoneNumber2,
            email2,
        });
        await newBill.save();
        return res
            .status(200)
            .json({ success: true, message: "Created Bill", newBill });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route Delete api/colors
// @desc create color
// @access Public
router.delete("/", async (req, res) => {
    const { billId } = req.query;
    try {
        const deletedBill = await Bill.findByIdAndDelete({ _id: billId });

        if (!deletedBill)
            res.status(500).json({ success: false, message: "Bill not found" });
        else res.json({ success: true, message: "Deleted bill", billId });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route PUT api/bills/update
// @desc update bill
// @access Public
router.put("/update", async (req, res) => {
    const { billId, state } = req.body;
    console.log("state: ", state);
    console.log("billId: ", billId);
    try {
        Bill.findByIdAndUpdate(
            { _id: billId },
            { state },
            { new: true },
            function (error, bill) {
                console.log(bill);
                if (!bill) {
                    res.status(400).json({
                        success: false,
                        message: "bill not found",
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: " state bill updated",
                        bill,
                    });
                }
            }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

module.exports = router;
