import React, { Component } from "react";
import { Container, Box } from "@material-ui/core";
import { Copyright, MTextField } from "../common/FormElements";
//import * as ROUTES from "../../constants/routes";
import * as APIS from "../../constants/fbapis";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
class Winner extends Component {
  constructor(props) {
    super(props);
    this.helper = this.props.helper;
    this.state = {
      onChange: this.handleChange(),
      apis: [
        {
          name: APIS.AUCTIONS,
          data: [],
          url: this.props.firebase
            .auctions()
            .orderByChild("is_active")
            .equalTo(0)
        }
      ],
      auction_id: "",
      bidlist: []
    };
    this.objCopy = [];
    this.helper = this.props.helper;
    this.current = 0;
    this.total = this.state.apis.length;
  }
  componentDidMount = () => {
    this.getDataFromDB();
  };
  getDataFromDB = () => {
    if (this.current < this.total) {
      if (!this.props.globalVars["" + this.state.apis[this.current].name]) {
        this.state.apis[this.current].url.on("value", snapshot => {
          const object = snapshot.val();
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
        });
      } else {
        let apis_copy = this.state.apis;
        apis_copy[this.current]["data"] = this.props.globalVars["" + this.state.apis[this.current].name];
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
    }
  };
  findWinnerByTime = _bids => {
    let new_low_date = new Date(Date.now());
    let bid;
    for (let i = 0; i < _bids.length; i++) {
      let e = _bids[i];
      let edate = new Date(e.biddt);
      if (edate < new_low_date) {
        new_low_date = edate;
        bid = e;
      }
    }
    //console.log(bid);
    this.declareWinner(bid);
  };
  findWinner = _bids => {
    let bids = _bids;
    let bidValues = this.getBidValuesFromBids(bids);
    let minBid = Math.min(...bidValues);
    let bidsWithMin = this.getBidsByValue(minBid);
    if (bidsWithMin.length > 1) {
      let refinedBids = this.removeInvalidBids(minBid);
      this.findWinner(refinedBids);
    } else {
      if (bidsWithMin.length === 0) {
        bids = JSON.parse(JSON.stringify(this.objCopy));
        bidValues = this.getBidValuesFromBids(bids);
        minBid = Math.min(...bidValues);
        bidsWithMin = this.getBidsByValue(minBid);
        this.findWinnerByTime(bidsWithMin);
      } else {
        //console.log("winner found",this.objCopy);
        //this.setState({bidlist:this.objCopy},()=>{console.log("no winner found",this.state.bidlist)});
        //console.log(bidsWithMin);
        this.declareWinner(bidsWithMin);
      }
    }
  };
  getBidValuesFromBids = _bids => {
    let bidValues = [];
    for (let i = 0; i < _bids.length; i++) {
      const e = _bids[i];
      bidValues.push(e.bid_price);
    }
    return bidValues;
  };
  declareWinner = bid => {
    console.log(bid);
  };
  removeInvalidBids = value => {
    let bids = this.state.bidlist;
    for (let i = 0; i < this.state.bidlist.length; i++) {
      const e = this.state.bidlist[i];
      if (e.bid_price === value) {
        bids.splice(i, 1);
        i--;
      }
    }
    return bids;
  };
  getBidsByValue = value => {
    let bids = [];
    for (let i = 0; i < this.objCopy.length; i++) {
      const e = this.objCopy[i];
      if (e.bid_price === value) {
        bids.push(e);
      }
    }
    return bids;
  };
  handleChange = () => (event, idx) => {
    if (event.target.name === "auctionList") {
      this.setState({ auction_id: event.target.value }, () => {
        this.props.firebase
          .bids()
          .orderByChild("auction_key")
          .equalTo(this.state.auction_id)
          .once("value")
          .then(v => {
            let object = v.val();
            const _list = Object.keys(object).map(key => ({
              ...object[key],
              id: key
            }));
            this.setState({ bidlist: _list }, () => {
              this.setState({ bidlist: _list });
              this.objCopy = JSON.parse(JSON.stringify(_list));
              this.findWinner(this.objCopy);
            });
          });
      });
    }
  };
  render() {
    const { auction_id, onChange } = this.state;
    const auction_data = [];
    const auction_list = this.state.apis[this.helper.getIndex(this.state.apis, APIS.AUCTIONS)].data;
    for (let i = 0; i < auction_list.length; i++) {
      const e = auction_list[i];
      auction_data.push({ value: e.id, label: e.auction_name });
    }
    return (
      <Container component="main" maxWidth="xs">
        <div className="auctionList">
          <MTextField
            name={"auctionList"}
            type={"select"}
            fullWidth={true}
            data={auction_data}
            label={"Auction List"}
            value={auction_id}
            onChange={onChange}
            helperText={"Please select a issue type"}
          ></MTextField>
        </div>
        <div className="winnerName">

        </div>
        <Box mt={4}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}
const winner = compose(withFirebase)(Winner);
export default withFirebase(winner);
