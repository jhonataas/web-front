// src/componentes/AuthLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import "../styles/CreateUser.css";

export default function AuthLayout() {
    return (
        <div>
            <div className="content">
                <Outlet />
            </div>
        </div>
    );
}
