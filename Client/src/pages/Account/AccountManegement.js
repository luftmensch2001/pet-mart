import React, { useEffect, useState } from "react";
import "./AccountManagement.css";
import accountImg from "../../assets/images/illustrations/undraw_Access_account_re_8spm.png";
import avatar from "../../assets/images/avatar.png";
import axios from "axios";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";

function AccountManagement() {
    const [userData, setUserData] = useState();
    const [isLoaded, setIsLoaded] = useState(false);
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [rePassword, setRePassword] = useState("");

    useEffect(() => {
        setIsLoaded(false);
        axios
            .get("http://localhost:5000/api/accounts/getInfo", {
                params: {
                    accountId: localStorage.getItem("accountID"),
                },
            })
            .then((res) => {
                setUserData(res.data.userId);
                setIsLoaded(true);
            })
            .catch((err) => console.log(err));
    }, []);

    const ChangePassword = () => {
        if (newPassword !== rePassword) {
            toast.warn("Mật khẩu không khớp!", {
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
        if (newPassword === password) {
            toast.warn("Mật khẩu mới phải khác mật khẩu cũ!", {
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
            .put("http://localhost:5000/api/accounts/changePassword", {
                accountId: localStorage.getItem("accountID"),
                oldPassword: password,
                newPassword: newPassword,
            })
            .then(() => {
                toast.success("Thay đổi mật khẩu thành công!", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            })
            .catch((err) => {
                console.log("err: ", err);
                if (err.response.data.message === "oldPassword not correct")
                    toast.error("Mật khẩu hiện tại chưa chính xác!", {
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

    if (isLoaded)
        return (
            <div className="AccountManagement">
                <img className="account-img" src={accountImg} />
                <div className="account-info">
                    <div className="account-head">
                        <img
                            className="account-avatar"
                            src={userData.imageURL ? userData.imageURL : avatar}
                        />
                        <span className="account-name">
                            {userData.fullName}
                        </span>
                    </div>
                    <div className="account-change-container">
                        <div className="account-change-item">
                            <label for="username">Tên đăng nhập</label>
                            <input
                                className="accout-input"
                                type="text"
                                value={userData.username}
                                disabled="disabled"
                                id="username"
                            />
                        </div>
                        <div className="account-change-item">
                            <label for="password">Mật khẩu hiện tại</label>
                            <input
                                className="accout-input"
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mật khẩu hiện tại"
                            />
                        </div>
                        <div className="account-change-item">
                            <label for="new-password">Mật khẩu mới</label>
                            <input
                                className="accout-input"
                                type="password"
                                id="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Mật khẩu mới"
                            />
                        </div>
                        <div className="account-change-item">
                            <label for="re-new-password">
                                Nhập lại mật khẩu mới
                            </label>
                            <input
                                className="accout-input"
                                type="password"
                                id="re-new-password"
                                value={rePassword}
                                onChange={(e) => setRePassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu mới"
                            />
                        </div>
                    </div>
                    <button
                        className="change-password-button primary-button"
                        onClick={ChangePassword}
                    >
                        Đổi mật khẩu
                    </button>
                </div>
            </div>
        );
    else return <Loading />;
}

export default AccountManagement;
