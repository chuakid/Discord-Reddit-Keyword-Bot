import { Message, Permissions, TextBasedChannels } from "discord.js";
import Config from "./interfaces/config";
import reddit_client from "./reddit_client";

const { Client, Intents } = require('discord.js');
const config: Config = require("../config.json");

interface Channels {
    [id: string]: TextBasedChannels
}
let channels: Channels = {};

function getPosts(time: string) {
    return reddit_client.getSubreddit(config.subreddit).search({ query: config.keyword, time: time });
}

async function sendPosts() {
    let posts = await getPosts("hour");
    posts = posts.map((post) => "https://reddit.com" + post.permalink);
    Object.values(channels).forEach(channel => {
        posts.forEach(post => {
            channel.send(post.link);
        });
    });
}

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', async () => {
    console.log('Ready!');
    setInterval(sendPosts, 60 * 60 * 1000);
});


client.on('messageCreate', async (message: Message) => {
    if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) && message.content === "/setBotChannel") {
        channels[message.guildId] = message.channel; //Add channel to list 
        message.channel.send("Channel added");
    }
    if (message.content === "/getlasthour") {
        let posts = await getPosts("hour");
        if (posts.length > 0) {
            posts = posts.map((post) => "https://reddit.com" + post.permalink);
            posts.forEach(post => {
                message.channel.send(post);
            });
        } else {
            message.channel.send("None in the last hour");
        }
    }
    if (message.content === "/getlastday") {
        let posts = await getPosts("day");
        posts = posts.map((post) => "https://reddit.com" + post.permalink);
        posts.forEach(post => {
            message.channel.send(post);
        });
    }

});



// // Login to Discord with your client's token
client.login(config.discord_token);
