const mongoose = require("mongoose");
const schema = mongoose.Schema;

const BillsSchema = new schema({
    accountSellerId: {
        type: schema.Types.ObjectId,
        ref: "accounts",
    },
    accountBuyerId: {
        type: schema.Types.ObjectId,
        ref: "accounts",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    state: {
        type: String,
        require: true,
    },
    paymentMethod: {
        type: String,
        require: true,
    },
    totalPrice: {
        type: Number,
        require: true,
    },
    discount: {
        type: Number,
        require: true,
    },
    fullName: {
        type: String,
        require: true,
    },
    phoneNumber: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    city: {
        type: String,
        require: true,
    },
    district: {
        type: String,
        require: true,
    },
    ward: {
        type: String,
        require: true,
    },
    detail: {
        type: String,
        require: true,
    },
    note: {
        type: String,
        require: true,
    },
    orderFor: {
        type: Boolean,
        require: true,
    },
    fullName2: {
        type: String,
        require: false,
    },
    phoneNumber2: {
        type: String,
        require: false,
    },
    email2: {
        type: String,
        require: false,
    },
});

module.exports = mongoose.model("bills", BillsSchema);
