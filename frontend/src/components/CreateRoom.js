import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";

export default class CreateRoom extends Component {
  

  constructor(props) {
    super(props);
    this.state = {
      max_strength:'',
      password:'',
      

    };
    fetch("/api/check_session")
        .then((response) => response.json())
        .then((data) => this.session_check(data));

    this.create_room = this.create_room.bind(this);
    this.handlecapacity= this.handlecapacity.bind(this);
    this.handlepassword = this.handlepassword.bind(this);
    
  }

  handlecapacity(e) {
    this.setState({
      max_strength: e.target.value,
    });
  }

  handlepassword(e) {
    this.setState({
      password: e.target.value,
    });
  }



  create_room() {
      if (this.state.password==''){
          alert("Password cannot be null");
      }else if(this.state.password=="0"){
         alert("Strength of room should be greater than 0");
      }
      else{
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passcode: this.state.password,
          strength: this.state.max_strength,
          
        }),
      };
      fetch("/api/create-room", requestOptions)
        .then((response) => response.json())
        .then((data) => this.view_response(data));
    
}
  }
view_response(data){
  console.log(data)
  if(data['created-room']){
    alert(`Room Code:${data['room_name']} Password :${data['pass']} Please Remember Them.`);
  }else{
      alert("Invalid Username Password");
  }
  
}
session_check(data){
  if(data['session']){
    this.setState({
      userName: data['user_name'],
    });
  }else{
    window.location.href = "/login";
  }
  
}



  render() {
    return (
        <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            Create A Room
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl>
            <TextField
              required={true}
              type="number"
              onChange={this.handlecapacity}
              defaultValue="1"
              inputProps={{
                min: 1,
                style: { textAlign: "center" },
              }}
            />
            <FormHelperText>
              <div align="center">Max. Strength of Room</div>
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl>
            <TextField
              required={true}
              type="text"
              onChange={this.handlepassword}
              defaultValue=""
              inputProps={{
                min: 1,
                style: { textAlign: "center" },
              }}
            />
            <FormHelperText>
              <div align="center">Passcode for Room</div>
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={this.create_room}
          >
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
   
    );
  }
}