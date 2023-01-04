const mongoose = require("mongoose");
const schema = mongoose.Schema;

const AccountsSchema = new schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        require: true,
    },
    fullName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    phoneNumber: {
        type: String,
        require: true,
    },
    imageURL: {
        type: String,
        require: false,
    },
    coin: {
        type: Number,
        default: 0,
        require: false,
    },
});

module.exports = mongoose.model("accounts", AccountsSchema);
