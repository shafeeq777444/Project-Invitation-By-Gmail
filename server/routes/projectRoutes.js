const express = require("express");
const Project = require("../models/Project");
const User = require("../models/User");
const { generateInviteToken, verifyInviteToken } = require("../utils/jwt");
const sendEmail = require("../utils/sgMail");
const { shortenUrl } = require("../utils/shortenUrl");

const router = express.Router();

// Create Project and Generate JWT Invite Link
router.post("/create", async (req, res) => {
  try {
    const { name, members = [],description } = req.body; // Default members to an empty array if not provided

    // Convert members list into an array of objects with status "invited"
    const formattedMembers = members.map(email => ({
      email,
      status: "invited",
    }));

    const project = new Project({ name,description, members: formattedMembers });
    await project.save();

    const inviteToken = await generateInviteToken(project._id);
    const longLink = `http://localhost:5173/invite/${inviteToken}`;
    const inviteLink = await shortenUrl(longLink);

    // Send invite emails
    for (const { email } of formattedMembers) {
      const subject = `You're Invited to Join "${name}"`;
      const text = `You have been invited to join the project "${name}". Click the link below to accept the invitation: ${inviteLink}`;
      const html = `
          <div style="background: url('https://source.unsplash.com/1600x900/?abstract,technology') no-repeat center center; background-size: cover; padding: 40px 20px; text-align: center; color: white; font-family: Arial, sans-serif;">
              <div style="background: rgba(0, 0, 0, 0.7); padding: 30px; border-radius: 10px;">
                  <h1 style="margin: 0; font-size: 24px;">📩 You're Invited to Join "${name}"</h1>
                  <p style="font-size: 16px; margin: 10px 0;">${description}</p>
                  <p style="font-size: 16px; margin: 20px 0;">Click the button below to accept your invitation.</p>
                  <a href="${inviteLink}" style="display: inline-block; padding: 10px 20px; background: #ff9800; color: white; text-decoration: none; font-size: 16px; border-radius: 5px;">Join Project</a>
              </div>
          </div>
      `;
      await sendEmail(email, subject, text, html);
    }

    res.status(201).json({ message: "Project created!", inviteLink });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Join Project via Invite Link
router.post("/join/:inviteToken", async (req, res) => {
  try {
    const { inviteToken } = req.params;
    const { email } = req.body;

    // Verify the invite token
    const decoded = verifyInviteToken(inviteToken);
    if (!decoded) return res.status(400).json({ message: "Invalid or expired invite link" });

    // Find the project using the decoded project ID
    const project = await Project.findById(decoded.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // const user = await User.findOne({email});
    //   if (!user) return res.status(404).json({ message: "You have not account, please start your account" });

    // Find the member in the project's members array
    const memberIndex = project.members.findIndex(member => member.email === email);

    if (memberIndex === -1) {
      return res.status(403).json({ message: "This user does not have access to join this project" });
    }

    // Update member status to "joined"
    project.members[memberIndex].status = "joined";
    await project.save();

    res.json({
      message: "Joined project successfully!",
      project,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
