import dbAsync from "mysql2-async";

/**
 * @private
 * @constant
 */
const CONFIG = {
    host: "localhost",
    user: "root",
    database: "node_chatapp",
    password: "",
    skiptzfix: true
};

export const db = new dbAsync(CONFIG);