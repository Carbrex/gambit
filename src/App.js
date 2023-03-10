import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import About from './About';

import './App.css';
import ChessTV from './ChessTV';
import Error from './Error';
import Game from './Game';
import Game2 from './Game2';
import Game3 from './Game3';
import Game4 from './Game4';
import Home from './Home';
import Navbar from './Navbar';
import Play from './Play';

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
            <Route path="/play/:id">
              {/* <Game /> */}
              {/* <Game2/> */}
              <Game3/>
              {/* <Game4/> */}
            </Route>
            <Route path="/play">
              <Play />
            </Route>
            <Route path="/chess-tv">
              <ChessTV/>
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
