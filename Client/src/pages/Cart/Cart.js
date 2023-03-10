import React, { useEffect, useState } from "react";
import "./Cart.css";
import { Link } from "react-router-dom";
import CartProduct from "./CartProduct";
import { HiOutlineRefresh } from "react-icons/hi";
import { BsArrowLeft, BsCartCheck } from "react-icons/bs";
import { FaMoneyBillWave, FaBitcoin } from "react-icons/fa";
import AddToCart from "../../assets/images/illustrations/undraw_Add_to_cart_re_wrdo.png";
import Loading from "../../components/Loading";
import axios from "axios";
import { toast } from "react-toastify";

import ThousandSeparator from "../../components/ThousandSeparator";

const Cart = ({ SetCartData, SetDiscountData, UpdateNavbar }) => {
    const [data, setData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [total, setTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [coinData, setCoinData] = useState(0);
    const [coin, setCoin] = useState();
    const [coinUsed, setCoinUsed] = useState(0);
    const [voucherCode, setVoucherCode] = useState("");
    const [voucherUsed, setVoucherUsed] = useState();
    let counter = 0;

    useEffect(() => {
        FetchData(true);
        GetUserData();
    }, []);

    const GetUserData = () => {
        setIsLoaded(false);
        axios
            .get("http://localhost:5000/api/accounts/getInfo", {
                params: {
                    accountId: localStorage.getItem("accountID"),
                },
            })
            .then((res) => {
                console.log("res user: ", res);
                setCoinData(res.data.userId.coin);
                setIsLoaded(true);
            })
            .catch((err) => console.log(err));
    };

    const FetchData = (showLoading) => {
        setIsLoaded(!showLoading);
        axios
            .get("http://localhost:5000/api/productInCarts/byAccountId", {
                params: {
                    accountId: localStorage.getItem("accountID"),
                },
            })
            .then((res) => {
                let cartProducts = res.data.productInCarts;
                counter = 0;
                if (counter === cartProducts.length) {
                    setData(cartProducts);
                    setIsLoaded(true);
                }
                let totalTemp = 0;
                cartProducts.forEach((item) => {
                    axios
                        .get("http://localhost:5000/api/products/byProductId", {
                            params: {
                                productId: item.productId,
                            },
                        })
                        .then((res) => {
                            item.nameProduct = res.data.product.nameProduct;
                            item.imageURL = res.data.product.imageURLs[0];
                            item.price = res.data.product.price;
                            totalTemp += item.price * item.count;
                            setData(cartProducts);
                            setTotal(totalTemp);
                            SetCartData(cartProducts, totalTemp, discount);
                            counter++;
                            if (counter === cartProducts.length)
                                setIsLoaded(true);
                        })
                        .catch((err) => console.log("err: ", err));
                });
            })
            .catch((err) => {
                console.log("err: ", err);
            });
    };

    const CoinCheck = () => {
        if (!coin) return;
        if (coin != Math.round(coin)) {
            toast.error("Vui l??ng nh???p s??? nguy??n", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }
        if (coin > coinData) {
            toast.error(
                "S??? Pet-Coin t???i ??a c???a b???n l?? " + coinData.toString(),
                {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                }
            );
            return;
        }
        setCoinUsed(parseInt(coin));
        setDiscount(discount - coinUsed + parseInt(coin));
    };

    function CheckValidVoucher(voucher) {
        if (voucher.count <= 0) return false;
        const start = new Date(voucher.timeStart);
        const end = new Date(voucher.timeEnd);
        const now = new Date();
        if (now < start || now > end) return false;
        return true;
    }

    const VoucherCheck = () => {
        axios
            .get("http://localhost:5000/api/products/byProductId", {
                params: {
                    productId: data[0].productId,
                },
            })
            .then((res) => {
                console.log("res product: ", res);

                axios
                    .post(
                        "http://localhost:5000/api/discountCodes/checkExist",
                        {
                            code: voucherCode,
                            accountId: res.data.product.accountId,
                        }
                    )
                    .then((res) => {
                        console.log("res voucher: ", res);
                        if (res.data.success === false) {
                            toast.error("M?? gi???m gi?? kh??ng t???n t???i!", {
                                position: "bottom-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            });
                            return;
                        }
                        // Check valid voucher
                        const voucher = res.data.discountCodes;
                        if (!CheckValidVoucher(voucher)) {
                            toast.error("M?? gi???m gi?? kh??ng kh??? d???ng!", {
                                position: "bottom-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            });
                        } else {
                            // is valid voucher
                            if (voucher.type === "VN??") {
                                setDiscount(coinUsed + voucher.value);
                            } else {
                                if (!voucher.maxValue)
                                    setDiscount(
                                        coinUsed + (total * voucher.value) / 100
                                    );

                                let value = Math.min(
                                    voucher.maxValue,
                                    (total * voucher.value) / 100
                                );
                                setDiscount(coinUsed + value);
                            }
                            setVoucherUsed(voucher);
                            toast.success("??p d???ng m?? th??nh c??ng!", {
                                position: "bottom-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            });
                        }
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    };

    if (!isLoaded) return <Loading />;

    if (data.length > 0)
        return (
            <div className="Cart content">
                <span className="page-title title-text">Gi??? H??ng</span>
                <span className="total-count-label">
                    Hi???n c??
                    <span className="green-text">
                        {" "}
                        {data?.length} s???n ph???m{" "}
                    </span>
                    trong Gi??? h??ng c???a b???n
                </span>
                <div className="cart-zone">
                    <div className="cart-products-container">
                        <div className="cart-product-heading">
                            <span className="c1">S???n ph???m</span>
                            <span className="c2">Gi??</span>
                            <span className="c3">S??? l?????ng</span>
                            <span className="c4">T???ng c???ng</span>
                            <span className="c5"></span>
                        </div>

                        <div className="cart-product-list">
                            {data.map((item) => (
                                <CartProduct
                                    data={item}
                                    updateFunction={FetchData}
                                    UpdateNavbar={UpdateNavbar}
                                />
                            ))}
                        </div>

                        <div className="cart-bottom-buttons">
                            <Link to="/">
                                <button
                                    className="cart-continue-shopping-button"
                                    onClick={() => window.scrollTo(0, 0)}
                                >
                                    <BsArrowLeft className="cart-button-icon" />
                                    Ti???p t???c mua s???m
                                </button>
                            </Link>
                            <button
                                className="cart-update-button"
                                onClick={FetchData}
                            >
                                <HiOutlineRefresh
                                    className="cart-button-icon"
                                    style={{ color: "#FFF" }}
                                />
                                C???p nh???t Gi???
                            </button>
                        </div>
                    </div>
                    <div className="checkout-zone">
                        <div className="bill-wrapper">
                            <div className="checkout-row">
                                <span className="checkout-label">
                                    T???ng ti???n h??ng:
                                </span>
                                <span className="checkout-value">
                                    {ThousandSeparator(total)} ??
                                </span>
                            </div>
                            <div className="checkout-row">
                                <span className="checkout-label">
                                    Ph?? v???n chuy???n:
                                </span>
                                <span className="checkout-value">Free</span>
                            </div>
                            <div className="checkout-row">
                                <span className="checkout-label">
                                    Gi???m gi??:
                                </span>
                                <span className="checkout-value">
                                    {discount && ThousandSeparator(discount)} ??
                                </span>
                            </div>
                            <div
                                className="checkout-row"
                                style={{ borderBottom: "none" }}
                            >
                                <span className="checkout-label">
                                    Th??nh ti???n:
                                </span>
                                <span className="checkout-value-total">
                                    {total !== "" &&
                                        discount !== "" &&
                                        ThousandSeparator(
                                            total - discount
                                        )}{" "}
                                    ??
                                </span>
                            </div>
                            <Link to="/checkout">
                                <button
                                    className="checkout-button primary-button"
                                    onClick={() => {
                                        window.scrollTo(0, 0);
                                        SetDiscountData(voucherUsed, coinUsed);
                                    }}
                                >
                                    <BsCartCheck className="checkout-button-icon" />
                                    Thanh to??n
                                </button>
                            </Link>
                        </div>
                        <div className="coupon-wrapper">
                            <input
                                className="coupon-input"
                                type="text"
                                placeholder="M?? gi???m gi??"
                                value={voucherCode}
                                onChange={(e) =>
                                    setVoucherCode(
                                        e.target.value
                                            .replace(/ /g, "")
                                            .toUpperCase()
                                    )
                                }
                            />
                            <button
                                className="coupon-apply-button primary-button"
                                onClick={VoucherCheck}
                            >
                                <FaMoneyBillWave className="coupon-icon" />
                                ??p d???ng
                            </button>
                        </div>
                        <div className="coupon-wrapper">
                            <input
                                className="coupon-input"
                                type="number"
                                placeholder="S??? d???ng Pet-Coin"
                                value={coin}
                                onChange={(e) => setCoin(e.target.value)}
                            />
                            <button
                                className="coupon-apply-button primary-button"
                                style={{
                                    backgroundColor: "var(--primary-color)",
                                }}
                                onClick={CoinCheck}
                            >
                                <FaBitcoin className="coupon-icon" />
                                S??? d???ng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    else return <EmptyCart />;
};

const EmptyCart = () => {
    return (
        <div className="EmptyCart content">
            <img src={AddToCart} alt="" />
            <span className="title-text">
                Gi??? H??ng <span className="green-text">??ang Tr???ng</span>
            </span>
            <span className="text-content">
                H??y l???a ch???n v?? th??m s???n ph???m b???n ??ng ?? v??o gi??? h??ng
            </span>
            <Link to="/">
                <button
                    className="cart-continue-shopping-button"
                    onClick={() => window.scrollTo(0, 0)}
                >
                    <BsArrowLeft className="cart-button-icon" />
                    Ti???p t???c mua s???m
                </button>
            </Link>
        </div>
    );
};

export default Cart;
