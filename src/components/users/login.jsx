import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { MButton, Copyright, MTextField, MSnackbar } from "../common/FormElements";

import * as ROUTES from "../../constants/routes";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onChange: this.handleChange(),
      snackClose: this.snackClose(),
      email: "",
      passowrd: "",
      error: "",
      snackOpen: false,
      snackMsg: "",
      rememberMe: true,
      emailHelper: "Email",
      emailError: false
    };
    this.helper = this.props.helper;
    if (localStorage.getItem("token") != null && localStorage.getItem("remember_me") != null) {
      //console.log("31");
      this.props.history.push(ROUTES.BIDLIST);
    } else {
      try {
        window.Android.contentLoaded("none");
      } catch (error) {
        //console.log(error);
      }
    }
  }
  snackClose = () => e => {
    this.setState({ snackMsg: "", snackOpen: false });
  };
  handleChange = () => e => {
    if (e.currentTarget.name === "rememberMe") {
      if (!this.state.rememberMe) {
        this.setState({ rememberMe: true });
      } else {
        this.setState({ rememberMe: false });
      }
    } else if (e.currentTarget.name === "email") {
      var mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (mailformat.test(e.target.value)) {
        this.setState({
          email: e.currentTarget.value,
          emailError: false,
          emailHelper: "E-mail address entered is correct"
        });
      } else {
        this.setState({
          email: e.currentTarget.value,
          emailError: true,
          emailHelper: "E-mail address entered is incorrect"
        });
      }
    } else if (e.currentTarget.name === "password") {
      this.setState({ password: e.currentTarget.value });
    } else if (e.currentTarget.name === "submit") {
      const { email, password } = this.state;
      const auth = this.props.gv.auth;
      this.helper.showOverlay();
      this.helper
        .doSignInWithEmailAndPassword(email, password, auth)
        .then(authUser => {
          localStorage.setItem("uid", authUser.user.uid);
          if (this.state.rememberMe) {
            localStorage.setItem("remember_me", "remember_me" + email);
          }
          localStorage.setItem("token", "token_" + email);
        })
        .then(() => {
          this.helper.hideOverlay();
          this.props.history.push(ROUTES.BIDLIST);
        })
        .catch(error => {
          this.helper.hideOverlay();
          this.setState({ snackMsg: "Password incorrect", snackOpen: true }, () => {});
          this.setState({ error });
        });
      e.preventDefault();
    }
  };
  render() {
    const { onChange, email, snackOpen, snackClose, snackMsg, rememberMe, emailHelper, emailError } = this.state;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div
          style={{
            marginTop: "6em",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Avatar style={{ margin: 1, backgroundColor: "#000" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form
            style={{
              width: "100%", // Fix IE 11 issue.
              marginTop: 1
            }}
          >
            <MTextField
              required={true}
              type="email"
              value={email}
              name="email"
              fullWidth={true}
              label="E-mail Address"
              margin="dense"
              onChange={onChange}
              error={emailError}
              helperText={emailHelper}
            ></MTextField>
            <MTextField
              id="password_field"
              showPassword={false}
              required={true}
              type="password"
              name="password"
              fullWidth={true}
              label="Password"
              margin="dense"
              onChange={onChange}
              helperText="Password"
            ></MTextField>
            <FormControlLabel
              control={<Checkbox checked name="rememberMe" value={rememberMe} onChange={onChange} color="primary" />}
              label="Remember me"
            />
            <MButton
              style={{ margin: "3px 0px 2px" }}
              value={"Submit"}
              color={"primary"}
              onClick={onChange}
              fullWidth={true}
              name={"submit"}
            >
              Login
            </MButton>
            <Grid container>
              <Grid item xs>
                <Link href={ROUTES.PASSWORD_FORGET} variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href={ROUTES.SIGN_UP} variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <MSnackbar
          autoHideDuration={4000}
          open={snackOpen}
          vPos={"bottom"}
          hPos={"left"}
          message={snackMsg}
          onClose={snackClose}
        ></MSnackbar>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}
export default Login;
