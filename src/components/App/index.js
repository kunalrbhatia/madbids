import React, { Component } from "react";
import Login from "../users/login";
import NewUser from "../users/newUser";
import Forgot from "../users/forget";
import { Router, Route, Switch } from "react-router-dom";
import history from "../common/history";
import NoInternet from "../common/NoInternet";
import { Helper } from "../common/helper";
import Bidlist from "../bids/bidlist";
import BidPage from "../bids/bidpage";
import Winner from "../bids/winner";
import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
//let hash = "";
class App extends Component {
  constructor(props) {
    super(props);
    this.Helper = new Helper(props);
    this.state = {
      globalVars: {
        userId: "1"
      }
    };
  }
  netOn = connected => {
    window.document.write("ok");
  };
  render() {
    //hash = history.location.pathname;
    const { globalVars } = this.state;
    return (
      <Router basename={"/db"} history={history}>
        <Switch>
          <Route
            path={ROUTES.SIGN_IN}
            component={props => <Login {...props} globalVars={globalVars} helper={this.Helper} />}
          />
          <Route
            path={ROUTES.SIGN_UP}
            component={props => <NewUser {...props} globalVars={globalVars} helper={this.Helper} />}
          />
          <Route
            path={ROUTES.PASSWORD_FORGET}
            component={props => <Forgot {...props} globalVars={globalVars} helper={this.Helper} />}
          />
          <Route
            path={ROUTES.BIDLIST}
            component={props => <Bidlist {...props} globalVars={globalVars} helper={this.Helper} />}
          />
          <Route
            path={ROUTES.BIDPAGE}
            component={props => <BidPage {...props} globalVars={globalVars} helper={this.Helper} />}
          />
          <Route
            path={ROUTES.WINNER}
            component={props => <Winner {...props} globalVars={globalVars} helper={this.Helper} />}
          />
          <Route
            path={ROUTES.NOINTERNET}
            component={props => <NoInternet {...props} globalVars={globalVars} helper={this.Helper} />}
          />
          <Route path="*" component={props => <Login {...props} globalVars={globalVars} helper={this.Helper} />} />
        </Switch>
      </Router>
    );
  }
}
const app = compose(withFirebase)(App);
export default withFirebase(app);


