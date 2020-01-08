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
import { MButton, MTextField, Copyright } from "../common/FormElements";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
import * as ROUTES from "../../constants/routes";
class NewUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onChange: this.handleChange(),
      gender: "female",
      fname: "",
      lname: "",
      email: "",
      password: "",
      cpassword: "",
      cno: "",
      secretQuestion: "",
      secretAnswer: ""
    };
  }
  handleChange = () => event => {
    if (event.target.name === "register") {
      const { gender, fname, lname, email, password, cpassword, cno, secretQuestion, secretAnswer } = this.state;
      this.props.firebase
        .doCreateUserWithEmailAndPassword(email, password)
        .then(authUser => {
          this.props.history.push(ROUTES.BIDLIST);
        })
        .catch(error => {
          this.setState({ error });
        });
      event.preventDefault();
    } else if (event.target.name === "gender") {
      this.setState({ gender: event.target.value });
    } else if (event.target.name === "fname") {
      this.setState({ fname: event.target.value });
    } else if (event.target.name === "lname") {
      this.setState({ lname: event.target.value });
    } else if (event.target.name === "email") {
      this.setState({ email: event.target.value });
    } else if (event.target.name === "password") {
      this.setState({ password: event.target.value });
    } else if (event.target.name === "cpassword") {
      this.setState({ cpassword: event.target.value });
    } else if (event.target.name === "cno") {
      this.setState({ cno: event.target.value });
    }
  };

  render() {
    const {
      onChange,
      gender,
      fname,
      lname,
      email,
      password,
      cpassword,
      cno,
      secretQuestion,
      secretAnswer
    } = this.state;
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
          <Avatar style={{ margin: 1, backgroundColor: "#000" }}>
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
              value={fname}
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
              value={lname}
              fullWidth={true}
              label="Last Name"
              margin="dense"
              onChange={onChange}
              helperText="Last name"
            ></MTextField>
            <FormControl component="fieldset">
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup aria-label="gender" name="gender" value={gender} onChange={onChange}>
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="other" control={<Radio />} label="Other" />
              </RadioGroup>
            </FormControl>
            <MTextField
              required={false}
              type="number"
              name="cno"
              value={cno}
              fullWidth={true}
              label="Contact Number"
              margin="dense"
              onChange={onChange}
              helperText="Contact Number"
            ></MTextField>
            <MTextField
              required={true}
              type="email"
              value={email}
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
              value={password}
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
              value={cpassword}
              fullWidth={true}
              label="Confirm Password"
              margin="dense"
              onChange={onChange}
              helperText="Confirm Password"
            ></MTextField>
            <MTextField
              name={"secretQuestion"}
              type={"select"}
              data={[
                { value: "1", label: "What is your mother's year of birth?" },
                { value: "2", label: "What is your family nick name?" },
                { value: "3", label: "Where you met your life patner first time?" }
              ]}
              label={"Secret Question"}
              value={secretQuestion}
              onChange={onChange}
              fullWidth={true}
              helperText={"Select a Secret Question"}
            ></MTextField>
            <MTextField
              required={true}
              type="text"
              name="secretAnswer"
              value={secretAnswer}
              fullWidth={true}
              label="Your answer"
              margin="dense"
              onChange={onChange}
              helperText="Answer is case insensitive"
            ></MTextField>

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
const newuser = compose(withFirebase)(NewUser);
export default withFirebase(newuser);
