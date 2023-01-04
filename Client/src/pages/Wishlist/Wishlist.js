import { React, useState, useEffect } from "react";
import "./Wishlist.css";
import ReactPaginate from "react-paginate";
import WishlistProduct from "./WishlistProduct";
import { AiOutlineSearch } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../../components/Loading";

function Items({
    currentItems,
    filterFunction,
    count,
    updateFunction,
    UpdateNavbar,
}) {
    const [searchValue, setSearchValue] = useState("");

    function SearchInputOnChange(event) {
        setSearchValue(event.target.value);
    }

    function SearchKeyDown(event) {
        if (event.key === "Enter") {
            filterFunction(searchValue);
        }
    }

    return (
        <div className="Wishlist content">
            <span className="page-title title-text">
                Danh Sách <span className="green-text">Yêu Thích</span>
            </span>
            <span className="total-count-label">
                Hiện có
                <span className="green-text"> {count} sản phẩm </span>
                trong Danh sách yêu thích của bạn
            </span>
            <div className="wishlist-search-container">
                <input
                    className="wishlist-search-input"
                    placeholder="Tìm kiếm sản phẩm"
                    onChange={SearchInputOnChange}
                    onKeyDown={SearchKeyDown}
                />
                <AiOutlineSearch className="wishlist-search-icon" />
            </div>
            <div className="wishlist-container">
                <div className="wishlist-header">
                    <span className="wishlist-header-field c1">Sản phẩm</span>
                    <span className="wishlist-header-field c2">Đánh giá</span>
                    <span className="wishlist-header-field c3">Giá</span>
                    <span className="wishlist-header-field c4"></span>
                </div>
                <div className="wishlist-list">
                    {currentItems.map((item) => (
                        <WishlistProduct
                            data={item}
                            updateFunction={updateFunction}
                            UpdateNavbar={UpdateNavbar}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function PaginatedItems({
    items,
    itemsPerPage,
    filterFunction,
    updateFunction,
    UpdateNavbar,
}) {
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = items.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(items.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % items.length;
        setItemOffset(newOffset);
        window.scrollTo(0, 160);
    };

    useEffect(() => {
        setItemOffset(0);
    }, [items]);

    return (
        <>
            <Items
                currentItems={currentItems}
                filterFunction={filterFunction}
                count={items.length}
                updateFunction={updateFunction}
                UpdateNavbar={UpdateNavbar}
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

function Wishlist({ UpdateNavbar }) {
    const [data, setData] = useState([]);
    const [allProduct, setAllProduct] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    let searchValue = "";
    let counter = 0;

    useEffect(() => {
        FetchData();
    }, []);

    const FetchData = () => {
        setIsLoaded(false);
        counter = 0;
        axios
            .get("http://localhost:5000/api/productInFavorites/byAccountId", {
                params: {
                    accountId: localStorage.getItem("accountID"),
                },
            })
            .then((res) => {
                let favoriteProducts = res.data.productInFavorites;
                if (counter === favoriteProducts.length) {
                    setData(favoriteProducts);
                    setAllProduct(favoriteProducts);
                    setIsLoaded(true);
                }
                favoriteProducts.forEach((item) => {
                    axios
                        .get("http://localhost:5000/api/products/byProductId", {
                            params: {
                                productId: item.productId,
                            },
                        })
                        .then((res) => {
                            item.nameProduct = res.data.product.nameProduct;
                            item.imageURL = res.data.product.imageURLs[0];
                            item.price = res.data.product.price;
                            item.countStar = res.data.product.countStar;
                            counter++;
                            if (counter === favoriteProducts.length) {
                                setData(favoriteProducts);
                                setAllProduct(favoriteProducts);
                                setIsLoaded(true);
                            }
                        })
                        .catch((err) => console.log("err: ", err));
                });
            })
            .catch((err) => {
                console.log("err: ", err);
            });
    };

    function FilterByName(item) {
        const productNameLow = item.nameProduct.toLowerCase();
        const searchString = searchValue.toLowerCase();
        return productNameLow.includes(searchString);
    }

    function FilterProduct(searchVal) {
        searchValue = searchVal;
        const arr = allProduct.filter(FilterByName);
        if (arr.length === 0) {
            toast.error("Không tìm thấy sản phẩm nào!", {
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
        setData(arr);
    }

    if (!isLoaded) return <Loading />;

    if (data.length > 0)
        return (
            <div className="BuyOrdersTab">
                <PaginatedItems
                    items={data}
                    itemsPerPage={8}
                    filterFunction={FilterProduct}
                    updateFunction={FetchData}
                    UpdateNavbar={UpdateNavbar}
                />
            </div>
        );
    else return <EmptyWishlist />;
}

const EmptyWishlist = () => {
    return (
        <div className="EmptyWishlist content">
            <span className="title-text">
                Danh Sách Yêu Thích{" "}
                <span className="green-text">Đang Trống</span>
            </span>
            <span className="text-content">
                Thêm sản phẩm vào Danh Sách Yêu Thích để có thể mua lại khi muốn
            </span>
            <Link to="/">
                <button
                    className="cart-continue-shopping-button"
                    onClick={() => window.scrollTo(0, 0)}
                >
                    <BsArrowLeft className="cart-button-icon" />
                    Tiếp tục mua sắm
                </button>
            </Link>
        </div>
    );
};

export default Wishlist;
