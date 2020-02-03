import React, { Component } from "react";
import { Container, Box } from "@material-ui/core";
import { Copyright, MCard, MAppBar, MMenu } from "../common/FormElements";
import * as ROUTES from "../../constants/routes";
import * as APIS from "../../constants/fbapis";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
class Bidlist extends Component {
  constructor(props) {
    super(props);
    if (localStorage.getItem("token") === null) {
      this.props.history.push(ROUTES.SIGN_IN);
    } else {
      this.state = {
        onChange: this.handleChange(),
        onAppBarClose: this.handleAppBarClose(),
        apis: [
          { name: APIS.PRODUCTS, data: [], url: this.props.firebase.products() },
          {
            name: APIS.AUCTIONS,
            data: [],
            url: this.props.firebase
              .auctions()
              .orderByChild("is_active")
              .equalTo("1")
          }
        ],
        productList: []
      };
    }
  }
  componentDidMount = () => {
    if (localStorage.getItem("token") !== null) {
      this.helper = this.props.helper;
      this.current = 0;
      this.total = this.state.apis.length;
      this.helper.showOverlay();
      this.getDataFromDB();
    }
  };
  getDataFromDB = () => {
    if (this.current < this.total) {
      if (!this.props.globalVars["" + this.state.apis[this.current].name]) {
        this.state.apis[this.current].url.on("value", snapshot => {
          if (snapshot.val() === null) {
            this.current++;
            this.getDataFromDB();
          } else {
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
          }
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
    } else {
      this.current = 0;
      let auctionsIndex = this.helper.getIndex(this.state.apis, APIS.AUCTIONS);
      let auctionsList = this.state.apis[auctionsIndex].data;
      if (auctionsList.length === 0) {
        let start_date = Date.now();
        let sd = new Date(start_date);
        let ed = new Date(start_date);
        ed.setDate(ed.getDate() + 1);
        let end_date = ed.getTime();
        let is_active = 1;
        let product_key = 1;
        let type = "daily";
        let auction_name = sd.getDate() + "/" + sd.getMonth() + 1 + "/" + sd.getFullYear();
        this.props.firebase.auctions().push({ auction_name, start_date, end_date, is_active, product_key, type });
      }
      let prodsIndex = this.helper.getIndex(this.state.apis, APIS.PRODUCTS);
      let prodsData = this.state.apis[prodsIndex].data;
      let pl = [];
      for (let i = 0; i < auctionsList.length; i++) {
        const e1 = auctionsList[i];
        for (let j = 0; j < prodsData.length; j++) {
          const e2 = prodsData[j];
          e2.auction_id = e1.id;
          if (e1.product_key === parseInt(e2.id)) {
            pl.push(e2);
          }
        }

        /* let strt_date = new Date();
        strt_date = Date.parse(e1.start_date);
        let end_date = new Date();
        end_date = Date.parse(e1.end_date);
        let now = new Date();
        if (now > strt_date && now < end_date) {
          for (let j = 0; j < prodsData.length; j++) {
            const e2 = prodsData[j];
            e2.auction_id = e1.id;
            if (e1.product_key === parseInt(e2.id)) {
              pl.push(e2);
            }
          }
        } */
      }

      this.setState({ productList: pl }, () => {
        this.helper.hideOverlay();
        try {
          window.Android.contentLoaded();
        } catch (error) {
          //console.log(error);
        }
      });
    }
  };
  handleAppBarClose = () => str => {
    if (str === "logout") {
      this.helper.doLogout(this.props);
    } else if (str === "winner") {
      this.props.history.push(ROUTES.WINNER);
    }
  };
  handleChange = () => (event, idx) => {
    if (event.currentTarget.name === "bid_1") {
      this.props.globalVars.productInfo = this.state.productList[idx];
      localStorage.setItem("productInfo", JSON.stringify(this.state.productList[idx]));
      this.props.history.push(ROUTES.BIDPAGE);
    }
  };
  render() {
    if (localStorage.getItem("token") === null) {
      this.props.history.push(ROUTES.SIGN_IN);
      return <div></div>;
    } else {
      const { onChange, onAppBarClose, productList } = this.state;
      const mCards = productList.map((pl, idx) => {
        return (
          <div style={{ marginBottom: 20 }} key={pl.id}>
            <MCard
              name={"bid_1"}
              actionEnabled={true}
              title={pl.name}
              image={pl.photo_url}
              imageTitle={pl.name}
              content={pl.description}
              price={pl.price}
              onChange={e => onChange(e, idx)}
            ></MCard>
          </div>
        );
      });
      return (
        <div>
          <MAppBar
            name="Products"
            handleClose={onAppBarClose}
            menu={
              <MMenu
                menuitems={[
                  { name: APIS.WINNER, value: "Winner" },
                  { name: APIS.LOGOUT, value: "Logout" }
                ]}
                handleClose={onAppBarClose}
              ></MMenu>
            }
          ></MAppBar>
          <Container component="main" maxWidth="xs" style={{ marginTop: 20 }}>
            {mCards}
            <Box mt={4}>
              <Copyright />
            </Box>
          </Container>
        </div>
      );
    }
  }
}
const bidList = compose(withFirebase)(Bidlist);
export default withFirebase(bidList);
