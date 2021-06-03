import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";

export default class JoinRoom extends Component {
  

  constructor(props) {
    super(props);
    this.state = {
      code:'',
      password:'',
      

    };
    fetch("/api/check_session")
        .then((response) => response.json())
        .then((data) => this.session_check(data));

    this.join_room= this.join_room.bind(this);
    this.handleroomcode= this.handleroomcode.bind(this);
    this.handlepassword = this.handlepassword.bind(this);
    
  }

  handleroomcode(e) {
    this.setState({
      code: e.target.value,
    });
  }

  handlepassword(e) {
    this.setState({
      password: e.target.value,
    });
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

  join_room() {
      if (this.state.password==''){
          alert("Password cannot be null");
      }else if(this.state.code==''){
         alert("Room code cannot be null");
      }
      else{
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passcode: this.state.password,
          code: this.state.code,
          
        }),
      };
      fetch("/api/join-room", requestOptions)
        .then((response) => response.json())
        .then((data) => this.view_response(data));
    
}
  }
view_response(data){
  console.log(data)
  if(data['join-room']=='success'){
    window.location.href = "/room/"+this.state.code;
  }else if(data['join-room']=='failure'){
      alert("Invalid room code or Password");
  }
  else{
    alert(data['join-room']);
  }
  
}



  render() {
    return (
        <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            Join A Room
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl>
            <TextField
              required={true}
              type="text"
              onChange={this.handleroomcode}
              defaultValue=""
              inputProps={{
                min: 1,
                style: { textAlign: "center" },
              }}
            />
            <FormHelperText>
              <div align="center">Room Code</div>
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
            onClick={this.join_room}
          >
            Join Room
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