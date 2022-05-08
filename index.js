const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", async () => {
    const data = [{
        name: "ping",
        description: "Replies with Pong!",
    }];
    await client.application.commands.set(data);
    console.log("Ready!");
});

client.login()
  .catch(console.error)