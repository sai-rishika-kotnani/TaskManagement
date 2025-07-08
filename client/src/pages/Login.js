import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CheckSquare, Mail, Lock, Eye, EyeOff } from "lucide-react";

const styles = {
  container: {
    background: "url('https://www.cbdcafe.nz/assets/img/804855.jpg')",

    // "linear-gradient(to bottom right, #d1f7d6,rgb(204, 228, 210), #c7f7e2)",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "2rem",
    maxWidth: "400px",
    width: "100%",
    boxShadow: "0 4px 12px rgba(0, 128, 0, 0.1)",
    textAlign: "center",
  },
  icon: {
    color: "#48bb78",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#2f855a",
  },
  subtext: {
    fontSize: "0.9rem",
    color: "#4a5568",
    marginBottom: "1.5rem",
  },
  link: {
    color: "#38a169",
    textDecoration: "none",
  },
  form: {
    textAlign: "left",
  },
  inputGroup: {
    marginBottom: "1rem",
  },
  label: {
    fontSize: "0.85rem",
    color: "#2d3748",
    marginBottom: "0.25rem",
    display: "block",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    background: "#f0fff4",
    padding: "0.5rem 0.75rem",
    borderRadius: "8px",
    border: "1px solid #c6f6d5",
  },
  input: {
    border: "none",
    outline: "none",
    background: "transparent",
    flex: 1,
    fontSize: "1rem",
    color: "#2f855a",
  },
  eye: {
    cursor: "pointer",
    color: "#68d391",
  },
  button: {
    background: "#38a169",
    color: "white",
    padding: "0.5rem 1rem",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    width: "100%",
    marginTop: "0.5rem",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  errorText: {
    color: "#e53e3e",
    fontSize: "0.8rem",
    marginTop: "0.25rem",
  },
  demoText: {
    marginTop: "1.5rem",
    fontSize: "0.85rem",
    color: "#4a5568",
  },
};

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const success = await login(formData.email, formData.password);
    if (success) navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <CheckSquare size={48} style={styles.icon} />
        <h2 style={styles.title}>Task Manager</h2>
        <p style={styles.subtext}>
          {" "}
          <Link to="/register" style={styles.link}>
            create a new account
          </Link>
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>
              Email address
            </label>
            <div style={styles.inputWrapper}>
              <Mail size={20} />
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            {errors.email && <p style={styles.errorText}>{errors.email}</p>}
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <div style={styles.inputWrapper}>
              <Lock size={20} />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
              />
              <span
                style={styles.eye}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            {errors.password && (
              <p style={styles.errorText}>{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
