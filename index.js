const { Client, Intents } = require('discord.js');
const DiscordJS = require('discord.js');
const dotenv = require('dotenv');
const { PythonShell } = require('python-shell');

var optionsPy = {
    mode: 'text',
    pythonPath: '/usr/bin/python3.8',
    pythonOptions: ['-u'],
    scriptPath: '/app/',
    args: ['test']
}

dotenv.config();

async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function runpyshell(id) {
    optionsPy = {
        mode: 'text',
        pythonPath: '/usr/bin/python3.8',
        pythonOptions: ['-u'],
        scriptPath: '/app/',
        args: [id]
    }

    const { success, err = '', results } = await new Promise(
        (resolve, reject) =>
        {
            PythonShell.run('search.py', optionsPy,
                function (err, results)
                {
                    if (err)
                    {
                        reject({ success: false, err });
                        return;
                    }

                    console.log('PythonShell results: %j', results);

                    resolve({ success: true, results });
                }
            );
        }
    );
    return results;
}


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
        const stats = await runpyshell(id);
        /*
        optionsPy = {
            mode: 'text',
            pythonPath: '/usr/bin/python3.8',
            pythonOptions: ['-u'],
            scriptPath: '/app/',
            args: [id]
        }
        // optionsPy[args] = id;
        
        PythonShell.run('search.py', optionsPy, function (err, results) {
            if (err) throw err;
            // results is an array consisting of messages collected during execution
            console.log('results: %j', results);
            stats = results;
        });
        */

        // await sleep(1000);
        await interaction.deferReply({
            content: 'stats:' + stats,
            ephemeral: true
        });
    }
});

client.login(process.env.TOKEN);