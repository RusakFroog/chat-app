import { getMessageWithTags } from "./tagsHelper.js";

export default class SocketHelper {
    constructor(io) {
        this.io = io;

        this.#init();
    }

    #init() {
        // When a new user connected
        this.io.on('connection', (client) => {
            
            client.on("server.chat.addMessage", (user, msg) => {                
                const formattedMessage = getMessageWithTags(user.name, msg);
                
                // Emit event for all clients (include this client)
                this.io.emit("client.chat.newMessage", user, formattedMessage);
            });
        });
    }
}
