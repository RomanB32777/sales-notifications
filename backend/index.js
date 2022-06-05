const express = require('express');
const siofu = require("socketio-file-upload");
const fs = require('fs')

const app = express()
    .use(siofu.router);
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});
app.use('/images', express.static(__dirname + '/uploads'))

app.get('/', (req, res) => {
    return res.status(201).json({ success: true, mes: 'Привет !' })

});

io.on('connection', (socket) => {
    const uploader = new siofu();
    uploader.dir = "uploads";
    uploader.listen(socket);
    console.log('a user connected');

    uploader.on("saved", function (event) {
        console.log("saved",  event.file.name);
        event.file.clientDetail.name = event.file.name;
    });

    uploader.on("error", function (event) {
        console.log("Error from uploader", event);
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });

    socket.on('new_message', (data) => {
        console.log("fff", data);
        io.sockets.emit('add_mess', data);
    })
});


server.listen(5000, () => {
    console.log('listening on *:5000');
});