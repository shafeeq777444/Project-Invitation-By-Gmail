const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }, // ✅ Added description field (required)
  members: [
    {
      email: { type: String, required: true }, // ✅ Store email of the member
      status: { type: String, enum: ["invited", "joined"], default: "invited" }, // ✅ Track status
    },
  ],
});

module.exports = mongoose.model("Project", ProjectSchema);
