const express = require("express");
const multer = require("multer");
const router = express.Router();

const DiscountCode = require("../Models/discountCodes");

const uploadMultipartForm = multer().none();

// @route POST api/discountCodes/create
// @desc Create discountCode
// @access Public
router.post("/create", async (req, res) => {
    const {
        code,
        count,
        timeStart,
        timeEnd,
        value,
        type,
        maxValue,
        accountId,
    } = req.body;

    // Simple validation
    if (!code || !count || !value || !type || !accountId)
        return res
            .status(400)
            .json({ success: false, message: "Missing information" });
    try {
        //Check for existing user
        const discountCode = await DiscountCode.findOne({ code, accountId });
        if (discountCode)
            return res.status(400).json({
                success: false,
                message: "Code already in this account",
            });

        // All good
        const newDiscountCode = new DiscountCode({
            code,
            count,
            timeStart,
            timeEnd,
            value,
            type,
            maxValue,
            accountId,
        });
        await newDiscountCode.save();

        res.status(200).json({
            success: true,
            message: " Created",
            discountCodeId: newDiscountCode._id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route GET api/discountCodes/all
// @desc Get all DiscountCode
// @access Public
router.get("/all", async (req, res) => {
    try {
        const discountCodes = await DiscountCode.find();
        res.json({ success: true, discountCodes });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});
// @route GET api/discountCodes/byAccountId
// @desc Get all DiscountCode
// @access Public
router.get("/byAccountId", async (req, res) => {
    try {
        const { accountId } = req.query;
        const discountCodes = await DiscountCode.find({ accountId });
        res.json({ success: true, discountCodes });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});
// @route GET api/discountCodes/
// @desc Get by code id
// @access Public
router.get("/", async (req, res) => {
    const codeId = req.query.codeId;
    console.log("codeId: ", codeId);
    try {
        const discountCodes = await DiscountCode.findOne({ _id: codeId });
        if (discountCodes == null)
            res.json({ success: false, message: "not found" });
        else res.json({ success: true, discountCodes });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});
// @route POST api/discountCodes/checkExist
// @desc Get by code id
// @access Public
router.post("/checkExist", async (req, res) => {
    const { code, accountId } = req.body;
    console.log("accountId: ", accountId);
    console.log("code: ", code);
    try {
        const discountCodes = await DiscountCode.findOne({ code, accountId });
        if (discountCodes == null)
            res.json({ success: false, message: "not found" });
        else res.json({ success: true, discountCodes });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route PUT api/discountCode/update
// @desc update discountCode
// @access Public
router.put("/update", async (req, res) => {
    try {
        const {
            codeId,
            code,
            count,
            timeStart,
            timeEnd,
            value,
            type,
            maxValue,
        } = req.body;

        const oldCode = await DiscountCode.findOne({ _id: codeId });
        console.log(oldCode.code);
        if (String(oldCode.code) != String(code)) {
            const checkNewCode = await DiscountCode.findOne({ code });
            if (checkNewCode != null)
                return res.status(401).json({
                    success: false,
                    message: " String Code Already Existed",
                });
        }
        if (oldCode.code)
            DiscountCode.findOneAndUpdate(
                { _id: codeId },
                {
                    code,
                    count,
                    timeStart,
                    timeEnd,
                    value,
                    type,
                    maxValue,
                },
                { new: true },
                function (error, discountCode) {
                    console.log(discountCode);
                    if (!discountCode) {
                        res.status(400).json({
                            success: false,
                            message: "discountCode not found",
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            message: " Updated discountCode",
                            discountCode,
                        });
                    }
                }
            );
        // All Good
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});
// @route PUT api/discountCode/down1count
// @desc update discountCode down1count
// @access Public
router.put("/down1count", async (req, res) => {
    try {
        const { codeId } = req.body;
        const oldCode = await DiscountCode.findOne({ _id: codeId });
        const newCount = oldCode.count - 1;
        DiscountCode.findOneAndUpdate(
            { _id: codeId },
            {
                count: newCount,
            },
            { new: true },
            function (error, discountCode) {
                console.log(discountCode);
                if (!discountCode) {
                    res.status(400).json({
                        success: false,
                        message: "discountCode not found",
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: " Updated discountCode",
                        discountCode,
                    });
                }
            }
        );
        // All Good
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route Delete api/discountCodes/byCodeId
// @desc delete 1 Discount by code Id
// @access Public
router.delete("/byCodeId", async (req, res) => {
    const { codeId, accountId } = req.query;
    try {
        const deleteDiscountCode = await DiscountCode.findByIdAndDelete({
            _id: codeId,
            accountId,
        });
        if (!deleteDiscountCode)
            res.status(500).json({
                success: false,
                message: "discountCode not found",
            });
        else
            res.json({
                success: true,
                message: "Deleted discountCode id: " + codeId,
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route Delete api/discountCodes/outDate
// @desc delete all outDate
// @access Public
router.delete("/outDate", async (req, res) => {
    const accountId = req.query.accountId;
    if (!accountId) {
        res.status(500).json({
            success: false,
            message: "missing accountId",
        });
        return;
    }
    try {
        const date = Date.now().toString();
        console.log(date);
        const deleteDiscountCode = await DiscountCode.deleteMany({
            timeEnd: { $lt: date },
            accountId,
        });
        const deleteDiscountCodeCount0 = await DiscountCode.deleteMany({
            count: 0,
            accountId,
        });
        if (!deleteDiscountCode && !deleteDiscountCodeCount0)
            res.status(500).json({
                success: false,
                message: "discountCode not found",
            });
        else
            res.json({
                success: true,
                message: "Deleted",
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

module.exports = router;
