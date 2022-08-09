const express = require('express');
const fs = require('fs')
const multer = require("multer")
const app = express()

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const moment = require('moment');
const io = new Server(server, {
    cors: {
        origin: '*'
        // origin: process.env.NODE_ENV === 'production' ? 'http://51.250.31.52:80/' : '*'
    }
});

const uploadsFolderName = '/uploads'

app.use('/images', express.static(__dirname + uploadsFolderName))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, __dirname + uploadsFolderName)
    },
    filename(req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        cb(null, fileName)
    }
})

const types = ['image/png', 'image/jpeg', 'image/jpg']

const fileFilter = (req, file, cb) => types.includes(file.mimetype) ? cb(null, true) : cb(null, false)

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
    return res.status(200).json({ success: true, mes: 'Hi!' })
});

app.post('/upload/file', multer({ storage, fileFilter }).single('file'), (req, res) => {
    try {
        deleteOldFiles()
        if (req.file) {
            return res.status(201).json({ success: true, filename: req.file.filename })
        }
    } catch (error) {
        return res.status(500).json({ success: false, error })
    }
})

app.get('/delete/file', (req, res) => {
    try {
        req.query.name && deleteFile(req.query.name)
        return res.status(200).json({ success: true })
    } catch (error) {
        return res.status(500).json({ success: false, error })
    }
})

app.get('/delete/files', (req, res) => {
    try {
        deleteOldFiles()
        return res.status(200).json({ success: true })
    } catch (error) {
        return res.status(500).json({ success: false, error })
    }
})

io.on('connection', (socket) => {
    socket.on('new_message', (data) => {
        io.sockets.emit('add_mess', data);
    })
});

server.listen(process.env.PORT || 5000, () => {
    console.log(`listening on *:${process.env.PORT || 5000}`);
});