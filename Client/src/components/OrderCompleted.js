import React from "react";
import "./OrderCompleted.css";
import img from "../assets/images/illustrations/orderConfirmed.svg";
import { Link } from "react-router-dom";
const OrderCompleted = () => {
    return (
        <div className="OrderCompleted">
            <img src={img} alt="image" />
            <h1>
                Đặt hàng <span className="green-text">Thành công</span>
            </h1>
            <h2>
                Bạn có thể theo dõi đơn hàng trong mục{" "}
                <span className="green-text">Đơn mua</span>
            </h2>
            <Link to="/">
                <button className="primary-button">Trở về trang chủ</button>
            </Link>
        </div>
    );
};

export default OrderCompleted;
