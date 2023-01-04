import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "./Register.css";
import { toast } from "react-toastify";
import axios from "axios";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [registerSuccess, setRegisterSuccess] = useState(false);
    const gender = "MALE";

    const HandleClickRegister = () => {
        setRegisterSuccess(false);
        if (password !== rePassword) {
            toast.error("Mật khẩu không khớp!", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }
        axios
            .post("http://localhost:5000/api/accounts/register", {
                username: username,
                password: password,
                fullName: fullName,
                email: email,
                phoneNumber: phoneNumber,
                sex: gender,
            })
            .then((res) => {
                toast.success("Đăng ký thành công!", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setRegisterSuccess(true);
            })
            .catch((err) => {
                if (err.response.data.message === "Username already")
                    toast.error("Tài khoản đã tồn tại!", {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                else if (err.response.data.message === "Missing information")
                    toast.warning("Vui lòng nhập đầy đủ thông tin!", {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                else
                    toast.error("Lỗi kết nối!", {
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
        <div className="Register">
            {registerSuccess && <Navigate to="/login" />}
            <div className="register-card">
                <span className="title-text register-logo">
                    E-<span className="green-text">Mart</span>
                </span>
                <p className="register-head-text">
                    Đăng ký và thoả sức mua sắm ngay
                </p>
                <input
                    className="register-input"
                    type="text"
                    placeholder="Họ và tên"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                />
                <input
                    className="register-input"
                    type="email"
                    placeholder="Địa chỉ E-mail"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
                <input
                    className="register-input"
                    type="number"
                    placeholder="Số điện thoại"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                />
                <input
                    className="register-input"
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />
                <input
                    className="register-input"
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <input
                    className="register-input"
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={rePassword}
                    onChange={(event) => setRePassword(event.target.value)}
                />
                <button
                    className="register-button primary-button"
                    onClick={HandleClickRegister}
                >
                    Đăng Ký
                </button>

                <span className="register-second-text">
                    Bạn đã có tài khoản ?
                    <Link to="/login">
                        <span className="register-bold-text">
                            {" "}
                            Đăng nhập ngay
                        </span>
                    </Link>
                </span>
            </div>
        </div>
    );
}

export default Register;
