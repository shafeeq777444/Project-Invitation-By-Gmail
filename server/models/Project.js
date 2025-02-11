const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // inviteToken: { type: String, unique: true }, // Store unique invite token
  members: [{ type: String, required: true }], // Store user emails instead of ObjectId
});

module.exports = mongoose.model("Project", ProjectSchema);
