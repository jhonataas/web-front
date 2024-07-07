import React from 'react'
import {Link} from 'react-router-dom' //npm i react-router-dom
import axios from 'axios'//npm i axios

export default function Game({id,name,description,url_image}) {

  const config = {
    headers: {
        Authorization: "Bearer " + sessionStorage.getItem('token')
    }
  }


  const handleDelete = async () =>{
    let c = confirm(`Deseja apagar o jogo ${name}`);
    if(c === true){
      try {
        const resposta = await axios.delete(`http://localhost:3000/games/remove-game/${id}`,config);
        if(resposta.status === 200)
          location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <tr>
        <td>{name}</td>
        <td>{description}</td>
        <td>{url_image}</td>
        <td>
            <Link to='/update-game' state={{name,description,url_image,id}}>Atualizar</Link>
            <button onClick={handleDelete}>Apagar</button>
        </td>
    </tr>
  )
}