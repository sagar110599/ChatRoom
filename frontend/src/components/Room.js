import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import { w3cwebsocket as W3CWebSocket } from "websocket";


export default class Room extends Component {
  

  constructor(props) {
    super(props);
    this.state = {
      text_data:'',
      userName:'',
      text_from_server:'',
      

    };
    fetch("/api/check_session")
        .then((response) => response.json())
        .then((data) => this.session_check(data));
    this.roomCode = this.props.match.params.room_code;
    this.client = new W3CWebSocket('ws://127.0.0.1:8000/ws/frontend/room/'+this.roomCode);
    this.handletext = this.handletext.bind(this);
    this.Senddata = this.Senddata.bind(this);
  }
   

    
  componentDidMount() {
    this.client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    this.client.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log('got reply! ', data);
      
      document.querySelector('#chat-log').value += (data.username + ': ' + data.message + '\n')
    };
}

handletext(e) {
  this.setState({
    text_data: e.target.value,
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
Senddata() {
  this.client.send(JSON.stringify({
    message: this.state.text_data,
    username: this.state.userName
  }));
  document.querySelector('#chat').value="";
}
 





  render() {
    return (
      <div class="center">
      <textarea id="chat-log" cols="100" rows="20"/><br/>
      <input id="chat" type="text" onChange={this.handletext} size="100"/><br/>
      <button onClick={this.Senddata}>SEND</button></div>
   
    );
  }
}