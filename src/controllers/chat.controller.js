import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import { request, response } from "express";

class ChatController {
    /**
     * @param {request} req 
     * @param {response} res 
     */
    getChat(req, res) {
        const idChat = req.params["id"];

        const chat = Chat.getChatById(parseInt(idChat));
        const user = User.getUserById(req.cookies.myUser.id);

        chat.addUserToChat(user);

        res.render("chat.hbs", {
            chat: chat,
            user: user
        });
    }

    /**
     * @param {request} req 
     * @param {response} res 
     */
    getCreatingChat(req, res) {
        res.render("creatingChat.hbs");
    }

    /**
     * @param {request} req 
     * @param {response} res 
     */
    createChat(req, res) {
        /** @type {User} */
        const user = User.getUserById(req.cookies.myUser.id);

        if (user == undefined)
            return res.status(412).json({message: "You need to Sign Up / Log in to create new chat"});

        const data = req.body;

        if (!data) {
            const errorMsg = "Chat controller (creating): data is empty";

            console.error(errorMsg);

            return res.status(412).json({message: errorMsg});
        }

        const createData = data.createData;
        const nameChat = createData.nameChat;

        const chatIsValid = Chat.valid(createData);

        if (chatIsValid != true)
            return res.status(412).json({message: chatIsValid.errorMsg});

        const newChat = new Chat(user, nameChat);

        Chat.addChatToDB(newChat);
        user.addCreatedChat(newChat);

        res.json({message: "Chat created succesful"});
    }

    exitFromChat(req, res) {
        const chat = Chat.getChatById(req.params["id"]);
        const user = User.getUserById(req.cookies.myUser.id);

        if (!user)
            return console.error("User wasn't exist in exit from chat");

        chat.removeUserFromChat(user);
        
        res.sendStatus(200);
    }

    /**
     * @param {request} req 
     * @param {response} res 
     */
    addMessage(req, res) {
        const idChat = req.params["id"];
        const data = req.body;

        if (!data)
            return console.error("ERROR: no data in `addmessage` chat.controller");

        const message = data.message;
        const user = req.cookies.myUser;

        if (!user)
            return res.status(401).json({ message: "No logged in user" });

        const chat = Chat.getChatById(parseInt(idChat));
        chat.addMessage(user, message);

        res.status(200).json({ user: user });
    }
}

export default new ChatController();