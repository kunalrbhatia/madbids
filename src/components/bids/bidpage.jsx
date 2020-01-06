import React, { Component } from "react";
import { Container, Box } from "@material-ui/core";
import { Copyright } from "../common/FormElements";
export default class BidPage extends Component {
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
        <Box mt={4}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}
