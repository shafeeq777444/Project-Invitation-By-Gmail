import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreateProject from "./CreateProject";
import JoinProject from "./JoinProject";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateProject />} />
        <Route path="/invite/:inviteToken" element={<JoinProject />} />
      </Routes>
    </Router>
  );
};

export default App;
