import { React, useEffect, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import axios from "axios";
import "./ProfileTab.css";
import { storage } from "../../components/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

import cover from "../../assets/images/cover.jpg";
import avatar from "../../assets/images/avatar.png";

import { AiOutlineCamera } from "react-icons/ai";
import Loading from "../../components/Loading";

function notifyReadOnly() {
    toast.warn("Không thể sửa tên đăng nhập!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}

function ProfileTab() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [userData, setUserData] = useState();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    let avatarURL = "";

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
                setFullName(res.data.userId.fullName);
                setEmail(res.data.userId.email);
                setPhoneNumber(res.data.userId.phoneNumber);
                setIsLoaded(true);
            })
            .catch((err) => console.log(err));
    }, []);

    const Refetch = () => {
        window.scrollTo(0, 0);
        setIsLoaded(false);
        axios
            .get("http://localhost:5000/api/accounts/getInfo", {
                params: {
                    accountId: localStorage.getItem("accountID"),
                },
            })
            .then((res) => {
                setUserData(res.data.userId);
                setFullName(res.data.userId.fullName);
                setEmail(res.data.userId.email);
                setPhoneNumber(res.data.userId.phoneNumber);
                setIsLoaded(true);
            })
            .catch((err) => console.log(err));
    };

    function UpdateAccount(avatarURL) {
        if (avatarURL === "") avatarURL = userData.imageURL;
        axios
            .put("http://localhost:5000/api/accounts/updateInfo", {
                accountId: localStorage.getItem("accountID"),
                fullName: fullName,
                phoneNumber: phoneNumber,
                email: email,
                imageURL: avatarURL,
            })
            .then((res) => {
                console.log(res);
                toast.success("Lưu thông tin thành công!", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                Refetch();
            })
            .catch((err) =>
                toast.error("Lỗi không xác định!", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                })
            );
    }

    function SaveInfo() {
        if (selectedImage) {
            const imageRef = ref(
                storage,
                `avatar/${selectedImage.name + v4()}`
            );
            uploadBytes(imageRef, selectedImage)
                .then(() => {
                    getDownloadURL(imageRef).then((url) => {
                        avatarURL = url;
                        UpdateAccount(avatarURL);
                    });
                })
                .catch((err) => console.log(err));
        } else {
            UpdateAccount(avatarURL);
        }
    }

    if (isLoaded)
        return (
            <div className="ProfileTab">
                <img alt="" className="profile-cover-img" src={cover} />
                <div className="profile-container">
                    <img
                        alt=""
                        className="profile-avatar-img"
                        src={userData.imageURL ? userData.imageURL : avatar}
                    />
                    <button className="profile-change-cover-button">
                        <AiOutlineCamera className="profile-change-cover-icon" />
                    </button>
                    <span className="profile-name">{userData.fullName}</span>

                    <div className="profile-left">
                        <span className="coin-label green-text">E-Coin</span>
                        <p className="profile-left-label">Tên đăng nhập</p>
                        <p className="profile-left-label">Họ và tên</p>
                        <p className="profile-left-label">Địa chỉ E-mail</p>
                        <p className="profile-left-label">Số điện thoại</p>
                        <p className="profile-left-label">
                            Thay đổi ảnh đại diện
                        </p>
                    </div>
                    <div className="profile-right">
                        <span className="coin-label green-text">
                            {userData.coin}
                        </span>
                        <input
                            className="profile-input profile-username-input"
                            type="text"
                            value={userData.username}
                            readOnly="readOnly"
                            onClick={notifyReadOnly}
                            onChange={() => {}}
                        />
                        <input
                            className="profile-input"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                        <input
                            className="profile-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className="profile-input"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <div className="profile-change-avatar-container">
                            {selectedImage && (
                                <img
                                    alt="not fount"
                                    className="profile-change-avatar-img"
                                    src={URL.createObjectURL(selectedImage)}
                                />
                            )}
                            <input
                                className="profile-upload-button"
                                type="file"
                                name="myImage"
                                onChange={(event) => {
                                    setSelectedImage(event.target.files[0]);
                                }}
                            />
                        </div>
                        <button
                            className="profile-save-button primary-button"
                            onClick={SaveInfo}
                        >
                            Lưu thông tin
                        </button>
                    </div>
                </div>
            </div>
        );
    else return <Loading />;
}

export default ProfileTab;
