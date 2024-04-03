const { Server } = require("socket.io");

const io = new Server(8000, {
  cors: true,
});

// to keep the track of which email is maped with socket_id
const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

// this code is help for building the signaling 
io.on("connection", (socket) => {
  console.log(`Socket Connected`, socket.id);

  // get the room:join event from frontend 
  socket.on("room:join", (data) => {

    // data get from fronend when any new user join 
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);   // use for map the email with socket id 
    socketidToEmailMap.set(socket.id, email);  // use for map the scoekt id with email  

    // if there is existing user in the room the user:joined this event will come to the user and push the user in socket.join(room)
    io.to(room).emit("user:joined", { email, id: socket.id }); 
    socket.join(room);

    io.to(socket.id).emit("room:join", data); // you can join now the room jis user ne data send kia usiko room join krne ke liye 

    

  });

  
  // code for another user joined the call 
  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  // this event will get after call accepted from frontend 
  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });
  
  // negotiation is use for reconnecting the call after disconnected
  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });


  // message sending part
  socket.on("user-message", (message) => {
    io.emit("message", message);
  });

  

  
});
