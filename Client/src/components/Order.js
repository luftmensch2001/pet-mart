import React from "react";
import "./Order.css";
import StatusLabel from "./StatusLabel";
import ThousandSeparator from "./ThousandSeparator";
import { Link } from "react-router-dom";

function Order(props) {
    const data = props.data;
    const isBuyOrder = props.isBuyOrder;
    const url = isBuyOrder
        ? `/buy-order/${data._id}`
        : `/sell-order/${data._id}`;

    function DateToString(myDate) {
        const yyyy = myDate.getFullYear();
        let mm = myDate.getMonth() + 1; // Months start at 0!
        let dd = myDate.getDate();

        if (dd < 10) dd = "0" + dd;
        if (mm < 10) mm = "0" + mm;
        const formattedDate = dd + "/" + mm + "/" + yyyy;
        return formattedDate;
    }

    return (
        <Link to={url}>
            <div className="Order">
                <span className="order-col c1">
                    {DateToString(new Date(data.createdAt))}
                </span>
                <div className="order-col c2 product-container">
                    <img className="product-img" src={data.imageURL} />
                    <span className="product-name">{data.nameProduct}</span>
                </div>
                <span className="order-col c3">{data.count}</span>
                <span className="order-col c4">
                    {ThousandSeparator(data.totalPrice)} VNĐ
                </span>
                <span className="order-col c5">
                    <StatusLabel type={data.state} />
                </span>
                <span className="order-product-count">
                    Đơn hàng gồm {data.productCount} sản phẩm
                </span>
            </div>
        </Link>
    );
}

export default Order;
