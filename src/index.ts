import { Interaction, Permissions, TextBasedChannels } from "discord.js";
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
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', async () => {
    console.log('Ready!');
    setInterval(sendPosts, 60 * 60 * 1000);
});


client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isCommand()) return
    const commandName = interaction.commandName;

    if (commandName === 'setchannel') {
        channels[interaction.guildId] = interaction.channel; //Add channel to list 
        interaction.reply("Channel added");
    } else if (commandName === "getchannel") {
        if (channels[interaction.guildId]) {
            interaction.reply(channels[interaction.guildId].id);
        } else {
            interaction.reply("Channel not set")
        }

    } else if (commandName === "getlasthour") {
        let posts = await getPosts("hour");
        if (posts.length > 0) {
            interaction.reply(posts);
        } else {
            interaction.reply("None in the last hour");
        }
    } else if (commandName === "getlastday") {
        let posts = await getPosts("day");
        posts = posts.map((post) => "https://reddit.com" + post.permalink).join(" ");
        interaction.reply(posts.join(" "));
    }
});



// // Login to Discord with your client's token
client.login(config.discord_token);
