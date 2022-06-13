const { Client, Intents } = require('discord.js');
const DiscordJS = require('discord.js');
const dotenv = require('dotenv');
const { PythonShell } = require('python-shell');
const pd = require('node-pandas');
const scipy = require('scipy');

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
var admin = require("firebase-admin");

var serviceAccount = require("/app/discord-valorant-matching-firebase-adminsdk-9gsja-02db5924bd.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://discord-valorant-matching-default-rtdb.firebaseio.com"
});

const db = getFirestore();

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
        // const stats = await runpyshell(id);
        // const agents = stats[0];
        // const time = stats[1];
        const agents = ["a", "b", "c"];
        const time = [3, 2, 5];
        
        //#region for debug python
        /*
        let stats;
        
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
        await sleep(1200);
        */
       //#endregion

        
        let data = {};
        for (let i = 0; i < agents.length; i++) {
            data[agents[i]] = time[i];
        }
        const res = await db.collection('users').doc(id).set(data);
        const usersRef = db.collection('users');
        const snapshot = await usersRef.get();
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
        });
        df = pd.DataFrame([data]);
        console.log(df);
        
        await interaction.reply({
            content: 'stats:' + agents + time,
            ephemeral: true
        });
    }
});

client.login(process.env.TOKEN);