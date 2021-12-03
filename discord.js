import { Client, Intents } from 'discord.js';
import { handle } from './logic.js';

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { token } = require('./discord.json');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES
    ]
});

client.on('ready', async (ctx) => {
    console.log(`Logged in as ${client.user.tag}!`);

    // ctx.on('message', async message => {
    //     console.log(message.content);
    // })

    // can only message users, with whom we have a server in common
    // try {
    //     const user = await ctx.users.fetch('174617873182883841')

    //     console.log("DC:", user)

    //     await user.send("Hello!")
    // } catch (error) {
    //     console.error(error)
    // }
});

// https://discord.com/api/oauth2/authorize?client_id=912811979557716018&permissions=274877910016&scope=bot%20applications.commands

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    return handle(message.content, (response) => {
        return message.reply(response);
    }, { username: message.author.username })
})

export function run() {
    client.login(token)
}