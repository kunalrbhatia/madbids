import React, { Component } from "react";
import { Container, Box } from "@material-ui/core";
import { Copyright, MCard, MAppBar } from "../common/FormElements";
import * as ROUTES from "../../constants/routes";
import * as APIS from "../../constants/fbapis";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
class Bidlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onChange: this.handleChange(),
      onAppBarClose: this.handleAppBarClose(),
      apis: [
        { name: APIS.PRODUCTS, data: [], url: this.props.firebase.products() },
        { name: APIS.AUCTIONS, data: [], url: this.props.firebase.auctions() }
      ]
    };
    this.current = 0;
    this.total = this.state.apis.length;
    this.getDataFromDB();
  }
  getIndex = (array, name) => {
    for (let i = 0; i < array.length; i++) {
      const e = array[i];
      if (e.name === name) {
        return i;
      }
    }
  };
  getDataFromDB = () => {
    if (this.current < this.total) {
      console.log(this.current);
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
  handleAppBarClose = () => str => {
    if (str === "logout") {
      this.props.firebase.doSignOut().then(e => {
        this.props.history.push(ROUTES.LANDING);
      });
    }
  };
  handleChange = () => (event, idx) => {
    if (event.currentTarget.name === "bid_1") {
      this.props.globalVars.productInfo = this.state.productList[idx];
      this.props.history.push(ROUTES.BIDPAGE);
    }
  };
  render() {
    const { onChange, onAppBarClose, apis } = this.state;
    const mCards = apis[this.getIndex(apis, APIS.PRODUCTS)].data.map((pl, idx) => {
      return (
        <div style={{ marginBottom: 20 }} key={pl.id}>
          <MCard
            name={"bid_1"}
            actionEnabled={true}
            title={pl.name}
            image={pl.photo_url}
            imageTitle={pl.name}
            content={pl.description}
            price={pl.price}
            onChange={e => onChange(e, idx)}
          ></MCard>
        </div>
      );
    });
    return (
      <div>
        <MAppBar handleClose={onAppBarClose}></MAppBar>
        <Container component="main" maxWidth="xs" style={{marginTop:20}}>
          {mCards}
          <Box mt={4}>
            <Copyright />
          </Box>
        </Container>
      </div>
      
    );
  }
}
const bidList = compose(withFirebase)(Bidlist);
export default withFirebase(bidList);
