const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ProductInBillsSchema = new schema({
    productId: {
        type: schema.Types.ObjectId,
        ref: "products",
    },
    billId: {
        type: schema.Types.ObjectId,
        ref: "bills",
    },
    count: {
        type: Number,
        require: true,
    },
    color: {
        type: String,
        require: true,
    },
});

module.exports = mongoose.model("productInBills", ProductInBillsSchema);
