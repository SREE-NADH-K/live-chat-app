
import { io } from "socket.io-client";
import { getRequest,baseUrl } from "../utils/service";
import AuthContext from "./AuthContext";
import { useState,useCallback,useEffect } from "react";

const AuthContextProvider = (props)=>{
    const [User,setUser] = useState(null);
    const [Users,setUsers] = useState(null);
    const [socket,setSocket] = useState(null);
    const [onlineUsers,setOnlineUsers] =useState([]);
  

    useEffect(()=>{
        const newSocket = io("http://localhost:8888");
        setSocket(newSocket);
      
        return()=>{
            newSocket.disconnect();
        }
    },[User])

    useEffect(()=>{
        if(socket){
            socket.emit("addNewUser",User?.id);
            socket.on("getOnlineUsers",(onlineUsers)=>{
             setOnlineUsers(onlineUsers);
             getAllUsers();
            });
        }
    },[socket]);
    // useEffect(()=>{
    //     if(User){
    //         getAllUsers();
    //     }
    // },[User])

    async function getAllUsers(){
        if(!User) return;
      let response = await getRequest(`${baseUrl}/user/Users`);
      let tmparr = response.filter((item)=>item.id!==User.id)
      setUsers(tmparr);
    }

    useEffect(()=>{
        let user = localStorage.getItem("user");
        setUser(JSON.parse(user));
    },[]);

    const Setuser = useCallback((user)=>{
        setUser(user);
        localStorage.setItem('user',JSON.stringify(user));
    },[]);

    const logout = useCallback(()=>{
        localStorage.removeItem("user")
        setUser(null);
    })


    return (
        <AuthContext.Provider value={{User,Setuser,logout,Users,onlineUsers,socket}} >
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;