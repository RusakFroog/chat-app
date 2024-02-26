import { dirname } from 'path';
import { fileURLToPath } from 'url';

global.__dirname = dirname(fileURLToPath(import.meta.url));

import express from "express";
import hbs from "hbs";

import HomeRouter from "./src/routes/home.routes.js";
import ChatsRouter from "./src/routes/chats.routes.js";
import ChatRouter from "./src/routes/chat.routes.js";
import UserRouter from "./src/routes/user.routes.js";

import { User } from './src/models/user.js';

import http from 'http';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { Server } from 'socket.io';
import SocketHelper from './src/helpers/sockets.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const socketHelper = new SocketHelper(io);

app.set("view engine", "hbs");
app.set("views", __dirname + "/src/views");

hbs.registerPartials(__dirname + "/src/views/partials");

hbs.registerHelper("getFormattedTime", (time) => {
    let res = '';

    const hours = time.getHours();
    const minutes = time.getMinutes();

    res += hours.toString().length == 1 ? `0${hours}:` : `${hours}:`;
    res += minutes.toString().length == 1 ? `0${minutes}` : minutes;

    return res;
});

hbs.registerHelper("eq", (arg1, arg2) => {
    return arg1 == arg2;
});

hbs.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/src/public'));

app.use("/home", HomeRouter);
app.use("/chat", ChatRouter);
app.use("/chats", ChatsRouter);
app.use("/user", UserRouter);
app.use("/", (_, res) => res.redirect(302, "/home"));

server.listen(3000, "localhost", () => {
    User.initUsersAndChats();
    console.info("Server start listening...");
})