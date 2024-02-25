import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import { request, response } from "express";
import { db } from "../models/database.js";

class UserController { 
    /**
     * @param {request} req 
     * @param {response} res 
     */
    getUser(req, res) {
        const idUser = req.params["id"];

        const user = User.getUserById(parseInt(idUser));

        res.json({user: user});
    }
    
    getCreatePage(_, res) {
        res.render("register.hbs");
    }

    /**
     * @param {request} req 
     * @param {response} res 
     */
    async loginUser(req, res) {
        const data = req.body;

        if (!data) {
            const errorMsg = "User controller (Login): data is empty";

            console.error(errorMsg);

            return res.json({message: errorMsg});
        }

        let loginData = req.body.createData;

        const result = await db.query("SELECT `id`, `password` FROM `users` WHERE `name` = ?", [loginData.login]);

        const account = result[0];
        const realPassword = account.password;

        if (realPassword !== loginData.password) {
            setTimeout(() => {
                res.status().json({message: "Wrong password!"});
            }, 1500);

            return;
        }



        res.cookie('myUser', newUser, {maxAge: expiresTime}).status(201).json({message: 'User logged in!'});
    }

    /**
     * @param {request} req 
     * @param {response} res 
     */
    createUser(req, res) {
        const data = req.body;

        if (!data) {
            const errorMsg = "User controller (register): data is empty";

            console.error(errorMsg);

            return res.json({message: errorMsg});
        }

        let createData = req.body.createData;
        createData.id = User.lastId;

        const isUserDataValid = User.valid(createData);

        if (isUserDataValid != true)
            return res.status(412).json({message: isUserDataValid.errorMsg});

        const newUser = new User(createData);

        const expiresTime = 5 * 24 * 60 * 60 * 1000;

        res.cookie('myUser', newUser, {maxAge: expiresTime}).status(201).json({message: 'User created!'});
    }

    /**
     * @param {request} req 
     * @param {response} res 
     */
    getUserValid(req, res) {
        try {
            const directRoute = req.params["route"];
            const data = req.query.id;

            const resultRoute = UserController.getRouteValid(directRoute, data);
            
            const user = req.cookies.myUser;
    
            if (!user) {
                res.json({redirect: { url: resultRoute.fail } });
            }
            else {
                res.json({user: user, redirect: { url: resultRoute.succes } });
            }
        }
        catch(e) {
            console.error(e);
        }
    }

    /**
     * @private
     */
    static getRouteValid(route, data = undefined) {
        if (route == "chat")
            return { fail: `/user/create`, succes: `/chat/${data}` };
    }
}

export default new UserController();