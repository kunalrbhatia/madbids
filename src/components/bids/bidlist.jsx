import React, { Component } from "react";
import { Container, Box } from "@material-ui/core";
import { Copyright, MCard } from "../common/FormElements";
import paytm_cash from "../../assets/images/paytm_cash.jpg";
import * as ROUTES from "../../constants/routes";
export default class Bidlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onChange: this.handleChange()
    };
  }
  handleChange = () => event => {
    if (event.currentTarget.name === "bid_1") {
      this.props.history.push(ROUTES.BIDPAGE);
    }
  };
  render() {
    const { onChange } = this.state;
    return (
      <Container component="main" maxWidth="xs">
        <div style={{ marginBottom: 20 }}>
          <MCard
            name={"bid_1"}
            actionEnabled={true}
            title={"Win \u20B9200 Paytm Cash"}
            image={paytm_cash}
            imageTitle="Paytm Cash"
            content={"Bid and Win \u20B9200 Paytm Cash"}
            onChange={onChange}
          ></MCard>
        </div>
        <Box mt={4}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}
