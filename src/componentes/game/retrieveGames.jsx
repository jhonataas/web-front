import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Lembrete npm install react-router-dom

export default function RetrieveGames() {
    const [games, setGames] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
    const [authorized, setAuthorized] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const gamesPerPage = 15;

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
                    // Ordena os jogos pelo nome antes de armazenar
                    const sortedGames = resposta.data.sort((a, b) => a.name.localeCompare(b.name));
                    setGames(sortedGames);
                    setFilteredGames(sortedGames); // Inicializa os jogos filtrados com todos os jogos
                    setAuthorized(true);
                }
            } catch (error) {
                setAuthorized(false);
            }
        }
        fetchGames();
    }, []);

    // Função para filtrar os jogos conforme o usuário digita na barra de pesquisa
    useEffect(() => {
        const filtered = games.filter(game =>
            game.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredGames(filtered);
    }, [searchTerm, games]);

    // Lógica para calcular os jogos a serem exibidos na página atual
    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);

    // Função para alterar a página atual
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (!authorized) return <p>Sem Autorização</p>;

    return (
        <div>
            <Link to='/create-game'>Adicionar Novo Jogo</Link>
            <input
                type="text"
                placeholder="Buscar por nome de jogo"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Imagem</th>
                    </tr>
                </thead>
                <tbody>
                    {currentGames.map(game => (
                        <tr key={game.id}>
                            <td>
                                <Link to={`/games/${game.id}`}>{game.name}</Link>
                            </td>
                            <td>
                                <img src={game.url_image} alt={game.name} style={{ width: '100px', height: 'auto' }} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Paginação */}
            <ul className="pagination">
                {Array.from({ length: Math.ceil(filteredGames.length / gamesPerPage) }, (_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                        <button onClick={() => paginate(i + 1)} className="page-link">
                            {i + 1}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
