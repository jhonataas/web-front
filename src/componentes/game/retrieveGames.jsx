import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/RetrieveGames.css'; // Certifique-se de criar e importar o CSS

export default function RetrieveGames() {
    const [games, setGames] = useState([]);
    const [authorized, setAuthorized] = useState(false);
    const carouselRef = useRef(null);

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
  
    if (!authorized) return <p className="no-auth">Sem Autorização</p>;

    const scrollLeft = () => {
        carouselRef.current.scrollBy({ left: -600, behavior: 'smooth' });
    };

    const scrollRight = () => {
        carouselRef.current.scrollBy({ left: 600, behavior: 'smooth' });
    };

    return (
        <div className="carousel-container">
            <h2 className="carousel-title">Lista de Jogos</h2>
            <Link to='/create-game' className="add-game-link">Adicionar Novo Jogo</Link>
            <div className="carousel-wrapper">
                <button className="carousel-nav left" onClick={scrollLeft}>&lt;</button>
                <div className="carousel" ref={carouselRef}>
                    {games.map(game => (
                        <div key={game.id} className="carousel-item">
                            <Link to={`/game/${game.id}`} className="game-link">
                                <img src={game.url_image} alt={game.name} className="game-image" />
                                <div className="game-name">{game.name}</div>
                            </Link>
                        </div>
                    ))}
                </div>
                <button className="carousel-nav right" onClick={scrollRight}>&gt;</button>
            </div>
        </div>
    );
}
