import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/Profile.css';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showChangePassword, setShowChangePassword] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('http://localhost:3000/auth/me', {
                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem('token')
                    }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Erro ao buscar perfil do usuário', error);
            }
        };

        fetchUserProfile();
    }, []);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/auth/change-password', 
                { currentPassword, newPassword }, 
                {
                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem('token')
                    }
                }
            );
            setMessage(response.data);
        } catch (error) {
            setMessage(error.response.data || 'Erro ao alterar a senha');
            console.error('Erro ao alterar a senha', error);
        }
    };

    if (!user) {
        return <p>Carregando...</p>;
    }

    return (
        <div className="profile-container">
            <h1>Perfil do Usuário</h1>
            <p><strong>Nome:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button 
                className="change-password-button"
                onClick={() => setShowChangePassword(!showChangePassword)}
            >
                {showChangePassword ? 'Cancelar' : 'Alterar Senha'}
            </button>
            {showChangePassword && (
                <div className="change-password-form">
                    <h2>Alterar Senha</h2>
                    <form onSubmit={handleChangePassword}>
                        <div>
                            <label htmlFor="currentPassword">Senha Atual</label>
                            <input 
                                type="password" 
                                id="currentPassword" 
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                placeholder="Digite sua senha atual"
                            />
                        </div>
                        <div>
                            <label htmlFor="newPassword">Nova Senha</label>
                            <input 
                                type="password" 
                                id="newPassword" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                placeholder="Digite sua nova senha"
                            />
                        </div>
                        <button type="submit">Alterar Senha</button>
                    </form>
                </div>
            )}
            {message && <p className="message">{message}</p>}
        </div>
    );
}
