import React, { Component } from "react";
import Login from "./components/users/login";
import NewUser from "./components/users/newUser";
import Forgot from "./components/users/forget";
import { Router, Route } from "react-router-dom";
import history from "./components/common/history";
import { Helper } from "./components/common/helper";

class App extends Component {
  constructor() {
    super();
    this.Helper = new Helper();
    this.state = {
      globalVars: {
        //base_URL: "http://35.200.211.35/dbk/",
        //base_URL: "http://192.168.0.20:3100/api/v1/", // vaibhav
        //base_URL: "http://192.168.0.24:3100/api/v1/", // vaibhav
        base_URL: "http://localhost:3100/api/v1/", // local
        //base_URL: "http://192.168.0.25:3100/api/v1/", // Kunal
        userId: "1"
      }
    };
  }
  render() {
    let hash = history.location.pathname;
    const { globalVars } = this.state;
    if (hash === "/login" || hash === "/signin") {
      return (
        <Router basename={"/db"} history={history}>
          <Route path="/login" component={props => <Login {...props} globalVars={globalVars} />} />
          {/* <Route path="/signup" component={props => <Signup {...props} globalVars={globalVars} />} /> */}
        </Router>
      );
    } else if (hash === "/newuser" || hash === "/signup") {
      return (
        <Router basename={"/db"} history={history}>
          <Route path="/newuser" component={props => <NewUser {...props} globalVars={globalVars} />} />
          {/* <Route path="/signup" component={props => <Signup {...props} globalVars={globalVars} />} /> */}
        </Router>
      );
    } else if (hash === "/forgot-passowrd") {
      return (
        <Router basename={"/db"} history={history}>
          <Route path="/forgot-passowrd" component={props => <Forgot {...props} globalVars={globalVars} />} />
          {/* <Route path="/signup" component={props => <Signup {...props} globalVars={globalVars} />} /> */}
        </Router>
      );
    } else {
      return (
        <Router basename={"/db"} history={history}>
          <Route path="*" component={props => <Login {...props} globalVars={globalVars} />} />
        </Router>
      );
    }
  }
  /* return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          React
        </a>
      </header>
    </div>
  ); */
}

export default App;
