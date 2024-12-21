import React, { useState } from "react";
import Login from "../components/login";
import Register from "../components/register";

const Auth = () => {
    const [activeTab, setActiveTab] = useState("register");

    const renderActiveTab = () => {
        if (activeTab === "register") {
            return <Register />;
        }
        return <Login />;
    };

    return (
        <div className="container mt-4">

            {/* Pills navs */}
            <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeTab === "login" ? "active" : ""}`}
                        onClick={() => setActiveTab("login")}
                    >
                        Login
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeTab === "register" ? "active" : ""}`}
                        onClick={() => setActiveTab("register")}
                    >
                        Register
                    </button>
                </li>
            </ul>
            {/* Pills navs */}

            {/* Render active tab */}
            <div className="tab-content">
                {renderActiveTab()}
            </div>
        </div>
    );
};

export default Auth;
