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
import { MButton, Copyright, MTextField } from "../common/FormElements";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
import * as ROUTES from "../../constants/routes";
class Login extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      onChange: this.handleChange(),
      email: "",
      passowrd: "",
      error: ""
    };
  }
  handleChange = () => e => {
    if (e.currentTarget.name === "email") {
      this.setState({ email: e.currentTarget.value });
    } else if (e.currentTarget.name === "password") {
      this.setState({ password: e.currentTarget.value });
    } else if (e.currentTarget.name === "submit") {
      const { email, password } = this.state;
      this.props.firebase
        .doSignInWithEmailAndPassword(email, password)
        .then(authUser => {
          this.props.globalVars.userId = authUser.user.uid;
        })
        .then(() => {
          this.props.history.push(ROUTES.BIDLIST);
        })
        .catch(error => {
          this.setState({ error });
        });
      e.preventDefault();
    }
  };
  render() {
    const { onChange, email } = this.state;
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
              helperText="E-mail"
            ></MTextField>
            <MTextField
              required={true}
              type="password"
              name="password"
              fullWidth={true}
              label="Password"
              margin="dense"
              onChange={onChange}
              helperText="Password"
            ></MTextField>
            <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
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
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}
const login = compose(withFirebase)(Login);
export default withFirebase(login);
