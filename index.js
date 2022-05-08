const { Client, Intents } = require('discord.js');
const DiscordJS = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", async () => {
    /*
    const data = [{
        name: "ping",
        description: "Replies with Pong!",
    }];
    */
    const data = [{
        name: "searchvalo",
        description: "TRN上でvalorantの統計情報を検索します．",
        options: [
            {
                name: "in-game name",
                description: "Valorantのゲーム内プレイヤ名を入力してください．",
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
            },
            {
                name: "TAG",
                description: "Valorantのゲーム内TAG(#の後ろの数字)を入力してください．",
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.INTEGER
            }
        ]
    }];
    await client.application.commands.set(data);
    console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }

    const { commandName, options } = interaction;

    if (interaction.commandName === 'searchvalo') {
        const name = options.getString('in-game name');
        const tag = options.getInteger('TAG');
        await interaction.reply({
            content: 'in-game ID is' + name + '#' + toString(tag),
            ephemeral: true
        });
    }
    /*
    if (interaction.commandName === 'ping') {
        await interaction.reply({ content: 'Pong!', ephemeral: true });
    }
    */
});

client.login(process.env.DISCORD_TOKEN);

/*
client.login()
  .catch(console.error)
*/