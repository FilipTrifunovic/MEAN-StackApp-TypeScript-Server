let io;

export function init(httpServer){
     io=require('socket.io')(httpServer);
     return io;
}