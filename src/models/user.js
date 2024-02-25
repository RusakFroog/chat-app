import { Chat } from "./chat.js";
import { db } from "./database.js";

export class User {
    /**
     * @private
     */
    static lastId = -1;

    /**
     * @private
     * @type {User[]}
     */
    static _allUsers = [];

    constructor(createData) {
        this.id = createData.id;
        this.name = createData.login;
         
        /**
         * @private
         * @type {string}
         */
        this._password = createData.password;

        /**
         * @private
         * @type {Chat[]}
         */
        this._createdChats = [];
        
        User.lastId++;
        User._allUsers.push(this);
    }

    static createUserFromDB(id, name) {
        const createData = {
            id: id,
            login: name,
            password: ""
        };

        User.lastId = id + 1;
        
        const createdUser = new User(createData);
        return createdUser;
    }

    static async initAllUsers() {
        const usersTables = await db.query("SELECT * FROM `users`");

        usersTables.forEach(async (userData) => {
            const chatsTable = await db.query("SELECT * FROM `chats` WHERE `owner_id` = ?", [userData.id]);

            const chats = [];
            
            const createdUser = User.createUserFromDB(userData.id, userData.name, userData.password);

            chatsTable.forEach(chatData => {
                const parsedMessages = JSON.parse(chatData.messages);

                parsedMessages.forEach(el => {
                    el.message.time = new Date(el.message.time);
                });

                chats.push(new Chat(createdUser, chatData.name, parsedMessages));
            });
            
            createdUser._createdChats = chats;
        });
    }

    /**
     * @param {object} data
     */
    static valid(data) {
        const name = data.login;

        if (User._allUsers.find(usr => usr.name == name) != undefined) {
            return {errorMsg: "User with same name already exist"};
        }

        return true;
    }

    /**
     * @param {number} id 
     */
    static getUserById(id) {
        return User._allUsers.find(u => u.id == id);
    }

    /**
     * @param {Chat} chat 
     */
    addCreatedChat(chat) {
        this._createdChats.push(chat);
    }

    /**
     * @param {Chat} chat 
     */
    removeCreatedChat(chat) {
        const chatIndex = this._createdChats.indexOf(chat);

        if (chatIndex < 0)
            return console.error(`Chat with id: ${chat.id} has index: ${chatIndex}`);

        this._createdChats.splice(chatIndex, 1);
    }
}