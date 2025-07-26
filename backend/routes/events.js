const express = require("express");
const Event = require("../models/events"); 
const router = express.Router();


router.route("/")
  .get(async (req, res) => {
    try {
      const events = await Event.find({});
      res.json(events);
    } catch (err) {
      console.error("Error fetching events:", err);
      res.status(500).json({ error: "Failed to fetch events.", details: err.message });
    }
  })
  .post(async (req, res) => {
    try {
      const event = await Event.create(req.body);
      res.status(201).json({ status: "success", event });
    } catch (err) {
      console.error("Error adding event:", err);
      res.status(400).json({ error: "Failed to add event.", details: err.message });
    }
  });


router.route("/:id")
  .get(async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Event not found." });
      }
      res.json(event);
    } catch (err) {
      console.error("Error fetching single event:", err);
      res.status(500).json({ error: "Failed to fetch event.", details: err.message });
    }
  })
  .patch(async (req, res) => {
    try {
      const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true, 
        runValidators: true 
      });
      if (!event) {
        return res.status(404).json({ error: "Event not found." });
      }
      res.status(200).json({ status: "updated", event });
    } catch (err) {
      console.error("Error updating event:", err);
      res.status(400).json({ error: "Failed to update event.", details: err.message });
    }
  })
  .delete(async (req, res) => {
    try {
      const event = await Event.findByIdAndDelete(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Event not found." });
      }
      res.status(200).json({ status: "deleted", message: "Event deleted successfully." });
    } catch (err) {
      console.error("Error deleting event:", err);
      res.status(500).json({ error: "Failed to delete event.", details: err.message });
    }
  });

module.exports = router;
