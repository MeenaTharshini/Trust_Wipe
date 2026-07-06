import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const getPasswordStrength = () => {
    const password = formData.password;

    if (password.length < 6)
      return {
        text: "Weak",
        className:
          "strength-weak",
      };

    if (password.length < 10)
      return {
        text: "Medium",
        className:
          "strength-medium",
      };

    return {
      text: "Strong",
      className:
        "strength-strong",
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Passwords do not match"
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          "https://trust-wipe.onrender.com/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name: formData.name,
              email:
                formData.email,
              password:
                formData.password,
              department:
                formData.department,
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

      setSuccess(
        "Account created successfully"
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const strength =
    getPasswordStrength();

  return (
    <div className="register-page">

      <div className="left-panel">

        <div className="brand-content">

          <div className="brand-logo">
            🛡️
          </div>

          <h1>TrustWipe</h1>

          <p>
            Join the enterprise-grade
            secure data erasure and
            verification platform.
          </p>

          <div className="feature-list">
            <div className="feature">
              ✓ Device Sanitization
            </div>

            <div className="feature">
              ✓ Digital Certificates
            </div>

            <div className="feature">
              ✓ Verification Engine
            </div>

            <div className="feature">
              ✓ Compliance Reports
            </div>

            <div className="feature">
              ✓ Secure Audit Trails
            </div>
          </div>

        </div>

      </div>

      <div className="right-panel">

        <form
          className="register-card"
          onSubmit={handleSubmit}
        >

          <div className="card-header">

            <div className="small-logo">
              🛡️
            </div>

            <h2>Create Account</h2>

            <p>
              Register for TrustWipe
            </p>

          </div>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          {success && (
            <div className="success-box">
              {success}
            </div>
          )}

          <div className="input-group">
            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>
              Department
            </label>

            <input
              type="text"
              name="department"
              placeholder="Enter department"
              value={
                formData.department
              }
              onChange={
                handleChange
              }
            />
          </div>

          <div className="input-group">

            <label>
              Password
            </label>

            <div className="password-wrapper">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Create password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                required
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

            <small
              className={
                strength.className
              }
            >
              Password Strength:
              {" "}
              {strength.text}
            </small>

          </div>

          <div className="input-group">

            <label>
              Confirm Password
            </label>

            <div className="password-wrapper">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm password"
                value={
                  formData.confirmPassword
                }
                onChange={
                  handleChange
                }
                required
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

          <button
            className="register-btn"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Account"}
          </button>

          <div className="trust-section">
            Protected by JWT &
            Secure Authentication
          </div>

          <p className="login-link">
            Already have an account?
            <Link to="/login">
              Login
            </Link>
          </p>

        </form>

      </div>

    </div>
  );
}