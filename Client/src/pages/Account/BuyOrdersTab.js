import { React, useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Order from "../../components/Order";
import "./BuyOrdersTab.css";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import Loading from "../../components/Loading";

function Items({ currentItems, filterFunction }) {
    const [statusFilterValue, setStatusFilterValue] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [dateFilterValue, setDateFilterValue] = useState(1);

    function StatusFilterOnchange(event) {
        switch (event.target.value) {
            case "Tất cả":
                setStatusFilterValue(1);
                filterFunction(searchValue, 1, dateFilterValue);
                break;
            case "Đang chờ xác nhận":
                setStatusFilterValue(2);
                filterFunction(searchValue, 2, dateFilterValue);
                break;
            case "Đang vận chuyển":
                setStatusFilterValue(3);
                filterFunction(searchValue, 3, dateFilterValue);
                break;
            case "Đã giao hàng":
                setStatusFilterValue(4);
                filterFunction(searchValue, 4, dateFilterValue);
                break;
            case "Đã huỷ":
                setStatusFilterValue(5);
                filterFunction(searchValue, 5, dateFilterValue);
                break;
            default:
                break;
        }
    }

    function DateFilterOnchange(event) {
        switch (event.target.value) {
            case "Tất cả":
                setDateFilterValue(1);
                filterFunction(searchValue, statusFilterValue, 1);
                break;
            case "Hôm nay":
                setDateFilterValue(2);
                filterFunction(searchValue, statusFilterValue, 2);
                break;
            case "Tuần này":
                setDateFilterValue(3);
                filterFunction(searchValue, statusFilterValue, 3);
                break;
            case "Tháng này":
                setDateFilterValue(4);
                filterFunction(searchValue, statusFilterValue, 4);
                break;
            case "Năm này":
                setDateFilterValue(5);
                filterFunction(searchValue, statusFilterValue, 5);
                break;
            default:
                break;
        }
    }

    function SearchInputOnChange(event) {
        setSearchValue(event.target.value);
    }

    function SearchButtonClick(event) {
        filterFunction(searchValue, statusFilterValue, dateFilterValue);
    }

    function SearchKeyDown(event) {
        if (event.key === "Enter") {
            filterFunction(searchValue, statusFilterValue, dateFilterValue);
        }
    }

    return (
        <>
            <div className="top">
                <div className="search-container">
                    <span className="top-label">Tìm kiếm</span>
                    <div className="search-field">
                        <AiOutlineSearch
                            className="search-icon"
                            onClick={SearchButtonClick}
                        />
                        <input
                            className="seach-input"
                            type="text"
                            placeholder="Tìm kiếm đơn hàng"
                            value={searchValue}
                            onChange={SearchInputOnChange}
                            onKeyDown={SearchKeyDown}
                        />
                    </div>
                </div>
                <div className="status-filter-container">
                    <span className="top-label">Trạng thái</span>
                    <select
                        className="status-filter-select"
                        onChange={StatusFilterOnchange}
                    >
                        <option
                            selected={statusFilterValue === 1 ? "selected" : ""}
                        >
                            Tất cả
                        </option>
                        <option
                            selected={statusFilterValue === 2 ? "selected" : ""}
                        >
                            Đang chờ xác nhận
                        </option>
                        <option
                            selected={statusFilterValue === 3 ? "selected" : ""}
                        >
                            Đang vận chuyển
                        </option>
                        <option
                            selected={statusFilterValue === 4 ? "selected" : ""}
                        >
                            Đã giao hàng
                        </option>
                        <option
                            selected={statusFilterValue === 5 ? "selected" : ""}
                        >
                            Đã huỷ
                        </option>
                    </select>
                </div>
                <div className="date-filter-container">
                    <span className="top-label">Thời gian đặt hàng</span>
                    <select
                        className="date-filter-select"
                        onChange={DateFilterOnchange}
                    >
                        <option
                            selected={dateFilterValue === 1 ? "selected" : ""}
                        >
                            Tất cả
                        </option>
                        <option
                            selected={dateFilterValue === 2 ? "selected" : ""}
                        >
                            Hôm nay
                        </option>
                        <option
                            selected={dateFilterValue === 3 ? "selected" : ""}
                        >
                            Tuần này
                        </option>
                        <option
                            selected={dateFilterValue === 4 ? "selected" : ""}
                        >
                            Tháng này
                        </option>
                        <option
                            selected={dateFilterValue === 5 ? "selected" : ""}
                        >
                            Năm này
                        </option>
                    </select>
                </div>
            </div>
            <div className="bot">
                <div className="orders-header">
                    <span className="orders-header-label c1">
                        Ngày đặt hàng
                    </span>
                    <span className="orders-header-label c2">Sản phẩm</span>
                    <span className="orders-header-label c3">Số lượng</span>
                    <span className="orders-header-label c4">
                        Tổng thanh toán
                    </span>
                    <span className="orders-header-label c5">Trạng thái</span>
                </div>
                {currentItems.length === 0 ? (
                    <span className="no-order">Không có đơn hàng nào</span>
                ) : (
                    <div className="orders-list">
                        {currentItems &&
                            currentItems.map((item) => (
                                <Order data={item} isBuyOrder={true} />
                            ))}
                    </div>
                )}
            </div>
        </>
    );
}

function PaginatedItems({ items, itemsPerPage, filterFunction }) {
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
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

function BuyOrdersTab() {
    const [allOrders, setAllOrders] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    let searchValue = "";
    let dateValue = 1;
    let statusValue = 1;

    useEffect(() => {
        setIsLoaded(false);
        axios
            .get("http://localhost:5000/api/bills/buyer", {
                params: {
                    accountBuyerId: localStorage.getItem("accountID"),
                },
            })
            .then((res) => {
                console.log("res get buy order: ", res);
                let arrBill = res.data.bills;
                if (arrBill.length === 0) {
                    setIsLoaded(true);
                    return;
                }
                let counter = 0;
                arrBill.forEach((bill) => {
                    axios
                        .get("http://localhost:5000/api/productInBills/", {
                            params: {
                                billId: bill._id,
                            },
                        })
                        .then((res) => {
                            console.log("res productinbill: ", res);
                            bill.color = res.data.productInBill[0].color;
                            bill.count = res.data.productInBill[0].count;
                            bill.productId =
                                res.data.productInBill[0].productId;
                            bill.productCount = res.data.productInBill.length;
                            axios
                                .get(
                                    "http://localhost:5000/api/products/byProductId",
                                    {
                                        params: {
                                            productId:
                                                res.data.productInBill[0]
                                                    .productId,
                                        },
                                    }
                                )
                                .then((res) => {
                                    bill.nameProduct =
                                        res.data.product.nameProduct;
                                    bill.imageURL =
                                        res.data.product.imageURLs[0];
                                    counter++;
                                    if (counter === arrBill.length)
                                        setIsLoaded(true);
                                    setOrders(arrBill.slice(0));
                                    setAllOrders(arrBill.slice(0));
                                })
                                .catch((err) => console.log(err));
                        })
                        .catch((err) => console.log(err));
                });
                console.log("arrBill: ", arrBill);
            })
            .catch((err) => console.log(err));
    }, []);

    function FilterOrders(searchVal, statusVal, dateVal) {
        statusValue = statusVal;
        searchValue = searchVal;
        dateValue = dateVal;
        let arr = allOrders.filter(FilterByStatus);
        arr = arr.filter(FilterByName);
        arr = arr.filter(FilterByDate);
        setOrders(arr);
    }

    function FilterByName(item) {
        const productNameLow = item.nameProduct.toLowerCase();
        const searchString = searchValue.toLowerCase();
        return productNameLow.includes(searchString);
    }

    function FilterByStatus(item) {
        if (statusValue === 1) return true;
        return parseInt(item.state) + 1 === statusValue;
    }

    function FilterByDate(item) {
        if (dateValue === 1) return true;
        const today = new Date();
        const orderDate = new Date(item.createdAt);
        if (!orderDate) return true;
        const milisecondsInDay = 1000 * 60 * 60 * 24;
        if (dateValue === 2) {
            const daySubtract = Math.abs(today - orderDate);
            return daySubtract <= milisecondsInDay;
        }
        if (dateValue === 3) {
            const daySubtract = Math.abs(today - orderDate);
            return daySubtract <= milisecondsInDay * 7;
        }
        if (dateValue === 4) {
            return (
                today.getFullYear() === orderDate.getFullYear() &&
                today.getMonth() === orderDate.getMonth()
            );
        }
        if (dateValue === 5) {
            return today.getFullYear() === orderDate.getFullYear();
        }
    }
    if (!isLoaded) return <Loading />;

    return (
        <div className="BuyOrdersTab">
            <PaginatedItems
                items={orders}
                itemsPerPage={4}
                filterFunction={FilterOrders}
            />
        </div>
    );
}

export default BuyOrdersTab;
