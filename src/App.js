import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import About from './About';

import './App.css';
import Error from './Error';
import Home from './Home';
import Navbar from './Navbar';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/">
            <Home/>
          </Route>
          <Route path="/about">
            <About/>
          </Route>
          <Route path="*">
            <Error/>
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
