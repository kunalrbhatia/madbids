import React, { Component } from "react";
import { Container, Box } from "@material-ui/core";
import { Copyright } from "../common/FormElements";
//import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
class Winner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onChange: this.handleChange(),
      bidlist: [],
      userslist: []
    };
    this.getValuesFromDB();
  }
  getValuesFromDB = () => {
    this.props.firebase.bids().on("value", async snapshot => {
      const bidsObject = snapshot.val();
      const _bidsList = Object.keys(bidsObject).map(key => ({
        ...bidsObject[key],
        bid: key
      }));
      this.setState({ bidlist: _bidsList }, async () => {
        let ul = this.state.userslist;
        for (let index = 0; index < this.state.bidlist.length; index++) {
          const e = this.state.bidlist[index];
          this.props.firebase.user(e.user_key).on("value", snapshot => {
            const userObject = snapshot.val();
            ul.push(userObject);
          });
        }
        this.setState({ userslist: ul }, () => {
          console.log(this.state);
        });
      });
    });
  };
  handleChange = () => (event, idx) => {
    if (event.currentTarget.name === "bid_1") {
    }
  };
  render() {
    //const { onChange, bidlist } = this.state;

    return (
      <Container component="main" maxWidth="xs">
        <Box mt={4}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}
const winner = compose(withFirebase)(Winner);
export default withFirebase(winner);
