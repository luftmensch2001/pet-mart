import React, { useState, useEffect } from "react";
import "./Voucher.css";
import Select from "react-select";
import { MdAdd } from "react-icons/md";
import ThoudsandSeparator from "../../components/ThousandSeparator";
import VoucherStatus from "../../components/VoucherStatus";
import { HiOutlineRefresh } from "react-icons/hi";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import axios from "axios";

const sortOptions = [
    { value: "1", label: "Mới nhất trước" },
    { value: "2", label: "Cũ nhất trước" },
    { value: "3", label: "Ngày hết hạn tăng" },
    { value: "4", label: "Ngày hết hạn giảm" },
];

const filterOptions = [
    { value: "1", label: "Tất cả" },
    { value: "2", label: "Chưa đến ngày" },
    { value: "3", label: "Có thể dùng" },
    { value: "4", label: "Đã hết lượt" },
    { value: "5", label: "Đã hết hạn" },
];

const unitOptions = [
    { value: 0, label: "%" },
    { value: 1, label: "VNĐ" },
];

const today = new Date();

const Voucher = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [sortOption, setSortOption] = useState(null);
    const [filterOption, setFilterOption] = useState(null);
    const [showAddModal, setShowAddModal] = useState(-1);
    // -1 : hide, 0: add modal, 1 2 ....: edit voucher id
    const [data, setData] = useState();
    //1: chưa đến ngày, 2: có thể dùng, 3: đã hết lượt, 4: đã hết hạn
    useEffect(() => {
        FetchData();
    }, []);

    function DeleteOutdatedVoucher() {
        axios
            .delete("http://localhost:5000/api/discountCodes/outDate", {
                params: {
                    accountId: localStorage.getItem("accountID"),
                },
            })
            .then((res) => {
                console.log("res delete", res);
                toast.success("Xoá thành công!", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                FetchData();
            })
            .catch((err) => {
                console.log("err: ", err);
                toast.error("Có lỗi xảy ra!", {
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

    function FetchData() {
        setIsLoaded(false);
        axios
            .get("http://localhost:5000/api/discountCodes/byAccountId", {
                params: {
                    accountId: localStorage.getItem("accountID"),
                },
            })
            .then((res) => {
                console.log("res voucher: ", res);
                let arrDiscounts = res.data.discountCodes;
                arrDiscounts.forEach((item) => {
                    if (item.count <= 0) {
                        item.status = 3; // het luot
                        return;
                    }
                    const start = new Date(item.timeStart);
                    const end = new Date(item.timeEnd);
                    const now = new Date();
                    if (now < start) {
                        item.status = 1; // chua den ngay
                    } else {
                        if (now > end) {
                            item.status = 4; // da het han
                        } else {
                            item.status = 2; // co the dung
                        }
                    }
                });
                setData(arrDiscounts);
                setIsLoaded(true);
            })
            .catch((err) => console.log(err));
    }

    const VoucherItemOnClick = (voucher) => {
        setShowAddModal(voucher._id);
    };

    useEffect(() => {
        if (showAddModal >= 0) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
    }, [showAddModal]);

    return (
        <div className="Voucher content">
            <span className="title-text">
                Quản Lý<span className="green-text"> Mã Giảm Giá</span>
            </span>
            <div className="top-buttons">
                <button
                    className="primary-button add-voucher-button"
                    onClick={() => setShowAddModal(0)}
                >
                    <MdAdd />
                    Thêm mới
                </button>
                <button className="update-button" onClick={FetchData}>
                    <HiOutlineRefresh
                        style={{ color: "#FFF", marginRight: "4px" }}
                    />
                    Cập nhật
                </button>
                <button
                    className="update-button remove-button"
                    onClick={DeleteOutdatedVoucher}
                >
                    <AiOutlineDelete
                        style={{ color: "#FFF", marginRight: "4px" }}
                    />
                    Xoá Mã không khả dụng
                </button>
            </div>
            <div className="filter-zone">
                <Select
                    className="sort-filter-select"
                    defaultValue={sortOption}
                    onChange={setSortOption}
                    options={sortOptions}
                    placeholder="Sắp xếp theo"
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            primary: "#18a0fb",
                        },
                    })}
                />
                <Select
                    className="sort-filter-select"
                    defaultValue={filterOption}
                    onChange={setFilterOption}
                    options={filterOptions}
                    placeholder="Lọc theo trạng thái"
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            primary: "#18a0fb",
                        },
                    })}
                />
            </div>
            <div className="voucher-list-container">
                <div className="head">
                    <span className="column-1">Mã giảm giá</span>
                    <span className="column-2">Bắt đầu</span>
                    <span className="column-3">Kết thúc</span>
                    <span className="column-4">Số tiền giảm</span>
                    <span className="column-5">Giảm tối đa</span>
                    <span className="column-6">Lượt còn lại</span>
                    <span className="column-7">Trạng thái</span>
                </div>
                <div className="voucher-list">
                    {data?.length > 0 ? (
                        data?.map((item) => (
                            <div
                                className="voucher-item"
                                onClick={() => VoucherItemOnClick(item)}
                            >
                                <span
                                    className="column-1"
                                    style={{ textTransform: "uppercase" }}
                                >
                                    {item.code}
                                </span>
                                <span className="column-2">
                                    {new Date(
                                        item.timeStart
                                    ).toLocaleDateString()}{" "}
                                    -{" "}
                                    {new Date(
                                        item.timeStart
                                    ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                                <span className="column-3">
                                    {new Date(
                                        item.timeEnd
                                    ).toLocaleDateString()}{" "}
                                    -{" "}
                                    {new Date(item.timeEnd).toLocaleTimeString(
                                        [],
                                        {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        }
                                    )}
                                </span>
                                <span className="column-4">
                                    {ThoudsandSeparator(item.value)}
                                    {" " + item.type}
                                </span>
                                <span className="column-5">
                                    {item.maxValue > 0
                                        ? ThoudsandSeparator(item.maxValue) +
                                          " VNĐ"
                                        : "-"}
                                </span>
                                <span className="column-6">{item.count}</span>
                                <div className="column-7">
                                    <VoucherStatus status={item.status} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <span className="no-voucher">
                            Chưa có Mã giảm giá nào
                        </span>
                    )}
                </div>
            </div>
            {showAddModal !== -1 && (
                <AddVoucherModal
                    id={showAddModal}
                    voucher={data.find((item) => item.id === showAddModal)}
                    closeFunction={() => setShowAddModal(-1)}
                    update={FetchData}
                />
            )}
        </div>
    );
};

const AddVoucherModal = ({ id, voucher, closeFunction, update }) => {
    const [unit, setUnit] = useState(unitOptions[0]);

    const [code, setCode] = useState("");
    const [count, setCount] = useState("");
    const [timeStart, setTimeStart] = useState("");
    const [timeEnd, setTimeEnd] = useState("");
    const [value, setValue] = useState("");
    const [max, setMax] = useState("");

    const ConvertToGMT7 = (time) => {
        let timeString = time.slice(0, 16);
        let hourInGMT7 = parseInt(timeString.slice(11, 13)) + 7;
        timeString =
            timeString.slice(0, 11) + hourInGMT7 + timeString.slice(13);
        return timeString;
    };

    useEffect(() => {
        if (id === 0) return;
        axios
            .get("http://localhost:5000/api/discountCodes/", {
                params: {
                    codeId: id,
                },
            })
            .then((res) => {
                console.log("res update discount: ", res);
                console.log("res: ", res);
                let data = res.data.discountCodes;
                console.log("data: ", data);
                setCode(data.code);
                setCount(data.count);
                setTimeStart(ConvertToGMT7(data.timeStart));
                setTimeEnd(ConvertToGMT7(data.timeEnd));
                setValue(data.value);
                setMax(data.maxValue);
                setUnit(data.type === "%" ? unitOptions[0] : unitOptions[1]);
            })
            .catch((err) => {
                console.log("err: ", err);
            });
    }, [id]);

    const AddVoucher = () => {
        if (!CheckValidInfo()) {
            toast.warn("Vui lòng kiểm tra lại thông tin!", {
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
            .post("http://localhost:5000/api/discountCodes/create", {
                code: code.toUpperCase(),
                count: count,
                timeStart: timeStart,
                timeEnd: timeEnd,
                value: value,
                type: unit.label,
                maxValue: max,
                accountId: localStorage.getItem("accountID"),
            })
            .then((res) => {
                console.log("res create voucher: ", res);
                toast.success("Thêm Mã giảm giá thành công", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                update();
                closeFunction();
            })
            .catch((err) => {
                console.log(err);
                toast.error("Có lỗi xảy ra!", {
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

    const UpdateVoucher = () => {
        if (!CheckValidInfo()) {
            toast.warn("Vui lòng kiểm tra lại thông tin!", {
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
            .put("http://localhost:5000/api/discountCodes/update", {
                code: code.toUpperCase(),
                count: count,
                timeStart: timeStart,
                timeEnd: timeEnd,
                value: value,
                type: unit.label,
                maxValue: max,
                codeId: id,
            })
            .then((res) => {
                console.log("res create voucher: ", res);
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
                update();
                closeFunction();
            })
            .catch((err) => {
                console.log(err);
                toast.error("Có lỗi xảy ra!", {
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

    function CheckValidInfo() {
        if (code.trim().length < 6 || code.trim.length > 10) return false;
        if (!count) return false;
        if (!timeStart || !timeEnd) return false;
        if (timeStart > timeEnd) return false;
        if (!value) return false;
        console.log("unit.label: ", unit.label);
        if (unit.label === "%" && (value < 1 || value > 99)) return false;
        return true;
    }

    function DeleteCurrentVoucher() {
        axios
            .delete("http://localhost:5000/api/discountCodes/byCodeId", {
                params: {
                    codeId: id,
                    accountId: localStorage.getItem("accountID"),
                },
            })
            .then((res) => {
                console.log("res delete", res);
                toast.success("Xoá mã giảm giá thành công!", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                update();
                closeFunction();
            })
            .catch((err) => {
                console.log("err: ", err);
                toast.error("Có lỗi xảy ra!", {
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

    if (id === 0)
        // Add Modal
        return (
            <div className="AddVoucherModal">
                <div className="container">
                    <button className="close-button" onClick={closeFunction}>
                        <IoMdClose className="icon" />
                    </button>
                    <span className="title-text">
                        Thêm <span className="green-text">Mã Giảm Giá</span>{" "}
                    </span>
                    <div className="row">
                        <span className="label">Mã giảm giá</span>
                        <div className="info">
                            <input
                                className="code-input"
                                type="text"
                                value={code}
                                onChange={(e) =>
                                    setCode(e.target.value.replace(/ /g, ""))
                                }
                            />
                            <span
                                className="label"
                                style={{
                                    width: "fit-content",
                                    margin: "0 12px 0 30px",
                                }}
                            >
                                Số lượt
                            </span>
                            <input
                                className="count-input"
                                type="number"
                                placeholder="Số lượt"
                                value={count}
                                onChange={(e) => setCount(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row" style={{ marginTop: 0 }}>
                        <span className="warning">
                            * Mã giảm giá gồm 6-10 kí tự viết liền, không được
                            trùng với Mã giảm giá khác
                        </span>
                    </div>
                    <div className="row">
                        <span className="label">Ngày bắt đầu</span>
                        <div className="info">
                            <input
                                className="date-input"
                                type="datetime-local"
                                value={timeStart}
                                onChange={(e) => setTimeStart(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <span className="label">Ngày kết thúc</span>
                        <div className="info">
                            <input
                                className="date-input"
                                type="datetime-local"
                                value={timeEnd}
                                onChange={(e) => setTimeEnd(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <span className="label">Giá trị</span>
                        <div className="info">
                            <input
                                className="value-input"
                                type="number"
                                placeholder="Giá trị"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                            />
                            <Select
                                className="unit-select"
                                defaultValue={unit}
                                onChange={setUnit}
                                options={unitOptions}
                                theme={(theme) => ({
                                    ...theme,
                                    borderRadius: "8px",
                                    colors: {
                                        ...theme.colors,
                                        primary: "var(--primary-color)",
                                    },
                                })}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <span className="label">Giảm tối đa</span>
                        <div className="info">
                            <input
                                className="max-input"
                                type="number"
                                placeholder="Giảm tối đa"
                                disabled={unit !== unitOptions[0]}
                                value={unit === unitOptions[0] ? max : " "}
                                onChange={(e) => setMax(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <button
                            className="add-button primary-button"
                            onClick={AddVoucher}
                        >
                            Thêm Mã Giảm Giá
                        </button>
                    </div>
                </div>
            </div>
        );
    else
        return (
            //Update Modal
            <div className="AddVoucherModal">
                <div className="container">
                    <button className="close-button" onClick={closeFunction}>
                        <IoMdClose className="icon" />
                    </button>
                    <span className="title-text">
                        Cập Nhật <span className="green-text">Mã Giảm Giá</span>{" "}
                    </span>
                    <div className="row">
                        <span className="label">Mã giảm giá</span>
                        <div className="info">
                            <input
                                className="code-input"
                                type="text"
                                placeholder="VD: VOUCHER012"
                                value={code}
                                onChange={(e) =>
                                    setCode(e.target.value.replace(/ /g, ""))
                                }
                            />
                            <span
                                className="label"
                                style={{
                                    width: "fit-content",
                                    margin: "0 12px 0 30px",
                                }}
                            >
                                Số lượt
                            </span>
                            <input
                                className="count-input"
                                type="number"
                                placeholder="Số lượt"
                                value={count}
                                onChange={(e) => setCount(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row" style={{ marginTop: 0 }}>
                        <span className="warning">
                            * Mã giảm giá gồm 6-10 kí tự viết liền, không được
                            trùng với Mã giảm giá khác
                        </span>
                    </div>
                    <div className="row">
                        <span className="label">Ngày bắt đầu</span>
                        <div className="info">
                            <input
                                className="date-input"
                                type="datetime-local"
                                value={timeStart}
                                onChange={(e) => setTimeStart(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <span className="label">Ngày kết thúc</span>
                        <div className="info">
                            <input
                                className="date-input"
                                type="datetime-local"
                                value={timeEnd}
                                onChange={(e) => setTimeEnd(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <span className="label">Giá trị</span>
                        <div className="info">
                            <input
                                className="value-input"
                                type="number"
                                placeholder="Giá trị"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                            />
                            <Select
                                className="unit-select"
                                value={unit}
                                onChange={setUnit}
                                options={unitOptions}
                                theme={(theme) => ({
                                    ...theme,
                                    borderRadius: "8px",
                                    colors: {
                                        ...theme.colors,
                                        primary: "var(--primary-color)",
                                    },
                                })}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <span className="label">Giảm tối đa</span>
                        <div className="info">
                            <input
                                className="max-input"
                                type="number"
                                placeholder="Giảm tối đa"
                                value={unit === unitOptions[0] ? max : ""}
                                onChange={(e) => setMax(e.target.value)}
                                disabled={unit === unitOptions[1]}
                            />
                        </div>
                    </div>
                    <div className="row save-form">
                        <button
                            className="add-button primary-button save-form"
                            onClick={UpdateVoucher}
                        >
                            Lưu thông tin
                        </button>
                        <button
                            className="add-button primary-button save-form"
                            onClick={DeleteCurrentVoucher}
                        >
                            Xoá Mã
                        </button>
                    </div>
                </div>
            </div>
        );
};

export default Voucher;
