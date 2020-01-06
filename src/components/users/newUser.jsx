import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import ChildFriendlyIcon from "@material-ui/icons/ChildFriendly";
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
export default class NewUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onChange: this.handleChange(),
      gender: "female"
    };
  }
  handleChange = () => event => {
    if (event.target.textContent === "Register") {
    } else if (event.target.name === "gender") {
      this.setState({ gender: event.target.value });
    }
  };

  render() {
    const { onChange, gender } = this.state;
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
            <ChildFriendlyIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
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
              type="text"
              name="fname"
              fullWidth={true}
              label="First Name"
              margin="dense"
              onChange={onChange}
              helperText="First name"
            ></MTextField>
            <MTextField
              required={true}
              type="text"
              name="lname"
              fullWidth={true}
              label="Last Name"
              margin="dense"
              onChange={onChange}
              helperText="Last name"
            ></MTextField>
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
            <MTextField
              required={true}
              type="password"
              name="cpassword"
              fullWidth={true}
              label="Confirm Password"
              margin="dense"
              onChange={onChange}
              helperText="Confirm Password"
            ></MTextField>
            <MTextField
              required={false}
              type="number"
              name="cno"
              fullWidth={true}
              label="Contact Number"
              margin="dense"
              onChange={onChange}
              helperText="Contact Number"
            ></MTextField>
            <FormControl component="fieldset">
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup aria-label="gender" name="gender" value={gender} onChange={onChange}>
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="other" control={<Radio />} label="Other" />
              </RadioGroup>
            </FormControl>
            <MButton
              name="register"
              style={{ margin: "3px 0px 2px" }}
              value={"Submit"}
              color={"primary"}
              onClick={onChange}
              fullWidth={true}
            >
              Register
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
