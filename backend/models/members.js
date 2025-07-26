const mongoose = require("mongoose");


const memberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: String,
    type: { type: String, enum: ["Core", "Manager", "Coordinator"] },
    photo: String, 
    bio: String,
    linkedin: String,
  });

const Member = mongoose.model("Member", memberSchema);
module.exports = Member;
