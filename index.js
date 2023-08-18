// // Require the necessary discord.js classes
// const fs = require('node:fs');
// const path = require('node:path');
// const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
// const { token } = require('./config.json');


// // Create a new client instance
// const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// // ***** this will help to find the path of our command files and store the command *****
// client.commands = new Collection();

// // First, path.join() helps to construct a path to the commands directory.
// // const commandsPath = path.join(__dirname, 'commands');

// // ***** $ old code $ *****
// //  The fs.readdirSync() method then reads the path to the directory and returns an array of all the file names it contains, currently ['ping.js', 'server.js', 'user.js']
// //  Array.filter() removes any non-JavaScript files from the array.
// // const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// // for (const file of commandFiles) {
// // 	const filePath = path.join(commandsPath, file);
// // 	const command = require(filePath);
// // 	// Set a new item in the Collection with the key as the command name and the value as the exported module
// // 	if ('data' in command && 'execute' in command) {
// // 		client.commands.set(command.data.name, command);
// // 	} else {
// // 		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
// // 	}
// // }

// // ***** new code for new file sturctures *****

// const foldersPath = path.join(__dirname, 'commands');
// const commandFolders = fs.readdirSync(foldersPath);

// for (const folder of commandFolders) {
// 	const commandsPath = path.join(foldersPath, folder);
// 	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
// 	for (const file of commandFiles) {
// 		const filePath = path.join(commandsPath, file);
// 		const command = require(filePath);
// 		// Set a new item in the Collection with the key as the command name and the value as the exported module
// 		if ('data' in command && 'execute' in command) {
// 			client.commands.set(command.data.name, command);
// 		} else {
// 			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
// 		}
// 	}
// }

// // When the client is ready, run this code (only once)
// // We use 'c' for the event parameter to keep it separate from the already defined 'client'
// client.once(Events.ClientReady, c => {
// 	console.log(`Ready! Logged in as ${c.user.tag}`);
// });


// client.on(Events.InteractionCreate, async interaction => {
// 	// ***** if this is not slash command return nothing
// 	if (!interaction.isChatInputCommand()) return;

// 	// ***** this will to find commandName if ther is no command it will log error *****
// 	const command = interaction.client.commands.get(interaction.commandName);

// 	if (!command) {
// 		console.error(`No command matching ${interaction.commandName} was found.`);
// 		return;
// 	}

// 	try {
// 		// .execute() method and pass in the interaction variable as its argument
// 		await command.execute(interaction);
// 	} catch (error) {
// 		console.error(error);
// 		if (interaction.replied || interaction.deferred) {
// 			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
// 		} else {
// 			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
// 		}
// 	}
// });


// // // Log in to Discord with your client's token
// client.login(token);

const { Client, Collection, GatewayIntentBits} = require("discord.js");
const { token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
client.cooldowns = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
			// console.log(command.data.name);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);
