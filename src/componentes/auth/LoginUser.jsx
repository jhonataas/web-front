import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import '../../styles/CreateUser.css';

// Objeto de validação de campos com yup
const schema = yup.object({
    email: yup.string().email('Email inválido').required('Email obrigatório'),
    password: yup.string().min(2, 'Senha com no mínimo 2 caracteres').required('Senha obrigatória'),
}).required();

const LoginUser = () => {
    const [msg, setMsg] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:3000/auth/login', data);
            sessionStorage.setItem('token', response.data);

            const userResponse = await axios.get('http://localhost:3000/auth/me', {
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem('token')
                }
            });

            const { id, username } = userResponse.data;

            sessionStorage.setItem('userId', id);
            sessionStorage.setItem('userName', username);
            console.log(username);
            setMsg('Usuário Autenticado');
        } catch (error) {
            setMsg(error.response?.data || 'Erro ao autenticar');
        }
    };

    if (msg.includes('Usuário Autenticado')) {
        return <Navigate to='/fetch-games' />;
    }

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <h2 className="login-title">Login</h2>
                <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="text" id="email" className="form-input" {...register('email')} />
                        <p className="error-message">{errors.email?.message}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Senha</label>
                        <input type="password" id="password" className="form-input" {...register('password')} />
                        <p className="error-message">{errors.password?.message}</p>
                    </div>
                    <div className="form-group form-actions">
                        <label>
                            <input type="checkbox" className="form-checkbox" /> Lembrar-me
                        </label>
                    </div>
                    <button type="submit" className="submit-button">Entrar</button>
                </form>
                <p className="server-response">{msg}</p>
                <div className="signup-link">
                    Não tem uma conta? <Link to="/criar-user" className="signup-link-text">Registrar</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginUser;
