const socketHandler = async (socket, io) => {
  socket.on("new_message", (data) => {
    io.sockets.emit("add_mess", data);
  });
};

module.exports = socketHandler;
