const mongoose = require("mongoose");
const schema = mongoose.Schema;

const DiscountCodeSchema = new schema({
    code: {
        type: String,
        require: true,
    },
    accountId: {
        type: schema.Types.ObjectId,
        ref: "accounts",
    },
    count: {
        type: Number,
        require: true,
    },
    timeStart: {
        type: Date,
        default: Date.now,
    },
    timeEnd: {
        type: Date,
        default: Date.now,
    },
    value: {
        type: Number,
        require: true,
    },
    type: {
        type: String,
        require: true,
    },
    maxValue: {
        type: Number,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("discountCode", DiscountCodeSchema);
