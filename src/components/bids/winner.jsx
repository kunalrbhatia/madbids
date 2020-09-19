import React, { Component } from "react";
import { Container, Box, Paper } from "@material-ui/core";
import { Copyright, MTextField } from "../common/FormElements";
import * as ROUTES from "../../constants/routes";
import * as APIS from "../../constants/fbapis";
class Winner extends Component {
  constructor(props) {
    super(props);
    if (localStorage.getItem("token") === null) {
      this.props.history.push(ROUTES.SIGN_IN);
    } else {
      const db = this.props.gv.db;
      this.helper = this.props.helper;
      let auc = this.helper.auctions(db).orderByChild("start_date").limitToLast(20);

      this.state = {
        onChange: this.handleChange(),
        apis: [
          {
            name: APIS.AUCTIONS,
            data: [],
            url: auc,
          },
        ],
        auction_id: "",
        bidlist: [],
        winner_name: null,
        bid_amount: null,
      };
      this.objCopy = [];
      this.current = 0;
      this.total = this.state.apis.length;
    }
  }
  componentDidMount = () => {
    if (localStorage.getItem("token") === null) {
      this.props.history.push(ROUTES.SIGN_IN);
    } else {
      this.helper.showOverlay();
      this.getDataFromDB();
    }
  };
  getDataFromDB = () => {
    //console.log(this.state);
    if (this.current < this.total) {
      if (!this.props.gv["" + this.state.apis[this.current].name]) {
        this.state.apis[this.current].url.on("value", (snapshot) => {
          //console.log("here --> ", snapshot.val());
          const object = snapshot.val();
          if (object === null) {
            this.current++;
            this.getDataFromDB();
          } else {
            const _list = Object.keys(object).map((key) => ({
              ...object[key],
              id: key,
            }));
            //console.log(_list);
            let apis_copy = this.state.apis;
            apis_copy[this.current]["data"] = _list;
            this.setState(
              {
                apis: apis_copy,
              },
              () => {
                this.current++;
                this.getDataFromDB();
              }
            );
          }
        });
      } else {
        let apis_copy = this.state.apis;
        apis_copy[this.current]["data"] = this.props.gv["" + this.state.apis[this.current].name];
        this.setState(
          {
            apis: apis_copy,
          },
          () => {
            this.current++;
            this.getDataFromDB();
          }
        );
      }
    } else {
      //console.log(this.state);
      this.helper.hideOverlay();
    }
  };
  findWinnerByTime = (_bids) => {
    let bids = _bids;
    let bidValues = this.getBidValuesFromBids(bids);
    let minBid = Math.min(...bidValues);
    let bidsWithMin = this.getBidsByValue(minBid);
    let new_low_date = new Date(Date.now());
    let bid;
    for (let i = 0; i < bidsWithMin.length; i++) {
      let e = _bids[i];
      let edate = new Date(e.biddt);
      if (edate < new_low_date) {
        new_low_date = edate;
        bid = e;
      }
    }
    console.log(bid);
    this.declareWinner(bid);
  };
  findWinner = (_bids) => {
    let bids = _bids;
    let bidValues = this.getBidValuesFromBids(bids);
    let minBid = Math.min(...bidValues);
    let bidsWithMin = this.getBidsByValue(minBid);
    console.log(bidsWithMin);
    if (bidsWithMin.length > 1) {
      console.log(bidsWithMin);
      this.removeInvalidBids(bidsWithMin);
      //console.log("bidsWithMin.length > 1");
      //this.findWinnerByTime(bidsWithMin);
      // let refinedBids = this.removeInvalidBids(minBid);
      // this.findWinner(refinedBids);
    } else if (bidsWithMin.length === 0) {
      //console.log("bidsWithMin.length === 0");
      bids = JSON.parse(JSON.stringify(this.objCopy));
      bidValues = this.getBidValuesFromBids(bids);
      minBid = Math.min(...bidValues);
      bidsWithMin = this.getBidsByValue(minBid);
      this.findWinnerByTime(bidsWithMin);
    } else {
      //console.log("winner found", bidsWithMin);
      //this.setState({bidlist:this.objCopy},()=>{console.log("no winner found",this.state.bidlist)});
      //console.log(bidsWithMin);
      this.declareWinner(bidsWithMin);
    }
  };
  getBidValuesFromBids = (_bids) => {
    let bidValues = [];
    for (let i = 0; i < _bids.length; i++) {
      const e = _bids[i];
      bidValues.push(parseFloat(e.bid_price));
    }
    return bidValues;
  };
  declareWinner = (bid) => {
    const db = this.props.gv.db;
    if (bid !== null) {
      bid = bid[0] === undefined ? bid : bid[0];
    }
    if (bid === null || bid === undefined) {
      this.setState(
        {
          winner_name: "No Winner Declared",
          bid_amount: 0,
        },
        () => {
          this.helper.hideOverlay();
        }
      );
    } else {
      this.helper
        .user(bid.user_key, db)
        .once("value")
        .then((v) => {
          let object = v.val();
          this.setState(
            {
              winner_name: object.fname + " " + object.lname,
              bid_amount: bid.bid_price,
            },
            () => {
              this.helper.hideOverlay();
            }
          );
        });
    }
  };
  removeInvalidBids = (bids) => {
    let r_bids = [];
    for (let i = 0; i < this.state.bidlist.length; i++) {
      const e = this.state.bidlist[i];
      let flag = false;
      console.log(e);
      for (let j = 0; j < bids.length; j++) {
        const f = bids[j];
        console.log(f);
        if (e.id === f.id) {
          flag = true;
          break;
        }
      }
      console.log(flag);
      if (!flag) {
        r_bids.push(e);
      }
    }
    console.log(r_bids);
    //return r_bids;
  };
  getBidsByValue = (value) => {
    let bids = [];
    for (let i = 0; i < this.objCopy.length; i++) {
      const e = this.objCopy[i];
      if (parseFloat(e.bid_price) === value) {
        bids.push(e);
      }
    }
    return bids;
  };
  handleChange = () => (event, idx) => {
    const db = this.props.gv.db;
    if (event.target.name === "auctionList") {
      this.helper.showOverlay();
      this.setState({ auction_id: event.target.value }, () => {
        this.helper
          .bids(db)
          .orderByChild("auction_key")
          .equalTo(this.state.auction_id)
          .once("value")
          .then((v) => {
            let object = v.val();
            if (object === null) {
              this.declareWinner(null);
            } else {
              const _list = Object.keys(object).map((key) => ({
                ...object[key],
                id: key,
              }));
              console.log(_list);
              this.setState({ bidlist: _list }, () => {
                this.setState({ bidlist: _list });
                this.objCopy = JSON.parse(JSON.stringify(_list));
                this.findWinner(this.objCopy);
              });
            }
          });
      });
    }
  };
  render() {
    let showMessage = "";
    let closedAuctions = true;
    if (localStorage.getItem("token") === null) {
      this.props.history.push(ROUTES.SIGN_IN);
      return <div></div>;
    } else {
      const { auction_id, onChange, winner_name, bid_amount } = this.state;
      const auction_data = [];
      const auction_data_weekly = [];
      const auction_list = this.state.apis[this.helper.getIndex(this.state.apis, APIS.AUCTIONS)].data;
      //console.log(auction_list);
      for (let i = auction_list.length - 1; i >= 0; i--) {
        const e = auction_list[i];
        if (e.is_active === 0 && e.type === "daily") {
          auction_data.push({ value: e.id, label: e.auction_name });
        }
      }
      for (let i = auction_list.length - 1; i >= 0; i--) {
        const e = auction_list[i];
        if (e.is_active === 0 && e.type === "weekly") {
          auction_data_weekly.push({ value: e.id, label: e.auction_name });
        }
      }
      //console.log(auction_list, auction_data_weekly);
      if (auction_data.length === 0) {
        closedAuctions = false;
        showMessage = "No closed auctions";
      }
      return (
        <div>
          <Container component="main" maxWidth="xs" style={{ marginTop: 20 }}>
            <div className="auctionList" style={{ display: closedAuctions ? "block" : "none" }}>
              <MTextField
                name={"auctionList"}
                type={"select"}
                fullWidth={true}
                data={auction_data}
                disabled={auction_data.length > 0 ? false : true}
                label={"Auction List Daily"}
                value={auction_id}
                onChange={onChange}
                //helperText={"Please select a issue type"}
              ></MTextField>
            </div>
            <div className="auctionList" style={{ display: closedAuctions ? "block" : "none" }}>
              <MTextField
                name={"auctionList"}
                type={"select"}
                fullWidth={true}
                data={auction_data_weekly}
                disabled={auction_data_weekly.length > 0 ? false : true}
                label={"Auction List Weekly"}
                value={auction_id}
                onChange={onChange}
                //helperText={"Please select a issue type"}
              ></MTextField>
            </div>
            <div className="auctionList" style={{ display: closedAuctions ? "none" : "block" }}>
              <Paper elevation={1}>
                <h4 align="center">{showMessage}</h4>
              </Paper>
            </div>
            <div className="winnerName" style={{ display: winner_name ? "block" : "none", margin: "20px auto" }}>
              <Paper elevation={4}>
                <img src={require("../images/winner.jpg")} alt="Winner" className="winner_img" />
                <div className="winnerName">
                  <p className="name">{winner_name}</p>
                  <span className="bidamount">Bid Amount: {bid_amount}</span>
                </div>
              </Paper>
            </div>
            <Box mt={4}>
              <Copyright />
            </Box>
          </Container>
        </div>
      );
    }
  }
}
export default Winner;
