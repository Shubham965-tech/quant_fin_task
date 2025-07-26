const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    date: Date,
    venue: String,
    tags: [String],
    image: String, 
  });

  const Event = mongoose.model("Event", eventSchema);

  module.exports = Event;
