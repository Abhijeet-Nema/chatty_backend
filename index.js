const io = require("socket.io")(3000, {
  cors: {
    origin: "*",
  },
});

const users = {};

io.on("connection", (socket) => {
  socket.on("userJoined", (name) => {
    // console.log(name);
    console.log(Object.values(users))
    users[socket.id] = name;
    io.emit("alertUserJoined", {
      id: socket.id,
      name,
      users: Object.values(users),
    });
  });

  socket.on("newMessageSent", ( message ) => {
    socket.broadcast.emit("recieveMessage", {
      message,
      name: users[socket.id],
      users: Object.values(users),
    });
  });

  socket.on("disconnect", () => {
    // console.log(users[socket.id]);
    userLeft = users[socket.id]
    if (userLeft){
      delete users[socket.id];
      socket.broadcast.emit("userDisconnected", {
        id: socket.id,
        name: userLeft,
        users: Object.values(users),
      });
    }
  });
});
