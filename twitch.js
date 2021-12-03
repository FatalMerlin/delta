import tmi from 'tmi.js';
import { handle } from './logic.js';

import { createRequire } from "module";
import { getRandomInt } from './lib.js';
const require = createRequire(import.meta.url);
const auth = require('./twitch.json')

// const fetch = require('node-fetch');

const opts = {
    identity: auth.bot,
    channels: [
        'fatalmerlin'
    ]
};

const client = new tmi.Client(opts);

client.on('message', (channel, userstate, message, self) => {
    // if message was sent by this bot, ignore it
    if (self) {
        return;
    }

    return handle(message, (response) => {
        return client.say(channel, response);
    }, { username: userstate.username })

    // console.log(channel, JSON.stringify(userstate), message);
});

const getPromoteCallback = () => {
    const messages = [
        "!twitter",
        "!discord",
        "!instagram",
        "!youtube",
        "!bio",
    ];

    let index = getRandomInt(0, messages.length - 1);

    return () => {
        const msg = messages[index++];

        handle(msg, (response) => {
            return client.say('fatalmerlin', response);
        });

        index %= messages.length;
    };
}

client.on('connected', (address, port) => {
    console.log("Bot connected on", address, port);

    const callback = getPromoteCallback();

    callback();

    setInterval(callback, 5 * 60 * 1000);
});




["SIGINT", "SIGTERM"].forEach(signal => {
    process.on(signal, () => {
        client.disconnect();
        console.log("Terminating!");
    });
})

export function run() {
    client.connect();
}