mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = mongoose.Schema({
    message: {
        type: String
        },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    type: {
        type: String
    },
    chatType: {
        type: String
    },
    room: {
        type: String
    },
    image: {
        type: String
    }
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);
module.exports = { Chat }