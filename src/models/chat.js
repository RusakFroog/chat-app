import { User } from "./user.js";
import { db } from "../models/database.js";

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
         * @type {User}
        */
        this.ownerUser = ownerUser;

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
     * @param {Chat} chat 
     */
    static async addChatToDB(chat) {
        await db.query("INSERT INTO `chats` (`owner_id`, `messages`, `name`) VALUES(?, ?, ?)", [chat.ownerUser.id, JSON.stringify(chat.messages), chat.name]);
    }

    static valid(data) {
        const name = data.nameChat;

        if (Chat._allChats.find(c => c.name == name) != undefined) {
            return {errorMsg: "Chat with same name already exist"};
        }

        return true;
    }
    
    /**
     * @param {User} user
     * @param {string} message
     */
    async addMessage(user, message) {
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

        await db.query("UPDATE `chats` SET `messages` = ? WHERE `id` = ?", [JSON.stringify(this.messages), this.id]);
    }

    /**
     * @param {User} user 
     */
    addUserToChat(user) {
        if (!this._poolUsers.includes(user))
            this._poolUsers.push(user);
    }

    /**
     * @param {User} user 
     */
    removeUserFromChat(user) {
        const userIndex = this._poolUsers.indexOf(user);
        
        if (userIndex >= 0)
            this._poolUsers.splice(userIndex, 1);
    }

    async deleteChat() {
        this.ownerUser.removeCreatedChat(this);

        const index = Chat._allChats.indexOf(this);

        Chat._allChats.splice(index, 1);

        await db.query("DELETE FROM `chats` WHERE `id` = ?", [this.id]);
    }

    /**
     * @returns {User[]}
     */
    getAllUsers() {
        return this._poolUsers;
    }
}