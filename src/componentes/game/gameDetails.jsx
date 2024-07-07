import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function GameDetails() {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [evaluations, setEvaluations] = useState([]);
    const [newEvaluation, setNewEvaluation] = useState({ rate: '', comments: '' });
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchGameDetails() {
            try {
                const response = await axios.get(`http://localhost:3000/games/${id}`);
                setGame(response.data);
                setEvaluations(response.data.evaluations);
            } catch (error) {
                setError('Erro ao carregar os detalhes do jogo.');
                console.error(error);
            }
        }

        fetchGameDetails();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:3000/games/${id}/evaluations`, newEvaluation);
            setEvaluations([...evaluations, response.data]);
            setNewEvaluation({ rate: '', comments: '' });
        } catch (error) {
            setError('Erro ao adicionar a avaliação.');
        }
    };

    if (!game) {
        return <p>Carregando...</p>;
    }

    return (
        <div>
            <h1>{game.title}</h1>
            <p>{game.description}</p>
            <img src={game.url_image} alt={game.title} />
            <h2>Avaliações</h2>
            <ul>
                {evaluations.map(evaluation => (
                    <li key={evaluation.id}>
                        <p>Nota: {evaluation.rate}</p>
                        <p>Comentários: {evaluation.comments}</p>
                    </li>
                ))}
            </ul>
            <h3>Adicionar Avaliação</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nota</label>
                    <input
                        type="number"
                        value={newEvaluation.rate}
                        onChange={(e) => setNewEvaluation({ ...newEvaluation, rate: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Comentários</label>
                    <textarea
                        value={newEvaluation.comments}
                        onChange={(e) => setNewEvaluation({ ...newEvaluation, comments: e.target.value })}
                        required
                    />
                </div>
                <button type="submit">Adicionar Avaliação</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
}
