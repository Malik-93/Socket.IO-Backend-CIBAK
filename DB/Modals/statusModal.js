const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StatusSchema = new Schema(
    {
        status: {
            type: String,
            trim: true
        }
    })

module.exports = Status = mongoose.model('status', StatusSchema);