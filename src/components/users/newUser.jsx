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
import { MButton, MTextField, Copyright, MSnackbar } from "../common/FormElements";

import * as ROUTES from "../../constants/routes";
import * as APIS from "../../constants/fbapis";
class NewUser extends Component {
  constructor(props) {
    super(props);
    this.helper = this.props.helper;
    const db = this.props.gv.db;
    this.state = {
      onChange: this.handleChange(),
      snackClose: this.snackClose(),
      gender: "female",
      fname: "",
      fnameError: false,
      fnameHelper: "First name",
      lname: "",
      email: "",
      emailError: false,
      emailHelper: "E-mail",
      password: "",
      cpassword: "",
      cno: "",
      cnoError: false,
      cnoHelper: "Your Contact no.",
      secretQuestion: "",
      secretAnswer: "",
      users: [],
      snackMsg: "",
      snackOpen: false,
      apis: [{ name: APIS.USERS, data: [], url: this.helper.users(db) }]
    };
    this.current = 0;
    this.total = this.state.apis.length;
  }
  componentDidMount = () => {
    this.helper.showOverlay();
    this.getDataFromDB();
  };
  getDataFromDB = () => {
    if (this.current < this.total) {
      if (!this.props.gv["" + this.state.apis[this.current].name]) {
        this.state.apis[this.current].url.on("value", snapshot => {
          const object = snapshot.val();
          if (object === null) {
            this.current++;
            this.getDataFromDB();
          } else {
            const _list = Object.keys(object).map(key => ({
              ...object[key],
              id: key
            }));
            let apis_copy = this.state.apis;
            apis_copy[this.current]["data"] = _list;
            this.setState(
              {
                apis: apis_copy
              },
              () => {
                this.current++;
                this.getDataFromDB();
              }
            );
          }
        });
      }
    } else {
      this.setState({ users: this.state.apis[this.helper.getIndex(this.state.apis, APIS.USERS)] }, () => {
        this.current = 0;
        this.helper.hideOverlay();
      });
    }
  };
  snackClose = () => e => {
    this.setState({ snackMsg: "", snackOpen: false }, () => {});
  };
  handleChange = () => event => {
    const auth = this.props.gv.auth;
    const db = this.props.gv.db;
    let uid = "";
    if (event.currentTarget.name === "register") {
      const {
        gender,
        fname,
        lname,
        email,
        emailError,
        fnameError,
        password,
        cpassword,
        cno,
        cnoError,
        secretQuestion,
        secretAnswer
      } = this.state;
      if (password === cpassword) {
        if (fnameError === false || emailError === false || cnoError === false) {
          if (!this.findIfUserExists(email)) {
            this.helper.showOverlay();
            this.helper
              .doCreateUserWithEmailAndPassword(email, password, auth)
              .then(authUser => {
                uid = authUser.user.uid;
                localStorage.setItem("uid", authUser.user.uid);
                let userRef = this.helper.users(db);
                return userRef.child(uid).set({
                  email,
                  password,
                  cno,
                  fname,
                  lname,
                  gender,
                  secretQuestion,
                  secretAnswer,
                  bids: []
                });
              })
              .then(() => {
                this.helper.hideOverlay();
                this.setState({
                  snackMsg: "Congratulations! Your're registered with us, please sign-in",
                  snackOpen: true
                });
                setTimeout(() => {
                  this.helper.doLogout(this.props);
                }, 3000);
              })
              .catch(error => {
                console.log(error.code);
                if (error.code === "auth/email-already-in-use") {
                  setTimeout(() => {
                    this.helper.hideOverlay();
                    this.props.history.push(ROUTES.SIGN_IN);
                  }, 3000);
                  this.setState({ snackMsg: "You're already registered with us! Please login", snackOpen: true });
                }
                this.setState({ error });
              });
          } else {
            this.setState({ snackMsg: "User already exist!", snackOpen: true });
          }
        } else {
          this.setState({ snackMsg: "Fields highlighted in red are required", snackOpen: true });
        }
      } else {
        this.setState({ snackMsg: "Password and confirm password doesn't match", snackOpen: true });
      }
      event.preventDefault();
    } else if (event.target.name === "gender") {
      this.setState({ gender: event.target.value });
    } else if (event.target.name === "fname") {
      if (event.target.value.length > 0) {
        this.setState({ fname: event.target.value, fnameError: false, fnameHelper: "First name" });
      } else {
        this.setState({ fname: event.target.value, fnameError: true, fnameHelper: "First name is required" });
      }
    } else if (event.target.name === "lname") {
      this.setState({ lname: event.target.value });
    } else if (event.target.name === "email") {
      this.setState({ email: event.target.value });
      var mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (mailformat.test(event.target.value)) {
        this.setState({ emailError: false, emailHelper: "E-mail address entered is correct" });
      } else {
        this.setState({ emailError: true, emailHelper: "E-mail address entered is incorrect" });
      }
    } else if (event.target.name === "password") {
      this.setState({ password: event.target.value });
    } else if (event.target.name === "cpassword") {
      this.setState({ cpassword: event.target.value });
    } else if (event.target.name === "cno") {
      if (event.target.value.length === 10) {
        this.setState({ cno: event.target.value, cnoError: false, cnoHelper: "Your Contact no." });
      } else {
        this.setState({ cno: event.target.value, cnoError: true, cnoHelper: "Contact no. is invalid" });
      }
      this.setState({ cno: event.target.value });
    } else if (event.target.name === "secretQuestion") {
      this.setState({ secretQuestion: event.target.value });
    } else if (event.target.name === "secretAnswer") {
      this.setState({ secretAnswer: event.target.value });
    }
  };
  findIfUserExists = email => {
    for (let i = 0; i < this.state.users.length; i++) {
      const e = this.state.users[i];
      if (e.email === email) {
        console.log("found");
        return true;
      }
    }
    return false;
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
      secretAnswer,
      snackMsg,
      snackOpen,
      snackClose,
      emailError,
      emailHelper,
      fnameError,
      fnameHelper,
      cnoError,
      cnoHelper
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
              error={fnameError}
              fullWidth={true}
              label="First Name"
              margin="dense"
              onChange={onChange}
              helperText={fnameHelper}
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
              error={cnoError}
              type="number"
              name="cno"
              value={cno}
              fullWidth={true}
              label="Contact Number"
              margin="dense"
              onChange={onChange}
              helperText={cnoHelper}
            ></MTextField>
            <MTextField
              required={true}
              type="email"
              error={emailError}
              value={email}
              name="email"
              fullWidth={true}
              label="E-mail"
              margin="dense"
              onChange={onChange}
              helperText={emailHelper}
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
            <MSnackbar
              autoHideDuration={5000}
              open={snackOpen}
              vPos={"bottom"}
              hPos={"left"}
              message={snackMsg}
              onClose={snackClose}
            ></MSnackbar>
            <Grid container>
              <Grid item xs>
                <Link variant="body2" onClick={()=>{this.props.history.push(ROUTES.LANDING)}}>
                  Home
                </Link>
              </Grid>
              <Grid item>
                <Link href={ROUTES.SIGN_IN} variant="body2" onClick={()=>{this.props.history.push(ROUTES.SIGN_IN)}}>
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
export default NewUser;
