import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";
import "./AddProduct.css";
import { BsCheckLg } from "react-icons/bs";
import axios from "axios";
import { storage } from "../../components/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { Navigate } from "react-router-dom";
import Loading from "../../components/Loading";

const AddProduct = () => {
    const [types, setTypes] = useState([]);
    const [sale, setSale] = useState(false);
    const [typeName, setTypeName] = useState("");
    const [mainImage, setMainImage] = useState(null);
    const [otherImage, setOtherImage] = useState([]);
    const [productName, setProductName] = useState("");
    const [productCategory, setProductCategory] = useState("Thức ăn cho Chó");
    const [productPrice, setProductPrice] = useState("");
    const [productSalePrice, setProductSalePrice] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [addSuccess, setAddSuccess] = useState(false);
    const [isLoaded, setIsLoaded] = useState(true);
    let imageCount = 0;
    let currentImageCount = 0;
    let urls = [];
    let mainImageURL = "";

    const TypeNameInputOnchange = (event) => {
        setTypeName(event.target.value);
    };

    const AddTypeButtonOnClick = () => {
        if (typeName.trim() === "") return;
        let newID = types.length > 0 ? types[types.length - 1].id + 1 : 0;
        let item = { name: typeName, id: newID };
        setTypes(types.concat(item));
        setTypeName("");
        toast.success("Thêm thành công!", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const TypeNameInputOnKeyDown = (event) => {
        if (event.key !== "Enter") return;
        if (typeName.trim() === "") return;
        let newID = types.length > 0 ? types[types.length - 1].id + 1 : 0;
        let item = { name: typeName, id: newID };
        setTypes(types.concat(item));
        setTypeName("");
        toast.success("Thêm thành công!", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const RemoveTypeButtonOnClick = (ID) => {
        setTypes(
            types.filter((item) => {
                return item.id !== ID;
            })
        );
    };

    const OtherImageOnChange = (event) => {
        if (otherImage.length + event.target.files.length > 4) {
            toast.error("Chỉ được thêm tối đa 4 ảnh!", {
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
        setOtherImage([...otherImage, ...event.target.files]);
    };

    const createFunc = () => {
        const accountID = localStorage.getItem("accountID");
        const saleValue = productSalePrice ? productSalePrice : 0;
        let formData = new FormData();
        formData.append("accountId", accountID);
        formData.append("nameProduct", productName);
        formData.append("price", productPrice);
        formData.append("describe", productDescription);
        formData.append("type", productCategory);
        formData.append("salePrice", saleValue);

        const imageURLs = [mainImageURL].concat(urls);
        imageURLs.forEach((item) => formData.append("imageURLs[]", item));

        axios
            .post("http://localhost:5000/api/products/create", formData, {
                headers: {
                    "content-type": "multipart/form-data",
                },
            })
            .then((res) => {
                UploadColor(res.data.productID);
                toast.success("Thêm sản phẩm thành công", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setAddSuccess(true);
            })
            .catch((err) => {
                if (err.response.data.message === "Missing information") {
                    toast.info("Vui lòng nhập đầy đủ thông tin!", {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                } else
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
            })
            .finally(() => setIsLoaded(true));
    };

    const UpLoadImages = (createFunc) => {
        urls = [];
        // Main Image
        if (!mainImage) return;
        const imageRef = ref(storage, `images/${mainImage.name + v4()}`);
        uploadBytes(imageRef, mainImage)
            .then(() => {
                getDownloadURL(imageRef).then((url) => {
                    // urls.push(url);
                    mainImageURL = url;
                    currentImageCount++;
                    if (currentImageCount === imageCount) createFunc();
                });
            })
            .catch((err) => console.log(err));
        // Other Images
        otherImage.forEach((item) => {
            const imageRef = ref(storage, `images/${item.name + v4()}`);
            uploadBytes(imageRef, item)
                .then(() => {
                    getDownloadURL(imageRef).then((url) => {
                        urls.push(url);
                        currentImageCount++;
                        if (currentImageCount === imageCount) createFunc();
                    });
                })
                .catch((err) => console.log(err));
        });
    };

    const UploadColor = (productID) => {
        types.forEach((item) => {
            axios
                .post("http://localhost:5000/api/colors/create", {
                    productId: productID,
                    name: item.name,
                })
                .then((res) => console.log(res))
                .catch((err) => console.log(err));
        });
    };

    const AddProductOnClick = () => {
        if (!mainImage) {
            toast.info("Vui lòng thêm hình ảnh cho sản phẩm!", {
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
        if (!productName || !productPrice || !productDescription) {
            toast.info("Vui lòng nhập đầy đủ thông tin!", {
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
        if (sale && !productSalePrice) {
            toast.info("Vui lòng nhập đầy đủ thông tin!", {
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
        window.scrollTo(0, 0);
        setIsLoaded(false);
        imageCount = otherImage.length + 1;
        UpLoadImages(createFunc);
    };
    if (isLoaded)
        return (
            <div className="AddProduct content">
                {addSuccess && <Navigate to="/account/store" />}
                <span className="title-text">
                    Thêm <span className="green-text">Sản Phẩm</span>
                </span>
                <div className="add-product-wrapper">
                    <div className="product-info-container">
                        <div className="product-info-row">
                            <span className="product-info-label">
                                Tên sản phẩm:
                            </span>
                            <input
                                className="product-info-input"
                                type="text"
                                placeholder="Nhập tên sản phẩm"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                            />
                        </div>
                        <div className="product-info-row">
                            <span className="product-info-label">
                                Danh mục:
                            </span>
                            <select
                                className="product-info-input"
                                style={{
                                    width: "fit-content",
                                    minWidth: "35%",
                                    cursor: "pointer",
                                }}
                                value={productCategory}
                                onChange={(e) =>
                                    setProductCategory(e.target.value)
                                }
                            >
                                <option value={"Thức ăn cho Chó"}>
                                    Thức ăn cho Chó
                                </option>
                                <option value={"Trang phục cho Chó"}>
                                    Trang phục cho Chó
                                </option>
                                <option value={"Đồ chơi cho Chó"}>
                                    Đồ chơi cho Chó
                                </option>
                                <option value={"Thức ăn cho Mèo"}>
                                    Thức ăn cho Mèo
                                </option>
                                <option value={"Trang phục cho Mèo"}>
                                    Trang phục cho Mèo
                                </option>
                                <option value={"Đồ chơi cho Mèo"}>
                                    Đồ chơi cho Mèo
                                </option>
                                <option value={"Chuồng, lồng nuôi"}>
                                    Chuồng, lồng nuôi
                                </option>
                                <option value={"Dành cho Chuột"}>
                                    Dành cho Chuột
                                </option>
                            </select>
                        </div>
                        <div className="product-info-row">
                            <span className="product-info-label">
                                Giá <span>(VNĐ)</span>:
                            </span>
                            <input
                                className="product-info-input"
                                type="number"
                                value={productPrice}
                                onChange={(e) =>
                                    setProductPrice(e.target.value)
                                }
                            />
                        </div>
                        {/* Sale */}
                        <div className="product-info-row">
                            <div
                                style={{
                                    width: "25%",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    style={{
                                        width: "15px",
                                        height: "15px",
                                        marginRight: "8px",
                                        cursor: "pointer",
                                    }}
                                    value={sale}
                                    onChange={() => {
                                        setProductSalePrice("");
                                        setSale(!sale);
                                    }}
                                />
                                <span
                                    className="product-info-label"
                                    style={{ width: "fit-content" }}
                                >
                                    Đã giảm giá
                                </span>
                            </div>
                            <input
                                className="product-info-input"
                                type="number"
                                disabled={!sale}
                                placeholder="Nhập giá cũ"
                                value={productSalePrice}
                                onChange={(e) =>
                                    setProductSalePrice(e.target.value)
                                }
                            />
                        </div>
                        <div className="product-info-row-detail">
                            <span className="product-info-label">
                                Mô tả sản phẩm:
                            </span>
                            <textarea
                                placeholder="Mô tả chi tiết sản phẩm"
                                value={productDescription}
                                onChange={(e) =>
                                    setProductDescription(e.target.value)
                                }
                            />
                        </div>
                        <div className="product-type-wrapper">
                            <span className="title">Phân loại sản phẩm:</span>
                            <div className="add-type-container">
                                <input
                                    type="text"
                                    placeholder="Tên phân loại hàng"
                                    value={typeName}
                                    onChange={TypeNameInputOnchange}
                                    onKeyDown={TypeNameInputOnKeyDown}
                                />
                                <button
                                    className="primary-button"
                                    onClick={AddTypeButtonOnClick}
                                >
                                    Thêm
                                </button>
                            </div>
                            <div className="type-container">
                                {types.length > 0 ? (
                                    types.map((item) => (
                                        <div className="type-item">
                                            <span className="type-name">
                                                {item.name}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    RemoveTypeButtonOnClick(
                                                        item.id
                                                    )
                                                }
                                            >
                                                <RiDeleteBin6Line className="icon" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <h2 className="no-type">
                                        Chưa có phân loại nào
                                    </h2>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="product-image-container">
                        <span className="title">Hình ảnh sản phẩm</span>
                        <div className="row">
                            <span className="label">Ảnh chính</span>
                            <div className="image-container">
                                {mainImage ? (
                                    <img
                                        src={URL.createObjectURL(mainImage)}
                                        className="main-image"
                                        alt="Chưa có ảnh nào"
                                    />
                                ) : (
                                    <h2
                                        style={{
                                            textAlign: "center",
                                            margin: "60px 0",
                                            display: "block",
                                            lineHeight: "30px",
                                            opacity: "0.7",
                                        }}
                                    >
                                        Chưa có ảnh nào
                                    </h2>
                                )}
                                <input
                                    type="file"
                                    name="myImage"
                                    onChange={(event) => {
                                        setMainImage(event.target.files[0]);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <span className="label">Ảnh khác</span>
                            <div className="image-container">
                                {otherImage.length > 0 ? (
                                    <div className="other-image-container">
                                        {otherImage.map((item) => (
                                            <img
                                                src={URL.createObjectURL(item)}
                                                className="other-image"
                                                alt="Chưa có ảnh nào"
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <h2
                                        style={{
                                            textAlign: "center",
                                            margin: "80px 0",
                                            display: "block",
                                            lineHeight: "30px",
                                            opacity: "0.7",
                                        }}
                                    >
                                        Chưa có ảnh nào
                                        <br />
                                        Thêm tối đa 4 ảnh
                                    </h2>
                                )}
                                <input
                                    type="file"
                                    multiple
                                    name="myImage"
                                    onChange={OtherImageOnChange}
                                />
                                <button
                                    className="primary-button remove-other-image"
                                    onClick={() => setOtherImage([])}
                                >
                                    Xoá tất cả
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    className="complete-button primary-button"
                    onClick={AddProductOnClick}
                >
                    <BsCheckLg className="icon" />
                    Hoàn tất Thêm sản phẩm
                </button>
            </div>
        );
    else return <Loading />;
};

export default AddProduct;
