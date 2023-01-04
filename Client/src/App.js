import "./App.css";
import { React, useEffect, useState } from "react";
import Home from "./pages/Home/Home";
import Login from "./pages/LoginRegister/Login";
import Register from "./pages/LoginRegister/Register";
import Account from "./pages/Account/Account";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { Outlet, Routes, Route, useLocation } from "react-router-dom";
import BuyOrdersTab from "./pages/Account/BuyOrdersTab";
import SellOrdersTab from "./pages/Account/SellOrdersTab";
import StoreTab from "./pages/Account/StoreTab";
import ProfileTab from "./pages/Account/ProfileTab";
import AccountManagement from "./pages/Account/AccountManegement";
import Wishlist from "./pages/Wishlist/Wishlist";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import ProductDetail from "./pages/Product/ProductDetail";
import AddProduct from "./pages/StoreManagement/AddProduct";
import Voucher from "./pages/StoreManagement/Voucher";
import ProductList from "./pages/Product/ProductList";
import EditProduct from "./pages/StoreManagement/EditProduct";
import OrderDetail from "./pages/Order/OrderDetail";
import axios from "axios";
import OrderCompleted from "./components/OrderCompleted";

function App() {
    // Hide header and footer in Login / Register screen
    const location = useLocation().pathname;
    const hideHeaderFooter = location === "/login" || location === "/register";
    // show count of products
    const [wishlistCount, setWishlistCount] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    // data for checkout screen
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [usedVoucher, setUsedVoucher] = useState();
    const [usedCoin, setUsedCoin] = useState(0);

    useEffect(() => {
        UpdateNavbar();
    }, []);

    const UpdateNavbar = () => {
        GetCartData();
        GetWishlistData();
    };

    const GetCartData = () => {
        axios
            .get("http://localhost:5000/api/productInCarts/byAccountId", {
                params: {
                    accountId: localStorage.getItem("accountID"),
                },
            })
            .then((res) => setCartCount(res.data.productInCarts.length))
            .catch((err) => console.log(err));
    };

    const GetWishlistData = () => {
        axios
            .get("http://localhost:5000/api/productInFavorites/byAccountId", {
                params: {
                    accountId: localStorage.getItem("accountID"),
                },
            })
            .then((res) => setWishlistCount(res.data.productInFavorites.length))
            .catch((err) => console.log(err));
    };

    function SetCartData(products, total, discount) {
        setProducts(products);
        setTotal(total);
        setDiscount(discount);
    }

    function SetDiscountData(usedVoucher, usedCoin) {
        setUsedVoucher(usedVoucher);
        setUsedCoin(usedCoin);
    }

    return (
        <div className="App">
            {!hideHeaderFooter && (
                <NavBar wishlistCount={wishlistCount} cartCount={cartCount} />
            )}
            <Routes>
                <Route
                    path="/"
                    element={<Home UpdateNavbar={UpdateNavbar} />}
                />
                <Route
                    path="/login"
                    element={<Login UpdateNavbar={UpdateNavbar} />}
                />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/wishlist"
                    element={<Wishlist UpdateNavbar={UpdateNavbar} />}
                />
                <Route
                    path="/cart"
                    element={
                        <Cart
                            SetCartData={SetCartData}
                            SetDiscountData={SetDiscountData}
                            UpdateNavbar={UpdateNavbar}
                        />
                    }
                />
                <Route
                    path="/checkout"
                    element={
                        <Checkout
                            products={products}
                            total={total}
                            discount={discount}
                            usedVoucher={usedVoucher}
                            usedCoin={usedCoin}
                            UpdateNavbar={UpdateNavbar}
                        />
                    }
                />
                <Route path="/buy-order">
                    <Route
                        path="/buy-order/:billId"
                        element={<OrderDetail isBuyOrder={true} />}
                    />
                </Route>
                <Route path="/sell-order">
                    <Route
                        path="/sell-order/:billId"
                        element={<OrderDetail isBuyOrder={false} />}
                    />
                </Route>
                <Route path="/product">
                    <Route
                        path="/product/:productId"
                        element={<ProductDetail UpdateNavbar={UpdateNavbar} />}
                    />
                </Route>
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/edit-product">
                    <Route
                        path="/edit-product/:productId"
                        element={<EditProduct />}
                    />
                </Route>
                <Route path="/voucher" element={<Voucher />} />
                <Route path="/order-completed" element={<OrderCompleted />} />
                <Route
                    path="/products"
                    element={<ProductList UpdateNavbar={UpdateNavbar} />}
                />
                <Route path="/account" element={<Account tabIndex={1} />}>
                    <Route
                        path="/account/buy-orders"
                        element={<BuyOrdersTab />}
                    />
                    <Route
                        path="/account/sell-orders"
                        element={<SellOrdersTab />}
                    />
                    <Route path="/account/store" element={<StoreTab />} />
                    <Route path="/account/profile" element={<ProfileTab />} />
                    <Route
                        path="/account/account-management"
                        element={<AccountManagement />}
                    />
                </Route>
            </Routes>
            {!hideHeaderFooter && <Footer />}
        </div>
    );
}

export default App;
