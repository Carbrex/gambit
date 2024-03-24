const User = require("../models/User");

let botId;

async function getBotId() {
    if (!botId) {
        const bot = await User.findOne({ email: 'bot@bot.com' });
        console.log('Bot:', bot);
        if (bot) {
            botId = bot._id;
        }
        else {
            pwd = Math.random().toString(36).slice(-8);
            bot = await User.create({ name: 'BOT', email: 'bot@bot.com', password: pwd });
            botId = bot._id;
        }
    }
    console.log('Bot ID:', botId);
    return botId;
}

module.exports = { getBotId };