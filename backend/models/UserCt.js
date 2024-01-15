// Model to store user's ct
const mongoose = require('mongoose');

const UserCtSchema = new mongoose.Schema({
    ct: {
        type: Number,
        required: [true, 'Please provide ct'],
    },
})

module.exports = mongoose.model('UserCt', UserCtSchema);