const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
app.use(cors());


const users = [{}];
const port = 5000 || process.env.PORT;



app.get('/',(req,res)=>{
    res.send(`<h1>BACKEND</h1>`)
})

io.on("connection",(socket)=>{
    // console.log('A user Connected');
    socket.on('joined',({user})=>{
        users[socket.id] = user;
        console.log(`${user} has Joined`);
        //broadcast ka mtlb jisne join kiya usko chodke sbpr message jayega yeh
        socket.broadcast.emit('userJoined',{user:"Admin",message:`${users[socket.id]} has Joined`});
        socket.emit('welcome',{user:"Admin",message:`Welcome to the Chat, ${users[socket.id]}`});
    })

    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id});
    })

    socket.on('disconnect',()=>{
        socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]} has left`});
        console.log(`User Left`);
    })
    

    
    
})

server.listen(port,()=>{ 
    console.log(`listening on port:${port}`);
});