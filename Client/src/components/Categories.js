import React from "react";
import "./Categories.css";
import { useNavigate, createSearchParams } from "react-router-dom";

import thoitrangnam from "../assets/images/catagories/thoitrangnam.png";
import thoitrangnu from "../assets/images/catagories/thoitrangnu.png";
import dongho from "../assets/images/catagories/dongho.png";
import dungcugiadinh from "../assets/images/catagories/dungcugiadinh.png";
import embe from "../assets/images/catagories/embe.png";
import giaynam from "../assets/images/catagories/giaynam.png";
import giaynu from "../assets/images/catagories/giaynu.png";
import lamdep from "../assets/images/catagories/lamdep.png";
import laptop from "../assets/images/catagories/laptop.png";
import nhabep from "../assets/images/catagories/nhabep.png";
import other from "../assets/images/catagories/other.png";
import sach from "../assets/images/catagories/sach.png";
import smartphone from "../assets/images/catagories/smartphone.png";
import suckhoe from "../assets/images/catagories/suckhoe.png";
import thietbidientu from "../assets/images/catagories/thietbidientu.png";
import trangsuc from "../assets/images/catagories/trangsuc.png";

function Categories() {
    const navigate = useNavigate();

    const GoToCategory = (category) => {
        window.scrollTo(0, 0);
        navigate({
            pathname: "/products",
            search: `?search=${createSearchParams(
                category
            )}&category=${createSearchParams(
                category
            )}&isCategory=${createSearchParams("true")}`,
        });
    };

    return (
        <div className="categories content">
            <p className="title-text">
                Danh mục <span className="green-text">Sản phẩm</span>
            </p>
            <div className="categories-list">
                <div
                    className="category-item"
                    onClick={() => GoToCategory("Thời trang nam")}
                >
                    <img className="category-img" src={thoitrangnam} alt="" />
                    <span className="category-name">Thời trang nam</span>
                </div>

                <div
                    className="category-item"
                    onClick={() => GoToCategory("Điện thoại")}
                >
                    <img className="category-img" src={smartphone} alt="" />
                    <span className="category-name">Điện thoại</span>
                </div>
                <div
                    className="category-item"
                    onClick={() => GoToCategory("Laptop")}
                >
                    <img className="category-img" src={laptop} alt="" />
                    <span className="category-name">Laptop</span>
                </div>
                <div
                    className="category-item"
                    onClick={() => GoToCategory("Thiết bị điện tử")}
                >
                    <img className="category-img" src={thietbidientu} alt="" />
                    <span className="category-name">Thiết bị điện tử</span>
                </div>
                <div
                    className="category-item"
                    onClick={() => GoToCategory("Giày nam")}
                >
                    <img className="category-img" src={giaynam} alt="" />
                    <span className="category-name">Giày nam</span>
                </div>
                <div
                    className="category-item"
                    onClick={() => GoToCategory("Sách")}
                >
                    <img className="category-img" src={sach} alt="" />
                    <span className="category-name">Sách</span>
                </div>
                <div
                    className="category-item"
                    onClick={() => GoToCategory("Đồng hồ")}
                >
                    <img className="category-img" src={dongho} alt="" />
                    <span className="category-name">Đồng hồ</span>
                </div>
                <div
                    className="category-item"
                    onClick={() => GoToCategory("Dụng cụ gia đình")}
                >
                    <img className="category-img" src={dungcugiadinh} alt="" />
                    <span className="category-name">Dụng cụ gia đình</span>
                </div>
                <div
                    className="category-item"
                    onClick={() => GoToCategory("Thời trang nữ")}
                >
                    <img className="category-img" src={thoitrangnu} alt="" />
                    <span className="category-name">Thời trang nữ</span>
                </div>
                <div
                    className="category-item"
                    onClick={() => GoToCategory("Trang sức")}
                >
                    <img className="category-img" src={trangsuc} alt="" />
                    <span className="category-name">Trang sức</span>
                </div>
                <div
                    className="category-item"
                    onClick={() => GoToCategory("Mỹ phẩm")}
                >
                    <img className="category-img" src={lamdep} alt="" />
                    <span className="category-name">Mỹ phẩm</span>
                </div>
                <div
                    className="category-item"
                    onClick={() => GoToCategory("Nhà bếp")}
                >
                    <img className="category-img" src={nhabep} alt="" />
                    <span className="category-name">Nhà bếp</span>
                </div>
                <div
                    className="category-item"
                    onClick={() => GoToCategory("Giày nữ")}
                >
                    <img className="category-img" src={giaynu} alt="" />
                    <span className="category-name">Giày nữ</span>
                </div>
                <div
                    className="category-item"
                    onClick={() => GoToCategory("Sức khoẻ")}
                >
                    <img className="category-img" src={suckhoe} alt="" />
                    <span className="category-name">Sức khoẻ</span>
                </div>
                <div
                    className="category-item"
                    onClick={() => GoToCategory("Cho bé")}
                >
                    <img className="category-img" src={embe} alt="" />
                    <span className="category-name">Cho bé</span>
                </div>
                <div
                    className="category-item"
                    onClick={() => GoToCategory("Khác")}
                >
                    <img className="category-img" src={other} alt="" />
                    <span className="category-name">Khác</span>
                </div>
            </div>
        </div>
    );
}

export default Categories;
