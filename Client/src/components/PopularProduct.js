import React, { useState, useEffect } from "react";
import "./PopularProduct.css";
import { BiCategory } from "react-icons/bi";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";

import ThousandSeparator from "./ThousandSeparator";
import Loading from "./Loading";
import GetStarImage from "./GetStarImage";
import axios from "axios";
import { toast } from "react-toastify";
import SelectTypeDialog from "./SelectTypeDialog";
import { updateMetadata } from "firebase/storage";

function PopularProduct({ UpdateNavbar }) {
    const [data, setData] = useState([]);
    const [isLoaded, setIsLoaded] = useState();
    const [widthPercent, setWidthPercent] = useState(100);
    const [widthPercentItem, setWidthPercentItem] = useState(22);
    const [filterValue, setFilterValue] = useState("All");

    useEffect(() => {
        setIsLoaded(false);
        GetAllData();
    }, []);

    const GetAllData = () => {
        axios
            .get("http://localhost:5000/api/products/allPopulate", {
                params: {
                    count: 8,
                    accountId: localStorage.getItem("accountID"),
                },
            })
            .then((res) => {
                if (res.data.products.length === 2) {
                    setWidthPercent(60);
                    setWidthPercentItem(40);
                } else if (res.data.products.length === 6) {
                    setWidthPercentItem(25.1);
                }
                setData(res.data.products);
                setIsLoaded(true);
            })
            .catch((err) => console.log(err));
    };

    const HandleFilterOnchange = (event) => {
        setIsLoaded(false);
        setFilterValue(event.target.value);
        if (event.target.value === "All") {
            GetAllData();
            return;
        }

        axios
            .get("http://localhost:5000/api/products/populateCatalog", {
                params: {
                    count: 8,
                    accountId: localStorage.getItem("accountID"),
                    catalog: event.target.value,
                },
            })
            .then((res) => {
                console.log("res: ", res);
                if (res.data.products.length === 2) {
                    setWidthPercent(60);
                    setWidthPercentItem(40);
                } else if (res.data.products.length === 6) {
                    setWidthPercentItem(25.1);
                }
                setData(res.data.products);
                setIsLoaded(true);
            })
            .catch((err) => console.log(err));
    };

    if (isLoaded)
        return (
            <div className="PopularProduct content">
                <div className="popular-head">
                    <p className="title-text">
                        S???n ph???m <span className="green-text">Ph??? bi???n</span>
                    </p>
                    <div className="popular-filter">
                        <BiCategory className="popular-filter-icon" />
                        <select
                            className="popular-filter-selector"
                            value={filterValue}
                            onChange={HandleFilterOnchange}
                        >
                            <option value={"All"}>T???t c??? danh m???c</option>
                            <option value={"Th???c ??n cho Ch??"}>
                                Th???c ??n cho Ch??
                            </option>
                            <option value={"Trang ph???c cho Ch??"}>
                                Trang ph???c cho Ch??
                            </option>
                            <option value={"????? ch??i cho Ch??"}>
                                ????? ch??i cho Ch??
                            </option>
                            <option value={"Th???c ??n cho M??o"}>
                                Th???c ??n cho M??o
                            </option>
                            <option value={"Trang ph???c cho M??o"}>
                                Trang ph???c cho M??o
                            </option>
                            <option value={"????? ch??i cho M??o"}>
                                ????? ch??i cho M??o
                            </option>
                            <option value={"Chu???ng, l???ng nu??i"}>
                                Chu???ng, l???ng nu??i
                            </option>
                            <option value={"D??nh cho Chu???t"}>
                                D??nh cho Chu???t
                            </option>
                        </select>
                    </div>
                </div>
                <div
                    className="product-list"
                    style={{ width: `${widthPercent}%` }}
                >
                    {data.length > 0 ? (
                        data.map((item) => (
                            <ProductCard
                                item={item}
                                widthPercentItem={widthPercentItem}
                                UpdateNavbar={UpdateNavbar}
                            />
                        ))
                    ) : (
                        <NoProduct />
                    )}
                </div>
            </div>
        );
    else return <Loading />;
}

function ProductCard({ item, widthPercentItem, UpdateNavbar }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    const isFavoriteOnChange = () => {
        if (!isFavorite) AddToFavorite();
        else RemoveFromFavorite();
    };

    const AddToFavorite = () => {
        console.log("id: ", item._id);
        // Add to favorite
        axios
            .post("http://localhost:5000/api/productInFavorites/create", {
                accountId: localStorage.getItem("accountID"),
                productId: item._id,
                // color: selectedType,
            })
            .then((res) => {
                console.log("res: ", res);
                toast.success("???? th??m v??o Y??u th??ch!", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                UpdateNavbar();
            })
            .catch((err) => {
                console.log("err: ", err);
                toast.error("Th??m kh??ng th??nh c??ng!", {
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
    };

    const RemoveFromFavorite = () => {
        axios
            .delete(
                "http://localhost:5000/api/productInFavorites/byProductIdAndAccountId",
                {
                    params: {
                        accountId: localStorage.getItem("accountID"),
                        productId: item._id,
                    },
                }
            )
            .then((res) => {
                console.log("res: ", res);
                toast.success("???? xo?? kh???i Y??u th??ch!", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                UpdateNavbar();
            })
            .catch((err) => {
                console.log("err: ", err);
                toast.error("Xo?? kh??ng th??nh c??ng!", {
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
    };

    return (
        <div className="product-item" style={{ width: `${widthPercentItem}%` }}>
            {showDialog && (
                <SelectTypeDialog
                    product={item}
                    closeFunction={() => setShowDialog(false)}
                    UpdateNavbar={UpdateNavbar}
                />
            )}
            <div className="product-info">
                <Link to={`/product/${item._id}`}>
                    <img
                        className="product-img"
                        src={item.imageURLs[0]}
                        alt=""
                    />
                    <div className="product-name-wrapper">
                        <p className="product-name">{item.nameProduct}</p>
                    </div>
                    <div className="product-star">
                        <img src={GetStarImage(item.countStar)} alt="" />
                        <span>
                            ({Math.round(parseFloat(item.countStar) * 10) / 10})
                        </span>
                    </div>
                    <div className="product-price-container">
                        <span className="product-sale-price">
                            {ThousandSeparator(item.price)} ??
                        </span>
                        <span className="product-old-price">
                            {item.salePrice > 0
                                ? ThousandSeparator(item.salePrice) + " ??"
                                : ""}
                        </span>
                    </div>
                </Link>
                <div className="product-buttons">
                    <button
                        className="product-add-to-cart-button"
                        onClick={() => setShowDialog(true)}
                    >
                        <AiOutlineShoppingCart className="product-add-to-cart-icon" />
                        Th??m V??o Gi???
                    </button>
                    <div
                        className="add-to-wishlist-wrapper"
                        onClick={isFavoriteOnChange}
                    >
                        <input
                            type="checkbox"
                            checked={isFavorite}
                            id="favorite"
                            name="favorite-checkbox"
                            value="favorite-button"
                            className="atw-input"
                            disabled={true}
                            onChange={() => {}}
                        />
                        <label
                            for="favorite"
                            className="container"
                            onClick={() => setIsFavorite(!isFavorite)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                    width: "24",
                                    height: "24",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "2",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                }}
                                className="feather feather-heart"
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

function NoProduct() {
    return <h1 className="NoProduct">Kh??ng t??m th???y s???n ph???m</h1>;
}

export default PopularProduct;
