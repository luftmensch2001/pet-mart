import { React, useEffect, useState } from "react";
import "./StoreTab.css";
import {
    AiOutlineSearch,
    AiOutlineEdit,
    AiOutlineDelete,
} from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";

import starImg from "../../assets/images/reviews/4.png";
import ThousandSeparator from "../../components/ThousandSeparator";
import axios from "axios";
import ConfirmDialog from "../../components/ConfirmDialog";

function Items({ currentItems, refetchFunction }) {
    const [searchValue, setSearchValue] = useState("");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [idDelete, setIdDelete] = useState("");

    function SearchInputOnChange(event) {
        setSearchValue(event.target.value);
    }

    const DeleteProduct = (productID) => {
        axios
            .delete("http://localhost:5000/api/products/byProductId", {
                params: { productId: productID },
            })
            .then((res) => {
                toast.success("Xoá sản phẩm thành công!", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                refetchFunction();
            })
            .catch((err) => console.log(err));
    };

    return (
        <div>
            <div className="store-top">
                <Link to="/add-product">
                    <button className="store-add-product-button primary-button">
                        <MdAdd className="icon" />
                        Thêm Sản phẩm
                    </button>
                </Link>
                <Link to="/voucher">
                    <button className="store-voucher-button primary-button">
                        <FaMoneyBillWave className="icon" />
                        Mã Giảm Giá
                    </button>
                </Link>
                <div className="store-search-container">
                    <input
                        type="text"
                        className="store-search-input"
                        value={searchValue}
                        placeholder="Tìm kiếm sản phẩm"
                        onChange={SearchInputOnChange}
                    />
                    <button className="store-search-button primary-button">
                        <AiOutlineSearch className="store-search-icon" />
                    </button>
                </div>
            </div>
            {currentItems.length > 0 ? (
                <div className="store-product-container">
                    {currentItems &&
                        currentItems.map((item) => (
                            <div className="product-item">
                                <Link to={`/product/${item._id}`}>
                                    <img src={item.imageURLs[0]} />
                                </Link>
                                <Link
                                    to={`/product/${item._id}`}
                                    style={{ flex: 1 }}
                                >
                                    <div className="product-info">
                                        <div className="product-head-info">
                                            <span className="product-sell">
                                                <span className="green-text">
                                                    Đã bán:{" "}
                                                </span>
                                                {item.countSold}
                                            </span>
                                            <span className="product-name">
                                                {item.nameProduct}
                                            </span>
                                        </div>
                                        <div className="product-all-price">
                                            <span className="product-price">
                                                {ThousandSeparator(
                                                    parseInt(item.price)
                                                )}{" "}
                                                đ
                                            </span>
                                            {item.salePrice > 0 && (
                                                <span className="product-old-price">
                                                    {ThousandSeparator(
                                                        parseInt(item.salePrice)
                                                    )}{" "}
                                                    đ
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                                <div className="product-bottom-buttons">
                                    <Link
                                        to={`/edit-product/${item._id}`}
                                        className="edit-link"
                                    >
                                        <button className="edit-button">
                                            <AiOutlineEdit className="icon" />
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setShowDeleteDialog(true);
                                            setIdDelete(item._id);
                                        }}
                                    >
                                        <AiOutlineDelete className="icon" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    {showDeleteDialog && (
                        <ConfirmDialog
                            message="Bạn có chắc chắn muốn xoá sản phẩm này ?"
                            yesLabel="Xoá"
                            noLabel="Huỷ"
                            yesFunction={() => DeleteProduct(idDelete)}
                            noFunction={() => setShowDeleteDialog(false)}
                        />
                    )}
                </div>
            ) : (
                <span className="no-product">Chưa có sản phẩm nào</span>
            )}
        </div>
    );
}

function PaginatedItems({ itemsPerPage, items, refetchFunction }) {
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = items.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(items.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % items.length;
        setItemOffset(newOffset);
        window.scrollTo(0, 0);
    };

    return (
        <>
            <Items
                currentItems={currentItems}
                refetchFunction={refetchFunction}
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

function StoreTab() {
    const [products, setProducts] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        window.scrollTo(0, 0);
        setIsLoaded(false);
        axios
            .get("http://localhost:5000/api/products/byAccountId", {
                params: {
                    accountId: localStorage.getItem("accountID"),
                },
            })
            .then((res) => {
                setProducts(res.data.products);
                setIsLoaded(true);
            })
            .catch((err) => console.log(err));
    }, []);
    const ReFetch = () => {
        window.scrollTo(0, 0);
        setIsLoaded(false);
        axios
            .get("http://localhost:5000/api/products/byAccountId", {
                params: {
                    accountId: localStorage.getItem("accountID"),
                },
            })
            .then((res) => {
                setProducts(res.data.products);
                setIsLoaded(true);
            })
            .catch((err) => console.log(err));
    };

    if (isLoaded)
        return (
            <div className="StoreTab">
                <PaginatedItems
                    itemsPerPage={6}
                    items={products}
                    refetchFunction={ReFetch}
                />
            </div>
        );
    else return <Loading />;
}

export default StoreTab;
