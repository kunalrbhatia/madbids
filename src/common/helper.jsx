import { Component } from "react";
import * as ROUTES from "../constants/routes";
export class Helper extends Component {
  getIndex = (array, name) => {
    for (let i = 0; i < array.length; i++) {
      const e = array[i];
      if (e.name === name) {
        return i;
      }
    }
  };
  showOverlay = () => {
    document.getElementsByTagName("body")[0].classList.add("fixbody");
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.classList.add("overlay");
    const spinner = document.createElement("div");
    spinner.classList.add("lds-ripple");
    const spinner_inner1 = document.createElement("div");
    const spinner_inner2 = document.createElement("div");
    spinner.appendChild(spinner_inner1);
    spinner.appendChild(spinner_inner2);
    overlay.appendChild(spinner);
    document.body.appendChild(overlay);
    document.getElementById("overlay").style.display = "block";
  };
  hideOverlay = () => {
    document.getElementsByTagName("body")[0].classList.remove("fixbody");
    const elem = document.getElementById("overlay");
    if (elem) document.body.removeChild(elem);
  };
  doLogout(props) {
    props.gv.auth.signOut().then(e => {
      if (localStorage.getItem("token") != null) {
        localStorage.removeItem("token");
      }
      if (localStorage.getItem("uid") != null) {
        localStorage.removeItem("uid");
      }
      if (localStorage.getItem("productInfo") != null) {
        localStorage.removeItem("productInfo");
      }
      if (localStorage.getItem("remember_me") != null) {
        localStorage.removeItem("remember_me");
      }
      props.history.push(ROUTES.LANDING);
    });
  }
  getCurrentUser = auth => auth.currentUser;
  doCreateUserWithEmailAndPassword = (email, password, auth) => auth.createUserWithEmailAndPassword(email, password);
  doSignInWithEmailAndPassword = (email, password, auth) => auth.signInWithEmailAndPassword(email, password);
  doSignOut = fb => fb.auth.signOut();
  doPasswordReset = (email, fb) => fb.auth.sendPasswordResetEmail(email);
  doPasswordUpdate = (password, fb) => fb.auth.currentUser.updatePassword(password);
  // *** Database API ***
  auctions = fb => fb.ref("auctions");
  users = fb => fb.ref("users");
  user = (uid, fb) => fb.ref(`users/${uid}`);
  products = db => db.ref("products");

  bids = fb => fb.ref("bids");
  bid = (bid, fb) => fb.ref(`bids/${bid}`);
}
export default { Helper };
