import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import { jwtDecode } from "jwt-decode";
import ChatApp from "./ChatApp";
import { Card } from "./components/ui/card";

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Chat /> : <LoginForm />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

const Chat: React.FC = () => {
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : "";
  // cheating!
  const username = (decodedToken as { username: string }).username;

  if (!token || !username) {
    return (
      <Card>
        Please log in to access the chat. <Link to="/">Login</Link>
      </Card>
    );
  }

  return (
    <Card className="chat-container">
      <ChatApp username={username} token={token} />
    </Card>
  );
};
