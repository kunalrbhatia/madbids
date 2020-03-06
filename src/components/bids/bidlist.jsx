import React, { Component } from "react";
import { Container, Box } from "@material-ui/core";
import { Copyright, MCard } from "../common/FormElements";
import * as ROUTES from "../../constants/routes";
import * as APIS from "../../constants/fbapis";
class Bidlist extends Component {
  constructor(props) {
    super(props);
    this.auctionsList = [];
    this.allauctions = [];
    //console.log(this.props.gv.db);
    this.helper = this.props.helper;
    const db = this.props.gv.db;
    if (localStorage.getItem("token") === null) {
      this.props.history.push(ROUTES.SIGN_IN);
    } else {
      this.state = {
        onChange: this.handleChange(),
        apis: [
          { name: APIS.PRODUCTS, data: [], url: this.helper.products(db) },
          {
            name: APIS.AUCTIONS,
            data: [],
            url: this.helper
              .auctions(db)
              .orderByChild("is_active")
              .equalTo(1)
          } /* ,
          {
            name: "3/3/2020",
            data: [],
            url: this.helper.auctions(db)
          } */
        ],
        productList: []
      };
    }
  }
  componentDidMount = () => {
    if (localStorage.getItem("token") !== null) {
      this.current = 0;
      //console.log(this.state.apis[this.current]);
      this.total = this.state.apis.length;
      this.helper.showOverlay();
      this.getDataFromDB();
    }
  };
  getDataFromDB = () => {
    if (this.current < this.total) {
      if (!this.props.gv["" + this.state.apis[this.current].name]) {
        this.state.apis[this.current].url.on("value", snapshot => {
          if (snapshot.val() === null) {
            let apis_copy = this.state.apis;
            apis_copy[this.current]["data"] = [];
            this.setState(
              {
                apis: apis_copy
              },
              () => {
                this.current++;
                this.getDataFromDB();
              }
            );
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
        apis_copy[this.current]["data"] = this.props.gv["" + this.state.apis[this.current].name];
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
      this.props.gv.fb.auth().onAuthStateChanged(user => {
        if (user !== undefined && user !== null) {
          this.helper
            .user(user.uid, this.props.gv.db)
            .once("value")
            .then(v => {
              let user = v.val();
              this.userName = user.fname + " " + user.lname;

              //AFTER USER'S NAME IS FETCHED

              const db = this.props.gv.db;
              this.current = 0;
              let auctionsIndex = this.helper.getIndex(this.state.apis, APIS.AUCTIONS);
              this.auctionsList = this.state.apis[auctionsIndex].data;
              /* let allauctionsIndex = this.helper.getIndex(this.state.apis, "3/3/2020");
              this.allauctions = this.state.apis[allauctionsIndex].data;
              let allAuc = this.getActiveAuctionsList("daily", this.allauctions); */
              let activeDaily = this.getActiveAuctionsList("daily", this.auctionsList);
              let activeWeekly = this.getActiveAuctionsList("weekly", this.auctionsList);
              //console.log(activeDaily, activeWeekly);
              for (let index = 0; index < activeDaily.length; index++) {
                const e = activeDaily[index];
                let sd = new Date(e.start_date);
                let nw = new Date();
                nw.setHours(0, 0, 0, 0);
                sd.setHours(0, 0, 0, 0);
                if (sd.getTime() !== nw.getTime()) {
                  e.is_active = 0;
                  this.helper
                    .auctions(db)
                    .child(e.id)
                    .update({ is_active: 0 })
                    .then(() => {
                      this.current = 0;
                      this.auctionsList = [];
                      this.getDataFromDB();
                    });
                }
              }
              if (activeDaily.length === 0) {
                let start_date = Date.now();
                let sd = new Date(start_date);
                let ed = new Date(start_date);
                ed.setDate(ed.getDate() + 1);
                let end_date = ed.getTime();
                let is_active = 1;
                let product_key = 1;
                let type = "daily";
                let auction_name = sd.getDate() + "/" + (sd.getMonth() + 1) + "/" + sd.getFullYear() + " daily";
                this.helper
                  .auctions(db)
                  .push({ auction_name, start_date, end_date, is_active, product_key, type })
                  .then(() => {
                    this.current = 0;
                    this.auctionsList = [];
                    this.getDataFromDB();
                  });
              }
              if (activeWeekly.length > 0) {
                for (let index = 0; index < activeWeekly.length; index++) {
                  const e = activeWeekly[index];
                  let one_day = 1000 * 60 * 60 * 24;
                  let ed = new Date(e.end_date);
                  let nw = new Date();
                  console.log(ed);
                  console.log(nw);
                  ed.setHours(0, 0, 0, 0);
                  nw.setHours(0, 0, 0, 0);
                  let date1_ms = nw.getTime();
                  let date2_ms = ed.getTime();
                  let difference_ms = date2_ms - date1_ms;
                  var res = Math.round(difference_ms / one_day);
                  console.log(res);
                  if (res === 0) {
                    e.is_active = 0;
                    this.helper
                      .auctions(db)
                      .child(e.id)
                      .update({ is_active: 0 })
                      .then(() => {
                        let sd = new Date();
                        let ed = new Date(sd);
                        ed.setDate(ed.getDate() + 7);
                        let end_date = ed.getTime();
                        let is_active = 1;
                        let start_date = sd.getTime();
                        let product_key = 2;
                        let type = "weekly";
                        let auction_name =
                          sd.getDate() + "/" + (sd.getMonth() + 1) + "/" + sd.getFullYear() + " weekly";
                        this.helper
                          .auctions(db)
                          .push({ auction_name, start_date, end_date, is_active, product_key, type })
                          .then(() => {
                            this.current = 0;
                            this.auctionsList = [];
                            this.getDataFromDB();
                          });
                      });
                  }
                }
              } else {
                let sd = new Date();
                if (sd.getDay() === 5) {
                  let ed = new Date(sd);
                  ed.setDate(ed.getDate() + 7);
                  let end_date = ed.getTime();
                  let is_active = 1;
                  let start_date = sd.getTime();
                  let product_key = 2;
                  let type = "weekly";
                  let auction_name = sd.getDate() + "/" + (sd.getMonth() + 1) + "/" + sd.getFullYear() + " weekly";
                  this.helper
                    .auctions(db)
                    .push({ auction_name, start_date, end_date, is_active, product_key, type })
                    .then(() => {
                      this.current = 0;
                      this.auctionsList = [];
                      this.getDataFromDB();
                    });
                }
              }
              this.afterUpdate();
            });
        }
      });
    }
  };
  getActiveAuctionsList(type, auctionlist) {
    let list = [];
    for (let index = 0; index < auctionlist.length; index++) {
      const e = auctionlist[index];
      /* if (e.auction_name === "3/3/2020") {
        const db = this.props.gv.db;
        db.ref("auctions/" + e.id).remove();
        console.log(e);
      } */
      if (e.is_active === 1 && e.type === type) {
        list.push(e);
      }
    }
    return list;
  }
  afterUpdate = () => {
    let prodsIndex = this.helper.getIndex(this.state.apis, APIS.PRODUCTS);
    let prodsData = this.state.apis[prodsIndex].data;
    let pl = [];
    for (let i = 0; i < this.auctionsList.length; i++) {
      let e1 = this.auctionsList[i];
      if (e1.type === "daily") {
        for (let j = 0; j < prodsData.length; j++) {
          let e2 = JSON.parse(JSON.stringify(prodsData[j]));
          if (e1.product_key === parseInt(e2.id)) {
            e2.auction_id = e1.id;
            pl.push(e2);
          }
        }
      }
    }
    for (let i = 0; i < this.auctionsList.length; i++) {
      let e1 = this.auctionsList[i];
      if (e1.type === "weekly") {
        for (let j = 0; j < prodsData.length; j++) {
          let e2 = JSON.parse(JSON.stringify(prodsData[j]));
          if (e1.product_key === parseInt(e2.id)) {
            e2.auction_id = e1.id;
            pl.push(e2);
          }
        }
      }
    }
    this.setState({ productList: pl }, () => {
      this.helper.hideOverlay();
      try {
        //console.log(this.userName);
        window.Android.contentLoaded(this.userName);
      } catch (error) {
        //console.log(error);
      }
    });
  };
  handleChange = () => (event, idx) => {
    if (event.currentTarget.name === "bid_1") {
      this.props.gv.productInfo = this.state.productList[idx];
      localStorage.setItem("productInfo", JSON.stringify(this.state.productList[idx]));
      this.props.history.push(ROUTES.BIDPAGE);
    }
  };
  render() {
    if (localStorage.getItem("token") === null) {
      this.props.history.push(ROUTES.SIGN_IN);
      return <div></div>;
    } else {
      const { onChange, productList } = this.state;
      const mCards = productList.map((pl, idx) => {
        return (
          <div style={{ marginBottom: 20 }} key={pl.auction_id}>
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

export default Bidlist;
