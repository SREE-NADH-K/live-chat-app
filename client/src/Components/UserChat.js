import Avatar from '@mui/material/Avatar';
import { baseUrl, getRequest } from '../utils/service';
import { useState,useEffect, useContext } from 'react';
import { Typography,Box } from '@mui/material';
import { green } from '@mui/material/colors';
import moment from 'moment';
import AuthContext from '../Context/AuthContext';

// chats
const UserChat = ({messages,element,onlineUsers})=>{
  const {socket} = useContext(AuthContext);


const [chatUser,setChatUser] = useState({id:"",name:""});
const [lastMessage,setLastMessage] = useState("");


const isOnline = (onlineUsers.some((item)=>item.userId===element.userId));

let {name} = chatUser;

//recieve message , and set last message
useEffect(()=>{
  if(socket==null) return;
  socket.on("getMessage",(res)=>{
    
    if(element?.chatId!==res.chatId) return;
    let tmpMessage = res.message[res.message.length-1];
    if(tmpMessage.text.length>12){
      setLastMessage(tmpMessage.text.slice(0,12)+"....")
    }
    else{
      setLastMessage(tmpMessage.text);
    }
  });
 },[]);

  useEffect(()=>{
    if(element.userId){
      fetchChatUser();
      fetchMessage();
    }
  },[]);


  //set last message when sending
  useEffect(()=>{
    if(messages[0] && messages[0].chatId===element.chatId){
      let message = messages[messages.length-1];
      // minimize the message length
      if(message.text.length>12){
        // message.text = message.text.slice(0,12)+"....";
        setLastMessage(message.text.slice(0,12)+"....");
      }
      else{
        setLastMessage(message.text);
      }
 
    }
  },[messages]);


  async function fetchMessage(){
    let messageResponse = await getRequest(`${baseUrl}/message/get/${element.chatId}`);
    let message = messageResponse[messageResponse.length-1];
    if(!message) return;
    if(message?.text.length>12){
      setLastMessage(message.text.slice(0,12)+"....")
    }
    else{
      setLastMessage(message.text);
    }
  }


  //fetch user details
  async function fetchChatUser(){
    let response = await getRequest(`${baseUrl}/user/find/${element.userId}`);
    setChatUser(response);
  }
    return(
     
      <Box sx={{
        display:"flex",
        justifyContent:"space-between",
        margin:"10px",
        borderBottom:"2px solid #7b96ec",
        paddingBottom:"8px",
        maxWidth:"400px",
        minWidth:'250px',
        cursor:"pointer"
      }} >
        <Box sx={{display:"flex"}}>
             <Box sx={{display:"flex",alignItems:"center"}}><Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg"/></Box>
            <Box sx={{marginLeft:"8px"}}>
              <Typography variant='h6' >{name}</Typography>
              <Typography color={green} variant='h8'>{lastMessage? lastMessage:"no chat yet"}</Typography>
            </Box>
          </Box>
          <Box sx={{display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
              <Typography sx={{marginTop:"5px"}} variant='h8'>{lastMessage && moment(lastMessage.createdAt).subtract(10, 'days').calendar()}</Typography>
              <Typography sx={{display:"flex",justifyContent:"flex-end"}} color={isOnline?"green":"black"} variant='h8'>{isOnline?'online':'offline'}</Typography>
          </Box>
       </Box>

    )
}

export default UserChat;