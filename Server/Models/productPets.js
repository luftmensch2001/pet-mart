const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ProductPetsSchema = new schema({
    nameProduct: {
        type: String,
        require: true,
    },
    accountId: {
        type: schema.Types.ObjectId,
        ref: "accounts",
    },
    price: {
        type: Number,
        require: true,
    },
    salePrice: {
        type: Number,
        require: true,
    },
    discountValue: {
        type: Number,
        require: true,
    },
    countSold: {
        type: Number,
        default: 0,
    },
    countAvailability: {
        type: Number,
        default: 0,
    },
    countStar: {
        type: Number,
        default: 0,
    },
    describe: {
        type: String,
        require: true,
    },
    type: {
        type: String,
        require: true,
    },
    imageURLs: [
        {
            type: String,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    state: {
        type: String,
        default: "normal",
    },
});

module.exports = mongoose.model("productPets", ProductPetsSchema);
