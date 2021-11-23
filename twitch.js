const tmi = require('tmi.js');
const auth = require('./twitch.json');
const { getRandomInt } = require('./lib');

const opts = {
    identity: auth,
    channels: [
        'fatalmerlin'
    ]
};

const client = new tmi.client(opts);

client.on('message', (channel, userstate, message, self) => {
    // if message was sent by this bot, ignore it
    if (self) {
        return;
    }

    if (message === '!ping') {
        return client.say(channel, 'Pong! ❤️');
    }

    if (message === '!trello') {
        return client.say(channel, "https://trello.com/invite/b/OzGiGtKO/13f309d7fbb5c6f57692c37d965b1eda/delta");
    }

    if (message === '!discord') {
        return client.say(channel, "https://discord.gg/8XGtYeZNCf");
    }

    if (message === '!instagram') {
        return client.say(channel, "https://instagram.com/fatalmerlin");
    }

    if (message === '!twitter') {
        return client.say(channel, "https://twitter.com/fatalmerlin");
    }

    if (message === '!bio') {
        return client.say(channel, "https://bio.link/fatatmerlin");
    }

    if (message === '!repo') {
        return client.say(channel, "https://github.com/FatalMerlin/delta");
    }

    // das_grill
    if (message === '!pet' && userstate.username === 'das_grill') {
        return client.say(channel, "Purrr (=^-ω-^=)");
    }

    // epurdus
    if (message === '!WhereHeAt?') {
        return client.say(channel, "@drakontheripper are u here?");
    }

    let match;
    if ((match = message.match(/^!roll( (\d+)-(\d+))?/i)) !== null) {
        console.log(match);

        if (match[1] === undefined) {
            return client.say(channel, "Usage: !roll [number]-[number]");
        }

        let lower = Number(match[2]);
        let upper = Number(match[3]);

        // we make sure, that the parameters are sorted correctly
        [lower, upper] = [lower, upper].sort()

        let result = getRandomInt(lower, upper).toString()

        return client.say(channel, `${userstate.username} rolled ${result}!`);
    }
    
    // console.log(channel, JSON.stringify(userstate), message);
});

client.on('connected', (address, port) => {
    console.log("Bot connected on", address, port);
});


["SIGINT", "SIGTERM"].forEach(signal => {
    process.on(signal, () => {
        client.disconnect();
        console.log("Terminating!");
    });
})

exports.run = () => {
    client.connect();
};