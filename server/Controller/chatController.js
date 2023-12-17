// ccreate chat
// get user chats
// findChat

const chatModel = require("../Models/chatModel");

const createChat = async(req,res)=>{
const {firstId,secondId} = req.body;
try{
  const chat  = await chatModel.findOne({
    members:{$all:[firstId,secondId]}
   })

  if(chat) return res.status(200).json(chat);

   const newChat = new chatModel({
    members:[firstId,secondId]
   })
   let response = await newChat.save();
   return res.status(200).json(response);
}
catch(error){
    return res.status(500).json(error.message);
  }
};


const findUserChat = async (req,res)=>{
const userId = req.params.userId;

try{
    const chats = await chatModel.find({
        members:{$in: [userId]}
    })
   return res.status(200).json(chats);
}
catch(error){
    return res.status(500).json(error.message);
  }
}


const findChat = async (req,res)=>{
    const {firstId,secondId} = req.params;
    
    try{
        const chat = await chatModel.findOne({
            members:{$all: [firstId,secondId]}
        })
       return res.status(200).json(chat);
    }
    catch(error){
        return res.status(500).json(error.message);
      }
    }

    module.exports = {createChat,findUserChat,findChat};