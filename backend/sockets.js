const socketHandler = async (socket, io) => {
  socket.on("new_message", (data) => {
    io.sockets.emit("add_mess", data);
  });

  socket.on("update_table", (data) => {
    io.sockets.emit("update_transactions_top", data);
  });
};

module.exports = socketHandler;
