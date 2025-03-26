import { useState } from "react";

const API_URL = "http://localhost:3000";

import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardTitle } from "./ui/card";

export default function LoginForm() {
  const [username, setUsername] = useState("sarah");
  const [password, setPassword] = useState("password");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const response = await fetch(API_URL + "/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const { token } = await response.json();
      // Save token in local storage or state management
      localStorage.setItem("token", token);
      navigate("/chat"); // Redirect to chat page
    } else {
      const error = await response.text();
      setErrorMessage(error || "An error occurred");
    }
  };

  return (
    <Card className="login-form p-4">
      <CardTitle className="mb-4">Login</CardTitle>
      <form onSubmit={handleLogin}>
        <Input
          className="mb-2"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          className="mb-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Login</Button>
      </form>
      {errorMessage && <div className="error">{errorMessage}</div>}
    </Card>
  );
}
