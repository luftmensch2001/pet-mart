import React, { useEffect, useState } from "react";
import Select from "react-select";
import "./ProductList.css";
import { AiOutlineFilter } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { BsCartPlus } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import ThousandSeparator from "../../components/ThousandSeparator";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading";
import GetStarImage from "../../components/GetStarImage";
import { toast } from "react-toastify";
import SelectTypeDialog from "../../components/SelectTypeDialog";

import notFoundProduct from "../../assets/images/illustrations/notfoundproduct.jpg";

const sortOptions = [
    { value: 1, label: "Mới nhất trước" },
    { value: 2, label: "Cũ nhất trước" },
    { value: 3, label: "Giá tăng dần" },
    { value: 4, label: "Giá giảm dần" },
    { value: 5, label: "Mua nhiều nhất" },
];

const countOptions = [
    { value: 9, label: "9 sản phẩm" },
    { value: 12, label: "12 sản phẩm" },
    { value: 15, label: "15 sản phẩm" },
    { value: 18, label: "18 sản phẩm" },
    { value: 21, label: "21 sản phẩm" },
];

const categories = [
    { id: 0, name: "Tất cả" },
    { id: 1, name: "Thời trang nam" },
    { id: 2, name: "Thời trang nữ" },
    { id: 3, name: "Điện thoại" },
    { id: 4, name: "Laptop" },
    { id: 5, name: "Thiết bị điện tử" },
    { id: 6, name: "Trang sức" },
    { id: 7, name: "Mỹ phẩm" },
    { id: 8, name: "Nhà bếp" },
    { id: 9, name: "Sách" },
    { id: 10, name: "Giày nam" },
    { id: 11, name: "Giày nữ" },
    { id: 12, name: "Sức khoẻ" },
    { id: 13, name: "Cho bé" },
    { id: 14, name: "Dụng cụ gia đình" },
    { id: 15, name: "Đồng hồ" },
    { id: 16, name: "Khác" },
];

