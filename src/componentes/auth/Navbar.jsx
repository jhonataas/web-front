// src/componentes/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Navbar.css';

export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">GameZone</Link>
                <ul className="navbar-menu">
                    <li className="navbar-item">
                        <Link to="/fetch-games" className="navbar-link">Jogos</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/create-game" className="navbar-link">Adicionar Jogo</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/profile" className="navbar-link">Perfil</Link>
                    </li>
                </ul>
                <button className="logout-button" onClick={handleLogout}>Sair</button>
            </div>
        </nav>
    );
}
