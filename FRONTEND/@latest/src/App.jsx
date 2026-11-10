
import { GoogleLogin } from "@react-oauth/google";
import "./App.css";

function App() {
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const credential = credentialResponse.credential;

      const response = await fetch(
        "http://localhost:4000/api/auth/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credential }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert(`Welcome ${data.user.name}`);
    } catch (error) {
      console.error("Login Error:", error);
      alert("Google Login Failed");
    }
  };

  const handleGoogleError = () => {
    console.log("Google Login Failed");
    alert("Google Login Failed");
  };

  return (
    <div className="container">
      <div className="login-card">
        <h1>Welcome Back 👋</h1>
        <p>Login with your Google account</p>

        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={handleGoogleError}
        />
      </div>
    </div>
  );
}

export default App;
