const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
    {
        user: {
            type: String,
            trim: true
        },
        message: {
            type: String,
            trim: true
        }
    })

module.exports = Message = mongoose.model('messages', MessageSchema);