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
      if (localStorage.getItem("uid") !== null) {
        this.props.gv.userId = localStorage.getItem("uid");
      }
      if (localStorage.getItem("productInfo") !== null) {
        this.props.gv.productInfo = JSON.parse(localStorage.getItem("productInfo"));
      }
      this.state = {
        bidValue: 0,
        onChange: this.handleChange(),
        snackClose: this.snackClose(),
        uid: this.props.gv.userId,
        pl: this.props.gv.productInfo,
        snackMsg: "",
        snackOpen: false
      };
      this.userBids = [];
      if (localStorage.getItem("token") === null) {
        this.props.history.push(ROUTES.SIGN_IN);
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
        this.helper
          .user(this.props.gv.userId, db)
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
                    .user(this.props.gv.userId, db)
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
        this.setState({ snackMsg: "Bid value can be greater than 0", snackOpen: true }, () => {});
        this.helper.hideOverlay();
      }
    }
  };
  render() {
    if (localStorage.getItem("token") === null) {
      this.props.history.push(ROUTES.SIGN_IN);
      return <div></div>;
    } else {
      const { onChange, bidValue, pl, snackOpen, snackClose, snackMsg } = this.state;
      const handleInputChange = event => {
        this.setState({
          bidValue: parseFloat(event.target.value)
        });
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
                    value={typeof bidValue === "number" ? bidValue : 0}
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
                    value={bidValue}
                    inputProps={{
                      step: 0.1,
                      min: 1,
                      max: 100.0,

                      "aria-labelledby": "input-slider"
                    }}
                    margin="dense"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    helperText="Number in range from 1 to 100, 2 point decimal allowed"
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
