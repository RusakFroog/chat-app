export default class SocketHelper {
    constructor(io) {
        this.io = io;

        this.#init();
    }

    #init() {
        // When a new user connected
        this.io.on('connection', (client) => {
            // console.log('a user connected to chat', client.id);

            client.on("server.chat.addMessage", (user, msg) => {
                // Emit event for all clients (include this client)
                this.io.emit("client.chat.newMessage", user, msg);
            });

            // client.on("disconnect", () => {
                // this.io.emit("client.chat.userDisconnected", client)
                //// console.log('a user has disconnected from chat', client.id);
            // });
        });
    }
}
