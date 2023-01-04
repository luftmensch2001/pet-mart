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
                            E-<span className="green-text">Mart</span>
                        </span>
                    </Link>
                    <div className="navbar-search-container">
                        <select
                            className="navbar-category-select"
                            value={categoryValue}
                            onChange={(e) => setCategoryValue(e.target.value)}
                        >
                            <option value={"All"}>Tất cả danh mục</option>
                            <option value={"Điện thoại"}>Điện thoại</option>
                            <option value={"Laptop"}>Laptop</option>
                            <option value={"Thời trang nam"}>
                                Thời trang nam
                            </option>
                            <option value={"Thời trang nữ"}>
                                Thời trang nữ
                            </option>
                            <option value={"Trang sức"}>Trang sức</option>
                            <option value={"Thiết bị điện tử"}>
                                Thiết bị điện tử
                            </option>
                            <option value={"Nhà bếp"}>Nhà bếp</option>
                            <option value={"Giày nam"}>Giày nam</option>
                            <option value={"Giày nữ"}>Giày nữ</option>
                            <option value={"Sách"}>Sách</option>
                            <option value={"Đồng hồ"}>Đồng hồ</option>
                            <option value={"Cho bé"}>Cho bé</option>
                            <option value={"Sức khoẻ"}>Sức khoẻ</option>
                            <option value={"Mỹ phẩm"}>Mỹ phẩm</option>
                            <option value={"Dụng cụ gia đình"}>
                                Dụng cụ gia đình
                            </option>
                            <option value={"Khác"}>Khác</option>
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
