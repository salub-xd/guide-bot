const { Client, Collection, GatewayIntentBits, Events } = require("discord.js");
const wait = require('node:timers/promises').setTimeout;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
client.cooldowns = new Collection();

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {

        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName === 'ping') {
            // Ephemeral responses are only available for interaction responses
            // await interaction.reply({ content: "Ping", ephemeral: true, });
            // deferReply will take more than 3 second and stil there will no error and valid for 15 minutes
            // await interaction.deferReply();
            // you can also you epephemeral
            await interaction.deferReply({ ephemeral: true });
            await wait(4000);
            // ***** editReply token is valid for 15 minutes in this time you can edit and you cannot use ephemeral this should be ephemeral when you reply if you want to use ephemeral *****
            await interaction.editReply({ content: "Pinged Again" })
            // ***** Fetching response 
            // await interaction.reply('Pong!');
            const message = await interaction.fetchReply();
            // console.log(message);
            // ***** You can delete intial response by deleteReply
            await interaction.deleteReply();

        }


        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found`);
            return;
        }

        const { cooldowns } = client;
        // if there is command has not used and itialized as an empty Collection
        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }

        // now: The current timestamp.
        const now = Date.now();

        // timestamps: A reference to the Collection of user ids and timestamp key/value pairs for the triggered command.
        const timestamps = cooldowns.get(command.data.name);
        const defaultCooldownDuration = 3;

        // cooldownAmount: The specified cooldown for the command, converted to milliseconds for straightforward calculation. If none is specified, this defaults to three seconds.
        const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

        // Since the timestamps Collection has the user's id as the key,
        if (timestamps.has(interaction.user.id)) {
            // the get() method on it to get the value and sum it up with the cooldownAmount variable to get the correct expiration timestamp and further check to see if it's expired or not.
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1000);
                return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
            }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }

    }
}


