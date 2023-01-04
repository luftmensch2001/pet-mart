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
            toast.error("Vui lòng nhập số nguyên", {
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
                "Số Pet-Coin tối đa của bạn là " + coinData.toString(),
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
                            toast.error("Mã giảm giá không tồn tại!", {
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
                            toast.error("Mã giảm giá không khả dụng!", {
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
                            if (voucher.type === "VNĐ") {
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
                            toast.success("Áp dụng mã thành công!", {
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
                <span className="page-title title-text">Giỏ Hàng</span>
                <span className="total-count-label">
                    Hiện có
                    <span className="green-text">
                        {" "}
                        {data?.length} sản phẩm{" "}
                    </span>
                    trong Giỏ hàng của bạn
                </span>
                <div className="cart-zone">
                    <div className="cart-products-container">
                        <div className="cart-product-heading">
                            <span className="c1">Sản phẩm</span>
                            <span className="c2">Giá</span>
                            <span className="c3">Số lượng</span>
                            <span className="c4">Tổng cộng</span>
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
                                    Tiếp tục mua sắm
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
                                Cập nhật Giỏ
                            </button>
                        </div>
                    </div>
                    <div className="checkout-zone">
                        <div className="bill-wrapper">
                            <div className="checkout-row">
                                <span className="checkout-label">
                                    Tổng tiền hàng:
                                </span>
                                <span className="checkout-value">
                                    {ThousandSeparator(total)} đ
                                </span>
                            </div>
                            <div className="checkout-row">
                                <span className="checkout-label">
                                    Phí vận chuyển:
                                </span>
                                <span className="checkout-value">Free</span>
                            </div>
                            <div className="checkout-row">
                                <span className="checkout-label">
                                    Giảm giá:
                                </span>
                                <span className="checkout-value">
                                    {discount && ThousandSeparator(discount)} đ
                                </span>
                            </div>
                            <div
                                className="checkout-row"
                                style={{ borderBottom: "none" }}
                            >
                                <span className="checkout-label">
                                    Thành tiền:
                                </span>
                                <span className="checkout-value-total">
                                    {total !== "" &&
                                        discount !== "" &&
                                        ThousandSeparator(
                                            total - discount
                                        )}{" "}
                                    đ
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
                                    Thanh toán
                                </button>
                            </Link>
                        </div>
                        <div className="coupon-wrapper">
                            <input
                                className="coupon-input"
                                type="text"
                                placeholder="Mã giảm giá"
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
                                Áp dụng
                            </button>
                        </div>
                        <div className="coupon-wrapper">
                            <input
                                className="coupon-input"
                                type="number"
                                placeholder="Sử dụng Pet-Coin"
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
                                Sử dụng
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
                Giỏ Hàng <span className="green-text">Đang Trống</span>
            </span>
            <span className="text-content">
                Hãy lựa chọn và thêm sản phẩm bạn ưng ý vào giỏ hàng
            </span>
            <Link to="/">
                <button
                    className="cart-continue-shopping-button"
                    onClick={() => window.scrollTo(0, 0)}
                >
                    <BsArrowLeft className="cart-button-icon" />
                    Tiếp tục mua sắm
                </button>
            </Link>
        </div>
    );
};

export default Cart;
