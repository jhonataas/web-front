// src/componentes/Home.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../componentes/auth/Navbar';
import "../styles/CreateUser.css"; // Certifique-se de que o caminho está correto

export default function Home() {
    return (
        <div>
            <Navbar />
            <div className="content">
                <Outlet />
            </div>
        </div>
    );
}
