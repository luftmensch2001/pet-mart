import React, { useEffect, useState } from "react";
import "./ProductDetail.css";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsCartPlus } from "react-icons/bs";
import axios from "axios";

import Loading from "../../components/Loading";
import ThousandSeparator from "../../components/ThousandSeparator";
import GetStarImage from "../../components/GetStarImage";
import NotFound from "../../components/NotFound";
import ConfirmDialog from "../../components/ConfirmDialog";
import avatar from "../../assets/images/avatar.png";

const ProductDetail = ({ UpdateNavbar }) => {
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [reviewData, setReviewData] = useState();
    const [isLoaded, setIsLoaded] = useState(false);
    const [productData, setProductData] = useState();
    const [typeData, setTypeData] = useState([]);
    const productID = useParams().productId;
    const [foundProduct, setFoundProduct] = useState(true);
    const [reviewContent, setReviewContent] = useState("");
    const [starVote, setStarVote] = useState(0);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [evaluteID, setEvaluteID] = useState();
    const [selectedType, setSelectedType] = useState();
    let counter = 0;

    useEffect(() => {
        window.scrollTo(0, 0);
        counter = 0;
        setIsLoaded(false);
        setIsFavorite(false);
        GetProductData();
        // Get type data
        axios
            .get("http://localhost:5000/api/colors", {
                params: {
                    productId: productID,
                },
            })
            .then((res) => {
                setTypeData(res.data.colors);
                if (res.data.colors.length > 0)
                    setSelectedType(res.data.colors[0].name);
                counter++;
                if (counter === 3) setIsLoaded(true);
            })
            .catch((err) => console.log("type error", err));
        // Get reviews data
        GetReviewData();
    }, [productID]);

    const GetProductData = () => {
        // Get product data
        axios
            .get("http://localhost:5000/api/products/byProductId", {
                params: {
                    productId: productID,
                },
            })
            .then((res) => {
                console.log("res: ", res);
                setProductData(res.data.product);
                counter++;
                if (counter === 3) setIsLoaded(true);
            })
            .catch(() => setFoundProduct(false));
    };

    const GetReviewData = () => {
        axios
            .get("http://localhost:5000/api/evalutes", {
                params: {
                    productId: productID,
                },
            })
            .then((res) => {
                // console.log("res review: ", res);
                setReviewData(res.data.evalutes);
                counter++;
                if (counter === 3) setIsLoaded(true);
            })
            .catch((err) => console.log(err));
    };

    const UpQuantityOnClick = () => {
        setQuantity(quantity + 1);
    };
    const DownQuantityOnClick = () => {
        if (quantity <= 1) {
            toast.error("Số lượng tối thiểu là 1", {
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
        setQuantity(quantity - 1);
    };

    const QuantityInputOnChange = (event) => {
        console.log(event.target.value);
        if (event.target.value === "-") return;
        if (event.target.value !== "" && event.target.value < 1) return;
        setQuantity(event.target.value * 1);
    };

    const AddToCart = () => {
        if (productData.accountId === localStorage.getItem("accountID")) {
            toast.error(
                "Không thể thêm sản phẩm trong Cửa hàng của bạn vào Giỏ hàng!",
                {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                }
            );
            return;
        }
        axios
            .post("http://localhost:5000/api/productInCarts/create", {
                accountId: localStorage.getItem("accountID"),
                productId: productID,
                color: selectedType,
                count: quantity,
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
            })
            .catch((err) => console.log("err: ", err));
    };

    const SendReview = () => {
        if (starVote === 0) {
            toast.warning("Bạn chưa vote sao!", {
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
            .post("http://localhost:5000/api/evalutes/create", {
                accountId: localStorage.getItem("accountID"),
                productId: productID,
                describe: reviewContent,
                star: starVote,
            })
            .then((res) => {
                toast.success("Đã gửi đánh giá!", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setReviewContent("");
                setStarVote(0);
                counter = 1;
                GetReviewData();
                GetProductData();
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
            });
    };

    const DeleteEvalute = () => {
        axios
            .delete("http://localhost:5000/api/evalutes/", {
                params: { evaluteId: evaluteID },
            })
            .then((res) => {
                toast.success("Xoá đánh giá thành công!", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                counter = 1;
                GetReviewData();
                GetProductData();
            })
            .catch((err) => {
                toast.error("Xoá không thành công!", {
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
        setShowDeleteDialog(false);
    };

    const AddToFavoriteOnChange = () => {
        if (productData.accountId === localStorage.getItem("accountID")) {
            toast.error(
                "Không thể thêm sản phẩm trong Cửa hàng của bạn vào Yêu thích!",
                {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                }
            );
            setIsFavorite(!isFavorite);
            return;
        }

        if (isFavorite) {
            // Add to favorite
            axios
                .post("http://localhost:5000/api/productInFavorites/create", {
                    accountId: localStorage.getItem("accountID"),
                    productId: productID,
                    color: selectedType,
                })
                .then((res) => {
                    console.log("res: ", res);
                    toast.success("Đã thêm vào Yêu thích!", {
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
                })
                .catch((err) => {
                    console.log("err: ", err);
                    toast.error("Thêm không thành công!", {
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
        } else {
            // Remove
            axios
                .delete(
                    "http://localhost:5000/api/productInFavorites/byProductIdAndAccountId",
                    {
                        params: {
                            accountId: localStorage.getItem("accountID"),
                            productId: productID,
                        },
                    }
                )
                .then((res) => {
                    console.log("res: ", res);
                    toast.success("Đã xoá khỏi Yêu thích!", {
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
                })
                .catch((err) => {
                    console.log("err: ", err);
                    toast.error("Xoá không thành công!", {
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
        }
    };

    if (!foundProduct) return <NotFound />;

    if (isLoaded)
        return (
            <div className="ProductDetail content">
                <div className="d-product-overview">
                    <div className="d-product-images">
                        <Carousel
                            thumbWidth="min(100px, 18%)"
                            showArrows={false}
                        >
                            {productData?.imageURLs.map((item) => (
                                <div>
                                    <img src={item} alt="" />
                                </div>
                            ))}
                        </Carousel>
                    </div>
                    <div className="d-product-info">
                        <span className="d-product-catalog">
                            {productData?.type}
                        </span>
                        <span className="d-product-name">
                            {productData?.nameProduct}
                        </span>
                        <div className="d-product-review-overview">
                            <img
                                src={GetStarImage(productData?.countStar)}
                                className="d-product-star-img"
                                alt=""
                            />
                            <span>
                                (
                                {Math.round(
                                    parseFloat(productData?.countStar) * 10
                                ) / 10}
                                )
                            </span>
                            <span>{reviewData?.length} lượt đánh giá</span>
                        </div>
                        <div className="d-product-prices">
                            <span className="d-product-current-price">
                                {productData.price &&
                                    ThousandSeparator(productData.price)}{" "}
                                đ
                            </span>
                            <span className="d-product-old-price">
                                {productData?.salePrice > 0
                                    ? ThousandSeparator(productData.salePrice) +
                                      " đ"
                                    : ""}{" "}
                            </span>
                        </div>
                        <div className="d-product-classify">
                            <div className="d-product-quantity-wrapper">
                                <span>Số lượng:</span>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={QuantityInputOnChange}
                                />
                                <button
                                    className="up-quantity-button"
                                    onClick={UpQuantityOnClick}
                                >
                                    <IoIosArrowUp className="quantity-icon" />
                                </button>
                                <button
                                    className="down-quantity-button"
                                    onClick={DownQuantityOnClick}
                                >
                                    <IoIosArrowDown className="quantity-icon" />
                                </button>
                            </div>
                            <div className="d-product-type-wrapper">
                                <span>Phân loại hàng:</span>
                                <select
                                    onChange={(e) =>
                                        setSelectedType(e.target.value)
                                    }
                                >
                                    {typeData?.map((item) => (
                                        <option value={item.name}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="d-product-buy-wrapper">
                            <div className="add-to-wishlist-wrapper">
                                <input
                                    type="checkbox"
                                    checked={isFavorite}
                                    id="favorite"
                                    name="favorite-checkbox"
                                    value="favorite-button"
                                    className="atw-input"
                                    onChange={AddToFavoriteOnChange}
                                />
                                <label
                                    for="favorite"
                                    className="container"
                                    onClick={() => setIsFavorite(!isFavorite)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        style={{
                                            width: "24",
                                            height: "24",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                        }}
                                        className="feather feather-heart"
                                    >
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                    <div className="action">
                                        <span className="option-1">
                                            Yêu thích
                                        </span>
                                        <span className="option-2">
                                            Đã thích
                                        </span>
                                    </div>
                                </label>
                            </div>
                            <Link to="/checkout">
                                <button className="buy-now-button primary-button">
                                    Mua ngay
                                </button>
                            </Link>
                            <button
                                className="add-to-cart-button primary-button"
                                onClick={AddToCart}
                            >
                                <AiOutlineShoppingCart className="icon" />
                                Thêm vào Giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>
                <div className="d-product-description-wrapper">
                    <span className="d-product-title">Mô tả sản phẩm</span>
                    <p className="d-product-description">
                        {productData?.describe}
                    </p>
                </div>
                <div className="d-product-review-wrapper">
                    <span className="d-product-title">Đánh giá</span>
                    <div className="review-left">
                        <span className="review-title">
                            Đánh giá của khách hàng ({reviewData.length})
                        </span>
                        {reviewData?.length > 0 && (
                            <PaginatedItems
                                items={reviewData}
                                itemsPerPage={4}
                                enableDialog={() => setShowDeleteDialog(true)}
                                setEvaluteID={setEvaluteID}
                            />
                        )}
                        {reviewData?.length === 0 && <NoReviewYet />}
                    </div>
                    <div className="review-right">
                        <span className="review-title">Gửi đánh giá</span>
                        <div class="rate">
                            <input
                                type="radio"
                                id="star5"
                                name="rate"
                                value="5"
                                checked={starVote === 5}
                                onChange={() => {}}
                            />
                            <label
                                for="star5"
                                title="text"
                                onClick={() => setStarVote(5)}
                            >
                                5 stars
                            </label>
                            <input
                                type="radio"
                                id="star4"
                                name="rate"
                                value="4"
                                checked={starVote === 4}
                                onChange={() => {}}
                            />
                            <label
                                for="star4"
                                title="text"
                                onClick={() => setStarVote(4)}
                            >
                                4 stars
                            </label>
                            <input
                                type="radio"
                                id="star3"
                                name="rate"
                                value="3"
                                checked={starVote === 3}
                                onChange={() => {}}
                            />
                            <label
                                for="star3"
                                title="text"
                                onClick={() => setStarVote(3)}
                            >
                                3 stars
                            </label>
                            <input
                                type="radio"
                                id="star2"
                                name="rate"
                                value="2"
                                checked={starVote === 2}
                                onChange={() => {}}
                            />
                            <label
                                for="star2"
                                title="text"
                                onClick={() => setStarVote(2)}
                            >
                                2 stars
                            </label>
                            <input
                                type="radio"
                                id="star1"
                                name="rate"
                                value="1"
                                checked={starVote === 1}
                                onChange={() => {}}
                            />
                            <label
                                for="star1"
                                title="text"
                                onClick={() => setStarVote(1)}
                            >
                                1 star
                            </label>
                        </div>
                        <textarea
                            placeholder="Đánh giá về sản phẩm"
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                        />
                        <button
                            className="send-review-button"
                            onClick={SendReview}
                        >
                            <div class="svg-wrapper-1">
                                <div class="svg-wrapper">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        style={{
                                            viewBox: "0 0 24 24",
                                            width: "24",
                                            height: "24",
                                        }}
                                    >
                                        <path
                                            d="M0 0h24v24H0z"
                                            style={{
                                                fill: "none",
                                            }}
                                        ></path>
                                        <path
                                            d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                                            style={{
                                                fill: "currentColor",
                                            }}
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                            <span>Gửi</span>
                        </button>
                    </div>
                </div>
                <OtherProduct
                    productID={productID}
                    category={productData.type}
                />
                {showDeleteDialog && (
                    <ConfirmDialog
                        message="Bạn có chắc chắn muốn xoá đánh giá này ?"
                        yesLabel="Xoá"
                        noLabel="Huỷ"
                        yesFunction={() => DeleteEvalute()}
                        noFunction={() => setShowDeleteDialog(false)}
                    />
                )}
            </div>
        );
    else return <Loading />;
};

function Items({ currentItems, enableDialog, setEvaluteID }) {
    return (
        <div className="review-list">
            {currentItems.map((item) => (
                <div className="review-item">
                    <div className="review-info">
                        <img
                            src={item.imageURL ? item.imageURL : avatar}
                            alt=""
                        />
                        <span>{item.fullName}</span>
                    </div>
                    <div className="review-body">
                        <span>
                            {new Date(item.createdAt).toLocaleDateString()} -{" "}
                            {new Date(item.createdAt).toLocaleTimeString()}
                        </span>
                        <p>{item.describe}</p>
                        <img src={GetStarImage(item.star)} alt="" />
                    </div>

                    {localStorage.getItem("accountID") === item.accountId && (
                        <button className="review-delete-button">
                            <RiDeleteBin6Line
                                className="review-delete-icon"
                                onClick={() => {
                                    setEvaluteID(item._id);
                                    console.log("item._id: ", item._id);
                                    enableDialog();
                                }}
                            />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

function PaginatedItems({ items, itemsPerPage, enableDialog, setEvaluteID }) {
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = items.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(items.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % items.length;
        setItemOffset(newOffset);
    };

    return (
        <>
            <Items
                currentItems={currentItems}
                enableDialog={enableDialog}
                setEvaluteID={setEvaluteID}
            />
            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                pageCount={pageCount}
                previousLabel="<"
                renderOnZeroPageCount={null}
                containerClassName="pag-container"
                pageClassName="pag-li"
                pageLinkClassName="pag-link"
                previousClassName="pag-previous"
                previousLinkClassName="pag-link-previous"
                nextClassName="pag-next"
                nextLinkClassName="pag-link-next"
                activeClassName="pag-active"
                activeLinkClassName="pag-link-active"
                breakClassName="pag-break"
                breakLinkClassName="pag-link-break"
            />
        </>
    );
}

function NoReviewYet() {
    return (
        <div className="NoReviewYet">
            <span className="title-text">
                Chưa Có <span className="green-text">Đánh Giá</span>
            </span>
            <span className="text-content">
                Hãy để lại trải nghiệm của bạn về sản phẩm bằng cách gửi đánh
                giá ngay
            </span>
        </div>
    );
}

function OtherProduct({ productID, category }) {
    const [otherProductData, setOtherProductData] = useState([]);
    const [isLoaded, setIsLoaded] = useState();
    const [widthPercent, setWidthPercent] = useState(100);
    const [widthPercentItem, setWidthPercentItem] = useState(23);
    useEffect(() => {
        setIsLoaded(false);
        axios
            .get("http://localhost:5000/api/products/populateCatalog", {
                params: {
                    count: 9,
                    catalog: category,
                    accountId: localStorage.getItem("accountID"),
                },
            })
            .then((res) => {
                let arr = res.data.products;
                console.log("res.data.products: ", res.data.products);
                const index = arr.findIndex((element) => {
                    return element._id === productID;
                });
                console.log("index: ", index);
                if (index !== -1)
                    arr = arr.slice(0, index).concat(arr.slice(index + 1));
                if (arr.length === 2) {
                    setWidthPercent(60);
                    setWidthPercentItem(40);
                } else if (arr.length === 6) {
                    setWidthPercentItem(26);
                }
                setOtherProductData(arr.slice(0, 8));
                setIsLoaded(true);
            })
            .catch((err) => console.log(err));
    }, []);
    if (isLoaded)
        return (
            <div className="OtherProduct">
                <span className="title-text">
                    Có thể bạn <span className="green-text">Quan tâm</span>
                </span>
                <div
                    className="list-products"
                    style={{ width: `${widthPercent}%` }}
                >
                    {otherProductData.map((item) => (
                        <div
                            className="product-item"
                            style={{ width: `${widthPercentItem}%` }}
                        >
                            <Link to={`/product/${item._id}`}>
                                <img
                                    className="product-image"
                                    src={item.imageURLs[0]}
                                />
                                <span className="product-category">
                                    {item.type}
                                </span>
                                <div className="product-name-wrapper">
                                    <span className="product-name">
                                        {item.nameProduct}
                                    </span>
                                </div>
                                <div className="product-star-wrapper">
                                    <img src={GetStarImage(item.countStar)} />
                                    <span>
                                        (
                                        {Math.round(
                                            parseFloat(item.countStar) * 10
                                        ) / 10}
                                        )
                                    </span>
                                </div>
                                <div className="product-price-wrapper">
                                    <span className="price">
                                        {ThousandSeparator(item.price)} đ
                                    </span>
                                    {item.salePrice > 0 && (
                                        <span className="old-price">
                                            {ThousandSeparator(item.salePrice)}{" "}
                                            đ
                                        </span>
                                    )}
                                </div>
                            </Link>

                            <button className="add-to-cart-button primary-button">
                                <BsCartPlus
                                    style={{
                                        width: "22px",
                                        height: "22px",
                                        marginRight: "6px",
                                    }}
                                />{" "}
                                Thêm vào Giỏ
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    else return <Loading />;
}

export default ProductDetail;
