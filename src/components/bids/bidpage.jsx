import React, { Component } from "react";
import { Container, Box, Paper, Grid } from "@material-ui/core";
import { Copyright, MCard, MTextField, MButton, MSnackbar } from "../common/FormElements";
import * as ROUTES from "../../constants/routes";
class BidPage extends Component {
  constructor(props) {
    super(props);
    if (localStorage.getItem("token") === null) {
      this.props.history.push(ROUTES.SIGN_IN);
    } else {
      this.helper = this.props.helper;

      this.userBids = [];
      if (localStorage.getItem("token") === null) {
        this.props.history.push(ROUTES.SIGN_IN);
      } else if (localStorage.getItem("uid") !== null && localStorage.getItem("productInfo") !== null) {
        this.state = {
          bidValue: 0,
          onChange: this.handleChange(),
          snackClose: this.snackClose(),
          uid: localStorage.getItem("uid"),
          pl: JSON.parse(localStorage.getItem("productInfo")),
          snackMsg: "",
          snackOpen: false,
          bidValueHelper: "Number in range from 0 to 100, 2 point decimal allowed",
          bidValueError: false
        };
      }
    }
  }
  snackClose = () => e => {
    this.setState({ snackMsg: "", snackOpen: false }, () => {});
  };
  canUserBid = () => {
    //console.log(this.userBids);

    for (let i = 0; i < this.userBids.length; i++) {
      const e = this.userBids[i];
      if (e) {
        if (e.auction_key + "" === this.state.pl.auction_id) {
          let userLastBidDate = new Date(parseInt(e.biddt));
          let ud = userLastBidDate.getDate();
          let now = new Date();
          let nd = now.getDate();
          if (ud === nd) {
            return false;
          } else if (ud < nd) {
            e.biddt = Date.now();
            return true;
          }
        }
      }
    }
    this.userBids.push({ auction_key: this.state.pl.auction_id, biddt: Date.now() });
    return true;
  };
  handleChange = () => event => {
    const db = this.props.gv.db;
    this.helper.showOverlay();
    if (event.currentTarget.name === "submit") {
      if (this.state.bidValue > 0 && this.state.bidValue <= 100) {
        if (this.state.bidValueError === false) {
          this.helper
            .user(this.state.uid, db)
            .once("value")
            .then(v => {
              let user = v.val();
              //console.log(user);
              this.userBids = [];
              if (user !== null) {
                if (user.bids !== undefined) {
                  this.userBids = user.bids;
                }
              }
              if (this.canUserBid()) {
                this.helper
                  .bids(db)
                  .push({
                    bid_price: this.state.bidValue,
                    user_key: this.state.uid,
                    product_key: this.state.pl.id,
                    auction_key: this.state.pl.auction_id,
                    biddt: Date.now()
                  })
                  .then(e => {
                    this.helper
                      .user(this.state.uid, db)
                      .update({ bids: this.userBids })
                      .then(e => {
                        setTimeout(() => {
                          this.helper.hideOverlay();
                          try {
                            window.Android.showToast("Thanks for biding!");
                          } catch (error) {
                            console.log(error);
                          }
                          this.props.history.push(ROUTES.BIDLIST);
                        }, 2000);
                        this.setState({ snackMsg: "Thanks for biding!", snackOpen: true }, () => {});
                      });
                  });
              } else {
                setTimeout(() => {
                  this.helper.hideOverlay();
                  try {
                    window.Android.showToast("You've already bided for this auction");
                  } catch (error) {
                    console.log(error);
                  }
                  this.props.history.push(ROUTES.BIDLIST);
                }, 2000);
                this.setState({ snackMsg: "You've already bided for this auction", snackOpen: true }, () => {});
              }
            });
        } else {
          this.setState({ snackMsg: "Bid value is incorrect", snackOpen: true }, () => {});
          this.helper.hideOverlay();
        }
      } else {
        this.setState({ snackMsg: "Bid value must be greater than 0", snackOpen: true }, () => {});
        this.helper.hideOverlay();
      }
    }
  };
  render() {
    if (localStorage.getItem("token") === null) {
      this.props.history.push(ROUTES.SIGN_IN);
      return <div></div>;
    } else {
      const { onChange, bidValue, pl, snackOpen, snackClose, snackMsg, bidValueHelper, bidValueError } = this.state;
      const handleInputChange = event => {
        let patt = /^(?!00)\d\d?(\.\d\d?)?$/;
        if (patt.test(event.target.value) && parseFloat(event.target.value) > 0) {
          this.setState({
            bidValue: parseFloat(event.target.value),
            bidValueError: false,
            bidValueHelper: "Bid value entered is correct"
          });
        } else {
          this.setState({
            bidValue: parseFloat(event.target.value),
            bidValueError: true,
            bidValueHelper: "Bid value entered is incorrect"
          });
        }
      };
      const handleBlur = e => {
        if (bidValue < 0) {
          this.setState({
            value: 0
          });
        } else if (bidValue > 100) {
          this.setState({
            value: 100
          });
        } else {
          this.setState({
            bidValue: e.target.value
          });
        }
      };
      return (
        <div>
          <Container component="main" maxWidth="xs">
            <Grid container spacing={2} alignItems="center" style={{ marginTop: 10 }}>
              <Grid item xs={12}>
                <MCard
                  name={"bid_1"}
                  actionEnabled={false}
                  title={pl.name}
                  image={pl.photo_url}
                  imageTitle={pl.name}
                  content={pl.description}
                  price={pl.price}
                ></MCard>
              </Grid>
            </Grid>
            <Paper style={{ marginTop: 20, padding: 20 }} elevation={6}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={isNaN(bidValue) ? 0 : bidValue}
                    step={0.01}
                    className="slider"
                    id="cno"
                    name="cno"
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <MTextField
                    required={true}
                    type="number"
                    name="cno"
                    fullWidth={true}
                    label="Bid Value"
                    value={isNaN(bidValue) ? 0 : bidValue}
                    inputProps={{
                      step: 0.1,
                      min: 1,
                      max: 100.0,

                      "aria-labelledby": "input-slider"
                    }}
                    margin="dense"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    helperText={bidValueHelper}
                    error={bidValueError}
                  ></MTextField>
                </Grid>
              </Grid>
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
                    Register Bid
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
export default BidPage;
