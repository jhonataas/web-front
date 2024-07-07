import React from 'react'
import { useLocation, Link, Navigate } from 'react-router-dom';//npm i react-router-dom
import { useState } from 'react';
import axios from 'axios'

export default function UpdateGame() {
    const [msg, setMsg] = useState('');

    const {id,name,description,url_image} = useLocation().state;

    const [game, setGame] = useState({
        id,  
        name,
        description,
        url_image
    });

    const handleChange = (e) =>{
        //constroi o novo valor
        const novoValor = {
            [e.target.name] : e.target.value
        }
        //atualizar
        setGame({
            ...game,
            ...novoValor
        });
    }


    const config = {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem('token')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const resposta = await axios.put('http://localhost:3000/games/update-game',game,config);
            if(resposta.status === 200){
                setMsg('OK');
                setAuthorized(true);
            }
        } catch (error) {
            console.log(error);
        }
        
    }

    if(msg === 'OK')
        return <Navigate to='/fetch-games'/>
    
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Título</label>
                <input type="text" id="name" name="name" 
                onChange={handleChange} value={game.name}
                />
            </div>
            <div>
                <label htmlFor="description">Descrição</label>
                <input type="text" name="description" id="description" 
                onChange={handleChange} value={game.description}
                />
            </div>
            <div>
                <label htmlFor="url_image">URL da Imagem</label>
                <input type="text" name="url_image" id="url_image" 
                onChange={handleChange} value={game.url_image}
                />
            </div>
            <Link to="/fetch-games">Voltar</Link>
            <button>Atualizar</button>
        </form>
    )
}
