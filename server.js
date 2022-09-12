const http = require('http');
const socketIO = require('socket.io');
const app = require('./app');
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
const cors = require('cors');
const Status = require('./DB/Modals/statusModal');
const Message = require('./DB/Modals/messagesModal');
//PEER SERVER
// const ExpressPeerServer = require('peer').ExpressPeerServer;
// const options = {
//   debug: true
// }

// const peerserver = ExpressPeerServer(server, options);

// app.use('/peerjs', peerserver);

app.use(cors())

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Successfully Connected with Socket', socket.id)

  socket.on('chat', (data) => {
    const { user, message } = data;
    const newMessage = new Message({
      user,
      message,
    })
    newMessage.save()
      .then(docs => {
        io.sockets.emit('get_chat', docs)
      })
      .catch(err => console.log('Error during add message :', err))
  })

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data)
  })

  //get All Messages
  socket.on('get_all_messages', () => {
    Message.find()
      .exec()
      .then(docs => {
        io.sockets.emit('get_all_messages', docs)
      })
      .catch(err => console.log('Erro during getting all messages :', err))
  })

  //update message
  socket.on('update_entry', (data) => {
    console.log('Data :', data)
    const { id, message } = data
    Message.findByIdAndUpdate({ _id: id }, {
      $set: { message: message }
    }).exec()
      .then(doc => {
        if (!doc) {
          console.log('Error doc found')
          return io.sockets.emit('update_entry', { message: 'Doc Not Found' })
        }
        console.log('initial :', doc)
        io.sockets.emit('update_entry', { message: 'Record updated', doc, })
      })
      .catch(err => console.log('Error :', err))
  })

  //Delete Message
  socket.on('delete_entry', (id) => {
    Message.findByIdAndRemove({ _id: id })
      .exec()
      .then(doc => {
        if (!doc) {
          console.log('Error doc found')
          return io.sockets.emit('update_entry', { message: 'Doc Not Found' })
        }
        io.sockets.emit('delete_entry', { message: 'Doc deleted successfully', doc, })
      })
      .catch(err => console.log('Error :', err))
  })

  Status.find()
    .then(docs => {
      io.sockets.emit('default_data', docs)
    })
    .catch(err => console.log('Error default :', err))

  socket.on('status', (status) => {
    Status.findOneAndUpdate({ status })
      .exec()
      .then(docs => {
        return io.sockets.emit('status', docs)
      })
      .catch(err => console.log('Error :', err))
  })

})

server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))