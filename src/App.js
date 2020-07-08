import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Dashboard from "./components/layout/Dashboard";
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import Pokemon from './components/pokemon/Pokemon';
class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route exact path="/pokemon/:pokemonIndex" component={Pokemon} />
              <Dashboard />

            </Switch>
          </div>
        </div>
        <Footer />

      </Router>
    );
  }
}
export default App;
