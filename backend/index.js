const express = require("express");
const cors = require('cors')
const app = express();

const { uploadsFolderName } = require("./conts");

const employeeRouter = require("./routes/employee.routes");
const transactionRouter = require("./routes/transaction.routes");
const fileRouter = require("./routes/file.routes");
const settingsRouter = require("./routes/settings.routes");
const socketHandler = require("./sockets");

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");

const io = new Server(server, {
  path: "/sockt/",
  cors: {
    origin: "*",
  },
});

app.use(cors())
app.use(express.json());
app.use("/images", express.static(__dirname + uploadsFolderName));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/api/employee/", employeeRouter);
app.use("/api/transaction/", transactionRouter);
app.use("/api/file/", fileRouter);
app.use("/api/settings/", settingsRouter);

io.on("connection", (socket) => socketHandler(socket, io));

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
