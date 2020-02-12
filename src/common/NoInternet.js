import React, { Component } from "react";

import { MButton } from "../common/FormElements";

class NoInternet extends Component {
  render() {
    return (
      <div className="NoInternet">
        <div className="connectionContainer">
          <img className="connectionImg" src={require("../images/noInternet.png")} alt="no Internet" />
          <p>Check your connection and try again.</p>
          <MButton
            style={{ margin: "3px 0px 2px" }}
            value={"Submit"}
            color={"primary"}
            onClick={this.onChange}
            fullWidth={true}
            name={"submit"}
          >
            Retry
          </MButton>
        </div>
      </div>
    );
  }
}
export default NoInternet;
//import Divider from '@material-ui/core/Divider';
