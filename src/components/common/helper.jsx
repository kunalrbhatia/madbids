import { Component } from "react";
import * as ROUTES from "../../constants/routes";
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
    props.firebase.doSignOut().then(e => {
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
}
export default { Helper };
