const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ImageProductsSchema = new schema({
    productId: {
        type: schema.Types.ObjectId,
        ref: "products",
    },
    imageURL: {
        type: String,
        require: true,
    },
    isMainImage: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("imageProducts", ImageProductsSchema);
