import { useState } from "react";
import "./CreateProject.css"; // Import the CSS file

const CreateProject = () => {
  const [projectName, setProjectName] = useState("");
  const [members, setMembers] = useState(""); // State for members input

  const createProject = async () => {
    const membersArray = members.split(",").map((email) => email.trim()); // Convert input to an array

     await fetch("http://localhost:3300/api/projects/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: projectName, members: membersArray }),
    });


  };

  return (
    <div className="container">
      <div className="form-box">
        <h2>Create Project</h2>
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Members (comma-separated emails)"
          value={members}
          onChange={(e) => setMembers(e.target.value)}
        />
        <button onClick={createProject}>Create Project</button>
        
      </div>
    </div>
  );
};

export default CreateProject;
