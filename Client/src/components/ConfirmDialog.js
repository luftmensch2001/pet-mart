import React from "react";
import "./ConfirmDialog.css";

const ConfirmDialog = ({
    message,
    yesLabel,
    noLabel,
    yesFunction,
    noFunction,
}) => {
    return (
        <div className="ConfirmDialog">
            <div className="container">
                <span className="message">{message}</span>
                <div className="buttons">
                    <button className="yes-button" onClick={yesFunction}>
                        {yesLabel}
                    </button>
                    <button className="no-button" onClick={noFunction}>
                        {noLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
