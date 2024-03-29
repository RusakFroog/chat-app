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
        
        this.createDate = createData.createDate;
         
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

    /**
     * @param {User} user 
     */
    static async addUserToDB(user) {
        await db.query("INSERT INTO `users` (`name`, `password`, `created_date`) VALUES(?, ?, ?)", [user.name, user._password, user._createDate]);
    }

    static createUserFromDB(id, name, createDate) {
        const createData = {
            id: id,
            login: name,
            password: "",
            createDate: createDate,
        };

        User.lastId = id + 1;
        
        const createdUser = new User(createData);
        return createdUser;
    }

    static async initUsersAndChats() {
        const usersTables = await db.query("SELECT * FROM `users`");

        usersTables.forEach(async (userData) => {
            const chatsTable = await db.query("SELECT * FROM `chats` WHERE `owner_id` = ?", [userData.id]);

            const createdUser = User.createUserFromDB(userData.id, userData.name, userData.created_date);
            
            const chats = [];

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
     * @param {string} name
     */
    static getUserByName(name) {
        return User._allUsers.find(u => u.name == name);
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