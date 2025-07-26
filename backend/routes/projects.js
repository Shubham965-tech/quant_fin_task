const express = require("express");
const Project = require("../models/project"); 
const router = express.Router();


router.route("/")
  .get(async (req, res) => {
    try {
      const projects = await Project.find({});
      res.json(projects);
    } catch (err) {
      console.error("Error fetching projects:", err);
      res.status(500).json({ error: "Failed to fetch projects.", details: err.message });
    }
  })
  .post(async (req, res) => {
    try {
      const project = await Project.create(req.body);
      res.status(201).json({ status: "success", project });
    } catch (err) {
      console.error("Error adding project:", err);
      res.status(400).json({ error: "Failed to add project.", details: err.message });
    }
  });


router.route("/:id")
  .get(async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found." });
      }
      res.json(project);
    } catch (err) {
      console.error("Error fetching single project:", err);
      res.status(500).json({ error: "Failed to fetch project.", details: err.message });
    }
  })
  .patch(async (req, res) => {
    try {
      const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!project) {
        return res.status(404).json({ error: "Project not found." });
      }
      res.status(200).json({ status: "updated", project });
    } catch (err) {
      console.error("Error updating project:", err);
      res.status(400).json({ error: "Failed to update project.", details: err.message });
    }
  })
  .delete(async (req, res) => {
    try {
      const project = await Project.findByIdAndDelete(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found." });
      }
      res.status(200).json({ status: "deleted", message: "Project deleted successfully." });
    } catch (err) {
      console.error("Error deleting project:", err);
      res.status(500).json({ error: "Failed to delete project.", details: err.message });
    }
  });

module.exports = router;
