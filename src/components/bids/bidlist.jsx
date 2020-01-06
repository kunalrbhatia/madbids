import React, { Component } from "react";
import { Container, Box } from "@material-ui/core";
import { Copyright, MCard } from "../common/FormElements";
import paytm_cash from "../../assets/images/paytm_cash.jpg";
export default class Bidlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onChange: this.handleChange()
    };
  }
  handleChange = () => event => {
    if (event.target.textContent === "Submit") {
    }
  };
  render() {
    const { onChange } = this.state;
    return (
      <Container component="main" maxWidth="xs">
        <div style={{ marginBottom: 20 }}>
          <MCard
            title={"Win \u20B9200 Paytm Cash"}
            image={paytm_cash}
            imageTitle="Paytm Cash"
            content={"Bid and Win \u20B9200 Paytm Cash"}
          ></MCard>
        </div>
        <Box mt={4}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}
