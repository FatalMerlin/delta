import tmi from 'tmi.js';
import { handle } from './logic.js';

import { createRequire } from "module";
import { getRandomInt } from './lib.js';
const require = createRequire(import.meta.url);
const auth = require('./twitch.json')

import fetch from 'node-fetch';

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

    // callback();

    setInterval(callback, 10 * 60 * 1000);
});

["SIGINT", "SIGTERM"].forEach(signal => {
    process.on(signal, () => {
        client.disconnect();
        console.log("Terminating!");
    });
})

// ==============================================================

async function authenticate() {
    const scopes = [
        "channel:manage:predictions",
        "channel:read:predictions",
    ]

    // manual user OAuth request

    // GET https://id.twitch.tv/oauth2/authorize
    // ?client_id=e8ujbv51bpu5qq5g06i4sle5smzjx9
    // &redirect_uri=http://localhost
    // &response_type=code
    // &scope=channel:manage:predictions%20channel:read:predictions

    // https://id.twitch.tv/oauth2/authorize?client_id=e8ujbv51bpu5qq5g06i4sle5smzjx9&redirect_uri=http://localhost&response_type=code&scope=channel:manage:predictions%20channel:read:predictions

    // {
    //     "access_token": "<user access token>",
    //     "refresh_token": "",
    //     "expires_in": <number of seconds until the token expires>,
    //     "scope": ["<your previously listed scope(s)>"],
    //     "token_type": "bearer"
    // }

    // Client Credentials
    // https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#oauth-client-credentials-flow
    // const url = `https://id.twitch.tv/oauth2/token?client_id=${auth.api.clientId}` +
    //     `&client_secret=${auth.api.clientSecret}&grant_type=client_credentials` +
    //     `&scope=${scopes.join('%20')}`;

    // OAuth Authorization Code Flow
    // https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#oauth-authorization-code-flow
    const url = `https://id.twitch.tv/oauth2/token?client_id=${auth.api.clientId}` +
        `&client_secret=${auth.api.clientSecret}&grant_type=authorization_code` +
        `&code=${auth.api.oauthCode}&redirect_uri=http://localhost` +
        `&scope=${scopes.join('%20')}`;

    const response = await fetch(url, {
        method: 'POST',
    });

    return response.json()
}

/**
 * 
 * @param {string} token 
 */
async function createPrediction(token) {
    const payload = {
        broadcaster_id: '131343721',
        title: 'Will this work?',
        outcomes: [{ title: 'Yes' }, { title: 'No' }],
        prediction_window: 5 * 60,
    };

    const response = await fetch('https://api.twitch.tv/helix/predictions', {
        body: JSON.stringify(payload),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Client-Id': auth.api.clientId,
            'Authorization': 'Bearer ' + token,
        },
    });

    console.log('[Twitch API] Created prediction', await response.json());
}

async function initApi() {
    try {
        const authResponse = await authenticate();

        console.log('[Twitch API] Authenticated -', authResponse.expires_in, authResponse.scope);

        await createPrediction(authResponse.access_token);
    } catch (error) {
        console.error("[Twitch API]", error)
    }
}

export function run() {
    client.connect();
    initApi();
}
