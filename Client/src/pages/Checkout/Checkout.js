import React, { useEffect, useState } from "react";
import "./Checkout.css";
import paypal from "../../assets/images/paypal.png";
import cod from "../../assets/images/cash-on-delivery.png";
import { BsCheckCircleFill } from "react-icons/bs";
import ThousandSeparator from "../../components/ThousandSeparator";
import Select from "react-select";
import AddressData from "../../assets/AddressData.json";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";

const Checkout = ({
    products,
    total,
    discount,
    usedVoucher,
    usedCoin,
    UpdateNavbar,
}) => {
    const [isLoaded, setIsLoaded] = useState(true);
    const [navigate, setNavigate] = useState(false); // Go to complete page
    const [orderFor, setOrderFor] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(0); // 0 is Paypal
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [fullName2, setFullName2] = useState("");
    const [email2, setEmail2] = useState("");
    const [phoneNumber2, setPhoneNumber2] = useState("");
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");
    const [street, setStreet] = useState("");
    const [note, setNote] = useState("");

    const [provinceOptions, setProvinceOptions] = useState([]);
    const [districtOptions, setDistrictOptions] = useState([]);
    const [wardOptions, setWardOptions] = useState([]);

    // Get Provinces Data
    useEffect(() => {
        let arr = [];
        for (let i = 0; i < AddressData.length; i++) {
            let option = {
                value: AddressData[i].Name,
                label: AddressData[i].Name,
            };
            arr.push(option);
        }
        setProvinceOptions(arr);
        setDistrict(null);
        setWard(null);
    }, []);

    // Get Districts Data
    useEffect(() => {
        for (let i = 0; i < AddressData.length; i++)
            if (AddressData[i].Name === province.value) {
                let arr = [];
                AddressData[i].Districts.forEach((element) => {
                    let option = {
                        value: element.Name,
                        label: element.Name,
                    };
                    arr.push(option);
                });
                setDistrictOptions(arr);
                break;
            }
        setWard(null);
    }, [province]);

    // Get Wards Data
    useEffect(() => {
        if (!district) return;

        for (let i = 0; i < AddressData.length; i++)
            if (AddressData[i].Name === province.value) {
                for (let j = 0; j < AddressData[i].Districts.length; j++) {
                    if (AddressData[i].Districts[j].Name === district) {
                        let arr = [];
                        AddressData[i].Districts[j].Wards.forEach((element) => {
                            let option = {
                                value: element.Name,
                                label: element.Name,
                            };
                            arr.push(option);
                        });
                        setWardOptions(arr);
                        break;
                    }
                }
                break;
            }
    }, [district]);

    function RemoveInvalidBill(id) {
        axios
            .delete("http://localhost:5000/api/bills/", {
                params: { billId: id },
            })
            .then((res) => {})
            .catch((err) => console.log(err));
    }

    function RemoveProductInCart() {
        axios
            .delete("http://localhost:5000/api/productInCarts/byAccountId", {
                params: { accountId: localStorage.getItem("accountID") },
            })
            .then((res) => {
                console.log(res);
                UpdateNavbar();
            })
            .catch((err) => console.log(err));
    }

    const CompleteOrder = () => {
        setIsLoaded(false);
        // Reduce Coin and Voucher count
        if (usedCoin)
            axios
                .put("http://localhost:5000/api/accounts/updateCoin", {
                    accountId: localStorage.getItem("accountID"),
                    coin: usedCoin * -1,
                })
                .then((res) => {
                    console.log("res update coin: ", res);
                })
                .catch((err) => {
                    console.log("err: ", err);
                });
        if (usedVoucher)
            axios
                .put("http://localhost:5000/api/discountCodes/down1count", {
                    codeId: usedVoucher._id,
                })
                .then((res) => {
                    console.log("res update voucher: ", res);
                })
                .catch((err) => {
                    console.log("err: ", err);
                });

        products.forEach((product) => {
            axios
                .put("http://localhost:5000/api/products/upSoldCount", {
                    productId: product.productId,
                    count: product.count,
                })
                .then((res) => {
                    console.log("res update product count: ", res);
                })
                .catch((err) => {
                    console.log("err: ", err);
                });
        });

        // Create bill and product in bill

        axios
            .post("http://localhost:5000/api/bills/create", {
                accountBuyerId: localStorage.getItem("accountID"),
                productId: products[0].productId,
                state: "1",
                paymentMethod: paymentMethod === 0 ? "Paypal" : "COD",
                totalPrice: total,
                discount: discount,
                fullName: fullName,
                phoneNumber: phoneNumber,
                email: email,
                city: province ? province.value : "",
                district: district ? district : "",
                ward: ward ? ward : "",
                detail: street,
                note: note,
                orderFor: orderFor,
                fullName2: orderFor ? fullName2 : "",
                phoneNumber2: orderFor ? phoneNumber2 : "",
                email2: orderFor ? email2 : "",
            })
            .then((res) => {
                console.log("res create bill: ", res);
                const newBillId = res.data.newBill._id;
                let counter = 0;
                // Create product in bill
                products.forEach((item) => {
                    axios
                        .post(
                            "http://localhost:5000/api/productInBills/create",
                            {
                                billId: newBillId,
                                productId: item.productId,
                                color: item.color,
                                count: item.count,
                            }
                        )
                        .then((res) => {
                            console.log("res create productInBill: ", res);
                            counter++;
                            if (counter == products.length) {
                                setIsLoaded(true);
                                setNavigate(true);
                            }
                        })
                        .catch((err) => {
                            toast.error("C?? l???i x???y ra, vui l??ng th??? l???i!", {
                                position: "bottom-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            });
                            RemoveInvalidBill(newBillId);
                            setIsLoaded(true);
                            return;
                        });
                });
                RemoveProductInCart();
            })
            .catch((err) => {
                toast.error("C?? l???i x???y ra, vui l??ng th??? l???i!", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setIsLoaded(true);
                return;
            });
    };

    if (!isLoaded) return <Loading />;

    console.log("usedCoin: ", usedCoin);
    console.log("usedVoucher: ", usedVoucher);

    return (
        <div className="Checkout content">
            {navigate && <Navigate to="/order-completed" />}
            <span className="page-title title-text">
                Th??ng tin <span className="green-text">Thanh to??n</span>
            </span>
            <span className="title-desc">
                Nh???p th??ng tin ????? ho??n t???t ?????t h??ng
            </span>
            <div className="checkout-container">
                <div className="checkout-info-container">
                    <div className="input-row">
                        <input
                            className="input-1"
                            type="text"
                            required="required"
                            placeholder="H??? v?? t??n"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>
                    <div className="input-row">
                        <input
                            className="input-2"
                            type="email"
                            required="required"
                            placeholder="?????a ch??? E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className="input-2"
                            type="tel"
                            required="required"
                            placeholder="S??? ??i???n tho???i"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <div
                        className="input-row"
                        style={{ justifyContent: "flex-start" }}
                    >
                        <input
                            type="checkbox"
                            checked={orderFor}
                            className="order-for-checkbox"
                            onClick={() => setOrderFor(!orderFor)}
                        />
                        <span>?????t h??ng h???</span>
                    </div>
                    {orderFor && (
                        <div className="input-row">
                            <input
                                className="input-1"
                                type="text"
                                required="required"
                                placeholder="H??? v?? t??n ng?????i nh???n"
                                value={fullName2}
                                onChange={(e) => setFullName2(e.target.value)}
                            />
                        </div>
                    )}
                    {orderFor && (
                        <div className="input-row">
                            <input
                                className="input-2"
                                type="email"
                                required="required"
                                placeholder="?????a ch??? E-mail ng?????i nh???n"
                                value={email2}
                                onChange={(e) => setEmail2(e.target.value)}
                            />
                            <input
                                className="input-2"
                                type="tel"
                                required="required"
                                placeholder="S??? ??i???n tho???i ng?????i nh???n"
                                value={phoneNumber2}
                                onChange={(e) =>
                                    setPhoneNumber2(e.target.value)
                                }
                            />
                        </div>
                    )}
                    {orderFor && (
                        <span className="order-for-desc">
                            * Ch??ng t??i c??ng s??? g???i th??ng tin v?? tr???ng th??i ????n
                            h??ng ?????n E-mail c???a ng?????i nh???n
                        </span>
                    )}
                    <div className="input-row">
                        <Select
                            className="select-2"
                            defaultValue={null}
                            onChange={setProvince}
                            options={provinceOptions}
                            placeholder="Ch???n t???nh / th??nh ph???"
                            isSearchable={true}
                            theme={(theme) => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    primary: "var(--primary-color)",
                                },
                            })}
                        />
                        <Select
                            className="select-2"
                            defaultValue={null}
                            value={districtOptions.filter(function (option) {
                                return option.value === district;
                            })}
                            onChange={(e) => setDistrict(e.value)}
                            options={districtOptions}
                            placeholder="Ch???n qu???n / huy???n"
                            isSearchable={true}
                            theme={(theme) => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    primary: "var(--primary-color)",
                                },
                            })}
                        />
                    </div>
                    <div className="input-row">
                        <Select
                            className="select-2"
                            defaultValue={null}
                            value={wardOptions.filter(function (option) {
                                return option.value === ward;
                            })}
                            onChange={(e) => setWard(e.value)}
                            options={wardOptions}
                            placeholder="Ch???n x?? / ph?????ng"
                            isSearchable={true}
                            theme={(theme) => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    primary: "var(--primary-color)",
                                },
                            })}
                        />
                        <input
                            className="input-2"
                            type="text"
                            placeholder="S??? nh?? / ???????ng"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                        />
                    </div>
                    <div className="input-row">
                        <textarea
                            placeholder="Ghi ch?? cho ng?????i b??n"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                    <div className="input-row">
                        <span style={{ marginTop: "10px" }}>
                            Ch???n ph????ng th???c thanh to??n:
                        </span>
                    </div>
                    <div className="input-row">
                        <div
                            className="payment-img-container"
                            onClick={() => setPaymentMethod(0)}
                        >
                            <img className="payment-img" src={paypal} />
                            {paymentMethod === 0 && (
                                <BsCheckCircleFill className="icon" />
                            )}
                        </div>
                        <div
                            className="payment-img-container"
                            onClick={() => setPaymentMethod(1)}
                        >
                            <img className="payment-img" src={cod} />
                            {paymentMethod === 1 && (
                                <BsCheckCircleFill className="icon" />
                            )}
                        </div>
                    </div>
                    <div className="input-row">
                        <button
                            className="complete-button primary-button"
                            onClick={CompleteOrder}
                        >
                            Ho??n t???t ?????t h??ng
                        </button>
                    </div>
                </div>
                <div className="checkout-bill-container">
                    <div className="bill-product-container">
                        {products.map((item) => (
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
                                {ThousandSeparator(total)} ??
                            </span>
                        </div>
                        <div className="bill-row">
                            <span className="label">Ph?? v???n chuy???n</span>
                            <span className="value">Free</span>
                        </div>
                        <div className="bill-row">
                            <span className="label">Gi???m gi??</span>
                            <span className="value">
                                {ThousandSeparator(discount)} ??
                            </span>
                        </div>
                        <div className="bill-row">
                            <span className="label">Th??nh ti???n</span>
                            <span
                                className="label"
                                style={{ fontSize: "1.7rem" }}
                            >
                                {ThousandSeparator(total - discount)} ??
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
