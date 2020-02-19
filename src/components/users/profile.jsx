import React, { Component } from "react";
import { Container, Box, Paper, Grid } from "@material-ui/core";
import { Copyright, MButton, MSnackbar } from "../common/FormElements";
import * as ROUTES from "../../constants/routes";
class Profile extends Component {
  constructor(props) {
    super(props);
    if (localStorage.getItem("token") === null) {
      this.props.history.push(ROUTES.SIGN_IN);
    } else {
      this.helper = this.props.helper;
      if (localStorage.getItem("uid") !== null) {
        this.props.gv.userId = localStorage.getItem("uid");
      }
      this.state = {
        onChange: this.handleChange(),
        snackClose: this.snackClose(),
        snackMsg: "",
        snackOpen: false
      };
      if (localStorage.getItem("token") === null) {
        this.props.history.push(ROUTES.SIGN_IN);
      }
    }
  }
  snackClose = () => e => {
    this.setState({ snackMsg: "", snackOpen: false }, () => {});
  };
  handleChange = () => event => {
    this.helper.showOverlay();
    if (event.currentTarget.name === "submit") {
    }
  };
  render() {
    if (localStorage.getItem("token") === null) {
      this.props.history.push(ROUTES.SIGN_IN);
      return <div></div>;
    } else {
      const { onChange, snackOpen, snackClose, snackMsg } = this.state;
      return (
        <div>
          <Container component="main" maxWidth="xs">
            <Paper style={{ marginTop: 20, padding: 20 }} elevation={6}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <MButton
                    name="submit"
                    style={{ margin: "3px 0px 2px" }}
                    value={"Submit"}
                    color={"primary"}
                    onClick={onChange}
                    fullWidth={true}
                  >
                    Submit
                  </MButton>
                </Grid>
              </Grid>
            </Paper>
            <MSnackbar
              autoHideDuration={1900}
              open={snackOpen}
              vPos={"bottom"}
              hPos={"left"}
              message={snackMsg}
              onClose={snackClose}
            ></MSnackbar>
            <Box mt={4}>
              <Copyright />
            </Box>
          </Container>
        </div>
      );
    }
  }
}
export default Profile;
