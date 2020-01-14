import React, { Component } from "react";
import Login from "../users/login";
import NewUser from "../users/newUser";
import Forgot from "../users/forget";
import { Router, Route, Switch } from "react-router-dom";
import history from "../common/history";
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
    this.Helper = new Helper();
    this.state = {
      globalVars: {
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
          <Route path={ROUTES.WINNER} component={props => <Winner {...props} globalVars={globalVars} />} />
          <Route path="*" component={props => <Login {...props} globalVars={globalVars} />} />
        </Switch>
      </Router>
    );
  }
}
const app = compose(withFirebase)(App);
export default withFirebase(app);
