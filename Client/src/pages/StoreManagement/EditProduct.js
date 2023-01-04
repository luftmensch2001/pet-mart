import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineSave } from "react-icons/ai";
import { toast } from "react-toastify";
import "./AddProduct.css";
import { BsCheckLg } from "react-icons/bs";
import axios from "axios";
import { storage } from "../../components/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { Navigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import NotFound from "../../components/NotFound";

const EditProduct = () => {
    const [types, setTypes] = useState([]);
    const [sale, setSale] = useState(false);
    const [typeName, setTypeName] = useState("");
    const [mainImage, setMainImage] = useState(null);
    const [otherImage, setOtherImage] = useState([]);
    const [productName, setProductName] = useState("");
    const [productCategory, setProductCategory] = useState("Điện thoại");
    const [productPrice, setProductPrice] = useState("");
    const [productSalePrice, setProductSalePrice] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [addSuccess, setAddSuccess] = useState(false);
    const [foundProduct, setFoundProduct] = useState(true);
    const [isLoaded, setIsLoaded] = useState(true);
    const productID = useParams().productId;
    let imageCount = 0;
    let currentImageCount = 0;
    let urls = [];
    let mainImageURL = "";

    useEffect(() => {
        window.scrollTo(0, 0);
        let counter = 0;
        setIsLoaded(false);
        // Get product data
        axios
            .get("http://localhost:5000/api/products/byProductId", {
                params: {
                    productId: productID,
                },
            })
            .then((res) => {
                setProductName(res.data.product.nameProduct);
                setProductCategory(res.data.product.type);
                setProductPrice(res.data.product.price);
                if (res.data.product.salePrice > 0) {
                    setProductSalePrice(res.data.product.salePrice);
                    setSale(true);
                }
                setMainImage(res.data.product.imageURLs[0]);
                setProductDescription(res.data.product.describe);
                setOtherImage(res.data.product.imageURLs.slice(1));
                counter++;
                if (counter === 2) setIsLoaded(true);
            })
            .catch(() => setFoundProduct(false));
        // Get type data
        axios
            .get("http://localhost:5000/api/colors", {
                params: {
                    productId: productID,
                },
            })
            .then((res) => {
                // setTypeData(res.data.colors);
                const arrTypes = [];
                res.data.colors.forEach((item) => {
                    let newID =
                        arrTypes.length > 0
                            ? arrTypes[arrTypes.length - 1].id + 1
                            : 0;
                    let newItem = { name: item.name, id: newID };
                    arrTypes.push(newItem);
                });
                setTypes(arrTypes);
                counter++;
                if (counter === 2) setIsLoaded(true);
            })
            .catch((err) => console.log(err));
    }, []);

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
        const saleValue = productSalePrice ? productSalePrice : 0;
        let formData = new FormData();
        formData.append("productId", productID);
        formData.append("nameProduct", productName);
        formData.append("price", productPrice);
        formData.append("describe", productDescription);
        formData.append("type", productCategory);
        formData.append("salePrice", saleValue);

        const imageURLs = [mainImageURL].concat(urls);
        imageURLs.forEach((item) => formData.append("imageURLs[]", item));

        axios
            .put("http://localhost:5000/api/products/update", formData, {
                headers: {
                    "content-type": "multipart/form-data",
                },
            })
            .then((res) => {
                // UploadColor(res.data.productID);
                toast.success("Cập nhật thông tin thành công", {
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
                console.log("err: ", err);
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
        if (typeof mainImage !== "string") {
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
        } else {
            mainImageURL = mainImage;
            currentImageCount++;
            if (currentImageCount === imageCount) createFunc();
        }
        // Other Images
        otherImage.forEach((item) => {
            if (typeof item === "string") {
                // is url
                urls.push(item);
                currentImageCount++;
                if (currentImageCount === imageCount) createFunc();
            } else {
                // is not url
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
            }
        });
    };

    const UploadColor = (productID) => {
        console.log("productID: ", productID);
        axios
            .delete("http://localhost:5000/api/colors/byProductId", {
                params: {
                    productId: productID,
                },
            })
            .then((res) => {
                console.log(res);
                types.forEach((item) => {
                    axios
                        .post("http://localhost:5000/api/colors/create", {
                            productId: productID,
                            name: item.name,
                        })
                        .then((res) => console.log(res))
                        .catch((err) => console.log(err));
                });
            })
            .catch((err) => console.log(err));
    };

    const AddProductOnClick = () => {
        console.log("mainImage: ", mainImage);
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
        console.log("imageCount: ", imageCount);
        UploadColor(productID);
        UpLoadImages(createFunc);
    };
    if (!foundProduct) return <NotFound />;

    if (isLoaded)
        return (
            <div className="AddProduct content">
                {addSuccess && <Navigate to="/account/store" />}
                <span className="title-text">
                    Chỉnh Sửa <span className="green-text">Sản Phẩm</span>
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
                                <option value={"Điện thoại"}>Điện thoại</option>
                                <option value={"Laptop"}>Laptop</option>
                                <option value={"Thời trang nam"}>
                                    Thời trang nam
                                </option>
                                <option value={"Thời trang nữ"}>
                                    Thời trang nữ
                                </option>
                                <option value={"Trang sức"}>Trang sức</option>
                                <option value={"Thiết bị điện tử"}>
                                    Thiết bị điện tử
                                </option>
                                <option value={"Nhà bếp"}>Nhà bếp</option>
                                <option value={"Giày nam"}>Giày nam</option>
                                <option value={"Giày nữ"}>Giày nữ</option>
                                <option value={"Sách"}>Sách</option>
                                <option value={"Đồng hồ"}>Đồng hồ</option>
                                <option value={"Cho bé"}>Cho bé</option>
                                <option value={"Sức khoẻ"}>Sức khoẻ</option>
                                <option value={"Mỹ phẩm"}>Mỹ phẩm</option>
                                <option value={"Dụng cụ gia đình"}>
                                    Dụng cụ gia đình
                                </option>
                                <option value={"Khác"}>Khác</option>
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
                                    checked={sale}
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
                                        src={
                                            typeof mainImage === "string"
                                                ? mainImage
                                                : URL.createObjectURL(mainImage)
                                        }
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
                                                src={
                                                    typeof item === "string"
                                                        ? item
                                                        : URL.createObjectURL(
                                                              item
                                                          )
                                                }
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
                    className="complete-button primary-button save-button"
                    onClick={AddProductOnClick}
                >
                    <AiOutlineSave className="icon" />
                    Lưu thông tin sản phẩm
                </button>
            </div>
        );
    else return <Loading />;
};

export default EditProduct;
