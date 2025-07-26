const express = require("express");
const Member = require("../models/members"); 
const router = express.Router();


router.route("/")
  .get(async (req, res) => {
    try {
      const members = await Member.find({});
      res.json(members);
    } catch (err) {
      console.error("Error fetching members:", err);
      res.status(500).json({ error: "Failed to fetch members.", details: err.message });
    }
  })
  .post(async (req, res) => {
    try {
      const member = await Member.create(req.body);
      res.status(201).json({ status: "success", member });
    } catch (err) {
      console.error("Error adding member:", err);
      res.status(400).json({ error: "Failed to add member.", details: err.message });
    }
  });


router.route("/:id")
  .get(async (req, res) => {
    try {
      const member = await Member.findById(req.params.id);
      if (!member) {
        return res.status(404).json({ error: "Member not found." });
      }
      res.json(member);
    } catch (err) {
      console.error("Error fetching single member:", err);
      res.status(500).json({ error: "Failed to fetch member.", details: err.message });
    }
  })
  .patch(async (req, res) => {
    try {
      const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!member) {
        return res.status(404).json({ error: "Member not found." });
      }
      res.status(200).json({ status: "updated", member });
    } catch (err) {
      console.error("Error updating member:", err);
      res.status(400).json({ error: "Failed to update member.", details: err.message });
    }
  })
  .delete(async (req, res) => {
    try {
      const member = await Member.findByIdAndDelete(req.params.id);
      if (!member) {
        return res.status(404).json({ error: "Member not found." });
      }
      res.status(200).json({ status: "deleted", message: "Member deleted successfully." });
    } catch (err) {
      console.error("Error deleting member:", err);
      res.status(500).json({ error: "Failed to delete member.", details: err.message });
    }
  });

module.exports = router;
