import React, { Component } from 'react';


export default class Login extends Component {
  

  constructor(props) {
    super(props);
    
    fetch("/api/delete_session")
        .then((response) => response.json())
        .then((data) => this.session_check(data));

    
    
  }

session_check(data){
    if(data['session']){
      console.log(data);
      window.location.href = "/join_room";
    }else{
        window.location.href = "/login";
    }
    
  }

  render() {
    return (
        <h1>LOGGING OUT.</h1>
   
    );
  }
}