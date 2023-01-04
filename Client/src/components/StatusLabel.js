import React from "react";
import "./StatusLabel.css";

import { IoIosCheckmark, IoIosClose, IoMdTime } from "react-icons/io";
import { TbTruckDelivery } from "react-icons/tb";

function StatusLabel(props) {
    return (
        <div className={"StatusLabel type" + props.type}>
            {props.type === "1" && <IoMdTime className="status-icon" />}
            {props.type === "2" && <TbTruckDelivery className="status-icon" />}
            {props.type === "3" && <IoIosCheckmark className="status-icon" />}
            {props.type === "4" && <IoIosClose className="status-icon" />}

            {props.type === "1" && (
                <span className="status-name">Đang chờ xác nhận</span>
            )}
            {props.type === "2" && (
                <span className="status-name">Đang vận chuyển</span>
            )}
            {props.type === "3" && (
                <span className="status-name">Đã giao hàng</span>
            )}
            {props.type === "4" && <span className="status-name">Đã huỷ</span>}
        </div>
    );
}

export default StatusLabel;
