import { Server } from 'socket.io';

class SocketModule {
    constructor() {
        this.io = null;
    }
    init(server) {
        this.io = new Server(server);
        this.io.on('connection', (socket) => {
            console.log('Socket connected', socket.id);
            socket.on('disconnect', () => {
                console.log('Socket dissconnected', socket.id);
            });
        });
        return this.io;
    }
    getIo() {
        if (!this.io) {
            throw new Error('Socket.IO not initialized!');
        }
        return this.io;
    }
}
const socketModule =new SocketModule();
export default socketModule;