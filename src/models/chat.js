import { User } from "./user.js";

export class Chat {
    /**
     * @private
     */
    static _lastId = 0;
    
    /**
     * @private
     * @type {Chat[]}
     */
    static _allChats = [];

    constructor(ownerUser, name, messages = []) {
        this.id = Chat._lastId;
        this.name = name;
        
        /**
         * @private
         * @type {User[]}
        */
        this._poolUsers = [];
        
        /**
         * @private
         * @type {User}
        */
        this._ownerUser = ownerUser;

        /**
         * @type {object[]}
        */
        this.messages = messages;

        Chat._lastId++;

        Chat._allChats.push(this);
    }

    /**
     * @returns {Chat[]}
     */
    static getAllChats() {
        return this._allChats;
    }

    /**
     * @param {number} id 
     * @returns {Chat | undefined}
     */
    static getChatById(id) {
        return this._allChats.find(chat => chat.id == id);
    }

    /**
     * @param {User} user 
     */
    addUserToChat(user) {
       this._poolUsers.push(user);
    }
    
    /**
     * @param {User} user
     * @param {string} message
     */
    addMessage(user, message) {
        const messageObject = {
            context: message,
            time: new Date(),
            user: {
                id: user.id, 
                name: user.name
            } 
        }

        const objectMessage = {
            message: messageObject
        }

        this.messages.push(objectMessage);
    }

    /**
     * @param {User} user 
     */
    removeUserFromChat(user) {
        const userIndex = this._poolUsers.indexOf(user);
        
        if (userIndex < 0)
            return console.error(`User with id: ${user.id} has index: ${userIndex}`);
        
        this._poolUsers.splice(userIndex, 1);

        console.info(`User ${user.id} has been deleted from chat ${this.id}`);
    }

    deleteChat() {
        this._ownerUser.removeCreatedChat(this);

        const index = Chat._allChats.indexOf(this);

        Chat._allChats.splice(index, 1);
    }

    /**
     * @returns {User[]}
     */
    getAllUsers() {
        return this._poolUsers;
    }
}