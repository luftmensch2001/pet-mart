import React, { useState } from "react";
import "./WishlistProduct.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbShoppingCartPlus } from "react-icons/tb";
import ThousandSeparator from "../../components/ThousandSeparator";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmDialog from "../../components/ConfirmDialog";
import GetStarImage from "../../components/GetStarImage";
import SelectTypeDialog from "../../components/SelectTypeDialog";

function WishlistProduct({ data, updateFunction, UpdateNavbar }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    function DeleteFromWishlist() {
        axios
            .delete(
                "http://localhost:5000/api/productInFavorites/byProductIdAndAccountId",
                {
                    params: {
                        accountId: localStorage.getItem("accountID"),
                        productId: data.productId,
                    },
                }
            )
            .then((res) => {
                console.log("res: ", res);
                toast.success("Đã xoá khỏi Yêu thích!", {
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
                console.log("err: ", err);
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
    }

    return (
        <div className="WishlistProduct">
            <Link
                to={`/product/${data.productId}`}
                style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
                <div className="wl-product-info c1">
                    <img
                        className="wl-product-image"
                        src={data.imageURL}
                        alt=""
                    />
                    <span className="wl-product-name">{data.nameProduct}</span>
                </div>

                <div className="wl-product-type c2">
                    <img src={GetStarImage(data.countStar)} />
                </div>

                <span className="wl-product-price c3">
                    {data?.price && ThousandSeparator(data.price)} đ
                </span>
            </Link>
            <div className="wl-product-buttons c4">
                <button
                    className="wl-product-cart-button"
                    onClick={() => setShowDialog(true)}
                >
                    <TbShoppingCartPlus className="wl-product-button-icon" />
                </button>
                <button
                    className="wl-product-remove-button"
                    onClick={() => {
                        setShowDeleteDialog(true);
                    }}
                >
                    <RiDeleteBin6Line className="wl-product-button-icon" />
                </button>
            </div>
            {showDeleteDialog && (
                <ConfirmDialog
                    message={
                        "Bạn có chắc muốn xoá sản phẩm này khỏi Danh Sách Yêu thích ?"
                    }
                    yesLabel={"Xoá"}
                    noLabel={"Huỷ"}
                    yesFunction={DeleteFromWishlist}
                    noFunction={() => setShowDeleteDialog(false)}
                />
            )}
            {showDialog && (
                <SelectTypeDialog
                    product={data}
                    id={data.productId}
                    closeFunction={() => setShowDialog(false)}
                    UpdateNavbar={UpdateNavbar}
                />
            )}
        </div>
    );
}

export default WishlistProduct;
