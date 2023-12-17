const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute")
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");

require("dotenv").config();

const port = process.env.PORT || 5000; // for deployment feasibility

const app = express();




app.use(express.json()); // is a middleware help to alow and send json data
app.use(cors());  // another middleware which make efficient communicate with front end

app.use("/user",userRoute); 
app.use("/chat",chatRoute);
app.use("/message",messageRoute);



app.listen(port,(req,res)=>{
   console.log(port);
})


const uri = process.env.ATLAS_URI;
mongoose.connect(uri).then(()=>{console.log("connected")}).catch((error)=>{console.log("some error",error.message)});