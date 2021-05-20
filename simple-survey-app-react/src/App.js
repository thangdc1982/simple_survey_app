import React from 'react';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { signIn, signOut } from './actions/UserActions';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from "./firebase";

function App() {  

  const user = useSelector(state => {    
    return state.user.user;
  });

  const dispatch = useDispatch();  

  const onSignOut = () => {
    dispatch(signOut());
    auth.signOut();
  };

  return (
    <Router>
    <div className="App">
      <header className="App-header">
        <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
          <div className="container">
            <Link className="navbar-brand" to="/dashboard">                            
              Survey Application
            </Link>                    
          </div>
          <div className="signOut-button" onClick={onSignOut}>
            {/* 
              {user.photo} 
              Use user avatar later to indicating loggin
            */}            
            <img src={process.env.PUBLIC_URL + '/Surveys-icon24.png'} className="avatar" alt="Avatar"></img>                        
            {user ? "Sign out" : "Sign in"}
          </div> 
        </nav>
      </header>
      <div className="container">
        <main role="main" className="pb-3">    
        <Switch>
          <Route path="/dashboard">
            <Dashboard></Dashboard>
          </Route>
          <Route path="/">
            <Login
              signIn={signIn}              
            ></Login>
          </Route>
        </Switch>            
        </main>
      </div>

      <footer className="border-top footer text-muted">
        <div className="container">
          &copy; 2021 - Simple Survey Application
        </div>
      </footer>
    </div>    
    </Router>
  );
}

export default App;
