import React, { Component } from "react";
import {
  Container,
  Box,
  Paper,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@material-ui/core";
import { Copyright, MButton, MSnackbar, MTextField } from "../common/FormElements";
import * as ROUTES from "../../constants/routes";
class Profile extends Component {
  constructor(props) {
    super(props);
    this.fb = this.props.gv.fb;
    this.db = this.props.gv.db;
    this.helper = this.props.gv.hl;
    this.uid = "";
    this.user = {};
    if (localStorage.getItem("token") === null) {
      this.props.history.push(ROUTES.SIGN_IN);
    } else if (localStorage.getItem("uid") !== null) {
      this.uid = localStorage.getItem("uid");
      this.state = {
        onChange: this.handleChange(),
        snackClose: this.snackClose(),
        snackMsg: "",
        snackOpen: false,
        gender: "female",
        fname: "",
        fnameError: false,
        fnameHelper: "First name",
        lname: "",
        email: "",
        emailError: false,
        emailHelper: "E-mail",
        cno: "",
        cnoError: false,
        cnoHelper: "Your Contact no.",
        vpa: "",
        vpaError: false,
        vpaHelper: "Virtual payment address (UPI id)",
        address: "",
        addressLabel: "Your current address",
        addressHelper: "Address",
        state: "",
        stateHelper: "State",
        stateLabel: "State",
        city: "",
        cityHelper: "City",
        cityLabel: "City",
        pincode: "",
        pincodeHelper: "Pincode",
        pincodeLabel: "Pincode",
        pincodeError: false
      };
      this.helper.showOverlay();
      this.helper
        .user(this.uid, this.db)
        .once("value")
        .then(v => {
          this.helper.hideOverlay();
          this.user = v.val();
          const { fname, lname, cno, gender, vpa, address, state, city, pincode } = this.user;
          this.setState({
            fname: fname ? fname : "",
            lname: lname ? lname : "",
            cno: cno ? cno : "",
            gender: gender ? gender : "",
            vpa: vpa ? vpa : "",
            address: address ? address : "",
            state: state ? state : "",
            city: city ? city : "",
            pincode: pincode ? pincode : ""
          });
        });
    }
  }
  snackClose = () => e => {
    this.setState({ snackMsg: "", snackOpen: false }, () => {});
  };
  handleChange = () => event => {
    const { fname, lname, cno, gender, vpa, address, cnoError, fnameError, state, city, pincode } = this.state;
    if (event.currentTarget.name === "submit") {
      this.helper.showOverlay();
      if (!cnoError && !fnameError) {
        this.helper
          .user(this.uid, this.db)
          .update({ fname, lname, cno, gender, vpa, address, state, city, pincode })
          .then(e => {
            this.helper.hideOverlay();
          });
      } else {
        this.setState({ snackMsg: "Fields highlighted in red have issues", snackOpen: true }, () => {});
        this.helper.hideOverlay();
      }
    } else if (event.target.name === "gender") {
      this.setState({ gender: event.target.value });
    } else if (event.target.name === "fname") {
      let fn = event.target.value;
      this.setState({ fname: event.target.value });
      if (fn.length <= 0) {
        this.setState({ fnameError: true, fnameHelper: "First name is mandatory" });
      } else {
        this.setState({ fnameError: false, fnameHelper: "First name" });
      }
    } else if (event.target.name === "lname") {
      this.setState({ lname: event.target.value });
    } else if (event.target.name === "cno") {
      let no = event.target.value;
      this.setState({ cno: no });
      if (no.length !== 10) {
        this.setState({ cnoError: true, cnoHelper: "Contact no. is invalid" });
      } else {
        this.setState({ cnoError: false, fnameHelper: "Contact no." });
      }
    } else if (event.target.name === "vpa") {
      this.setState({ vpa: event.target.value });
    } else if (event.target.name === "address") {
      this.setState({ address: event.target.value });
    } else if (event.target.name === "city") {
      this.setState({ city: event.target.value });
    } else if (event.target.name === "state") {
      this.setState({ state: event.target.value });
    } else if (event.target.name === "pincode") {
      if (event.target.value.length !== 6) {
        this.setState({ pincodeError: true, pincodeHelper: "Pincode should be 6 digit" });
      } else {
        this.setState({ pincodeError: false, pincodeHelper: "Pincode" });
      }
      this.setState({ pincode: event.target.value });
    }
  };
  render() {
    if (localStorage.getItem("token") === null) {
      this.props.history.push(ROUTES.SIGN_IN);
      return <div></div>;
    } else {
      const {
        onChange,
        gender,
        fname,
        lname,
        cno,
        snackMsg,
        snackOpen,
        snackClose,
        fnameError,
        fnameHelper,
        cnoError,
        cnoHelper,
        vpa,
        vpaError,
        vpaHelper,
        address,
        addressHelper,
        addressLabel,
        state,
        stateHelper,
        stateLabel,
        city,
        cityHelper,
        cityLabel,
        pincode,
        pincodeHelper,
        pincodeLabel,
        pincodeError
      } = this.state;
      return (
        <div>
          <Container component="main" maxWidth="xs">
            <Paper style={{ marginTop: 20, padding: 20 }} elevation={6}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
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
                    required={false}
                    error={vpaError}
                    type="text"
                    name="vpa"
                    value={vpa}
                    fullWidth={true}
                    label={vpaHelper}
                    margin="dense"
                    onChange={onChange}
                    helperText={vpaHelper}
                  ></MTextField>
                  <MTextField
                    required={false}
                    multiline
                    rows={3}
                    type="text"
                    name="address"
                    value={address}
                    fullWidth={true}
                    label={addressLabel}
                    margin="dense"
                    onChange={onChange}
                    helperText={addressHelper}
                  ></MTextField>
                  <MTextField
                    required={false}
                    type="text"
                    name="state"
                    value={state}
                    fullWidth={true}
                    label={stateLabel}
                    margin="dense"
                    onChange={onChange}
                    helperText={stateHelper}
                  ></MTextField>
                  <MTextField
                    required={false}
                    type="text"
                    name="city"
                    value={city}
                    fullWidth={true}
                    label={cityLabel}
                    margin="dense"
                    onChange={onChange}
                    helperText={cityHelper}
                  ></MTextField>
                  <MTextField
                    required={false}
                    type="number"
                    name="pincode"
                    value={pincode}
                    fullWidth={true}
                    label={pincodeLabel}
                    margin="dense"
                    onChange={onChange}
                    helperText={pincodeHelper}
                    error={pincodeError}
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
