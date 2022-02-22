import React, { Component } from 'react';
import { Switch,Route,BrowserRouter as Router,withRoute, Redirect} from 'react-router-dom';



import './App.css';
import Login from './containers/Login';
import Dashboard from './containers/Dashboard';
import Questions from './containers/Questions';
import UserReference from './containers/UserReference';

function App() {
  return (
    <Router>
    <div className="App">
      <Switch>
        {/* <Redirect from="/" to="/Login" exact component={Login}/> */}
        <Route exact path="/">
          <Redirect to="/Login" />
        </Route>
        <Route path="/Login" exact component={Login} />
        <Route path='/my-liquorstore/dashboard' exact component={Dashboard} />
        <Route path='/my-liquorstore/questions' exact component={Questions} />
        <Route path='/my-liquorstore/saved reference' exact component={UserReference} />
      </Switch>
    </div>
  </Router>
  );
}

export default App;
