import React, { Component } from "react";
import { Container, Box } from "@material-ui/core";
import { Copyright, MCard, MAppBar } from "../common/FormElements";
import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
class Bidlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onChange: this.handleChange(),
      onAppBarClose: this.handleAppBarClose(),
      productList: []
    };
    setTimeout(() => {
      this.props.firebase.products().on("value", snapshot => {
        const productsObject = snapshot.val();
        const _productsList = Object.keys(productsObject).map(key => ({
          ...productsObject[key],
          pid: key
        }));
        this.setState({ productList: _productsList }, () => {});
      });
    }, 3000);
  }

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
    const { onChange, onAppBarClose, productList } = this.state;
    const mCards = productList.map((pl, idx) => {
      return (
        <div style={{ marginBottom: 20 }} key={pl.pid}>
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
      <Container component="main" maxWidth="xs">
        <MAppBar handleClose={onAppBarClose}></MAppBar>
        {mCards}
        <Box mt={4}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}
const bidList = compose(withFirebase)(Bidlist);
export default withFirebase(bidList);
