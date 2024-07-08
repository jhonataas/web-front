import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';

export default function UpdateGame() {
    const [msg, setMsg] = useState('');
    const location = useLocation();

    // Verifica se o estado está presente e contém os dados necessários
    const gameData = location.state || {};

    // Estado local do componente para os dados do jogo
    const [game, setGame] = useState({
        id: gameData.id || '',
        name: gameData.name || '',
        description: gameData.description || '',
        url_image: gameData.url_image || '',
        evaluations: gameData.evaluations || []
    });

    // Configuração do cabeçalho para a requisição HTTP
    const config = {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem('token')
        }
    };

    // Busca dados do jogo se não estiverem presentes no estado
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

    // Handler para mudança nos inputs do formulário
    const handleChange = (e) => {
        const novoValor = {
            [e.target.name]: e.target.value
        }
        setGame({
            ...game,
            ...novoValor
        });
    }

    // Handler para submissão do formulário de atualização
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Exclui id e evaluations dos dados enviados
            const { id, evaluations, ...updateData } = game;

            const resposta = await axios.put(`http://localhost:3000/games/update-game/${id}`, updateData, config);
            if (resposta.status === 200) {
                setMsg('OK');
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Redireciona para a lista de jogos se a atualização foi bem-sucedida
    if (msg === 'OK') {
        return <Navigate to='/fetch-games' />;
    }

    // Exibe mensagem de erro se os dados do jogo não foram encontrados
    if (msg === 'Dados do jogo não encontrados.') {
        return <p>{msg}</p>;
    }

    // Renderiza o formulário de atualização do jogo
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Título</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    onChange={handleChange}
                    value={game.name}
                />
            </div>
            <div>
                <label htmlFor="description">Descrição</label>
                <input
                    type="text"
                    name="description"
                    id="description"
                    onChange={handleChange}
                    value={game.description}
                />
            </div>
            <div>
                <label htmlFor="url_image">URL da Imagem</label>
                <input
                    type="text"
                    name="url_image"
                    id="url_image"
                    onChange={handleChange}
                    value={game.url_image}
                />
            </div>
            <button type="submit">Atualizar</button>
        </form>
    );
}
