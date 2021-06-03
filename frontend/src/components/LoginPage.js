import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { useAlert } from 'react-alert';

export default class Login extends Component {
  

  constructor(props) {
    super(props);
    this.state = {
      username:'',
      password:'',
      

    };
    fetch("/api/check_session")
        .then((response) => response.json())
        .then((data) => this.session_check(data));

    this.register = this.login.bind(this);
    this.uname = this.uname.bind(this);
    this.pass1 = this.pass1.bind(this);
    
  }

  uname(e) {
    this.setState({
      username: e.target.value,
    });
  }

  pass1(e) {
    this.setState({
      password: e.target.value,
    });
  }



  login() {
    
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uname: this.state.username,
          password: this.state.password,
          
        }),
      };
      fetch("/api/login", requestOptions)
        .then((response) => response.json())
        .then((data) => this.view_response(data));
    
}
view_response(data){
  if(data['user_login']=='success'){
    window.location.href = "/";
  }else{
      alert("Invalid Username Password");
  }
  
}

session_check(data){
    if(data['session']){
      console.log(data);
      window.location.href = "/";
    }
    
  }

  render() {
    return (
        <div class="centerpage">
        <MuiThemeProvider>
          <div>
          <AppBar
             title="Login"
           />
           <TextField
             hintText="Enter your Prefered Username"
             floatingLabelText="User name"
             onChange = {this.uname}
             />
             <br/>
           <TextField
             type = "password"
             hintText="Enter your Password"
             floatingLabelText="Password"
             onChange = {this.pass1}
             />
           <br/>
           
           <RaisedButton label="Submit" primary={true}  onClick={this.register}/>
          </div>
         </MuiThemeProvider>
      </div>
   
    );
  }
}