const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Testing a command!'),
    async execute(interaction) {
        await interaction.reply('Successfully Tested!');
    },
};
