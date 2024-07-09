import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginUser from './componentes/auth/LoginUser';
import CreateUser from './componentes/auth/CreateUser';
import Home from './componentes/Home';
import RetrieveGames from './componentes/game/retrieveGames';
import CreateGame from './componentes/game/createGame';
import UpdateGame from './componentes/game/updateGame';
import GameDetails from './componentes/game/gameDetails';
import AuthLayout from './componentes/AuthLayout';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: '/',
        element: <LoginUser />
      },
      {
        path: 'criar-user',
        element: <CreateUser />
      }
    ]
  },
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: 'fetch-games',
        element: <RetrieveGames />
      },
      {
        path: 'create-game',
        element: <CreateGame />
      },
      {
        path: 'update-game',
        element: <UpdateGame />
      },
      {
        path: 'games/:id',
        element: <GameDetails />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={routes} />
);
