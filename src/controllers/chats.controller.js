import { Chat } from "../models/chat.js";
import { request, response } from "express";

class AllChatsController {
    createChat(req, res) {
        const chatData = req.body;

        const chatName = chatData.name;
    }

    /**
     * @param {request} req 
     * @param {response} res 
     */
    getAllChats(req, res) {
        try {
            const allChats = Chat.getAllChats();

            const chatsInObjects = [];
            
            allChats.forEach(chat => {
                const chatObject = {
                    id: chat.id,
                    name: chat.name,
                    users: chat.getAllUsers()
                }

                chatsInObjects.push(chatObject);
            });

            res.render("chats.hbs", { chats: chatsInObjects});
        }
        catch(e) {
            console.error(e);

            return res.json({message: e.message}).status(400);
        }
    }

}

export default new AllChatsController();