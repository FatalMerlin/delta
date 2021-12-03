// TODO: receive input message from any connected source
// TODO: retain the message source
// TODO: be able to respond to the message at the source
// TODO: respond / forward response to different source (e.g. twitch => discord)

// TODO: 


import { getRandomInt } from './lib.js';

/**
 * 
 * @param {string} message 
 * @param {function} replyCallback 
 * @param {object} ctx Contains user metadate
 */
export async function handle(message, replyCallback, ctx = {}) {
    if (message === "!spells" || message === '!help') {
        return replyCallback("!ping, !trello, !discord, !instagram, !twitter, !bio, !repo, !pet, !WhereHeAt?")
    }

    if (message === '!ping') {
        return replyCallback('Pong! ❤️');
    }

    if (message === '!trello') {
        return replyCallback("https://trello.com/invite/b/OzGiGtKO/13f309d7fbb5c6f57692c37d965b1eda/delta");
    }

    if (message === '!discord') {
        return replyCallback("https://discord.gg/8XGtYeZNCf");
    }

    if (message === '!instagram') {
        return replyCallback("https://instagram.com/fatalmerlin");
    }

    if (message === '!twitter') {
        return replyCallback("https://twitter.com/fatalmerlin");
    }

    if (message === '!bio') {
        return replyCallback("https://bio.link/fatatmerlin");
    }

    if (message === '!youtube') {
        return replyCallback("https://www.youtube.com/channel/UCPXUlowZpDwi4NyRhkLf9hQ");
    }

    if (message === '!github') {
        return replyCallback("https://github.com/FatalMerlin/delta");
    }

    // das_grill
    if (message === '!pet' && userstate.username === 'das_grill') {
        const pets = [
            "Woof ▼・ᴥ・▼",
            "Oink (´・(oo)・｀)",
            "Purrr (=^-ω-^=)",
        ]

        return replyCallback(pets[getRandomInt(0, pets.length - 1)]);
    }

    // epurdus
    if (message === '!WhereHeAt?') {
        return replyCallback("@drakontheripper are u here?");
    }

    let match;
    if ((match = message.match(/^!(?:roll|gamble)( (\d+)-(\d+))?/i)) !== null) {
        console.log(match);

        if (match[1] === undefined) {
            return replyCallback("Usage: !roll [number]-[number]");
        }

        let lower = Number(match[2]);
        let upper = Number(match[3]);

        // we make sure, that the parameters are sorted correctly
        [lower, upper] = [lower, upper].sort()

        let result = getRandomInt(lower, upper).toString()

        return replyCallback(`${ctx.username || 'unknown'} rolled ${result}!`);
    }
}