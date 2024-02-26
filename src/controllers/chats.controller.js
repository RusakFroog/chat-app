import { Chat } from "../models/chat.js";
import { request, response } from "express";

class AllChatsController {
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
                    ownerUser: chat.ownerUser,
                    users: chat.getAllUsers()
                }

                chatsInObjects.push(chatObject);
            });

            let myUser = req.cookies.myUser;

            res.render("chats.hbs", {user: myUser, chats: chatsInObjects});
        }
        catch(e) {
            console.error(e);

            return res.json({message: e.message}).status(400);
        }
    }

}

export default new AllChatsController();