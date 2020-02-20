import React, { Component } from "react";
import Login from "./components/users/login";
import NewUser from "./components/users/newUser";
import Forgot from "./components/users/forget";
import { Router, Route, Switch } from "react-router-dom";
import history from "./common/history";
import NoInternet from "./components/common/NoInternet";
import { Helper } from "./common/helper";
import Bidlist from "./components/bids/bidlist";
import BidPage from "./components/bids/bidpage";
import Winner from "./components/bids/winner";
import * as ROUTES from "./constants/routes";
import * as firebase from "firebase/app";
import * as fb from "./constants/fb";
import "firebase/auth";
import "firebase/database";
import Communicate from "./components/communicate/communicate";
import Profile from "./components/users/profile";
import SpinWheel from "./components/games/spinwheel";
const config = fb.firebase.dev;
class App extends Component {
  constructor(props) {
    super(props);
    this.fb = firebase.initializeApp(config);
    this.Helper = new Helper();
    this.state = {
      gv: {
        uid: "1",
        us: this.updateState,
        fb: this.fb,
        auth: this.fb.auth(),
        db: this.fb.database(),
        ht: history,
        hl: this.Helper
      }
    };
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
          <Route path={ROUTES.PROFILE} component={props => <Profile {...props} gv={gv} helper={this.Helper} />} />
          <Route path={ROUTES.SPINWHEEL} component={props => <SpinWheel {...props} gv={gv} helper={this.Helper} />} />
          <Route
            path={ROUTES.COMMUNICATE}
            component={props => <Communicate {...props} gv={gv} helper={this.Helper} />}
          />
          <Route path={ROUTES.NOINTERNET} component={props => <NoInternet {...props} gv={gv} helper={this.Helper} />} />
          <Route path="*" component={props => <Login {...props} gv={gv} helper={this.Helper} />} />
        </Switch>
      </Router>
    );
  }
}
export default App;
