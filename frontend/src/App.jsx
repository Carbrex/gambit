import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import About from './Pages/About';

import ChessTV from './Components/ChessTV';
import Error from './Components/Error';
import Game from './Pages/Game';
import Home from './Pages/Home';
import Navbar from './Components/Navbar';
import Play from './Pages/Play';
import { GameContextProvider } from './Components/GameContext';
import Login from './Pages/Login';
import PrivateRoute from './Components/PrivateRoute';
import Hero from './Components/Hero';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <main className="page">
          <Hero />
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <PrivateRoute path="/play/:id">
              <GameContextProvider>
                <Game />
              </GameContextProvider>
            </PrivateRoute>
            <PrivateRoute path="/play">
              <Play />
            </PrivateRoute>
            <Route path="/login">
              <Login />
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
