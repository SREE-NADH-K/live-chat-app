const express = require("express");

const {createMessage,getMessages} = require("../Controller/messageController");

const router = express.Router();

router.post("/",createMessage);
router.get("/get/:chatId",getMessages);

module.exports = router;