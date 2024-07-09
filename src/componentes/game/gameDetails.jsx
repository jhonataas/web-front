import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../../styles/GameDetails.css';

export default function GameDetails() {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [evaluations, setEvaluations] = useState([]);
    const [newEvaluation, setNewEvaluation] = useState({ rate: '', comments: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const usuarioId = sessionStorage.getItem('userId');
    const usuarioName = sessionStorage.getItem('userName');

    const config = {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem('token')
        }
    }

    useEffect(() => {
        async function fetchGameDetails() {
            try {
                const response = await axios.get(`http://localhost:3000/games/games/${id}`, config);
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
            const evaluationData = {
                rate: newEvaluation.rate,
                comments: newEvaluation.comments,
                userId: usuarioId,
                userName: usuarioName
            };

            const response = await axios.post(`http://localhost:3000/games/games/${id}/evaluations`, evaluationData, config);
            const evaluationWithUser = { ...response.data, userName: usuarioName };
            setEvaluations([...evaluations, evaluationWithUser]);
            setNewEvaluation({ rate: '', comments: '' });
        } catch (error) {
            setError('Erro ao adicionar a avaliação.');
            console.error(error);
        }
    };

    const handleDelete = async () =>{
        let c = confirm(`Deseja apagar o jogo ${name}`);
        if(c === true){
          try {
            const resposta = await axios.delete(`http://localhost:3000/games/remove-game/${id}`,config);
            if(resposta.status === 200)
                navigate('/fetch-games');
          } catch (error) {
            console.log(error);
          }
        }
      }
    
    const handleDeleteEvaluation = async (evaluationId) => {
        try {
            const response = await axios.delete(`http://localhost:3000/evaluations/${evaluationId}`, config);
            if (response.status === 200) {
                setEvaluations(evaluations.filter(evaluation => evaluation.id !== evaluationId));
            }
        } catch (error) {
            setError('Erro ao apagar a avaliação.');
            console.error(error);
        }
    };

    const handleEdit = async (evaluationId, updatedEvaluation) => {
        try {
            const response = await axios.put(`http://localhost:3000/evaluations/${evaluationId}`, updatedEvaluation, config);
            if (response.status === 200) {
                setEvaluations(evaluations.map(evaluation => (evaluation.id === evaluationId ? response.data : evaluation)));
            }
        } catch (error) {
            setError('Erro ao editar a avaliação.');
            console.error(error);
        }
    };

    if (!game) {
        return <p>Carregando...</p>;
    }

    const { name, description, url_image } = game;

    return (
        <div className="game-details">
            <div className="game-details-header">
                <Link to='/update-game' state={{name,description,url_image,id}} className="button update-button">Atualizar</Link>
                <button onClick={handleDelete} className="button delete-button">Apagar</button>
            </div>
            <div className="game-main-info">
                <img src={url_image} alt={name} className="game-image" />
                <div className="game-description">
                    <h1 className="game-title">{name}</h1>
                    <p>{description}</p>
                </div>
            </div>
            <h2 className="evaluations-title">Avaliações</h2>
            <ul className="evaluations-list">
                {evaluations.map(evaluation => (
                    <li key={evaluation.id} className="evaluation-item">
                        <p className="evaluation-user">Usuário: {evaluation.userName}</p>
                        <p className="evaluation-rate">Nota: {evaluation.rate}</p>
                        <p className="evaluation-comments">Comentários: {evaluation.comments}</p>
                        {usuarioId === evaluation.userId && (
                            <>
                                <button onClick={() => handleDeleteEvaluation(evaluation.id)} className="button delete-button">Apagar</button>
                                <button onClick={() => handleEdit(evaluation.id, { rate: 'nova nota', comments: 'novos comentários' })} className="button edit-button">Editar</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
            <h3 className="add-evaluation-title">Adicionar Avaliação</h3>
            <form onSubmit={handleSubmit} className="evaluation-form">
                <div className="form-group">
                    <label className="form-label">Nota</label>
                    <input
                        type="number"
                        value={newEvaluation.rate}
                        onChange={(e) => setNewEvaluation({ ...newEvaluation, rate: e.target.value })}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Comentários</label>
                    <textarea
                        value={newEvaluation.comments}
                        onChange={(e) => setNewEvaluation({ ...newEvaluation, comments: e.target.value })}
                        required
                        className="form-input"
                    />
                </div>
                <button type="submit" className="button submit-button">Adicionar Avaliação</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            <Link to='/fetch-games' className="button back-button">Voltar</Link>
        </div>
    );
}
