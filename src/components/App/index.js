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
import * as firebase from "firebase/app";
import * as fb from "../../constants/fb";
import "firebase/auth";
import "firebase/database";
const config = fb.firebase.dev;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gv: {
        userId: "1",
        updateState: this.updateState
      }
    };
    this.Helper = new Helper(props);
  }
  componentDidMount() {
    console.log(this.state);
  }
  updateState = () => {
    this.setState(this.state);
  };
  render() {
    //hash = history.location.pathname;
    const { gv } = this.state;
    return (
      <Router basename={"/db"} history={history}>
        <Switch>
          <Route path={ROUTES.SIGN_IN} component={props => <Login {...props} gv={gv} helper={this.Helper} />} />
          <Route path={ROUTES.SIGN_UP} component={props => <NewUser {...props} gv={gv} helper={this.Helper} />} />
          <Route
            path={ROUTES.PASSWORD_FORGET}
            component={props => <Forgot {...props} gv={gv} helper={this.Helper} />}
          />
          <Route path={ROUTES.BIDLIST} component={props => <Bidlist {...props} gv={gv} helper={this.Helper} />} />
          <Route path={ROUTES.BIDPAGE} component={props => <BidPage {...props} gv={gv} helper={this.Helper} />} />
          <Route path={ROUTES.WINNER} component={props => <Winner {...props} gv={gv} helper={this.Helper} />} />
          <Route path={ROUTES.NOINTERNET} component={props => <NoInternet {...props} gv={gv} helper={this.Helper} />} />
          <Route path="*" component={props => <Login {...props} gv={gv} helper={this.Helper} />} />
        </Switch>
      </Router>
    );
  }
}
const app = compose(withFirebase)(App);
export default withFirebase(app);
