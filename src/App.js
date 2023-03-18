import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import About from './About';

import './App.css';
import ChessTV from './ChessTV';
import Error from './Error';
import Game from './Game';
import Chat from './Chat';
import Game2 from './Game2';
import Game3 from './Game3';
import Game4 from './Game4';
import Home from './Home';
import Navbar from './Navbar';
import Play from './Play';
import StartGame from './StartGame';
import { GameContextProvider } from './GameContext';
import Login from './Login';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <main className="page">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/chat/:id">
              <Chat />
            </Route>
            <PrivateRoute path="/game">
              <StartGame />
            </PrivateRoute>
            <PrivateRoute path="/play/:id">
              <GameContextProvider>
                <Game />
                {/* <Game2/> */}
                {/* <Game3 /> */}
                {/* <Game4/> */}
              </GameContextProvider>
            </PrivateRoute>
            <Route path="/play">
              <Play />
            </Route>
            <Route path="/login">
              <Login/>
            </Route>
            <Route path="/chess-tv">
              <ChessTV />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="*">
              <Error />
            </Route>
          </Switch>
        </main>
      </Router>
    </>
  );
}

export default App;
