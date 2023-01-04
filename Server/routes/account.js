const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const Account = require("../Models/accounts");

router.get("/", (req, res) => res.send("ACCOUNT ROUTE"));

// @route POST api/accounts/register
// @desc Register account
// @access Public
router.post("/register", async (req, res) => {
    const { username, password, fullName, email, phoneNumber } = req.body;

    // Simple validation
    if (!username || !password || !fullName || !email || !phoneNumber)
        return res
            .status(400)
            .json({ success: false, message: "Missing information" });
    try {
        //Check for existing user
        const user = await Account.findOne({ username });
        if (user)
            return res
                .status(400)
                .json({ success: false, message: "Username already" });

        // All good
        const hashedPassword = await argon2.hash(password);
        const newAccount = new Account({
            username,
            password: hashedPassword,
            fullName,
            email,
            phoneNumber,
        });
        await newAccount.save();

        res.status(200).json({
            success: true,
            message: " Created",
            userId: newAccount._id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route POST api/accounts/login
// @desc Login user
// @access Public
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(400).json({
            success: false,
            message: "Missing username and/or password",
        });
    try {
        // Check for existing user
        const user = await Account.findOne({ username });
        if (!user)
            return res
                .status(400)
                .json({ success: false, message: "Incorrect username " });

        const passwordValid = await argon2.verify(user.password, password);
        if (!passwordValid)
            return res
                .status(400)
                .json({ success: false, message: "Incorrect  password" });
        res.json({
            success: true,
            message: "User logged in successfully",
            userId: user._id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route GET api/accounts/getInfo
// @desc Get info user
// @access Public
router.get("/getInfo", async (req, res) => {
    const accountId = req.query.accountId;
    try {
        const user = await Account.findOne({ _id: accountId });
        if (!user)
            return res
                .status(200)
                .json({ success: false, message: "Account not found " });
        else
            res.json({
                success: true,
                message: "Get Info successfully",
                userId: user,
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route PUT api/accounts/updateInfo
// @desc update info user
// @access Public
router.put("/updateInfo", async (req, res) => {
    const { accountId, fullName, email, phoneNumber, imageURL } = req.body;

    try {
        Account.findOneAndUpdate(
            { _id: accountId },
            {
                fullName,
                email,
                phoneNumber,
                imageURL,
            },
            { new: true },
            function (error, account) {
                console.log(account);
                if (!account) {
                    res.status(400).json({
                        success: false,
                        message: "Account not found",
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: " Updated account",
                        account,
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

// @route PUT api/accounts/changePassword
// @desc update password user
// @access Public
router.put("/changePassword", async (req, res) => {
    const { accountId, oldPassword, newPassword } = req.body;

    try {
        const user = await Account.findOne({ _id: accountId });
        if (!user)
            res.status(400).json({
                success: false,
                message: "Account not found",
            });
        let checkPassword = await argon2.verify(user.password, oldPassword);
        if (!checkPassword)
            res.status(401).json({
                success: false,
                message: "oldPassword not correct",
            });
        else {
            let password = await argon2.hash(newPassword);
            Account.findOneAndUpdate(
                { _id: accountId },
                {
                    password,
                },
                { new: true },
                function (error, account) {
                    console.log(account);
                    if (!account) {
                        res.status(400).json({
                            success: false,
                            message: "Account not found",
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            message: " Changed account",
                            account,
                        });
                    }
                }
            );
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " Internal server error",
        });
    }
});

// @route PUT api/accounts/updateCoin
// @desc update coin
// @access Public
router.put("/updateCoin", async (req, res) => {
    const { accountId, coin } = req.body;
    console.log("coin: ", coin);
    console.log("accountId: ", accountId);

    try {
        const account = await Account.findOne({ _id: accountId });
        const newCoin = account.coin + coin;
        Account.findOneAndUpdate(
            { _id: accountId },
            {
                coin: newCoin,
            },
            { new: true },
            function (error, account) {
                console.log(account);
                if (!account) {
                    res.status(400).json({
                        success: false,
                        message: "Account not found",
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: " Updated account",
                        account,
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

module.exports = router;
