import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { MButton, MTextField, Copyright, MSnackbar } from "../common/FormElements";
import * as ROUTES from "../../constants/routes";

class Forgot extends Component {
  constructor(props) {
    super(props);
    this.helper = this.props.helper;
    this.state = {
      onChange: this.handleChange(),
      snackClose: this.snackClose(),
      email: "",
      user: null,
      snackMsg: "User doesn't exist!",
      snackOpen: false,
      userFound: false,
      newPassword: "",
      confirmPassword: "",
      detailsVerified: false,
      questionsData: [
        { value: "1", label: "What is your mother's year of birth?" },
        { value: "2", label: "What is your family nick name?" },
        { value: "3", label: "Where you met your life patner first time?" }
      ],
      question: "",
      answer: "",
      uanswer: "",
      emailError: false,
      emailHelper: "Email"
    };
  }
  componentDidMount = () => {};
  getQuestionsByValue = value => {
    for (let i = 0; i < this.state.questionsData.length; i++) {
      const e = this.state.questionsData[i];
      if (e.value === value) {
        return e.label;
      }
    }
  };
  snackClose = () => e => {
    this.setState({ snackMsg: "", snackOpen: false });
  };
  handleChange = () => event => {
    const db = this.props.gv.db;
    const auth = this.props.gv.auth;
    if (event.currentTarget.name === "submit" && !this.state.userFound) {
      this.helper.showOverlay();
      this.helper
        .users(db)
        .orderByChild("email")
        .equalTo(this.state.email)
        .once("value")
        .then(v => {
          this.helper.hideOverlay();
          let object = v.val();
          object = Object.keys(object).map(key => ({
            ...object[key],
            id: key
          }));
          object = object[0];
          this.setState({ user: object });
          if (object) {
            let ques = this.getQuestionsByValue(object.secretQuestion);
            this.setState({ question: ques, answer: object.secretAnswer }, () => {
              this.setState({ userFound: true });
            });
          } else {
            this.setState({ snackMsg: "User doesn't exist!", snackOpen: true }, () => {});
          }
        });
    } else if (event.currentTarget.name === "submit" && this.state.userFound && this.state.detailsVerified) {
      this.helper.showOverlay();
      if (this.state.newPassword === this.state.confirmPassword) {
        let email = this.state.user.email;
        let password = this.state.user.password;
        this.helper.doSignInWithEmailAndPassword(email, password, auth).then(authUser => {
          let userRef = this.helper.user(this.state.user.id, db);
          let user = this.helper.getCurrentUser(auth);
          user
            .updatePassword(this.state.newPassword)
            .then(() => {
              userRef.update({ password: this.state.newPassword }).then(() => {
                this.setState({ snackMsg: "Password changed", snackOpen: true });
                setTimeout(() => {
                  this.helper.hideOverlay();
                  this.helper.doLogout(this.props);
                }, 2000);
              });
            })
            .catch(function(error) {
              // An error happened.
            });
        });
      } else {
        this.setState({ snackMsg: "Password and confirm password doesn't match", snackOpen: true });
      }
    } else if (event.currentTarget.name === "submit" && this.state.userFound) {
      if (this.state.uanswer === this.state.answer) {
        this.setState({ snackMsg: "Answer matched, please change password.", snackOpen: true, detailsVerified: true });
      } else {
        this.setState({ snackMsg: "Answer doesn't match with our records.", snackOpen: true });
      }
    } else if (event.currentTarget.name === "email") {
      var mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (mailformat.test(event.target.value)) {
        this.setState({
          email: event.currentTarget.value,
          emailError: false,
          emailHelper: "E-mail address entered is correct"
        });
      } else {
        this.setState({
          email: event.currentTarget.value,
          emailError: true,
          emailHelper: "E-mail address entered is incorrect"
        });
      }
      this.setState({ email: event.currentTarget.value });
    } else if (event.currentTarget.name === "newPassword") {
      this.setState({ newPassword: event.currentTarget.value });
    } else if (event.currentTarget.name === "confirmPassword") {
      this.setState({ confirmPassword: event.currentTarget.value });
    } else if (event.currentTarget.name === "uanswer") {
      this.setState({ uanswer: event.currentTarget.value });
    }
  };

  render() {
    const {
      onChange,
      email,
      snackMsg,
      userFound,
      snackOpen,
      snackClose,
      newPassword,
      confirmPassword,
      question,
      detailsVerified,
      uanswer,
      emailError,
      emailHelper
    } = this.state;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div
          className="base"
          style={{
            margin: "1em",
            alignItems: "center",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Avatar style={{ backgroundColor: "#000", margin: "1em" }}>
            <VpnKeyIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
        </div>
        <form
          style={{
            width: "100%", // Fix IE 11 issue.
            marginTop: 1
          }}
          noValidate
        >
          <div
            className="getEmail"
            style={{
              display: userFound === true ? "none" : "block"
            }}
          >
            <MTextField
              required={true}
              type="email"
              name="email"
              fullWidth={true}
              label="E-mail"
              margin="dense"
              value={email}
              onChange={onChange}
              helperText={emailHelper}
              error={emailError}
            ></MTextField>
          </div>
          <div
            className="getVerification"
            style={{
              display: userFound === true && detailsVerified === false ? "block" : "none"
            }}
          >
            <Typography component="h1" variant="subtitle1">
              {question}
            </Typography>
            <MTextField
              required={true}
              type="text"
              name="uanswer"
              fullWidth={true}
              label="Your answer here"
              margin="dense"
              value={uanswer}
              onChange={onChange}
            ></MTextField>
          </div>
          <div
            className="setPassword"
            style={{
              display: detailsVerified === false ? "none" : "block"
            }}
          >
            <MTextField
              required={true}
              type="password"
              name="newPassword"
              fullWidth={true}
              label="New password"
              margin="dense"
              value={newPassword}
              onChange={onChange}
            ></MTextField>
            <MTextField
              required={true}
              type="password"
              name="confirmPassword"
              fullWidth={true}
              label="Confirm password"
              margin="dense"
              value={confirmPassword}
              onChange={onChange}
            ></MTextField>
          </div>
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
        </form>
        <Grid container>
          <Grid item xs>
            <Link href={ROUTES.LANDING} variant="body2">
              Home
            </Link>
          </Grid>
          <Grid item>
            <Link href={ROUTES.SIGN_IN} variant="body2">
              {"Login"}
            </Link>
          </Grid>
        </Grid>
        <MSnackbar
          autoHideDuration={4000}
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
    );
  }
}

export default Forgot;
