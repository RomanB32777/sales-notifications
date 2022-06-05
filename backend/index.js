const express = require('express');
const siofu = require("socketio-file-upload");
const fs = require('fs')

const app = express()
    .use(siofu.router);
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const moment = require('moment');
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

const uploadsFolderName = '/uploads'

app.use('/images', express.static(__dirname + uploadsFolderName))

const deleteFile = fileName => fs.unlinkSync(__dirname + uploadsFolderName + "/" + fileName)

const deleteOldFiles = () => {
    const files = fs.readdirSync(__dirname + uploadsFolderName)
    const now = moment()
    for (const file of files) {
        birthtime = fs.statSync(__dirname + uploadsFolderName + "/" + file).birthtime
        now.diff(birthtime, "days") > 0 && deleteFile(file)
    }
}

app.get('/', (req, res) => {
    return res.status(201).json({ success: true, mes: 'Hi!' })
});

app.get('/delete/file', (req, res) => {
    try {
        req.query.name && deleteFile(req.query.name)
        return res.status(201).json({ success: true })
    } catch (error) {
        return res.status(500).json({ success: false, error })
    }
})

app.get('/delete/files', (req, res) => {
    try {
        deleteOldFiles()
        return res.status(201).json({ success: true })
    } catch (error) {
        return res.status(500).json({ success: false, error })
    }
})

io.on('connection', (socket) => {
    const uploader = new siofu();

    uploader.dir = uploadsFolderName.slice(1);
    uploader.listen(socket);

    console.log('a user connected');

    uploader.on("saved", function (event) {
        deleteOldFiles()
        event.file.clientDetail.name = event.file.name;
    });

    uploader.on("error", function (event) {
        console.log("Error from uploader", event);
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });

    socket.on('new_message', (data) => {
        io.sockets.emit('add_mess', data);
    })
});

server.listen(5000, () => {
    console.log(process.env.PORT);
    console.log('listening on *:5000');
});