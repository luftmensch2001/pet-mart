import React, { useEffect, useState } from "react";
import "../Checkout/Checkout.css";
import "./OrderDetail.css";
import paypal from "../../assets/images/paypal.png";
import cod from "../../assets/images/cash-on-delivery.png";
import { BsCheckCircleFill } from "react-icons/bs";
import ThousandSeparator from "../../components/ThousandSeparator";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import StatusLabel from "../../components/StatusLabel";
import emailjs from "@emailjs/browser";

const OrderDetail = ({ isBuyOrder }) => {
    const [isLoaded, setIsLoaded] = useState(true);
    const [products, setProducts] = useState();
    const [billData, setBillData] = useState();
    const navigate = useNavigate();
    const billId = useParams().billId;

    useEffect(() => {
        setIsLoaded(false);
        let counter = 0;
        // Get Products in bill
        axios
            .get("http://localhost:5000/api/productInBills/", {
                params: {
                    billId: billId,
                },
            })
            .then((res) => {
                setProducts(res.data.productInBill);
                console.log("products: ", products);
                let productsArr = res.data.productInBill;
                productsArr.forEach((product) => {
                    axios
                        .get("http://localhost:5000/api/products/byProductId", {
                            params: {
                                productId: product.productId,
                            },
                        })
                        .then((res) => {
                            console.log("res one product: ", res);
                            product.nameProduct = res.data.product.nameProduct;
                            product.imageURL = res.data.product.imageURLs[0];
                            product.price = res.data.product.price;
                            setProducts(productsArr.slice(0));
                        })
                        .catch((err) => console.log(err));
                });
                counter++;
                if (counter === 2) setIsLoaded(true);
            })
            .catch((err) => console.log(err));
        // Get Bill data
        axios
            .get("http://localhost:5000/api/bills/byBillId", {
                params: {
                    billId: billId,
                },
            })
            .then((res) => {
                setBillData(res.data.bill);
                console.log("bill: ", res.data.bill);
                counter++;
                if (counter === 2) setIsLoaded(true);
            })
            .catch((err) => console.log(err));
    }, [billId]);

    function SetBillState(status) {
        console.log("billId: ", billId);
        let message;
        switch (status) {
            case "2":
                message = "???? ch???p nh???n ????n h??ng!";
                break;
            case "3":
                message =
                    "???? nh???n h??ng th??nh c??ng! B???n nh???n ???????c " +
                    Math.round(billData.totalPrice / 100).toString() +
                    " Pet-Coin";
                UpdateCoin();
                break;
            case "4":
                message = "???? hu??? ????n h??ng!";
                break;
        }
        axios
            .put("http://localhost:5000/api/bills/update", {
                billId: billId,
                state: status,
            })
            .then((res) => {
                console.log("res update state: ", res);
                toast.success(message, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                BackToOrders();
            })
            .catch((err) => {
                console.log(err);
                toast.error("C?? l???i x???y ra!", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            });
    }

    function BackToOrders() {
        window.scrollTo(0, 0);
        navigate({
            pathname: isBuyOrder
                ? "/account/buy-orders"
                : "/account/sell-orders",
        });
    }

    function UpdateCoin() {
        axios
            .put("http://localhost:5000/api/accounts/updateCoin", {
                accountId: localStorage.getItem("accountID"),
                coin: Math.round(billData?.totalPrice / 100),
            })
            .then((res) => {
                console.log("res coin update", res);
            })
            .catch((err) => console.log(err));
    }

    if (!isLoaded) return <Loading />;

    return (
        <div className="Checkout OrderDetail content">
            <span className="page-title title-text">
                Th??ng tin <span className="green-text">????n h??ng</span>
            </span>
            <div className="checkout-container">
                <div className="checkout-info-container">
                    <span className="title-of-zone green-text">
                        Th??ng tin ng?????i nh???n
                    </span>
                    <div className="input-row">
                        <input
                            className="input-1"
                            type="text"
                            value={billData?.fullName}
                            readOnly={true}
                        />
                    </div>
                    <div className="input-row">
                        <input
                            className="input-2"
                            type="email"
                            value={billData?.email}
                            readOnly={true}
                        />
                        <input
                            className="input-2"
                            type="tel"
                            value={billData?.phoneNumber}
                            readOnly={true}
                        />
                    </div>
                    <div
                        className="input-row"
                        style={{ justifyContent: "flex-start" }}
                    >
                        <input
                            type="checkbox"
                            checked={billData?.orderFor}
                            className="order-for-checkbox"
                            readOnly={true}
                        />
                        <span>?????t h??ng h???</span>
                    </div>
                    {billData?.orderFor && (
                        <div className="input-row">
                            <input
                                className="input-1"
                                type="text"
                                value={billData.fullName2}
                                readOnly={true}
                            />
                        </div>
                    )}
                    {billData?.orderFor && (
                        <div className="input-row">
                            <input
                                className="input-2"
                                type="email"
                                value={billData.email2}
                                readOnly={true}
                            />
                            <input
                                className="input-2"
                                type="tel"
                                value={billData.phoneNumber2}
                                readOnly={true}
                            />
                        </div>
                    )}
                    {billData?.orderFor && (
                        <span className="order-for-desc">
                            * Ch??ng t??i c??ng s??? g???i th??ng tin v?? tr???ng th??i ????n
                            h??ng ?????n E-mail c???a ng?????i nh???n
                        </span>
                    )}
                    <span className="title-of-zone green-text">
                        ?????a ch??? nh???n h??ng
                    </span>
                    <div className="input-row">
                        <input
                            className="input-2"
                            type="email"
                            value={billData?.city}
                            readOnly={true}
                        />
                        <input
                            className="input-2"
                            type="tel"
                            value={billData?.district}
                            readOnly={true}
                        />
                    </div>
                    <div className="input-row">
                        <input
                            className="input-2"
                            type="email"
                            value={billData?.ward}
                            readOnly={true}
                        />
                        <input
                            className="input-2"
                            type="tel"
                            value={billData?.detail}
                            readOnly={true}
                        />
                    </div>
                    <div className="input-row">
                        <textarea
                            placeholder="Ghi ch?? cho ng?????i b??n"
                            value={billData?.note}
                            readOnly={true}
                        />
                    </div>
                    <span className="title-of-zone green-text">
                        Ph????ng th???c thanh to??n
                    </span>
                    <div className="input-row">
                        <div className="payment-img-container">
                            <img className="payment-img" src={paypal} />
                            {billData?.paymentMethod === "Paypal" && (
                                <BsCheckCircleFill className="icon" />
                            )}
                        </div>
                        <div className="payment-img-container">
                            <img className="payment-img" src={cod} />
                            {billData?.paymentMethod === "COD" && (
                                <BsCheckCircleFill className="icon" />
                            )}
                        </div>
                    </div>
                    {isBuyOrder ? (
                        <div className="input-row button-wrapper">
                            {billData?.state === "2" && (
                                <button
                                    className="primary-button button-green"
                                    onClick={() => {
                                        SetBillState("3");
                                    }}
                                >
                                    ???? Nh???n ???????c H??ng
                                </button>
                            )}
                            {billData?.state === "1" && (
                                <button
                                    className="primary-button button-red"
                                    style={{ marginLeft: 0 }}
                                    onClick={() => {
                                        SetBillState("4");
                                        emailjs.send(
                                            "service_cki5lbq",
                                            "template_jfnoubx",
                                            {
                                                name_customer:
                                                    billData?.fullName,
                                                name_first_product:
                                                    products[0]?.nameProduct,
                                                count_other_product:
                                                    products.length - 1,
                                                cancel_reason:
                                                    "Ng?????i mua hu??? ????n h??ng",
                                                url: `/buy-order/${billData?._id}`,
                                                email_customer: billData?.email,
                                            },
                                            "KbVTEVlkRxDF3qYFd"
                                        );
                                    }}
                                >
                                    Hu??? ????n H??ng
                                </button>
                            )}
                        </div>
                    ) : (
                        billData?.state === "1" && (
                            <div className="input-row button-wrapper">
                                <button
                                    className="primary-button button-green"
                                    onClick={() => {
                                        SetBillState("2");
                                        emailjs.send(
                                            "service_cki5lbq",
                                            "template_c9f9ohd",
                                            {
                                                name_customer:
                                                    billData?.fullName,
                                                name_first_product:
                                                    products[0]?.nameProduct,
                                                count_other_product:
                                                    products.length - 1,
                                                url: `/buy-order/${billData?._id}`,
                                                email_customer: billData?.email,
                                            },
                                            "KbVTEVlkRxDF3qYFd"
                                        );
                                    }}
                                >
                                    Ch???p nh???n ????n H??ng
                                </button>
                                <button
                                    className="primary-button button-red"
                                    onClick={() => {
                                        SetBillState("4");
                                        emailjs.send(
                                            "service_cki5lbq",
                                            "template_jfnoubx",
                                            {
                                                name_customer:
                                                    billData?.fullName,
                                                name_first_product:
                                                    products[0]?.nameProduct,
                                                count_other_product:
                                                    products.length - 1,
                                                cancel_reason:
                                                    "Ng?????i b??n t??? ch???i ????n h??ng",
                                                url: `/buy-order/${billData?._id}`,
                                                email_customer: billData?.email,
                                            },
                                            "KbVTEVlkRxDF3qYFd"
                                        );
                                    }}
                                >
                                    T??? Ch???i ????n H??ng
                                </button>
                            </div>
                        )
                    )}
                </div>
                <div className="checkout-bill-container">
                    <div className="bill-product-container">
                        {products?.map((item) => (
                            <div className="bill-product-item">
                                <div className="bill-product-info">
                                    <img
                                        className="bill-product-img"
                                        src={item.imageURL}
                                    />
                                    <div className="bill-product-detail">
                                        <div className="bill-product-name-wrapper">
                                            <span className="bill-product-name">
                                                {item.nameProduct}
                                            </span>
                                        </div>
                                        <span className="bill-product-quantity">
                                            Ph??n lo???i: {item.color}
                                        </span>
                                        <span className="bill-product-quantity">
                                            S??? l?????ng: {item.count}
                                        </span>
                                    </div>
                                </div>
                                <span className="bill-product-total">
                                    {ThousandSeparator(item.price * item.count)}{" "}
                                    ??
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="bill-money-container">
                        <div className="bill-row">
                            <span className="label">T???ng ti???n h??ng</span>
                            <span className="value">
                                {billData?.totalPrice
                                    ? ThousandSeparator(billData.totalPrice)
                                    : "0"}{" "}
                                ??
                            </span>
                        </div>
                        <div className="bill-row">
                            <span className="label">Ph?? v???n chuy???n</span>
                            <span className="value">Free</span>
                        </div>
                        <div className="bill-row">
                            <span className="label">Gi???m gi??</span>
                            <span className="value">
                                {billData?.discount
                                    ? ThousandSeparator(billData.discount)
                                    : 0}{" "}
                                ??
                            </span>
                        </div>
                        <div className="bill-row">
                            <span className="label">Th??nh ti???n</span>
                            <span
                                className="label"
                                style={{ fontSize: "1.7rem" }}
                            >
                                {billData?.totalPrice
                                    ? ThousandSeparator(
                                          billData.totalPrice -
                                              billData.discount
                                      )
                                    : "0"}{" "}
                                ??
                            </span>
                        </div>
                        <div className="bill-row">
                            <StatusLabel type={billData?.state} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
