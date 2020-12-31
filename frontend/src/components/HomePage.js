import React, { Component } from "react";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";
import Room from "./Room";
import JoinRoom from "./JoinRoom";
import Logout from "./Logout";
import CreateRoom from "./CreateRoom";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
 
} from "react-router-dom";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state={
     isLogged:false,
    };

    fetch("/api/check_session")
        .then((response) => response.json())
        .then((data) => this.session_check(data));

  }
  session_check(data){
    console.log(data);
    if(data['session']){
      this.setState({
        isLogged: true,
      });
    }
    
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" >
            
            <div class="center">
            <h1>Welcome to MyChat</h1>
        <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/create_room" component={Link}>
              
            Create Room
          </Button>
          </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/join_room" component={Link}>
            Join Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/register" component={Link}>
            Register
          </Button>
        </Grid>
        { this.state.isLogged ?(
          <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/logout" component={Link}>
            Logout
          </Button>
        </Grid>):(
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/login" component={Link}>
            Login
          </Button>
        </Grid>)}
        
        
    
      </Grid></div>
          </Route>
          <Route path="/register" component={RegisterPage}>
            
            </Route>
            <Route path="/login" component={LoginPage}>
            
            </Route>
            
            <Route path="/create_room" component={CreateRoom}>
            
            </Route>
            <Route path="/join_room" component={JoinRoom}>
            
            </Route>
            <Route path="/room/:room_code" component={Room}>
            
            </Route>
            <Route path="/logout" component={Logout}>
            
            </Route>
        </Switch>
      </Router>
    );
  }
}