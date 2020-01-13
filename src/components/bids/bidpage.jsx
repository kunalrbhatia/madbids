import React, { Component } from "react";
import { Container, Box, Paper, Grid, Slider } from "@material-ui/core";
import { Copyright, MCard, MTextField, MButton } from "../common/FormElements";
import paytm_cash from "../../assets/images/paytm_cash.jpg";
export default class BidPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value:0,
      onChange: this.handleChange()
    };
  }
  handleChange = () => event => {
    if (event.target.textContent === "Submit") {
    }
  };
  render() {
    const { onChange, value } = this.state;
    const handleSliderChange = (event, newValue) => {
      this.setState({
        value:newValue
      })
    };
  
    const handleInputChange = event => {
      console.log(event.target.value);
      this.setState({
        value:parseFloat(event.target.value)
      });      
    };

    const handleBlur = (e) => {
      if (value < 0) {
        this.setState({
          value:0
        });
      } else if (value > 100) {
        this.setState({
          value:100
        })
      }
    };
    return (

      <Container component="main" maxWidth="xs">
        
        <Paper style={{ marginTop: 20, padding:20 }} elevation={6}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <MCard
                name={"bid_1"}
                actionEnabled={false}
                title={"Win \u20B9200 Paytm Cash"}
                image={paytm_cash}
                imageTitle="Paytm Cash"
                content={"Bid and Win \u20B9200 Paytm Cash"}
                onChange={onChange}
              ></MCard>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <Slider
                /* value={typeof value === 'number' ? value : 0} */
                value={value}
                onChange={handleSliderChange}
                aria-labelledby="input-slider"
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
                value={value}
                inputProps={{
                  step: "0.01",
                  min: "0",
                  max: "100.00",
                  'aria-labelledby': 'input-slider',
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
        <Box mt={4}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}
