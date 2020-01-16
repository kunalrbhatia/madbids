import React, { Component } from "react";
import { Container, Box } from "@material-ui/core";
import { Copyright } from "../common/FormElements";
//import * as ROUTES from "../../constants/routes";
import * as APIS from "../../constants/fbapis";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
class Winner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onChange: this.handleChange(),
      bidlist: [],
      userslist: [],
      apis: [
        { name: APIS.AUCTIONS, data: [], url: this.props.firebase.auctions() },
        { name: APIS.BIDLIST, data: [], url: this.props.firebase.bids() },
        { name: APIS.USERS, data: [], url: this.props.firebase.users() }
      ]
    };
    this.helper = this.props.helper;
    this.current = 0;
    this.total = this.state.apis.length;
  }
  componentDidMount = () => {
    this.getDataFromDB();
  };
  getDataFromDB = () => {
    if (this.current < this.total) {
      if (!this.props.globalVars["" + this.state.apis[this.current].name]) {
        this.state.apis[this.current].url.on("value", snapshot => {
          const object = snapshot.val();
          const _list = Object.keys(object).map(key => ({
            ...object[key],
            id: key
          }));
          let apis_copy = this.state.apis;
          apis_copy[this.current]["data"] = _list;
          this.setState(
            {
              apis: apis_copy
            },
            () => {
              this.current++;
              this.getDataFromDB();
            }
          );
        });
      } else {
        let apis_copy = this.state.apis;
        apis_copy[this.current]["data"] = this.props.globalVars["" + this.state.apis[this.current].name];
        this.setState(
          {
            apis: apis_copy
          },
          () => {
            this.current++;
            this.getDataFromDB();
          }
        );
      }
    } else {
      console.log(this.state);
    }
  };
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
