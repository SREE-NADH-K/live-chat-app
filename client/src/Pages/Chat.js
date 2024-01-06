import {useContext,useEffect, useState } from "react";
import ButtonAppBar from "../Components/ButtonAppbar";
import UserChat from "../Components/UserChat";
import AuthContext from "../Context/AuthContext";
import { getRequest,baseUrl, postRequest } from "../utils/service";
import ChatBox from "../Components/ChatBox";
import UserDiv from "../Components/UserDiv";

const Chat = ()=>{
   const {User,Users,onlineUsers} = useContext(AuthContext);
   const [chatList,SetChatList] = useState([]);
   const [reciever,setReciever] = useState(null);
   const [messages,setMessages]  = useState([]);
   const [currChat,setcurrChat] = useState(null);



    useEffect(()=>{
        if(User){
            fetchChatData();
        }
      },[User])


    async function fetchChatData(){
        const response = await getRequest(`${baseUrl}/chat/${User.id}`);
        let list = getUsers(response);
        SetChatList(list);
    }
      // return an array of users list
      function getUsers(response){
       let arr=[];
          response.forEach((element)=>{
            let tmparr = element.members.filter((item)=>item!=User.id);
            arr.push({chatId:element._id,userId:tmparr[0]});
        })
        return arr;
      };

  async function handleChat(e,element){
     let response = await getRequest(`${baseUrl}/user/find/${element.userId}`);
      setReciever(response);
      let messageResponse = await getRequest(`${baseUrl}/message/get/${element.chatId}`);
      setMessages(messageResponse);
      setcurrChat(element);
   }
   
   async function createChat(userItem){
     if(!chatList.some(obj => obj.userId === userItem.id)){
       let response = await postRequest(`${baseUrl}/chat/`,{firstId:User.id,secondId:userItem.id});
       console.log(response);
       let tmparr = response.members.filter((item)=>item!=User.id);
       let obj = {chatId:response._id,userId:tmparr[0]};
       SetChatList([...chatList,obj]);
     }

   }
    return (
        <div className="chat">
            <ButtonAppBar/>
            <div className="user-div" style={{margin:"10px",display:"flex",cursor:"pointer",overflow:"auto"}}>
                {Users && Users.map((item,index)=>(
                  <div key={index} style={{padding:"10px"}} onClick={(e)=>{createChat(item)}} >
                      <UserDiv  item={item} onlineUsers={onlineUsers} />
                  </div>
                )) } 
            </div>

            <div className="chat-container">
               <div className="chat-list">
                {chatList.map((element,index)=>(
                    <div key={index} onClick={(e)=>{handleChat(e,element)}}>
                       <UserChat messages={messages}  element={element} onlineUsers={onlineUsers} />
                    </div>
                ))}
                
               </div>
               <div className="chat-window">
                {!reciever && <div>No chats are selected ..</div>}
                {reciever && 
                 <ChatBox reciever={reciever} messages={messages} currChat={currChat} setMessages={setMessages}/>
                }
               </div>
        
            </div>
            
        </div>
    )
}

export default Chat;