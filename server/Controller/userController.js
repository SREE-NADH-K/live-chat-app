const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const validate = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id)=>{
    const key = process.env.JWT_SECRET_KEY;
    return jwt.sign({_id},key,{expiresIn: "3d"})
}
 

 const registerUser= (async(req,res)=>{
    const {name,email,password} = req.body;
    try{
    let user  = await userModel.findOne({email});

    if(user) return res.status(400).json("user with given email already exits");

    if(!name || !password || !email) return res.status(400).json("All fields are required");

    if(!validate.isEmail(email)) return res.status(400).json("email must be valid");

    // if(!validate.isStrongPassword(password)) return res.status(400).json("give a strong password");
    user = new userModel({name,email,password});
    
    const salt  = await bcrypt.genSalt(10);
     let newPassword = await bcrypt.hash(password,salt);
   
     user.password = newPassword;
    
    await user.save();
    const token = createToken(user._id);
    res.status(200).json({id:user._id,name:name,token:token})
    }
    catch(error){
      return res.status(500).json(error.message);
    }
})

const loginUser = (async (req,res)=>{

  const {email,password} = req.body;

 try{
  let user  = await userModel.findOne({email});
  if(!user) return res.status(400).json("invalid email");
  

  const isValidpassword =  await bcrypt.compare(password,user.password);
  if(!isValidpassword)  return res.status(400).json("invalid password");

  const token = createToken(user._id);
  return res.status(200).json({id:user._id,name:user.name,token:token})

 }
 catch(error){
  return res.status(500).json(error.message);
}
})

const findUser = async(req,res)=>{
  const userId = req.params.userId;
try{
  let user = await userModel.findById(userId);
  return res.status(200).json({id:user._id,name:user.name});
}
catch(error){
  return res.status(500).json(error.message);
}
}

const getUsers = async(req,res)=>{
try{
  let users = await userModel.find();
  userArr = [];
  users.forEach((item)=>{
    userArr.push({id:item._id,name:item.name,email:item.email});
  })
  res.status(200).json(userArr);
}
catch(error){
  return res.status(500).json(error.message);
}
}
module.exports = {registerUser,loginUser,findUser,getUsers};