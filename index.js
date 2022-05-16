const { Client, Intents } = require('discord.js');
const DiscordJS = require('discord.js');
const dotenv = require('dotenv');
const { PythonShell } = require('python-shell');

dotenv.config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", async () => {
    const data = [{
        name: "search",
        description: "TRN上でvalorantの統計情報を検索します。",
        options: [
            {
                name: "name",
                description: "Valorantのゲーム内プレイヤ名を入力してください。",
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
            },
            {
                name: "tag",
                description: "Valorantのゲーム内TAG(#の後ろの数字)を入力してください。",
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.INTEGER
            }
        ]
    }];
    await client.application.commands.set(data);
    console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
    console.log(interaction);

    if (!interaction.isCommand()) {
        return;
    }

    const { commandName, options } = interaction;

    if (interaction.commandName === 'search') {
        const name = options.getString('name');
        const tag = options.getInteger('tag');
        const id = name + '#' + tag;

        const pyshell = new PythonShell('search.py');
        let pydata;
        
        pyshell.send(id);
        pyshell.on('message', function (data) {
            pydata = data;
            console.log(data);

            interaction.reply({
                content: 'test in-game ID is ' + id + ', ' + pydata,
                ephemeral: true
            });
        });
        
        
    }
});

client.login(process.env.TOKEN);