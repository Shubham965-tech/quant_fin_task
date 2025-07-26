const mongoose = require("mongoose");

async function connectMongoDb(url) {
    return mongoose.connect(url)
        .then(() => console.log("MongoDB Connected!"))
        .catch(err => console.error("MongoDB connection error:", err));
}

module.exports = connectMongoDb;
