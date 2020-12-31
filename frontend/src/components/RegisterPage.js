import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { useAlert } from 'react-alert';

export default class Register extends Component {
  

  constructor(props) {
    super(props);
    this.state = {
      username:'',
      password:'',
      confirm_password:'',

    };

    this.register = this.register.bind(this);
    this.uname = this.uname.bind(this);
    this.pass1 = this.pass1.bind(this);
    this.pass2 = this.pass2.bind(this);
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

  pass2(e) {
    this.setState({
        confirm_password: e.target.value,
    });
  }

  register() {
    
    if(this.state.confirm_password==this.state.password){
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uname: this.state.username,
          password: this.state.password,
          confirm_password:this.state.confirm_password,
        }),
      };
      fetch("/api/register", requestOptions)
        .then((response) => response.json())
        .then((data) => this.view_response(data));
    }else{
      
    
    alert("Password does not match");
  }
}
view_response(data){
  if(data['user_register']=='success'){
    window.location.href = "/login";
  }
  
}
  

  render() {
    return (
        <div class="center">
        <MuiThemeProvider>
          <div>
          <AppBar
             title="Register"
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
           <TextField
             type = "password"
             hintText="Enter your Confirm Password"
             floatingLabelText=" Confrm Password"
             onChange = {this.pass2}
             />
           <br/>
           <RaisedButton label="Submit" primary={true}  onClick={this.register}/>
          </div>
         </MuiThemeProvider>
      </div>
   
    );
  }
}