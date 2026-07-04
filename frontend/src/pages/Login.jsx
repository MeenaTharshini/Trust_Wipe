import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (e) => {
    const {
      name,
      value,
      checked,
      type,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.email ||
      !formData.password
    ) {
      setError(
        "Please enter email and password"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password:
              formData.password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message
        );
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="left-panel">

        <div className="brand-content">

          <div className="brand-logo">
            🛡️
          </div>

          <h1>TrustWipe</h1>

          <p>
            Enterprise-grade
            secure data erasure,
            certificate generation,
            verification and audit
            compliance platform.
          </p>

          <div className="feature-list">

            <div className="feature">
              ✓ Secure Device Wiping
            </div>

            <div className="feature">
              ✓ Digital Certificates
            </div>

            <div className="feature">
              ✓ Verification Engine
            </div>

            <div className="feature">
              ✓ Audit Reports
            </div>

            <div className="feature">
              ✓ Role-Based Access
            </div>

          </div>

        </div>

      </div>

      <div className="right-panel">

        <form
          className="login-card"
          onSubmit={handleSubmit}
        >

          <div className="card-header">

            <div className="small-logo">
              🛡️
            </div>

            <h2>Welcome Back</h2>

            <p>
              Sign in to your
              TrustWipe account
            </p>

          </div>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          <div className="input-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />

          </div>

          <div className="input-group">

            <label>Password</label>

            <div className="password-wrapper">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Enter password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
              />

              <button
  type="button"
  className="eye-btn"
  onClick={() =>
    setShowPassword(!showPassword)
  }
>
  {showPassword ? (
    <FaEyeSlash />
  ) : (
    <FaEye />
  )}
</button>

            </div>

          </div>

          <div className="options">

            <label>
              <input
                type="checkbox"
                name="rememberMe"
                checked={
                  formData.rememberMe
                }
                onChange={
                  handleChange
                }
              />
              Remember Me
            </label>

            <Link
              to="/forgot-password"
            >
              Forgot Password?
            </Link>

          </div>

          <button
            className="login-btn"
            disabled={loading}
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </button>

          <div className="trust-section">
            Protected by JWT &
            Secure Authentication
          </div>

          <p className="register-link">
            Don't have an account?
            <Link to="/register">
              Register
            </Link>
          </p>

        </form>

      </div>

    </div>
  );
}