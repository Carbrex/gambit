const User = require("../models/User");

let botId;

async function getBotId() {
    if (!botId) {
        const bot = await User.findOne({ email: 'bot@bot.com' });
        if (bot) {
            botId = bot._id;
        }
        else {
            pwd = Math.random().toString(36).slice(-8);
            bot = await User.create({ name: 'BOT', email: 'bot@bot.com', password: pwd });
            botId = bot._id;
        }
    }
    return botId;
}

module.exports = { getBotId };