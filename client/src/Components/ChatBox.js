
import { Container, Typography,Box } from "@mui/material";
import moment from "moment";
import InputEmoji from 'react-input-emoji';
import SendIcon from '@mui/icons-material/Send';
import { useContext, useEffect, useRef, useState } from "react";
import { baseUrl, postRequest } from "../utils/service";
import AuthContext from "../Context/AuthContext";



// where all chats are contained
const ChatBox = ({reciever,messages,currChat,setMessages})=>{
  const {User,socket} = useContext(AuthContext);
  const [message,setMessage] = useState("");
  const [tmpMessages,SetTmpMessages] = useState([]);
  const scrolRef = useRef(null);
  // console.log(reciever);
 
  useEffect(()=>{
    scrollToBottom();
  },[tmpMessages]);
  
  
   useEffect(()=>{
    // recieve message 
    if(socket==null) return;
  
    socket.on("getMessage",(res)=>{
      console.log(currChat);
      console.log("currchat =" + reciever.id, "resChatid ="+res.recipientId);
      if(currChat && currChat.chatId==res.chatId){ // check it is belong to recipient
         SetTmpMessages([...res.message]);
      }
      else{
        SetTmpMessages(messages);
      }
    });
   },[currChat]);
   

 // for first rendering
  useEffect(()=>{
     if(messages[0] && currChat?.chatId===messages[0].chatId){
      SetTmpMessages(messages);
     }
     else{
      SetTmpMessages([]);
     }
  },[messages])
 
  // handle message event
  async function handleMessage(){
    if(message.length>0){
    let res = await postRequest(`${baseUrl}/message/`,{chatId:currChat.chatId,senderId:User.id,text:message});
       setMessages([...tmpMessages,res]);
       SetTmpMessages([...tmpMessages,res]);
       setMessage("");
     if(socket==null) return;
   
    let recipientId = currChat?.userId;
    let chatId = currChat?.chatId;
    //trigger send message event
    socket.emit("sendMessage",{message:[...tmpMessages,res],chatId,recipientId});
    }
  }

  //make scroll position always in bottom
  const scrollToBottom = () => {
    if (scrolRef.current) {
      scrolRef.current.scrollTo({
        top: scrolRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  scrollToBottom();


    return(
        <Box className="chat-box">
         <Container  sx={{bgcolor:" #7b96ec",display:"flex",justifyContent:"center",padding:"5px"}}>
            <Typography>{reciever.name}</Typography>
         </Container>

         <Box ref={scrolRef} sx={{height:"80%",overflow:"auto"}}>
            {tmpMessages.length>0 && tmpMessages.map((element,index)=>(
            <div key={index} className={User.id===element.senderId?"message-container send":"message-container reciever"}>
                    
                    <div className="message ">
                      <Typography sx={{wordWrap: "break-word"}} variant="body1">{element.text}</Typography>
                      <Typography align="right" variant="body2">{moment(element.createdAt).calendar()}</Typography>
                    </div> 
                 </div>
            ))}
         </Box>

          <Box sx={{width:"100%", height:"fit-contend",bgcolor:"#CFE8FC",display:"flex",alignItems:"center"}}>
            <div className="input-emoji"><InputEmoji value={message} onChange={setMessage} /></div>
            <div style={{marginRight:"5px",cursor:"pointer"}}><SendIcon onClick={handleMessage} /></div>
          </Box>
        </Box>
    )
}

export default ChatBox;