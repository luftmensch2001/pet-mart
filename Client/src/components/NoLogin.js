import React from "react";
import "./NoLogin.css";
import loginImg from "../assets/images/illustrations/undraw_secure_login_pdn4.svg";
import { Link } from "react-router-dom";

const NoLogin = () => {
    return (
        <div className="NoLogin content">
            <img src={loginImg} />
            <span>
                Bạn chưa <span className="green-text">Đăng nhập</span>
            </span>
            <span>
                Hãy <span className="green-text">Đăng nhập</span> để trải nghiệm
                toàn bộ tính năng của E -
                <span className="green-text"> Mart</span>
            </span>
            <Link to="/login">
                <button className="primary-button login-now-button">
                    Đăng nhập ngay
                </button>
            </Link>
        </div>
    );
};

export default NoLogin;
