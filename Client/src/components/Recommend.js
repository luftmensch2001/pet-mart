import React, { useEffect, useState } from "react";
import "./Recommend.css";

import ThousandSeparator from "./ThousandSeparator";
import Loading from "./Loading";
import axios from "axios";
import GetStarImage from "./GetStarImage";
import { Link } from "react-router-dom";

function Recommend() {
    const [bestSellerData, setBestSellerData] = useState([]);
    const [lastestData, setLatestData] = useState([]);
    const [deepSaleData, setDeepSaleData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    let counter = 0;

    useEffect(() => {
        setIsLoaded(false);
        counter = 0;
        GetBestSellerData();
        GetLastestData();
        GetDeepSaleData();
    }, []);

    const GetBestSellerData = () => {
        axios
            .get("http://localhost:5000/api/products/allPopulate", {
                params: {
                    count: 3,
                    accountId: localStorage.getItem("accountID"),
                },
            })
            .then((res) => {
                setBestSellerData(res.data.products);
                counter++;
                if (counter === 3) setIsLoaded(true);
            })
            .catch((err) => console.log(err));
    };

    const GetLastestData = () => {
        axios
            .get("http://localhost:5000/api/products/allNewest", {
                params: {
                    count: 3,
                    accountId: localStorage.getItem("accountID"),
                },
            })
            .then((res) => {
                setLatestData(res.data.products);
                counter++;
                if (counter === 3) setIsLoaded(true);
            })
            .catch((err) => console.log(err));
    };

    const GetDeepSaleData = () => {
        axios
            .get("http://localhost:5000/api/products/allDiscount", {
                params: {
                    count: 3,
                    accountId: localStorage.getItem("accountID"),
                },
            })
            .then((res) => {
                setDeepSaleData(res.data.products);
                counter++;
                if (counter === 3) setIsLoaded(true);
            })
            .catch((err) => console.log(err));
    };

    if (isLoaded)
        return (
            <div className="Recommend content">
                <div className="recommend-block">
                    <span className="title-text recommend-title">
                        Best <span className="green-text">Seller</span>
                    </span>
                    <div className="recommend-product-container">
                        {bestSellerData.map((item) => (
                            <Link to={`/product/${item._id}`}>
                                <div className="recommend-product">
                                    <img
                                        className="recommend-product-img"
                                        alt=""
                                        src={item.imageURLs[0]}
                                    />
                                    <div className="recommend-product-info">
                                        <span className="recommend-product-name">
                                            {item.nameProduct}
                                        </span>
                                        <img
                                            className="recommend-product-stars"
                                            alt=""
                                            src={GetStarImage(item.countStar)}
                                        />
                                        <span className="recommend-category">
                                            {item.type}
                                        </span>
                                        <div className="recommend-price-container">
                                            <span className="recommend-price">
                                                {ThousandSeparator(item.price)}
                                            </span>
                                            {item.salePrice > 0 && (
                                                <span className="recommend-old-price">
                                                    {ThousandSeparator(
                                                        item.salePrice
                                                    ) + " đ"}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="recommend-block">
                    <span className="title-text recommend-title">
                        Mới <span className="green-text">Nhất</span>
                    </span>
                    <div className="recommend-product-container">
                        {lastestData.map((item) => (
                            <Link to={`/product/${item._id}`}>
                                <div className="recommend-product">
                                    <img
                                        className="recommend-product-img"
                                        alt=""
                                        src={item.imageURLs[0]}
                                    />
                                    <div className="recommend-product-info">
                                        <span className="recommend-product-name">
                                            {item.nameProduct}
                                        </span>
                                        <img
                                            className="recommend-product-stars"
                                            alt=""
                                            src={GetStarImage(item.countStar)}
                                        />
                                        <span className="recommend-category">
                                            {item.type}
                                        </span>
                                        <div className="recommend-price-container">
                                            <span className="recommend-price">
                                                {ThousandSeparator(item.price)}
                                            </span>
                                            {item.salePrice > 0 && (
                                                <span className="recommend-old-price">
                                                    {ThousandSeparator(
                                                        item.salePrice
                                                    ) + " đ"}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="recommend-block">
                    <span className="title-text recommend-title">
                        Giảm <span className="green-text">Giá Sâu</span>
                    </span>
                    <div className="recommend-product-container">
                        {deepSaleData.map((item) => (
                            <Link to={`/product/${item._id}`}>
                                <div className="recommend-product">
                                    <img
                                        className="recommend-product-img"
                                        alt=""
                                        src={item.imageURLs[0]}
                                    />
                                    <div className="recommend-product-info">
                                        <span className="recommend-product-name">
                                            {item.nameProduct}
                                        </span>
                                        <img
                                            className="recommend-product-stars"
                                            alt=""
                                            src={GetStarImage(item.countStar)}
                                        />
                                        <span className="recommend-category">
                                            {item.type}
                                        </span>
                                        <div className="recommend-price-container">
                                            <span className="recommend-price">
                                                {ThousandSeparator(item.price)}
                                            </span>
                                            {item.salePrice > 0 && (
                                                <span className="recommend-old-price">
                                                    {ThousandSeparator(
                                                        item.salePrice
                                                    ) + " đ"}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        );
    else return <Loading />;
}

export default Recommend;
