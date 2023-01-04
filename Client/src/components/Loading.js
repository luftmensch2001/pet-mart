import React from "react";
import "./Loading.css";

const Loading = () => {
    return (
        <div
            className="LoadingContainer"
            style={{
                width: "100%",
                height: "400px",
                position: "relative",
            }}
        >
            <div className="Loading">
                <div className="loader">
                    <div className="orbe o0"></div>
                    <div className="orbe o1"></div>
                    <div className="orbe o2"></div>
                    <div className="orbe o3"></div>
                    <div className="orbe o4"></div>
                </div>
            </div>
        </div>
    );
};

export default Loading;
