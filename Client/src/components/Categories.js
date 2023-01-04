import React from "react";
import "./Categories.css";
import { useNavigate, createSearchParams } from "react-router-dom";

import thucanchocho from "../assets/images/catagories/thucancuacho.jpg";
import thucanchomeo from "../assets/images/catagories/thucancuameo.jpg";
import trangphuccho from "../assets/images/catagories/trangphuccho.png";
import trangphucmeo from "../assets/images/catagories/trangphucmeo.jpg";
import dochoicho from "../assets/images/catagories/dochoicho.png";
import dochoimeo from "../assets/images/catagories/dochoimeo.jpg";
import chuong from "../assets/images/catagories/chuongmeo.jpg";
import chuot from "../assets/images/catagories/mouse.jpg";

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
                    onClick={() => GoToCategory("Thức ăn cho Chó")}
                >
                    <img className="category-img" src={thucanchocho} alt="" />
                    <span className="category-name">Thức ăn cho Chó</span>
                </div>

                <div
                    className="category-item"
                    onClick={() => GoToCategory("Trang phục cho Chó")}
                >
                    <img className="category-img" src={trangphuccho} alt="" />
                    <span className="category-name">
                        Trang phục
                        <br />
                        cho Chó
                    </span>
                </div>
                <div
                    className="category-item"
                    onClick={() => GoToCategory("Đồ chơi cho Chó")}
                >
                    <img className="category-img" src={dochoicho} alt="" />
                    <span className="category-name">Đồ chơi cho Chó</span>
                </div>
                <div
                    className="category-item"
                    onClick={() => GoToCategory("Thức ăn cho Mèo")}
                >
                    <img className="category-img" src={thucanchomeo} alt="" />
                    <span className="category-name">
                        Thức ăn
                        <br />
                        cho Mèo
                    </span>
                </div>
                <div
                    className="category-item"
                    onClick={() => GoToCategory("Trang phục cho Mèo")}
                >
                    <img className="category-img" src={trangphucmeo} alt="" />
                    <span className="category-name">
                        Trang phục
                        <br />
                        cho Mèo
                    </span>
                </div>
                <div
                    className="category-item"
                    onClick={() => GoToCategory("Đồ chơi cho Mèo")}
                >
                    <img className="category-img" src={dochoimeo} alt="" />
                    <span className="category-name">Đồ chơi cho Mèo</span>
                </div>
                <div
                    className="category-item"
                    onClick={() => GoToCategory("Chuồng, lồng nuôi")}
                >
                    <img className="category-img" src={chuong} alt="" />
                    <span className="category-name">
                        Chuồng,
                        <br />
                        lồng nuôi
                    </span>
                </div>
                <div
                    className="category-item"
                    onClick={() => GoToCategory("Dành cho Chuột")}
                >
                    <img className="category-img" src={chuot} alt="" />
                    <span className="category-name">Dành cho Chuột</span>
                </div>
            </div>
        </div>
    );
}

export default Categories;
