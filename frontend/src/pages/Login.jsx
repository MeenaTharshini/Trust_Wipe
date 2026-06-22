import { useState } from "react";

function Login() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const loginUser = (e) => {
    e.preventDefault();

    alert(
      "Login functionality can be connected to JWT backend later."
    );
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
      }}
    >
      <h1>TrustWipe Login</h1>

      <form onSubmit={loginUser}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          style={{
            width: "100%",
            marginBottom: "10px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          style={{
            width: "100%",
            marginBottom: "10px",
          }}
        />

        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;