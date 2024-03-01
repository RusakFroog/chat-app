import { User } from '../models/user.js';

/** 
 * @param {string} value 
 */
function filterTags(value) {
    const name = value.slice(1);

    if (name.includes("@"))
        return false;

    return User.getUserByName(name) != undefined;
}

/**
 * @param {string} message - full message from user
 * @returns {string[]} format: ["@nameuser1", "@nameuser2"]
 */
function getAllFilteredTags(message) {
    const splitedData = message.split(" ");
    const allTags = splitedData.filter((s) => s.startsWith("@"));
    const filteredTags = allTags.filter(filterTags);

    return filteredTags;
}

function replaceTags(localUserName, tags, message) {
    for (const tag of tags) {
        const start = `<span class="hightlight-tag" @click="seeProfile('${tag.slice(1)}')"`;
        const center = (('@' + localUserName == tag) ? ` style="color:red;"> ${tag}` : `> ${tag}`);
        const end = `</span>`;
        
        const resultString = start + center + end;

        message = message.replaceAll(tag, resultString);
    }

    return message;
}

/**
 * @param {string} localUserName 
 * @param {string} message 
 */
export function getMessageWithTags(localUserName, message) {
    const filteredTags = getAllFilteredTags(message);

    message = replaceTags(localUserName, filteredTags, message);

    return message;
}