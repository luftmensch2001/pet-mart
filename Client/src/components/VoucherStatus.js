import React from "react";
import "./VoucherStatus.css";
import { IoIosCheckmark, IoIosClose, IoMdTime } from "react-icons/io";
import { BsCheckCircle, BsCalendarX } from "react-icons/bs";
import {
    AiOutlineClockCircle,
    AiOutlineCloseCircle,
    AiOutlineCheckCircle,
} from "react-icons/ai";

const VoucherStatus = ({ status }) => {
    return (
        <div className={"VoucherStatus type" + status}>
            {status === 1 && <AiOutlineClockCircle className="status-icon" />}
            {status === 2 && <AiOutlineCheckCircle className="status-icon" />}
            {status === 3 && <AiOutlineCloseCircle className="status-icon" />}
            {status === 4 && <BsCalendarX className="status-icon" />}

            {status === 1 && <span className="status-name">Chưa đến ngày</span>}
            {status === 2 && <span className="status-name">Có thể dùng</span>}
            {status === 3 && <span className="status-name">Đã hết lượt</span>}
            {status === 4 && <span className="status-name">Đã hết hạn</span>}
        </div>
    );
};

export default VoucherStatus;
