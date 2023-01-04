const express = require("express");
const multer = require("multer");
const router = express.Router();

const Product = require("../models/productPets");

const uploadMultipartForm = multer().none();

router.get("/", (req, res) => res.send("PRODUCT PET ROUTE"));

// @route POST api/products/create
// @desc Create product
// @access Public
router.post("/create", async (req, res) => {
    try {
        uploadMultipartForm(req, res, function (err) {
            const {
                accountId,
                nameProduct,
                price,
                salePrice,
                describe,
                type,
                imageURLs,
            } = req.body;

            if (!accountId || !nameProduct || !price || !describe || !type)
                return res
                    .status(400)
                    .json({ success: false, message: "Missing information" });

            const discountValue = Number(salePrice) - Number(price);
            const newProduct = new Product({
                accountId,
                nameProduct,
                price,
                salePrice,
                discountValue,
                describe,
                type,
                imageURLs,
            });

            //All good

            newProduct.save();
            res.json({
                success: true,
                message: "Product created successfully",
                productID: newProduct._id,
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route GET api/products/all
// @desc Get All Product
// @access Public
router.get("/all", async (req, res) => {
    try {
        const products = await Product.find({ state: { $ne: "deleted" } });
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route GET api/products/byAccountId
// @desc Get Product by accountId
// @access Public
router.get("/byAccountId", async (req, res) => {
    const accountId = req.query.accountId;
    try {
        console.log(accountId);
        const products = await Product.find({
            accountId,
            state: { $ne: "deleted" },
        });
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route GET api/products/byProductId
// @desc Get Product by productId
// @access Public
router.get("/byProductId", async (req, res) => {
    const productId = req.query.productId;
    try {
        const product = await Product.findOne({
            _id: productId,
            state: { $ne: "deleted" },
        });
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route Delete api/products/byProductId
// @desc delete 1 product
// @access Public
router.delete("/byProductId", async (req, res) => {
    const productId = req.query.productId;
    console.log("productId: ", productId);

    try {
        const state = "deleted";
        Product.findOneAndUpdate(
            { _id: productId },
            {
                state,
            },
            { new: true },
            function (error, product) {
                console.log(product);
                if (!product) {
                    res.status(404).json({
                        success: false,
                        message: "product not found",
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: " Updated product state to  deleted",
                        product,
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

// @route POST api/products/changeState
// @desc change state /////////////////////// deleted
// @access Public
router.post("/changeState", async (req, res) => {
    const productId = req.query.productId;
    const state = req.query.state;
    console.log("productId: ", productId);

    try {
        Product.findOneAndUpdate(
            { _id: productId },
            {
                state,
            },
            { new: true },
            function (error, product) {
                console.log(product);
                if (!product) {
                    res.status(404).json({
                        success: false,
                        message: "product not found",
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: " Updated product state to  deleted",
                        product,
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

// @route Delete api/products/byAccountId
// @desc delete all product by accountId
// @access Public
router.delete("/byAccountId", async (req, res) => {
    const { accountId } = req.body;
    try {
        await Product.deleteMany({ accountId: accountId });
        res.json({
            success: true,
            message: "Deleted Products accountId: " + accountId,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route PUT api/products/update
// @desc update Product
// @access Public
router.put("/update", async (req, res) => {
    try {
        uploadMultipartForm(req, res, function (err) {
            const {
                productId,
                nameProduct,
                price,
                salePrice,
                describe,
                type,
                countSold,
                imageURLs,
                countAvailability,
                countStar,
            } = req.body;
            Product.findOneAndUpdate(
                { _id: productId },
                {
                    nameProduct: nameProduct,
                    price: price,
                    salePrice: salePrice,
                    discountValue: Number(salePrice - price),
                    describe: describe,
                    imageURLs: imageURLs,
                    type: type,
                    countSold: countSold,
                    countAvailability: countAvailability,
                    countStar: countStar,
                },
                { new: true },
                function (error, productt) {
                    console.log(productt);
                    if (!productt) {
                        res.status(400).json({
                            success: false,
                            message: "product not found",
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            message: " Updated product",
                            productt,
                        });
                    }
                }
            );
            // All Good
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route PUT api/products/upSoldCount
// @desc update
// @access Public
router.put("/upSoldCount", async (req, res) => {
    try {
        const { productId, count } = req.body;
        const oldProduct = await Product.findOne({ _id: productId });
        const newCount = oldProduct.countSold + count;
        Product.findOneAndUpdate(
            { _id: productId },
            {
                countSold: newCount,
            },
            { new: true },
            function (error, product) {
                console.log(product);
                if (!product) {
                    res.status(400).json({
                        success: false,
                        message: "product not found",
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: " Updated product",
                        product,
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

// @route GET api/products/populate
// @desc Get Count Product populate
// @access Public
router.get("/populate", async (req, res) => {
    const count = req.query.count;
    const accountId = req.query.accountId;
    try {
        const products = await Product.find({
            accountId: { $ne: accountId },
            state: { $ne: "deleted" },
        })
            .limit(count)
            .sort({ countSold: -1 });
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route GET api/products/allPopulate
// @desc Get Count Product populate all catalog
// @access Public
router.get("/allPopulate", async (req, res) => {
    const count = req.query.count;
    const accountId = req.query.accountId;
    try {
        const products = await Product.find({
            accountId: { $ne: accountId },
            state: { $ne: "deleted" },
        })
            .limit(count)
            .sort({ countSold: -1 });
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});
// @route GET api/products/populateCatalog
// @desc Get Count Product populate
// @access Public
router.get("/populateCatalog", async (req, res) => {
    const count = req.query.count;
    const type = req.query.catalog;
    console.log("type: ", type);
    const accountId = req.query.accountId;
    try {
        const products = await Product.find({
            type,
            accountId: { $ne: accountId },
            state: { $ne: "deleted" },
        })
            .limit(count)
            .sort({ countSold: -1 });
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route GET api/products/allNewest
// @desc Get Count Product newest all catalog
// @access Public
router.get("/allNewest", async (req, res) => {
    const count = req.query.count;
    const accountId = req.query.accountId;
    try {
        const products = await Product.find({
            accountId: { $ne: accountId },
            state: { $ne: "deleted" },
        })
            .limit(count)
            .sort({ createdAt: -1 });
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});
// @route GET api/products/newestCatalog
// @desc Get Count Product newest
// @access Public
router.get("/newestCatalog", async (req, res) => {
    const count = req.query.count;
    const type = req.query.catalog;
    const accountId = req.query.accountId;
    try {
        const products = await Product.find({
            type,
            accountId: { $ne: accountId },
            state: { $ne: "deleted" },
        })
            .limit(count)
            .sort({ createdAt: -1 });
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route GET api/products/allDiscount
// @desc Get Count Product discount all catalog
// @access Public
router.get("/allDiscount", async (req, res) => {
    const count = req.query.count;
    const accountId = req.query.accountId;
    try {
        const products = await Product.find({
            accountId: { $ne: accountId },
            state: { $ne: "deleted" },
        })
            .limit(count)
            .sort({ discountValue: -1 });
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});
// @route GET api/products/discountCatalog
// @desc Get Count Product discount
// @access Public
router.get("/discountCatalog", async (req, res) => {
    const count = req.query.count;
    const type = req.query.catalog;
    const accountId = req.query.accountId;
    try {
        const products = await Product.find({
            type,
            accountId: { $ne: accountId },
            state: { $ne: "deleted" },
        })
            .limit(count)
            .sort({ discountValue: -1 });
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route GET api/products/randomInCatalog
// @desc Get Count Product random in Catalog
// @access Public
router.get("/randomInCatalog", async (req, res) => {
    const count = req.query.count;
    const accountId = req.query.accountId;
    const type = req.query.catalog;
    try {
        const products = await Product.aggregate([
            { $sample: { size: Number(count) } },
            {
                $match: {
                    accountId: { $ne: accountId },
                    type,
                    state: { $ne: "deleted" },
                },
            },
        ]);
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route GET api/products/allByKeyWord
// @desc Get All Product By key word
// @access Public
router.get("/allByKeyWord", async (req, res) => {
    const keyWord = req.query.keyword;
    try {
        const products = await Product.find({
            nameProduct: { $regex: keyWord, $options: "six" },
            state: { $ne: "deleted" },
        });
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route GET api/products/catalogByKeyWord
// @desc Get (Catalog) Product By key word
// @access Public
router.get("/catalogByKeyWord", async (req, res) => {
    const keyWord = req.query.keyword;
    const type = req.query.type;
    try {
        const products = await Product.find({
            nameProduct: { $regex: keyWord, $options: "six" },
            type,
            state: { $ne: "deleted" },
        });
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route GET api/products/allByKeyWordMinMax
// @desc Get All Product By key word Min Max
// @access Public
router.get("/allByKeyWordMinMax", async (req, res) => {
    const keyWord = req.query.keyWord;
    const min = req.query.min;
    const max = req.query.max;
    try {
        const products = await Product.find({
            nameProduct: { $regex: keyWord },
            price: { $gt: Number(min), $lt: Number(max) },
            state: { $ne: "deleted" },
        });
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});
// @route GET api/products/catalogByKeyWordMinMax
// @desc Get (Catalog) Product By key word Min Max
// @access Public
router.get("/catalogByKeyWordMinMax", async (req, res) => {
    const keyWord = req.query.keyWord;
    const type = req.query.type;
    const min = req.query.min;
    const max = req.query.max;
    try {
        const products = await Product.find({
            nameProduct: { $regex: keyWord },
            type,
            price: { $gt: Number(min), $lt: Number(max) },
            state: { $ne: "deleted" },
        });
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route GET api/products/allByKeyWordMinMaxStar
// @desc Get All Product By key word Min Max Star
// @access Public
router.get("/allByKeyWordMinMaxStar", async (req, res) => {
    const keyWord = req.query.keyWord;
    const min = req.query.min;
    const max = req.query.max;
    try {
        const products = await Product.find({
            nameProduct: { $regex: keyWord },
            countStar: { $gt: Number(min), $lt: Number(max) },
            state: { $ne: "deleted" },
        });
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});
// @route GET api/products/catalogByKeyWordMinMaxStar
// @desc Get (Catalog) Product By key word Min Max Star
// @access Public
router.get("/catalogByKeyWordStar", async (req, res) => {
    const keyWord = req.query.keyWord;
    const type = req.query.type;
    const min = req.query.min;
    const max = req.query.max;
    try {
        const products = await Product.find({
            nameProduct: { $regex: keyWord },
            type,
            countStar: { $gt: Number(min), $lt: Number(max) },
            state: { $ne: "deleted" },
        });
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

module.exports = router;
