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
    this.props.firebase.products().on("value", snapshot => {
      const productsObject = snapshot.val();
      const _productsList = Object.keys(productsObject).map(key => ({
        ...productsObject[key],
        pid: key
      }));
      this.setState({ productList: _productsList }, () => {});
    });
  }

  handleAppBarClose = () => e => {
    console.log("on handleAppBarClose");
  };
  handleChange = () => event => {
    if (event.currentTarget.name === "bid_1") {
      this.props.history.push(ROUTES.BIDPAGE);
    }
  };
  render() {
    const { onChange, onAppBarClose, productList } = this.state;
    const mCards = productList.map(pl => {
      console.log(pl);
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
            onChange={onChange}
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
