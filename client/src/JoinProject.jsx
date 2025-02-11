import { useState } from "react";
import { useParams } from "react-router-dom";
import "./JoinProject.css"; // Import the CSS file

const JoinProject = () => {
  const { inviteToken } = useParams();
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const joinProject = async () => {
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    setError("");

    try {
      const res = await fetch(`http://localhost:3300/api/projects/join/${inviteToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to join project. Please try again.",err);
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <h2>Join Project</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={joinProject}>Join</button>

        {error && <p className="error-message">{error}</p>}
        {user && (
          <p className="success-message">Project Joined: {user.project?.name}</p>
        )}
      </div>
    </div>
  );
};

export default JoinProject;
