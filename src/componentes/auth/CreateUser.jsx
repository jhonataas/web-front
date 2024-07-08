import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import '../../styles/CreateUser.css';

// Objeto de validação de campos com yup
const schema = yup.object({
    username: yup.string().required('Usuário obrigatório'),
    email: yup.string().email('Email inválido').required('Email obrigatório'),
    password: yup.string().min(2, 'Senha com no mínimo 2 caracteres').required('Senha obrigatória'),
    passwordConf: yup.string().required('Confirme a senha').oneOf([yup.ref('password')], 'As senhas devem coincidir!'),
}).required();

const CreateUser = () => {
    const [msg, setMsg] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:3000/auth/create', data);
            if (response.status === 200)
                setMsg('OK');
        } catch (error) {
            setMsg(error.response.data);
        }
    };

    if (msg === 'OK')
        return <Navigate to='/' />;

    return (
        <div className="login-container">
            <h2 className="login-title">Crie uma nova conta</h2>
            <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-group">
                    <label htmlFor="username" className="form-label">Usuário</label>
                    <input type="text" id="username" className="form-input" {...register('username')} />
                    <p className="error-message">{errors.username?.message}</p>
                </div>
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
                <div className="form-group">
                    <label htmlFor="passwordConf" className="form-label">Confirmar Senha</label>
                    <input type="password" id="passwordConf" className="form-input" {...register('passwordConf')} />
                    <p className="error-message">{errors.passwordConf?.message}</p>
                </div>
                <button type="submit" className="submit-button">Criar Usuário</button>
            </form>
            <p className="server-response">{msg}</p>
        </div>
    );
};

export default CreateUser;
