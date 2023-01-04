import React, { useEffect, useState } from "react";
import "./SelectTypeDialog.css";
import axios from "axios";
import { toast } from "react-toastify";

const SelectTypeDialog = ({ product, closeFunction, id, UpdateNavbar }) => {
    console.log("id: ", id);
    console.log("productId: ", product);

    const value = id ? id : product._id;
    console.log("value: ", value);
    // productId = "63ae92e236aeb06002c3b800";

    const [selectedType, setSelectedType] = useState("");
    const [typeData, setTypeData] = useState([]);

    const AddToCart = () => {
        axios
            .post("http://localhost:5000/api/productInCarts/create", {
                accountId: localStorage.getItem("accountID"),
                productId: value,
                color: selectedType,
                count: 1,
            })
            .then((res) => {
                toast.success("Đã thêm vào Giỏ hàng!", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                UpdateNavbar();
                closeFunction();
            })
            .catch((err) => console.log("err: ", err));
    };

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/colors", {
                params: {
                    productId: value,
                },
            })
            .then((res) => {
                console.log("res: ", res);
                setTypeData(res.data.colors);
                if (res.data.colors.length > 0)
                    setSelectedType(res.data.colors[0].name);
            })
            .catch((err) => console.log("type error", err));
    }, []);

    return (
        <div className="SelectypeDialog">
            <div className="select-type-container">
                <span>Vui lòng chọn phân loại hàng:</span>
                <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                >
                    {typeData?.map((item) => (
                        <option value={item.name}>{item.name}</option>
                    ))}
                </select>
                <div className="buttons">
                    <button className="yes-button" onClick={AddToCart}>
                        Thêm vào Giỏ
                    </button>
                    <button className="no-button" onClick={closeFunction}>
                        Huỷ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectTypeDialog;
