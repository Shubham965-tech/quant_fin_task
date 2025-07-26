const express = require("express");
const Gallery = require("../models/gallery"); // Correct path to Gallery model
const router = express.Router();


router.route("/")
  .get(async (req, res) => {
    try {
      const images = await Gallery.find({});
      res.json(images);
    } catch (err) {
      console.error("Error fetching gallery images:", err);
      res.status(500).json({ error: "Failed to fetch gallery images.", details: err.message });
    }
  })
  .post(async (req, res) => {
    try {
      const image = await Gallery.create(req.body);
      res.status(201).json({ status: "success", image });
    } catch (err) {
      console.error("Error adding gallery image:", err);
      res.status(400).json({ error: "Failed to add gallery image.", details: err.message });
    }
  });


router.route("/:id")
  .get(async (req, res) => {
    try {
      const image = await Gallery.findById(req.params.id);
      if (!image) {
        return res.status(404).json({ error: "Image not found." });
      }
      res.json(image);
    } catch (err) {
      console.error("Error fetching single image:", err);
      res.status(500).json({ error: "Failed to fetch image.", details: err.message });
    }
  })
  .patch(async (req, res) => {
    try {
      const image = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!image) {
        return res.status(404).json({ error: "Image not found." });
      }
      res.status(200).json({ status: "updated", image });
    } catch (err) {
      console.error("Error updating image:", err);
      res.status(400).json({ error: "Failed to update image.", details: err.message });
    }
  })
  .delete(async (req, res) => {
    try {
      const image = await Gallery.findByIdAndDelete(req.params.id);
      if (!image) {
        return res.status(404).json({ error: "Image not found." });
      }
      res.status(200).json({ status: "deleted", message: "Image deleted successfully." });
    } catch (err) {
      console.error("Error deleting image:", err);
      res.status(500).json({ error: "Failed to delete image.", details: err.message });
    }
  });

module.exports = router;
