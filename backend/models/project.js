const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    technologies: [String],
    status: { type: String, enum: ["ongoing", "completed"], default: "ongoing" },
    github: String,
    demo: String,
  });

  const Project = mongoose.model("Project", projectSchema);

  module.exports = Project;
