import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import LoginUser from './componentes/auth/LoginUser.jsx'
import CreateUser from './componentes/auth/CreateUser.jsx'
import Home from './componentes/Home.jsx'
import RetrieveGames from './componentes/game/retrieveGames.jsx'
import CreateGame from './componentes/game/createGame.jsx'
import UpdateGame from './componentes/game/updateGame.jsx'
import GameDetails from './componentes/game/gameDetails.jsx'

const routes = createBrowserRouter([
  {
    path: '/',
    element : <Home />,
    children: [
      {
        path : '/',
        element : <LoginUser />
      },
      {
        path: 'criar-user',
        element : <CreateUser />
      }
    ] 
  },
  {
    path: '/create-game',
    element : <CreateGame />
  },
  {
    path: '/fetch-games',
    element : <RetrieveGames />
  },
  {
    path: '/update-game',
    element : <UpdateGame />
  }
  ,
  {
    path: '/game/:id',
    element : <GameDetails />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={routes}/>
)