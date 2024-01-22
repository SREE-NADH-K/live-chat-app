const { Server } = require("socket.io");

const io = new Server({ cors:"http://localhost:3000" });

let onlineUsers = [];

io.on("connection", (socket) => {
   socket.on("addNewUser",(userId)=>{
    !onlineUsers.some((obj)=>obj.userId===userId) &&
    onlineUsers.push({
        userId,
        socketId:socket.id
    });
    io.emit("getOnlineUsers",onlineUsers);
   })
   socket.on("disconnect",()=>{
     onlineUsers = onlineUsers.filter((item)=>item.socketId!==socket.id);
     io.emit("getOnlineUsers",onlineUsers);
   })


   socket.on("sendMessage",(message)=>{
    const user = onlineUsers.find((user)=>user.userId===message.recipientId);
    if(user){
        io.to(user.socketId).emit("getMessage",message);
    }
   })
});

io.listen(8888);
