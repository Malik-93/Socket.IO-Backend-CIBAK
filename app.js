const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mongoURI = `mongodb://127.0.0.1:27017/CHAT`
mongoose.connect(mongoURI, { useNewUrlParser: true })
    .then(() => console.log('Mongodb connected'))
    .catch(err => console.log('Erro during mongodb connection :', err))
//Middlewares
app.use(express.static('build'))
app.use('/adeel', (req, res) => {
    return res.status(200).json({ message: 'HELLO ADEEL' })
})
module.exports = app
