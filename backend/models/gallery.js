const mongoose = require("mongoose");


const gallerySchema = new mongoose.Schema({
    image: { type: String, required: true }, 
    caption: String,
    tags: [String],
  });

  const Gallery = mongoose.model("Gallery", gallerySchema);

  module.exports = Gallery;
