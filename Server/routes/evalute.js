const express = require("express");
const router = express.Router();

const Evalute = require("../models/evalutes");
const Account = require("../Models/accounts");
const Product = require("../models/products");

// @route GET api/evalutes
// @desc get evalute
// @access Public
router.get("/", async (req, res) => {
    try {
        const evalutes = await Evalute.find({ productId: req.query.productId });
        res.json({ success: true, evalutes });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route POST api/evalutes/create
// @desc create color
// @access Public
router.post("/create", async (req, res) => {
    const { accountId, productId, describe, star } = req.body;
    try {
        if (!describe || !star || !productId || !accountId)
            return res
                .status(400)
                .json({ success: false, message: "Missing information" });

        // All Good
        const account = await Account.findOne({ _id: accountId });
        const fullName = account.fullName;
        const imageURL = account.imageURL;

        const newEvalute = new Evalute({
            describe,
            productId,
            accountId,
            star,
            fullName,
            imageURL,
        });
        await newEvalute.save();
        const product = await Product.findOne({ _id: productId });
        const countEva = await Evalute.find({ productId }).count();
        console.log(countEva);
        const newStar =
            ((Number(countEva) - 1) * Number(product.countStar) +
                Number(star)) /
            Number(countEva);

        product.countStar = newStar;
        await product.save();
        return res.status(200).json({
            success: true,
            message: "Created evalute",
            newEvalute,
            newStar,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route Delete api/evalutes
// @desc delete evalute
// @access Public
router.delete("/", async (req, res) => {
    const evaluteId = req.query.evaluteId;
    try {
        const eva = await Evalute.findOne({ _id: evaluteId });
        const productId = eva.productId;
        const star = eva.star;
        console.log(eva);
        console.log("star" + star + "star");
        const deleteEvalute = await Evalute.findByIdAndDelete({
            _id: evaluteId,
        });
        if (!deleteEvalute)
            res.status(500).json({
                success: false,
                message: "Evalute not found",
            });
        else {
            const product = await Product.findOne({ _id: productId });
            const countEva = await Evalute.find({ productId }).count();
            console.log("countEva" + countEva);
            console.log("countStar" + product.countStar);
            const newStar = 0;
            if (Number(countEva) > 0)
                newStar =
                    ((Number(countEva) + 1) * Number(product.countStar) -
                        Number(star)) /
                    Number(countEva);
            product.countStar = newStar;
            await product.save();
            res.json({ success: true, message: "Deleted evalute", newStar });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

module.exports = router;
