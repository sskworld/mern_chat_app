const express = require('express');
const router = express.Router();
const { Chat } = require("../models/Chat");


router.get("/getChats",async (req, res) => {
    await Chat.find({ chatType: "public"})
        .populate("sender")
        .exec((err, chats) => {
            if(err) return res.status(400).send(err);
            res.status(200).send(chats)
        })
});

router.post("/getPrivateChats",async (req, res) => {
    
    await Chat.find({ 
            sender: { $in: [ req.body.sender, req.body.receiver] },
            receiver: { $in: [ req.body.sender, req.body.receiver] }
        })
        .populate("sender")
        .populate("receiver")
        .exec((err, chats) => {
            if(err) return res.status(400).send(err);
            res.status(200).send(chats)
        })
});

module.exports = router;