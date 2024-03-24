const User = require("../models/User");

let botId;

function generatePassword() {
    let small = 'abcdefghijklmnopqrstuvwxyz';
    let capital = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let numbers = '0123456789';
    let symbols = '!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < 3; i++) {
        password += small[Math.floor(Math.random() * small.length)];
        password += capital[Math.floor(Math.random() * capital.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += symbols[Math.floor(Math.random() * symbols.length)];
    }
    return password;
}

async function getBotId() {
    if (!botId) {
        const bot = await User.findOne({ email: 'bot@bot.com' });
        if (bot) {
            botId = bot._id;
        }
        else {
            pwd = generatePassword();
            bot = await User.create({ name: 'BOT', email: 'bot@bot.com', password: pwd });
            botId = bot._id;
        }
    }
    return botId;
}

module.exports = { getBotId };