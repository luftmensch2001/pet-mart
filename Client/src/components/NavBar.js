import React, { useEffect, useState } from "react";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import "./NavBar.css";
import axios from "axios";

import {
    AiOutlineSearch,
    AiOutlineHeart,
    AiOutlineShoppingCart,
    AiOutlineUser,
} from "react-icons/ai";
import {
    TiSocialFacebookCircular,
    TiSocialInstagram,
    TiSocialTwitterCircular,
    TiSocialYoutubeCircular,
} from "react-icons/ti";
import { FiPhoneCall } from "react-icons/fi";

function NavBar({ wishlistCount, cartCount, setWishlistCount, setCartCount }) {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState("");
    const [categoryValue, setCategoryValue] = useState("All");

    const searchClick = () =>
        navigate({
            pathname: "/products",
            search: `?search=${createSearchParams(
                searchValue
            )}&category=${createSearchParams(
                categoryValue
            )}&isCategory=${createSearchParams("false")}`,
        });

    return (
        <div className="NavBar">
            <div className="navbar-full-width">
                <div className="content navbar-container">
                    <Link to="/" className="navbar-logo-link">
                        <span className="navbar-logo">
                            Pet-<span className="green-text">Mart</span>
                        </span>
                    </Link>
                    <div className="navbar-search-container">
                        <select
                            className="navbar-category-select"
                            value={categoryValue}
                            onChange={(e) => setCategoryValue(e.target.value)}
                        >
                            <option value={"All"}>Tất cả danh mục</option>
                            <option value={"Thức ăn cho Chó"}>
                                Thức ăn cho Chó
                            </option>
                            <option value={"Trang phục cho Chó"}>
                                Trang phục cho Chó
                            </option>
                            <option value={"Đồ chơi cho Chó"}>
                                Đồ chơi cho Chó
                            </option>
                            <option value={"Thức ăn cho Mèo"}>
                                Thức ăn cho Mèo
                            </option>
                            <option value={"Trang phục cho Mèo"}>
                                Trang phục cho Mèo
                            </option>
                            <option value={"Đồ chơi cho Mèo"}>
                                Đồ chơi cho Mèo
                            </option>
                            <option value={"Chuồng, lồng nuôi"}>
                                Chuồng, lồng nuôi
                            </option>
                            <option value={"Dành cho Chuột"}>
                                Dành cho Chuột
                            </option>
                        </select>
                        <input
                            className="navbar-search-input"
                            placeholder="Tìm kiếm sản phẩm"
                            value={searchValue}
                            onChange={(event) =>
                                setSearchValue(event.target.value)
                            }
                            onKeyDown={(event) => {
                                if (event.key === "Enter") searchClick();
                            }}
                        />
                        <AiOutlineSearch
                            className="navbar-search-icon"
                            onClick={searchClick}
                        />
                    </div>
                    <div className="navbar-controller">
                        <Link to="/wishlist">
                            <div className="navbar-controller-item">
                                <AiOutlineHeart className="navbar-controller-icon" />
                                {wishlistCount > 0 && (
                                    <p className="navbar-controller-count">
                                        {wishlistCount}
                                    </p>
                                )}
                            </div>
                        </Link>
                        <Link to="/cart">
                            <div className="navbar-controller-item">
                                <AiOutlineShoppingCart className="navbar-controller-icon" />
                                {cartCount > 0 && (
                                    <p className="navbar-controller-count">
                                        {cartCount}
                                    </p>
                                )}
                            </div>
                        </Link>
                        <Link
                            to="/account/profile"
                            className="navbar-controller-item"
                        >
                            <AiOutlineUser className="navbar-controller-icon" />
                        </Link>
                    </div>
                </div>
            </div>
            <div className="navbar-full-width height-60">
                <div className="content navbar-menu-container">
                    <ul className="navbar-menu-list">
                        <Link to="/">
                            <li className="navbar-menu-item">Trang chủ</li>
                        </Link>
                        <Link to="/account/buy-orders">
                            <li className="navbar-menu-item">Đơn mua</li>
                        </Link>
                        <Link to="/account/sell-orders">
                            <li className="navbar-menu-item">Đơn bán</li>
                        </Link>
                        <Link to="/account/store">
                            <li className="navbar-menu-item">Cửa hàng</li>
                        </Link>
                        <li className="navbar-menu-item">Giới thiệu</li>
                        <li className="navbar-menu-item">Liên hệ</li>
                    </ul>
                    <div className="navbar-contact">
                        <div className="navbar-social">
                            <TiSocialFacebookCircular className="navbar-social-icon" />
                            <TiSocialInstagram className="navbar-social-icon" />
                            <TiSocialTwitterCircular className="navbar-social-icon" />
                            <TiSocialYoutubeCircular className="navbar-social-icon" />
                        </div>
                        <div className="navbar-phone">
                            <FiPhoneCall className="navbar-phone-icon" />
                            <div className="navbar-phone-info">
                                <span className="navbar-phone-number">
                                    (+84) 935 0032 14
                                </span>
                                <span className="navbar-phone-desc">
                                    8AM - 17PM
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NavBar;
