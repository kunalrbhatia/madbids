import React, { Component } from "react";
import { Container, Box } from "@material-ui/core";
import { Copyright, MCard, MAppBar } from "../common/FormElements";
import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
class Winner extends Component {}
const winner = compose(withFirebase)(Winner);
export default withFirebase(winner);
