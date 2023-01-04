require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const accountRouter = require("./routes/account");
const productRouter = require("./routes/product");
const productRouterPet = require("./routes/productPet");
const imageProductRouter = require("./routes/imageProduct");
const colorRouter = require("./routes/color");
const productInCartRouter = require("./routes/productInCart");
const productInFavorite = require("./routes/productInFavorite");
const discountCodeRouter = require("./routes/discountCode");
const evalutesRouter = require("./routes/evalute");
const billRouter = require("./routes/bill");
const productInBillRouter = require("./routes/productInBill");

//const colorRouter = require("./routes/color");

console.log(process.env.DB_USERNAME);

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.rbbiuxh.mongodb.net/?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

connectDB();

const app = express();

app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/accounts", accountRouter);
app.use("/api/products", productRouter);
app.use("/api/productPets", productRouterPet);
app.use("/api/imageProducts", imageProductRouter);
app.use("/api/colors", colorRouter);
app.use("/api/productInCarts", productInCartRouter);
app.use("/api/productInFavorites", productInFavorite);
app.use("/api/discountCodes", discountCodeRouter);
app.use("/api/evalutes", evalutesRouter);
app.use("/api/bills", billRouter);
app.use("/api/productInBills", productInBillRouter);

const PORT = 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
