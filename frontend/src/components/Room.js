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
    this.senddata = this.senddata.bind(this);
    this.handlefile=this.handlefile.bind(this);
   
    
    
  }
   

    
  componentDidMount() {
    this.client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    this.client.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log('got reply! ', data);
      if (data.username==this.state.userName){
        this.insertChat("me",data.message,1000,data.username,data.type)
      }else{
        this.insertChat("notme",data.message,1000,data.username,data.type)
      }
      document.querySelector(".mytext").value="";
    };
}
handlefile(e){

var file = e.target.files[0];
var reader = new FileReader();
reader.onload = (event)=> {
  var yesno=confirm("Click Ok To Send the File. Sending takes time so be patient");
  if(yesno){
    this.client.send(JSON.stringify({
      message: event.target.result,
      username: this.state.userName,
      type:'non-text'}))
  }else{
    document.getElementById("file-input").value="";
  }
  }
  

reader.readAsDataURL(file);
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
dataurltofile(dataURI){
  var BASE64_MARKER = ';base64,';
  var mime = (dataURI.split(BASE64_MARKER)[0]).split(':')[1];
      var filename = 'file-' + (new Date()).getTime() + '.' + mime.split('/')[1];
      var bytes = atob(dataURI.split(BASE64_MARKER)[1]);
      var writer = new Uint8Array(new ArrayBuffer(bytes.length));

      for (var i=0; i < bytes.length; i++) {
        writer[i] = bytes.charCodeAt(i);
      }

      var file= new File([writer.buffer], filename, { type: mime });
      var fileobjurl=URL.createObjectURL(file)
      
      return fileobjurl
}
senddata() {
  
   this.client.send(JSON.stringify({
    message: this.state.text_data,
    username: this.state.userName,
    type:'text'
  })); 
  
  
}
triggerFile(){
  document.getElementById("file-input").click();
}
formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; 
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}  
insertChat(who, text, time,by,type){
  if (time === undefined){
      time = 0;
  }
  var control = "";
  var date = this.formatAMPM(new Date());
  if(type=="text"){
  if (who == "me"){
      control = '<li style="width:100%">' +
                      '<div class="msj macro">' +
                      '<div class="avatar">You</div>' +
                          '<div class="text text-l">' +
                              '<p>'+ text +'</p>' +
                              '<p><small>'+date+'</small></p>' +
                          '</div>' +
                      '</div>' +
                  '</li>';                    
  }else{
      control = '<li style="width:100%;">' +
                      '<div class="msj-rta macro">' +
                          '<div class="text text-r">' +
                              '<p>'+ text +'</p>' +
                              '<p><small>'+date+'</small></p>' +
                          '</div>' +
                      '<div class="avatar">From: '+by+'  </div></div>' +                                
                '</li>';
  }
}else{
  if (who == "me"){
    control = '<li style="width:100%">' +
                    '<div class="msj macro">' +
                    '<div class="avatar">You</div>' +
                        '<div class="text text-l">' +
                            '<a  href="'+this.dataurltofile(text)+'" target="_blank">download</a>' +
                            '<p><small>'+date+'</small></p>' +
                        '</div>' +
                    '</div>' +
                '</li>';                    
}else{
    control = '<li style="width:100%;">' +
                    '<div class="msj-rta macro">' +
                        '<div class="text text-r">' +
                            '<a  href="'+this.dataurltofile(text)+'" target="_blank">download</a>' +
                            '<p><small>'+date+'</small></p>' +
                        '</div>' +
                    '<div class="avatar">From: '+by+'  </div></div>' +                                
              '</li>';
}
}
  setTimeout(
      function(){                        
          $("ul").append(control).scrollTop($("ul").prop('scrollHeight'));
      }, time);
  
} 





  render() {
    
      
return (
  <div class="center"><div class="col-sm-3 col-sm-offset-4 frame">
  <ul></ul>
  <div>
      <div class="msj-rta macro">                        
          <div class="text text-r" style={{background:'whitesmoke !important'}}>
              <input class="mytext" onChange={this.handletext} placeholder="Type a message"/>
          </div> 

      </div>
      <div style={{padding:'10px'}}>
          <span class="glyphicon glyphicon-share-alt" onClick={this.senddata}></span><br/>
        
    <span><i class="fa fa-upload" aria-hidden="true" onClick={this.triggerFile}></i></span>
    <input id="file-input"  onChange={this.handlefile}  type="file" style={{display:'none'}}/>

          
      </div>                
  </div>
</div> 

</div>
 /* <div class="center">
      <textarea id="chat-log" cols="100" rows="20"/><br/>
      <input id="chat" type="text" onChange={this.handletext} size="100"/><br/>
      <button onClick={this.Senddata}>SEND</button><br/>
      {/* <div class="image-upload">
    <label for="file-input">
        <img src="data:image/png;base64,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"/>
    </label>

    <input id="file-input" onChange={this.handlefile} type="file"/>
</div> }</div>  */
   
    );
}
  
}