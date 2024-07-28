const mongoose = require('mongoose');

async function connectToMondoDB(url) {
    return mongoose.connect(url)

};

module.exports = { connectToMondoDB };