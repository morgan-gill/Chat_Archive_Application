const app = require("./backend/app");
const http = require('http');

// const io = require('socket.io');
const express = require('express');
const exp = express();
const bodyParser = require('body-parser');

// const sapp = require("./socketFiles/sapp");

// const user = io.listen(3000).sockets;
const hostname = '127.0.0.1';
const port = process.env.PORT || "4000";

app.set("port", port);

exp.set('view engine', 'ejs');
exp.use(express.static('public'));
exp.use(bodyParser.urlencoded({ extended: false }));
exp.use(bodyParser.json());

exp.get('/', (req, res) => {
  res.render('index');
});

exp.post('/chatroom', (req,res) => {
  console.log(req.body);
  res.render('chatroom')
  /*
  res.render('chatroom',{
    username: req.body.username,
    chatroom: req.body.chatroom
  });
  */
})

// Listen to port 3000
expServer = exp.listen(3000);

const user = require('socket.io')(expServer);

const server = http.createServer(app);
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);

  user.on('connction', function(socket) {

    console.log("Someone connected!");

    // let chat = db.collection('chats'); This line was from the video

    // Sending status to client
    status = (param) => {
      socket.emit('status', param);
    }

    /*
    // Get chats from mongo collection
    chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
      if(err){
        throw err;
      }

      // Emit the messages
      socket.emit('output', res);
    });
    */

    // Handle input events
    socket.on('input', function(data){
      let name = data.name;
      let message = data.messge;

      // Check for name and message
      if (name == "" || message == "") {

        // Send error status
        status('please enter a name/message.');
      } else {

        // Insert message
        chat.insert({name: name, message: message}, function(){
          sio.emit('output', [data]);

          // Send status object
          status({
            message: 'message sent',
            clear: true
          });

        });

      }

    });

    // Handle clear
    socket.on('clear', function(data){

      // remove all chats from the colelction
      chat.remove({}, function(){

        // Emit cleared
        socket.emit('cleared');

      });

    });

  });

});
