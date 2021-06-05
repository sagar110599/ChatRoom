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
      ishost:false,
      size:0,
      roomCode:this.props.match.params.room_code,
      

    };
    
    fetch("/api/check-room-session?code="+this.state.roomCode)
        .then((response) => response.json())
        .then((data) => this.session_check(data));
    
    this.client = new W3CWebSocket('ws://127.0.0.1:8000/ws/frontend/room/'+this.state.roomCode);
    this.handletext = this.handletext.bind(this);
    this.senddata = this.senddata.bind(this);
    this.handlefile=this.handlefile.bind(this);
   this.closeRoom=this.closeRoom.bind(this);
   this.increaseSize=this.increaseSize.bind(this);
   this.handleroomsize=this.handleroomsize.bind(this);
    
    
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
    this.client.onclose=()=>{
console.log("Room Closed");
alert("Refresh To Again start Chatting")
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

increaseSize(){
  if(this.state.size>0){
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      room:this.state.roomCode,
      strength: this.state.size,
      
    }),
  };
  fetch("/api/increase-room-size", requestOptions)
    .then((response) => response.json())
    .then((data) => this.view_response(data));
}else{
alert("Invalid Room Size");
}
}
view_response(data){
  if(data['response']){
    alert("Size Increased");
  }else{
    alert("Could Not Update Size");
  }
}
handletext(e) {
  this.setState({
    text_data: e.target.value,
  });
}

handleroomsize(e) {
  
  this.setState({
    size: e.target.value,
  });

}

session_check(data){
  if(data['session']){
    this.setState({
      userName: data['user_name'],
      ishost:data['host'],
    });
  }else{
    window.location.href = "/join_room";
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
closeRoom(){
  this.client.send(JSON.stringify({
    message: "Exited the Room",
    username: this.state.userName,
    type:'text'
  })); 
  this.client.close();
  
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
  <div class="container">
  <div class="row">
   
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
</div>
<br/><br/>
{this.state.ishost?(
<div class="container">
<Grid item xs={11} align="center">
<FormControl>
            <TextField
              required={true}
              type="number"
              onChange={this.handleroomsize}
              defaultValue=""
              inputProps={{
                min: 0,
                style: { textAlign: "center" },
              }}
            />
            <FormHelperText>
              <div align="center">Increase Room Size By</div>
            </FormHelperText>
            <Button color="secondary" variant="contained" onClick={this.increaseSize}>
            Increase
          </Button>
          </FormControl>
        </Grid>
        <br/>
        <br/>
        
</div>):''}
<Grid item xs={11} align="center">
          <Button color="secondary" variant="contained" onClick={this.closeRoom}>
            Exit Room
          </Button>
        </Grid>
</div>


   
    );
}
}