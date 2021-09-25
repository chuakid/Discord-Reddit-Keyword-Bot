import { GuildMember, Interaction, Permissions, TextBasedChannels } from "discord.js";
import Config from "./interfaces/config";
import reddit_client from "./reddit_client";

const { Client, Intents } = require('discord.js');
const config: Config = require("../config.json");

interface Channels {
    [id: string]: TextBasedChannels
}
let channels: Channels = {};

function getPosts(time: string) {
    return reddit_client
        .getSubreddit(config.subreddit)
        .search({ query: config.keyword, time: time })
        .filter((x: any) => x.title.toLowerCase().includes(config.keyword));
}

async function sendPosts() {
    let posts = await getPosts("hour");
    posts = posts.map((post) => "https://reddit.com" + post.permalink).join(" ");
    if (posts.length > 0) {
        Object.values(channels).forEach(channel => {
            channel.send(posts);
        });
    }
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
        const member = interaction.member as GuildMember;
        if (member.permissions.has("ADMINISTRATOR")) {
            channels[interaction.guildId] = interaction.channel; //Add channel to list 
            interaction.reply("Channel added");
        } else {
            interaction.reply("Only admin can do this")
        }
    } else if (commandName === "getchannel") {
        if (channels[interaction.guildId]) {
            interaction.reply(channels[interaction.guildId].id);
        } else {
            interaction.reply("Channel not set")
        }
    } else if (commandName === "getlasthour") {
        let posts = await getPosts("hour");
        if (posts.length > 0) {
            posts = posts.map((post) => "https://reddit.com" + post.permalink).join(" ");
            interaction.reply(posts);
        } else {
            interaction.reply("None in the last hour");
        }
    } else if (commandName === "getlastday") {
        let posts = await getPosts("day");
        if (posts.length > 0) {
            posts = posts.map((post) => "https://reddit.com" + post.permalink).join(" ");
            interaction.reply(posts);
        } else {
            interaction.reply("None in the last day");
        }
    }
});



// // Login to Discord with your client's token
client.login(config.discord_token);
