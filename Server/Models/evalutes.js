const mongoose = require("mongoose");
const schema = mongoose.Schema;

const EvalutesSchema = new schema({
    accountId: {
        type: schema.Types.ObjectId,
        ref: "accounts",
    },
    productId: {
        type: schema.Types.ObjectId,
        ref: "products",
    },
    describe: {
        type: String,
        require: true,
    },
    star: {
        type: Number,
        require: true,
    },
    fullName: {
        type: String,
        require: true,
        default: "",
    },
    imageURL: {
        type: String,
        require: true,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("evalutes", EvalutesSchema);
