import React, { useEffect } from 'react'
import { useState } from "react"
import { Link, Navigate } from "react-router-dom";//npm install react-router-dom
import axios from 'axios';//npm install axios

export default function CreateGame() {
    
    const [msg, setMsg] = useState('');

    const [game, setGame] = useState({
        id : Date.now(),
        name : '',
        description : '',
        url_image : '',
        evaluations: []
    });

    const handleChange = (e) =>{
        //constroi o novo valor
        const novoValor = {
            id : Date.now(),
            [e.target.name] : e.target.value
        }
        //atualizar
        setGame({
            ...game,
            ...novoValor
        });
    }


    const [authorized, setAuthorized] = useState(false);

    const config = {
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem('token')
        }
    }

    useEffect(() =>{
        
        async function validaAcesso(){
            try {
                const resposta = await axios.get('http://localhost:3000/games/games',config);
                if(resposta.status === 200){
                     setAuthorized(true)
                }  
            } catch (error) {
                setAuthorized(false)
            }
        }
        validaAcesso();
    },[]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(game);
        try {
            const resposta = await axios.post('http://localhost:3000/games/create-game',game,config);
            if(resposta.status === 200){
                setMsg('OK');
                setAuthorized(true);
            }
        } catch (error) {
            console.log(error);    
        }
    }

    if(!authorized)
        return <p>Sem Autorização</p>

    if(msg === 'OK'){
        //NAVEGAR PARA Listar Propriedades
        return <Navigate to='/fetch-games' />
    }
    
    

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Título</label>
                <input type="text" id="name" name="name" 
                onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="description">Descrição</label>
                <input type="text" name="description" id="description" 
                onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="url_image">URL da Imagem</label>
                <input type="text" name="url_image" id="url_image" 
                onChange={handleChange}
                />
            </div>
            <Link to="/fetch-games" >Voltar</Link>
            <button>Enviar</button>

        </form>
    )
}
