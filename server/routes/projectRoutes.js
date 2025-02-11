const express = require("express");
const Project = require("../models/Project");
const User = require("../models/User");
const { generateInviteToken, verifyInviteToken } = require("../utils/jwt");
const sendEmail = require("../utils/sgMail");

const router = express.Router();

// Create Project and Generate JWT Invite Link
router.post("/create", async (req, res) => {
    try {
      const { name, members = [] } = req.body; // Default members to an empty array if not provided
      
      const project = new Project({ name, members });
      await project.save();
  
      const inviteToken =await generateInviteToken(project._id);
      const inviteLink = `http://localhost:5173/invite/${inviteToken}`;

      // Send invite emails
      for (const email of members) {
        const subject = `You're Invited to Join "${name}"`;
        const text = `You have been invited to join the project "${name}". Click the link below to accept the invitation: ${inviteLink}`;
        const html = `
            <div style="background: url('https://source.unsplash.com/1600x900/?abstract,technology') no-repeat center center; background-size: cover; padding: 40px 20px; text-align: center; color: white; font-family: Arial, sans-serif;">
                <div style="background: rgba(0, 0, 0, 0.7); padding: 30px; border-radius: 10px;">
                    <h1 style="margin: 0; font-size: 24px;">📩 You're Invited to Join "${name}"</h1>
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
      console.log(inviteToken)
      const { email } = req.body;
  
      // Verify the invite token
    const decoded = verifyInviteToken(inviteToken);
    if (!decoded) return res.status(400).json({ message: "Invalid or expired invite link" });

    // Find the project using the decoded project ID
    const project = await Project.findById(decoded.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
  
    //   const user = await User.findOne({email});
    //   if (!user) return res.status(404).json({ message: "User not found" });
  
      // Check if the user's email is in the project's members list
    if (!project.members.includes(email)) {
        return res.status(403).json({ message: "This user does not have access to join this project" });
      }
  console.log("succsess")
      res.json({ message: "Joined project successfully!",
        project
       });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  module.exports = router;