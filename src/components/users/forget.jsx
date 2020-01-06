import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { MButton, MTextField } from "../common/FormElements";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © madbids "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
export default class Forgot extends Component {
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
        <CssBaseline />
        <div
          style={{
            marginTop: "1em",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Avatar style={{ margin: 1, backgroundColor: "#00f" }}>
            <VpnKeyIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <form
            style={{
              width: "100%", // Fix IE 11 issue.
              marginTop: 1
            }}
            noValidate
          >
            <MTextField
              required={true}
              type="email"
              name="email"
              fullWidth={true}
              label="E-mail"
              margin="dense"
              onChange={onChange}
              helperText="E-mail"
            ></MTextField>

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
            <Grid container>
              <Grid item xs>
                <Link href="/" variant="body2">
                  Home
                </Link>
              </Grid>
              <Grid item>
                <Link href="/login" variant="body2">
                  {"Login"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={4}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}
