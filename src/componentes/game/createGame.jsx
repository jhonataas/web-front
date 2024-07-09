import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom'; // npm install react-router-dom
import axios from 'axios'; // npm install axios
import '../../styles/CreateGame.css'; // Certifique-se de criar e importar o CSS

export default function CreateGame() {
    const [msg, setMsg] = useState('');

    const [game, setGame] = useState({
        id: Date.now(),
        name: '',
        description: '',
        url_image: ''
    });

    const handleChange = (e) => {
        const novoValor = {
            id: Date.now(),
            [e.target.name]: e.target.value
        };
        setGame({
            ...game,
            ...novoValor
        });
    };

    const [authorized, setAuthorized] = useState(false);

    const config = {
        headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
    };

    useEffect(() => {
        async function validaAcesso() {
            try {
                const resposta = await axios.get('http://localhost:3000/games/games', config);
                if (resposta.status === 200) {
                    setAuthorized(true);
                }
            } catch (error) {
                setAuthorized(false);
            }
        }
        validaAcesso();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resposta = await axios.post('http://localhost:3000/games/create-game', game, config);
            if (resposta.status === 200) {
                setMsg('OK');
                setAuthorized(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (!authorized) return <p className="no-auth">Sem Autorização</p>;

    if (msg === 'OK') {
        return <Navigate to='/fetch-games' />;
    }

    return (
        <div className="form-container">
            <h2 className="form-title">Adicionar Novo Jogo</h2>
            <form onSubmit={handleSubmit} className="game-form">
                <div className="form-group">
                    <label htmlFor="name" className="form-label">Título</label>
                    <input type="text" id="name" name="name" className="form-input" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="description" className="form-label">Descrição</label>
                    <input type="text" name="description" id="description" className="form-input" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="url_image" className="form-label">URL da Imagem</label>
                    <input type="text" name="url_image" id="url_image" className="form-input" onChange={handleChange} />
                </div>
                <div className="form-actions">
                    <Link to="/fetch-games" className="back-link">Voltar</Link>
                    <button type="submit" className="submit-button">Enviar</button>
                </div>
            </form>
            {msg && <p className="server-response">{msg}</p>}
        </div>
    );
}
