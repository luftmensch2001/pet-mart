import React from "react";
import "./NotFound.css";
import notFound from "../assets/images/illustrations/notfound.svg";

const NotFound = () => {
    return (
        <div className="NotFound">
            <img src={notFound} />
            <span>Không tìm thấy trang</span>
        </div>
    );
};

export default NotFound;
