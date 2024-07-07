import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Lembrete npm install react-router-dom

export default function RetrieveGames() {
    const [games, setGames] = useState([]);
    const [authorized, setAuthorized] = useState(false);

    const config = {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem('token')
        }
    }

    useEffect(() => {
        async function fetchGames() {
            try {
                const resposta = await axios.get('http://localhost:3000/games/games', config);
                if (resposta.status === 200) {
                    setGames(resposta.data);
                    setAuthorized(true);
                }
            } catch (error) {
                setAuthorized(false);
            }
        }
        fetchGames();
    }, []);
  
    if (!authorized) return <p>Sem Autorização</p>;

    return (
        <div>
            <Link to='/create-game'>Adicionar Novo Jogo</Link>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Imagem</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map(game => (
                        <tr key={game.id}>
                            <td>
                                <Link to={`/game/${game.id}`}>{game.name}</Link>
                            </td>
                            <td>
                                <img src={game.url_image} alt={game.name} style={{ width: '100px', height: 'auto' }} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
