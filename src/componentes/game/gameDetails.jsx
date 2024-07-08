import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

export default function GameDetails() {
    const { id } = useParams();  // Pega o ID dos parâmetros da URL
    const [game, setGame] = useState(null);  // Estado para armazenar os detalhes do jogo
    const [evaluations, setEvaluations] = useState([]);  // Estado para armazenar as avaliações do jogo
    const [newEvaluation, setNewEvaluation] = useState({ rate: '', comments: '' });  // Estado para armazenar nova avaliação
    const [error, setError] = useState(null);  // Estado para armazenar mensagens de erro
    const navigate = useNavigate();

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
            const response = await axios.post(`http://localhost:3000/games/games/${id}/evaluations`, newEvaluation, config);
            setEvaluations([...evaluations, response.data]);
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

    if (!game) {
        return <p>Carregando...</p>;
    }

    const { name, description, url_image } = game;

    return (
        <div>
            <Link to='/update-game' state={{name,description,url_image,id}}>Atualizar</Link>
            <button onClick={handleDelete}>Apagar</button>
            <h1>{name}</h1>
            <p>{description}</p>
            <img src={url_image} alt={name} />
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
            <Link to='/fetch-games'>Voltar</Link>
        </div>
    );
}