const ProductList = ({ UpdateNavbar }) => {
    // states
    const [sortOption, setSortOption] = useState(null);
    const [countOption, setCountOption] = useState(countOptions[1]);
    const [selectedCategory, setSelectedCategory] = useState("Tất cả");
    const [showCategories, setShowCategories] = useState(false);
    const [isSaling, setIsSaling] = useState(false);
    const [searchParams] = useSearchParams();
    const [data, setData] = useState([]);
    const [dataRaw, setDataRaw] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [minStar, setMinStar] = useState(0);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    // variables
    let keyword = searchParams.get("search").slice(0, -1);
    let category = searchParams.get("category").slice(0, -1);
    let isCategory = searchParams.get("isCategory").slice(0, -1);
    let categoryFilterName = "Tất cả";
    let varMinStar = minStar;
    let varIsSaling = isSaling;
    let minPriceNum = parseFloat(minPrice);
    let maxPriceNum = parseFloat(maxPrice);

    useEffect(() => {
        setIsLoaded(false);
        if (category === "All") GetAllProducts();
        else GetCategoryProducts();
    }, [keyword, category]);

    useEffect(() => {
        if (!sortOption) return;
        let arr = data;
        switch (sortOption.value) {
            case 1:
                arr.sort((a, b) => {
                    const aDate = new Date(a.createdAt);
                    const bDate = new Date(b.createdAt);
                    return bDate - aDate;
                });
                break;
            case 2:
                arr.sort((a, b) => {
                    const aDate = new Date(a.createdAt);
                    const bDate = new Date(b.createdAt);
                    return aDate - bDate;
                });
                break;
            case 3:
                arr.sort((a, b) => {
                    return a.price - b.price;
                });
                break;
            case 4:
                arr.sort((a, b) => {
                    return b.price - a.price;
                });
                break;
            case 5:
                arr.sort((a, b) => {
                    return b.countSold - a.countSold;
                });
                break;
        }
        setData(arr.slice(0));
    }, [sortOption]);

    const GetAllProducts = () => {
        axios
            .get("http://localhost:5000/api/products/allByKeyWord", {
                params: {
                    keyword: keyword,
                },
            })
            .then((res) => {
                // Reset Filter
                setSortOption(null);
                setCountOption(countOptions[1]);
                setSelectedCategory("Tất cả");
                setShowCategories(false);
                categoryFilterName = "";
                // Set Data
                setData(res.data.products);
                setDataRaw(res.data.products);
                setIsLoaded(true);
            })
            .catch((err) => console.log(err));
    };

    const GetCategoryProducts = () => {
        let keywordNew = keyword;
        // Get All product in category
        if (isCategory === "true") keywordNew = "";

        axios
            .get("http://localhost:5000/api/products/catalogByKeyWord", {
                params: {
                    keyword: keywordNew,
                    type: category,
                },
            })
            .then((res) => {
                // Reset Filter
                setSortOption(null);
                setCountOption(countOptions[1]);
                setSelectedCategory("Tất cả");
                setShowCategories(false);
                categoryFilterName = "";
                // Set Data
                setData(res.data.products);
                setDataRaw(res.data.products);
                setIsLoaded(true);
            })
            .catch((err) => console.log(err));
    };

    function FilterData() {
        setIsLoaded(false);
        let arr = dataRaw;
        // By Category
        arr = arr.filter(checkFilterCategory);
        arr = arr.filter(checkSaling);
        arr = arr.filter(checkMinStar);
        arr = arr.filter(checkPrice);
        setData(arr);
        setIsLoaded(true);
    }

    function checkFilterCategory(item) {
        if (categoryFilterName === "Tất cả") return true;
        return item.type === categoryFilterName;
    }

    function checkSaling(item) {
        if (!varIsSaling) return true;
        return item.discountValue > 0;
    }

    function checkMinStar(item) {
        return item.countStar >= varMinStar;
    }

    function checkPrice(item) {
        if (!minPrice || !maxPrice || minPriceNum > maxPriceNum) return true;
        return item.price >= minPriceNum && item.price <= maxPriceNum;
    }

    const FilterPriceClick = () => {
        if (!minPrice || !maxPrice) {
            toast.warn("Vui lòng nhập Giá cao nhất và Giá thấp nhất!", {
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
        minPriceNum = parseFloat(minPrice);
        maxPriceNum = parseFloat(maxPrice);
        if (minPriceNum > maxPriceNum) {
            toast.warn("Giá cao nhất phải cao hơn Giá thấp nhất!", {
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
        FilterData();
    };

    return (
        <div className="ProductList content">
            <span className="title-text keyword-label">
                Kết quả hiển thị cho
                <br />
                <span className="green-text">
                    "{keyword === "" ? "Tất cả sản phẩm" : keyword}"
                </span>
            </span>
            <div className="selects-wrapper">
                <Select
                    className="count-select"
                    defaultValue={countOption}
                    onChange={setCountOption}
                    options={countOptions}
                    isSearchable={false}
                    placeholder="Hiển thị"
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            primary: "var(--primary-color)",
                        },
                    })}
                />
                <Select
                    className="sort-filter-select"
                    defaultValue={sortOption}
                    onChange={setSortOption}
                    options={sortOptions}
                    placeholder="Sắp xếp theo"
                    isSearchable={false}
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            primary: "var(--primary-color)",
                        },
                    })}
                />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="filter-container">
                    <div className="filter-item">
                        <span
                            className="filter-label categories"
                            onClick={() => setShowCategories(!showCategories)}
                        >
                            Danh mục
                            <MdKeyboardArrowDown className="arrow-icon" />
                        </span>
                        {showCategories && (
                            <div className="filter-content categories-dropdown">
                                {categories.map((item) => (
                                    <button
                                        className={
                                            selectedCategory === item.name
                                                ? "category-button active"
                                                : "category-button"
                                        }
                                        onClick={() => {
                                            setSelectedCategory(item.name);
                                            categoryFilterName = item.name;
                                            FilterData();
                                        }}
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="filter-item">
                        <span className="filter-label">Giá</span>
                        <div className="filter-content">
                            <div className="price-filter-row">
                                <input
                                    type="number"
                                    className="price-input"
                                    placeholder="Giá thấp nhất"
                                    value={minPrice}
                                    onChange={(event) =>
                                        setMinPrice(event.target.value)
                                    }
                                />
                                <span>VNĐ</span>
                            </div>
                            <div className="price-filter-row">
                                <input
                                    type="number"
                                    className="price-input"
                                    placeholder="Giá cao nhất"
                                    value={maxPrice}
                                    onChange={(event) =>
                                        setMaxPrice(event.target.value)
                                    }
                                />
                                <span>VNĐ</span>
                            </div>
                            <button
                                className="price-filter-button primary-button"
                                onClick={FilterPriceClick}
                            >
                                <AiOutlineFilter
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        marginRight: "8px",
                                    }}
                                />
                                Lọc
                            </button>
                        </div>
                    </div>
                    <div className="filter-item">
                        <span className="filter-label">Tuỳ chọn</span>
                        <div className="filter-content">
                            <div className="filter-option-row">
                                <input
                                    type="checkbox"
                                    id="0"
                                    className="filter-checkbox"
                                    checked={isSaling}
                                    onClick={() => {
                                        setIsSaling(!isSaling);
                                        varIsSaling = !varIsSaling;
                                    }}
                                    onChange={FilterData}
                                />
                                <label for="0">Đang giảm giá</label>
                            </div>
                            <div className="filter-option-row">
                                <input
                                    type="radio"
                                    name="star"
                                    id="1"
                                    className="filter-checkbox"
                                    checked={minStar === 1}
                                    onClick={() => {
                                        varMinStar = 1;
                                        setMinStar(1);
                                    }}
                                    onChange={FilterData}
                                />
                                <label for="1">Từ 1 sao trở lên</label>
                            </div>
                            <div className="filter-option-row">
                                <input
                                    type="radio"
                                    name="star"
                                    id="2"
                                    className="filter-checkbox"
                                    checked={minStar === 2}
                                    onClick={() => {
                                        varMinStar = 2;
                                        setMinStar(2);
                                    }}
                                    onChange={FilterData}
                                />
                                <label for="2">Từ 2 sao trở lên</label>
                            </div>
                            <div className="filter-option-row">
                                <input
                                    type="radio"
                                    name="star"
                                    id="3"
                                    className="filter-checkbox"
                                    checked={minStar === 3}
                                    onClick={() => {
                                        varMinStar = 3;
                                        setMinStar(3);
                                    }}
                                    onChange={FilterData}
                                />
                                <label for="3">Từ 3 sao trở lên</label>
                            </div>
                            <div className="filter-option-row">
                                <input
                                    type="radio"
                                    name="star"
                                    id="4"
                                    className="filter-checkbox"
                                    checked={minStar === 4}
                                    onClick={() => {
                                        varMinStar = 4;
                                        setMinStar(4);
                                    }}
                                    onChange={FilterData}
                                />
                                <label for="4">Từ 4 sao trở lên</label>
                            </div>
                            <div className="filter-option-row">
                                <input
                                    type="radio"
                                    name="star"
                                    id="5"
                                    className="filter-checkbox"
                                    checked={minStar === 5}
                                    onClick={() => {
                                        varMinStar = 5;
                                        setMinStar(5);
                                    }}
                                    onChange={FilterData}
                                />
                                <label for="5">Từ 5 sao trở lên</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="products-container">
                    {isLoaded ? (
                        data.length > 0 ? (
                            <PaginatedItems
                                items={data}
                                itemsPerPage={countOption.value}
                                UpdateNavbar={UpdateNavbar}
                            />
                        ) : (
                            <NotFoundProduct />
                        )
                    ) : (
                        <Loading />
                    )}
                </div>
            </div>
        </div>
    );
};

function NotFoundProduct() {
    return (
        <div className="NotFoundProduct">
            <img src={notFoundProduct} />
            <h1 className="not-found">Không tìm thấy sản phẩm nào</h1>;
        </div>
    );
}

function PaginatedItems({ items, itemsPerPage, UpdateNavbar }) {
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = items.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(items.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % items.length;
        setItemOffset(newOffset);
        window.scrollTo(0, 140);
    };

    return (
        <>
            <Items currentItems={currentItems} UpdateNavbar={UpdateNavbar} />
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

function Items({ currentItems, UpdateNavbar }) {
    return (
        <div className="product-list">
            {currentItems.map((item) => (
                <ProductCard item={item} UpdateNavbar={UpdateNavbar} />
            ))}
        </div>
    );
}

const ProductCard = ({ item, UpdateNavbar }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    const isFavoriteOnChange = () => {
        if (CheckProductInStore(item.accountId)) {
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
            setIsFavorite(isFavorite);
            return;
        }
        if (!isFavorite) AddToFavorite();
        else RemoveFromFavorite();
    };

    const AddToFavorite = () => {
        console.log("id: ", item._id);
        // Add to favorite
        axios
            .post("http://localhost:5000/api/productInFavorites/create", {
                accountId: localStorage.getItem("accountID"),
                productId: item._id,
                // color: selectedType,
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
    };

    const RemoveFromFavorite = () => {
        axios
            .delete(
                "http://localhost:5000/api/productInFavorites/byProductIdAndAccountId",
                {
                    params: {
                        accountId: localStorage.getItem("accountID"),
                        productId: item._id,
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
    };

    function CheckProductInStore(accountId) {
        return accountId === localStorage.getItem("accountID");
    }

    return (
        <div className="product-item">
            {showDialog && (
                <SelectTypeDialog
                    product={item}
                    closeFunction={() => setShowDialog(false)}
                    UpdateNavbar={UpdateNavbar}
                />
            )}
            <Link to={`/product/${item._id}`}>
                <img src={item.imageURLs[0]} className="product-image" />
                <span className="product-category">{item.type}</span>
                <div className="product-name-wrapper">
                    <span className="product-name">{item.nameProduct}</span>
                </div>
                <div className="product-star-wrapper">
                    <img src={GetStarImage(item.countStar)} />
                    <span>({Math.round(item.countStar * 10) / 10})</span>
                </div>
                <div className="product-price-wrapper">
                    <span className="price">
                        {ThousandSeparator(item.price)} đ
                    </span>
                    {item.salePrice > 0 && (
                        <span className="old-price">
                            {ThousandSeparator(item.salePrice)} đ
                        </span>
                    )}
                </div>
            </Link>
            <div className="buttons-wrapper">
                <button
                    className="add-to-cart-button primary-button"
                    onClick={() => {
                        if (!CheckProductInStore(item.accountId))
                            setShowDialog(true);
                        else
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
                    }}
                >
                    <BsCartPlus
                        style={{
                            width: "22px",
                            height: "22px",
                            marginRight: "6px",
                        }}
                    />{" "}
                    Thêm vào Giỏ
                </button>
                <div
                    className="add-to-wishlist-wrapper"
                    onClick={isFavoriteOnChange}
                >
                    <input
                        type="checkbox"
                        checked={isFavorite}
                        id="favorite"
                        name="favorite-checkbox"
                        value="favorite-button"
                        className="atw-input"
                        disabled={true}
                        onChange={() => {}}
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
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
