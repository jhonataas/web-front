import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/UpdateGame.css';

export default function UpdateGame() {
    const [msg, setMsg] = useState('');
    const location = useLocation();
    const gameData = location.state || {};
    const [game, setGame] = useState({
        id: gameData.id || '',
        name: gameData.name || '',
        description: gameData.description || '',
        url_image: gameData.url_image || '',
        evaluations: gameData.evaluations || []
    });

    const config = {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem('token')
        }
    };

    useEffect(() => {
        if (!gameData.id || !gameData.name || !gameData.description || !gameData.url_image) {
            const fetchGameDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/games/games/${gameData.id}`, config);
                    setGame({
                        id: response.data.id,
                        name: response.data.name,
                        description: response.data.description,
                        url_image: response.data.url_image,
                        evaluations: response.data.evaluations
                    });
                } catch (error) {
                    setMsg('Dados do jogo não encontrados.');
                    console.error(error);
                }
            };
            fetchGameDetails();
        }
    }, [gameData, config]);

    const handleChange = (e) => {
        const novoValor = {
            [e.target.name]: e.target.value
        }
        setGame({
            ...game,
            ...novoValor
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { id, evaluations, ...updateData } = game;
            const resposta = await axios.put(`http://localhost:3000/games/update-game/${id}`, updateData, config);
            if (resposta.status === 200) {
                setMsg('OK');
            }
        } catch (error) {
            console.log(error);
        }
    }

    if (msg === 'OK') {
        return <Navigate to='/fetch-games' />;
    }

    if (msg === 'Dados do jogo não encontrados.') {
        return <p>{msg}</p>;
    }

    return (
        <div className="update-game">
            <h2 className="update-game-title">Atualizar Jogo</h2>
            <form onSubmit={handleSubmit} className="update-game-form">
                <div className="form-group">
                    <label htmlFor="name" className="form-label">Título</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        onChange={handleChange}
                        value={game.name}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description" className="form-label">Descrição</label>
                    <input
                        type="text"
                        name="description"
                        id="description"
                        onChange={handleChange}
                        value={game.description}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="url_image" className="form-label">URL da Imagem</label>
                    <input
                        type="text"
                        name="url_image"
                        id="url_image"
                        onChange={handleChange}
                        value={game.url_image}
                        className="form-input"
                    />
                </div>
                <button type="submit" className="button">Atualizar</button>
            </form>
        </div>
    );
}
