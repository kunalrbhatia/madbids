import React, { Component } from "react";
import Login from "../users/login";
import NewUser from "../users/newUser";
import Forgot from "../users/forget";
import { Router, Route, Switch } from "react-router-dom";
import history from "../common/history";
import { Helper } from "../common/helper";
import Bidlist from "../bids/bidlist";
import BidPage from "../bids/bidpage";
import * as ROUTES from "../../constants/routes";
//let hash = "";
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
    //hash = history.location.pathname;
    const { globalVars } = this.state;
    return (
      <Router basename={"/db"} history={history}>
        <Switch>
          <Route path={ROUTES.SIGN_IN} component={props => <Login {...props} globalVars={globalVars} />} />
          <Route path={ROUTES.SIGN_UP} component={props => <NewUser {...props} globalVars={globalVars} />} />
          <Route path={ROUTES.PASSWORD_FORGET} component={props => <Forgot {...props} globalVars={globalVars} />} />
          <Route path={ROUTES.BIDLIST} component={props => <Bidlist {...props} globalVars={globalVars} />} />
          <Route path={ROUTES.BIDPAGE} component={props => <BidPage {...props} globalVars={globalVars} />} />
          <Route path="*" component={props => <Login {...props} globalVars={globalVars} />} />
        </Switch>
      </Router>
    );
  }
}

export default App;
