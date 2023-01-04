import React, { useState } from "react";
import "./CartProduct.css";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import ThousandSeparator from "../../components/ThousandSeparator";
import ConfirmDialog from "../../components/ConfirmDialog";
import axios from "axios";

const CartProduct = ({ data, updateFunction, UpdateNavbar }) => {
    const [quantity, setQuantity] = useState(data.count);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const UpdateQuantity = (count) => {
        axios
            .put("http://localhost:5000/api/productInCarts/update", {
                productInCartId: data._id,
                count: count,
            })
            .then((res) => {
                console.log("res: ", res);
                updateFunction(false);
            })
            .catch((err) => {
                console.log("err: ", err);
            });
    };

    const UpQuantityOnClick = () => {
        setQuantity(quantity + 1);
        UpdateQuantity(quantity + 1);
    };
    const DownQuantityOnClick = () => {
        if (quantity <= 1) {
            toast.error("Số lượng tối thiểu là 1", {
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
        setQuantity(quantity - 1);
        UpdateQuantity(quantity - 1);
    };

    const QuantityInputOnChange = (event) => {
        console.log(event.target.value);
        if (event.target.value === "-") return;
        if (event.target.value !== "" && event.target.value < 1) return;
        setQuantity(event.target.value * 1);
    };

    const DeleteFromCart = () => {
        console.log("data.productId: ", data.productId);
        axios
            .delete(
                "http://localhost:5000/api/productInCarts/byProductIdAndAccountId",
                {
                    params: {
                        accountId: localStorage.getItem("accountID"),
                        productId: data.productId,
                        color: data.color,
                    },
                }
            )
            .then((res) => {
                toast.success("Đã xoá khỏi Giỏ hàng!", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                updateFunction();
                UpdateNavbar();
            })
            .catch((err) => {
                toast.error("Xoá không thành công!", {
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
        setShowDeleteDialog(false);
    };

    return (
        <div className="CartProduct">
            <Link
                to={`/product/${data.productId}`}
                className="cart-link-product"
            >
                <div className="cart-product-info">
                    <img className="cart-product-img" src={data.imageURL} />
                    <div className="cart-product-name-type">
                        <span className="cart-product-name">
                            {data.nameProduct}
                        </span>
                        <span className="cart-product-type">
                            Phân loại: {data.color}
                        </span>
                    </div>
                </div>
            </Link>
            <span className="cart-product-price">
                {data.price && ThousandSeparator(data.price)} đ
            </span>
            <div className="cart-product-quantity">
                <div style={{ position: "relative", width: "80px" }}>
                    <input
                        type="number"
                        value={quantity}
                        onChange={QuantityInputOnChange}
                    />
                    <button
                        className="cart-up-quantity-button"
                        onClick={UpQuantityOnClick}
                    >
                        <IoIosArrowUp className="cart-quantity-icon" />
                    </button>
                    <button
                        className="cart-down-quantity-button"
                        onClick={DownQuantityOnClick}
                    >
                        <IoIosArrowDown className="cart-quantity-icon" />
                    </button>
                </div>
            </div>
            <span className="cart-product-total">
                {data.price && ThousandSeparator(data.price * quantity)} đ
            </span>
            <div className="cart-product-delete">
                <button onClick={() => setShowDeleteDialog(true)}>
                    <RiDeleteBin6Line className="cart-product-delete-icon" />
                </button>
            </div>
            {showDeleteDialog && (
                <ConfirmDialog
                    message={
                        "Bạn có chắc chắn muốn xoá sản phẩm khỏi Giỏ hàng ?"
                    }
                    yesLabel={"Xoá"}
                    noLabel={"Huỷ"}
                    yesFunction={DeleteFromCart}
                    noFunction={() => setShowDeleteDialog(false)}
                />
            )}
        </div>
    );
};

export default CartProduct;
