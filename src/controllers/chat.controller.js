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
        const user = req.cookies.myUser;

        chat.addUserToChat(user);

        res.render("chat.hbs", {
            chat: chat,
            user: user
        });

        // TODO: DELETE FOR NON DEV
        // res.clearCookie("myUser");
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