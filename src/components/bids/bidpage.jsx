import React, { Component } from "react";
import { Container, Box, Paper } from "@material-ui/core";
import { Copyright, MCard, MTextField, MButton } from "../common/FormElements";
import paytm_cash from "../../assets/images/paytm_cash.jpg";
export default class BidPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onChange: this.handleChange()
    };
    console.log(this.props);
  }
  handleChange = () => event => {
    if (event.target.textContent === "Submit") {
    }
  };
  render() {
    const { onChange } = this.state;
    return (
      <Container component="main" maxWidth="xs">
        <MCard
          name={"bid_1"}
          actionEnabled={false}
          title={"Win \u20B9200 Paytm Cash"}
          image={paytm_cash}
          imageTitle="Paytm Cash"
          content={"Bid and Win \u20B9200 Paytm Cash"}
          onChange={onChange}
        ></MCard>
        <Paper style={{ marginTop: 20 }}>
          <MTextField
            required={true}
            type="number"
            name="cno"
            fullWidth={true}
            label="Bid Value"
            margin="dense"
            onChange={onChange}
            helperText="Number in range from 1 to 100, 2 point decimal allowed"
          ></MTextField>
          <MButton
            name="submit"
            style={{ margin: "3px 0px 2px" }}
            value={"Submit"}
            color={"primary"}
            onClick={onChange}
            fullWidth={true}
          >
            Register Bid
          </MButton>
        </Paper>
        <Box mt={4}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}
