const express = require("express");
const multer = require("multer");
const router = express.Router();

const ProductPet = require("../models/productPets");

const uploadMultipartForm = multer().none();

router.get("/", (req, res) => res.send("PRODUCTPET ROUTE"));

// @route POST api/productPets/create
// @desc Create productPet
// @access Public
router.post("/create", async (req, res) => {
  try {
    uploadMultipartForm(req, res, function (err) {
      const {
        accountId,
        nameProductPet,
        price,
        salePrice,
        describe,
        type,
        imageURLs,
      } = req.body;

      if (!accountId || !nameProductPet || !price || !describe || !type)
        return res
          .status(400)
          .json({ success: false, message: "Missing information" });

      const discountValue = Number(salePrice) - Number(price);
      const newProductPet = new ProductPet({
        accountId,
        nameProductPet,
        price,
        salePrice,
        discountValue,
        describe,
        type,
        imageURLs,
      });

      //All good

      newProductPet.save();
      res.json({
        success: true,
        message: "ProductPet created successfully",
        productID: newProductPet._id,
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

// @route GET api/productPets/all
// @desc Get All ProductPet
// @access Public
router.get("/all", async (req, res) => {
  try {
    const productPets = await ProductPet.find({ state: { $ne: "deleted" } });
    res.json({ success: true, productPets });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});

// @route GET api/productPets/byAccountId
// @desc Get ProductPet by accountId
// @access Public
router.get("/byAccountId", async (req, res) => {
  const accountId = req.query.accountId;
  try {
    console.log(accountId);
    const productPets = await ProductPet.find({
      accountId,
      state: { $ne: "deleted" },
    });
    res.json({ success: true, productPets });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});

// @route GET api/productPets/byProductPetId
// @desc Get ProductPet by productPetId
// @access Public
router.get("/byProductPetId", async (req, res) => {
  const productPetId = req.query.productPetId;
  try {
    const productPet = await ProductPet.findOne({
      _id: productPetId,
      state: { $ne: "deleted" },
    });
    res.json({ success: true, productPet });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});

// @route Delete api/productPets/byProductPetId
// @desc delete 1 productPet
// @access Public
router.delete("/byProductPetId", async (req, res) => {
  const productPetId = req.query.productPetId;
  console.log("productPetId: ", productPetId);

  try {
    const state = "deleted";
    ProductPet.findOneAndUpdate(
      { _id: productPetId },
      {
        state,
      },
      { new: true },
      function (error, productPet) {
        console.log(productPet);
        if (!productPet) {
          res.status(404).json({
            success: false,
            message: "productPet not found",
          });
        } else {
          res.status(200).json({
            success: true,
            message: " Updated product Pet state to  deleted",
            productPet,
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

// @route POST api/productPets/changeState
// @desc change state /////////////////////// deleted
// @access Public
router.post("/changeState", async (req, res) => {
  const productPetId = req.query.productPetId;
  const state = req.query.state;
  console.log("productId: ", productId);

  try {
    ProductPet.findOneAndUpdate(
      { _id: productPetId },
      {
        state,
      },
      { new: true },
      function (error, productPet) {
        console.log(productPet);
        if (!productPet) {
          res.status(404).json({
            success: false,
            message: "product not found",
          });
        } else {
          res.status(200).json({
            success: true,
            message: " Updated productPet state to  deleted",
            productPet,
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

// @route Delete api/productPets/byAccountId
// @desc delete all product Pet by accountId
// @access Public
router.delete("/byAccountId", async (req, res) => {
  const { accountId } = req.body;
  try {
    await ProductPet.deleteMany({ accountId: accountId });
    res.json({
      success: true,
      message: "Deleted ProductPets accountId: " + accountId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});

// @route PUT api/productPets/update
// @desc update Product Pet
// @access Public
router.put("/update", async (req, res) => {
  try {
    uploadMultipartForm(req, res, function (err) {
      const {
        productPetId,
        nameProductPet,
        price,
        salePrice,
        describe,
        type,
        countSold,
        imageURLs,
        countAvailability,
        countStar,
      } = req.body;
      ProductPet.findOneAndUpdate(
        { _id: productPetId },
        {
          nameProductPet: nameProductPet,
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
        function (error, productPet) {
          console.log(productPet);
          if (!productPet) {
            res.status(400).json({
              success: false,
              message: "productPet not found",
            });
          } else {
            res.status(200).json({
              success: true,
              message: " Updated productPet",
              productPet,
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

// @route PUT api/productPets/upSoldCount
// @desc update
// @access Public
router.put("/upSoldCount", async (req, res) => {
  try {
    const { productPetId, count } = req.body;
    const oldProductPet = await ProductPet.findOne({ _id: productPetId });
    const newCount = oldProductPet.countSold + count;
    ProductPet.findOneAndUpdate(
      { _id: productPetId },
      {
        countSold: newCount,
      },
      { new: true },
      function (error, productPet) {
        console.log(productPet);
        if (!productPet) {
          res.status(400).json({
            success: false,
            message: "productPet not found",
          });
        } else {
          res.status(200).json({
            success: true,
            message: " Updated productPet",
            productPet,
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

// @route GET api/productPets/populate
// @desc Get Count ProductPet populate
// @access Public
router.get("/populate", async (req, res) => {
  const count = req.query.count;
  const accountId = req.query.accountId;
  try {
    const productPets = await ProductPet.find({
      accountId: { $ne: accountId },
      state: { $ne: "deleted" },
    })
      .limit(count)
      .sort({ countSold: -1 });
    res.json({ success: true, productPets });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});

// @route GET api/productPets/allPopulate
// @desc Get Count ProductPet populate all catalog
// @access Public
router.get("/allPopulate", async (req, res) => {
  const count = req.query.count;
  const accountId = req.query.accountId;
  try {
    const productPets = await ProductPet.find({
      accountId: { $ne: accountId },
      state: { $ne: "deleted" },
    })
      .limit(count)
      .sort({ countSold: -1 });
    res.json({ success: true, productPets });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});
// @route GET api/productPets/populateCatalog
// @desc Get Count ProductPet populate
// @access Public
router.get("/populateCatalog", async (req, res) => {
  const count = req.query.count;
  const type = req.query.catalog;
  console.log("type: ", type);
  const accountId = req.query.accountId;
  try {
    const productPets = await ProductPet.find({
      type,
      accountId: { $ne: accountId },
      state: { $ne: "deleted" },
    })
      .limit(count)
      .sort({ countSold: -1 });
    res.json({ success: true, productPets });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});

// @route GET api/productPets/allNewest
// @desc Get Count ProductPet newest all catalog
// @access Public
router.get("/allNewest", async (req, res) => {
  const count = req.query.count;
  const accountId = req.query.accountId;
  try {
    const productPets = await ProductPet.find({
      accountId: { $ne: accountId },
      state: { $ne: "deleted" },
    })
      .limit(count)
      .sort({ createdAt: -1 });
    res.json({ success: true, productPets });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});
// @route GET api/productPets/newestCatalog
// @desc Get Count ProductPet newest
// @access Public
router.get("/newestCatalog", async (req, res) => {
  const count = req.query.count;
  const type = req.query.catalog;
  const accountId = req.query.accountId;
  try {
    const productPets = await ProductPet.find({
      type,
      accountId: { $ne: accountId },
      state: { $ne: "deleted" },
    })
      .limit(count)
      .sort({ createdAt: -1 });
    res.json({ success: true, productPets });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});

// @route GET api/productPets/allDiscount
// @desc Get Count ProductPet discount all catalog
// @access Public
router.get("/allDiscount", async (req, res) => {
  const count = req.query.count;
  const accountId = req.query.accountId;
  try {
    const productPets = await ProductPet.find({
      accountId: { $ne: accountId },
      state: { $ne: "deleted" },
    })
      .limit(count)
      .sort({ discountValue: -1 });
    res.json({ success: true, productPets });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});
// @route GET api/productPets/discountCatalog
// @desc Get Count ProductPet discount
// @access Public
router.get("/discountCatalog", async (req, res) => {
  const count = req.query.count;
  const type = req.query.catalog;
  const accountId = req.query.accountId;
  try {
    const productPets = await ProductPet.find({
      type,
      accountId: { $ne: accountId },
      state: { $ne: "deleted" },
    })
      .limit(count)
      .sort({ discountValue: -1 });
    res.json({ success: true, productPets });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});

// @route GET api/productPets/randomInCatalog
// @desc Get Count ProductPet random in Catalog
// @access Public
router.get("/randomInCatalog", async (req, res) => {
  const count = req.query.count;
  const accountId = req.query.accountId;
  const type = req.query.catalog;
  try {
    const productPets = await ProductPet.aggregate([
      { $sample: { size: Number(count) } },
      {
        $match: {
          accountId: { $ne: accountId },
          type,
          state: { $ne: "deleted" },
        },
      },
    ]);
    res.json({ success: true, productPets });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});

// @route GET api/productPets/allByKeyWord
// @desc Get All ProductPet By key word
// @access Public
router.get("/allByKeyWord", async (req, res) => {
  const keyWord = req.query.keyword;
  try {
    const productPets = await ProductPet.find({
      nameProductPet: { $regex: keyWord, $options: "six" },
      state: { $ne: "deleted" },
    });
    res.json({ success: true, productPets });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});

// @route GET api/productPets/catalogByKeyWord
// @desc Get (Catalog) ProductPet By key word
// @access Public
router.get("/catalogByKeyWord", async (req, res) => {
  const keyWord = req.query.keyword;
  const type = req.query.type;
  try {
    const productPets = await ProductPet.find({
      nameProductPet: { $regex: keyWord, $options: "six" },
      type,
      state: { $ne: "deleted" },
    });
    res.json({ success: true, productPets });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});

// @route GET api/productPets/allByKeyWordMinMax
// @desc Get All ProductPet By key word Min Max
// @access Public
router.get("/allByKeyWordMinMax", async (req, res) => {
  const keyWord = req.query.keyWord;
  const min = req.query.min;
  const max = req.query.max;
  try {
    const productPets = await ProductPet.find({
      nameProductPet: { $regex: keyWord },
      price: { $gt: Number(min), $lt: Number(max) },
      state: { $ne: "deleted" },
    });
    res.json({ success: true, productPets });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});
// @route GET api/productPets/catalogByKeyWordMinMax
// @desc Get (Catalog) ProductPet By key word Min Max
// @access Public
router.get("/catalogByKeyWordMinMax", async (req, res) => {
  const keyWord = req.query.keyWord;
  const type = req.query.type;
  const min = req.query.min;
  const max = req.query.max;
  try {
    const productPets = await ProductPet.find({
      nameProductPet: { $regex: keyWord },
      type,
      price: { $gt: Number(min), $lt: Number(max) },
      state: { $ne: "deleted" },
    });
    res.json({ success: true, productPets });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});

// @route GET api/productPets/allByKeyWordMinMaxStar
// @desc Get All ProductPet By key word Min Max Star
// @access Public
router.get("/allByKeyWordMinMaxStar", async (req, res) => {
  const keyWord = req.query.keyWord;
  const min = req.query.min;
  const max = req.query.max;
  try {
    const productPets = await ProductPet.find({
      nameProductPet: { $regex: keyWord },
      countStar: { $gt: Number(min), $lt: Number(max) },
      state: { $ne: "deleted" },
    });
    res.json({ success: true, productPets });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});
// @route GET api/productPets/catalogByKeyWordMinMaxStar
// @desc Get (Catalog) ProductPet By key word Min Max Star
// @access Public
router.get("/catalogByKeyWordStar", async (req, res) => {
  const keyWord = req.query.keyWord;
  const type = req.query.type;
  const min = req.query.min;
  const max = req.query.max;
  try {
    const productPets = await ProductPet.find({
      nameProduct: { $regex: keyWord },
      type,
      countStar: { $gt: Number(min), $lt: Number(max) },
      state: { $ne: "deleted" },
    });
    res.json({ success: true, productPets });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
    });
  }
});

module.exports = router;
