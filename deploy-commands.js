const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require("./command_builder_config.json");


const commands = [
    new SlashCommandBuilder().setName('setchannel').setDescription('Set channel for automatic updates'),
	new SlashCommandBuilder().setName('getlasthour').setDescription('Get deals from the last hour'),
	new SlashCommandBuilder().setName('getlastday').setDescription('Get deals from the last day'),
	new SlashCommandBuilder().setName('getchannel').setDescription('Check current channel'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
