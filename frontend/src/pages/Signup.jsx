import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// =====================================
// PRODUCTION BACKEND API
// =====================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://smartspend-backend-b8h9.onrender.com/api";

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================
  // HANDLE INPUT
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =====================================
  // HANDLE SIGNUP
  // =====================================

  const handleSignup = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const {
      name,
      email,
      password,
      confirmPassword,
    } = formData;

    // =====================================
    // VALIDATION
    // =====================================

    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setError(
        "Please agree to the Terms & Conditions."
      );
      return;
    }

    try {
      setLoading(true);

      // =====================================
      // SIGNUP API REQUEST
      // =====================================

      console.log(
        "SIGNUP API:",
        `${API_URL}/auth/signup`
      );

      const response = await fetch(
        `${API_URL}/auth/signup`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      // =====================================
      // SAFE RESPONSE PARSING
      // =====================================

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log(
        "SIGNUP STATUS:",
        response.status
      );

      console.log(
        "SIGNUP RESPONSE:",
        data
      );

      // =====================================
      // BACKEND ERROR
      // =====================================

      if (!response.ok) {
        setError(
          data.message ||
            data.error ||
            `Failed to create account (${response.status}).`
        );

        return;
      }

      // =====================================
      // SUCCESS
      // =====================================

      setMessage(
        data.message ||
          "Account created successfully! Redirecting to login..."
      );

      // =====================================
      // CLEAR FORM
      // =====================================

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setAgreeTerms(false);

      // =====================================
      // REDIRECT TO LOGIN
      // =====================================

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
      console.error(
        "SIGNUP ERROR:",
        error
      );

      setError(
        "Unable to connect to SmartSpend server. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-md">

        {/* =====================================
            LOGO
        ===================================== */}

        <div className="text-center mb-8">

          <Link
            to="/"
            className="inline-flex items-center gap-2"
          >

            <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center text-xl">
              💰
            </div>

            <span className="text-2xl font-bold text-white">
              Smart
              <span className="text-emerald-400">
                Spend
              </span>
            </span>

          </Link>

        </div>

        {/* =====================================
            SIGNUP CARD
        ===================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

          {/* HEADING */}

          <div className="mb-8">

            <h1 className="text-3xl font-bold text-white">
              Create Account
            </h1>

            <p className="text-slate-400 mt-2">
              Start managing your finances with SmartSpend.
            </p>

          </div>

          {/* =====================================
              SIGNUP FORM
          ===================================== */}

          <form onSubmit={handleSignup}>

            {/* NAME */}

            <div className="mb-5">

              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition disabled:opacity-60"
              />

            </div>

            {/* EMAIL */}

            <div className="mb-5">

              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition disabled:opacity-60"
              />

            </div>

            {/* PASSWORD */}

            <div className="mb-5">

              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition disabled:opacity-50"
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="mb-6">

              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition disabled:opacity-60"
              />

            </div>

            {/* TERMS */}

            <div className="flex items-start gap-2 mb-6">

              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) =>
                  setAgreeTerms(
                    e.target.checked
                  )
                }
                disabled={loading}
                className="w-4 h-4 mt-1 accent-emerald-500"
              />

              <p className="text-sm text-slate-400">
                I agree to the{" "}

                <span className="text-emerald-400">
                  Terms & Conditions
                </span>{" "}

                and Privacy Policy.
              </p>

            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* SUCCESS */}

            {message && (
              <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                {message}
              </div>
            )}

            {/* CREATE ACCOUNT */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          {/* =====================================
              LOGIN
          ===================================== */}

          <p className="text-center text-sm text-slate-400 mt-7">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-emerald-400 font-medium hover:text-emerald-300 transition"
            >
              Sign in
            </Link>

          </p>

        </div>

        {/* =====================================
            BACK
        ===================================== */}

        <p className="text-center mt-6">

          <Link
            to="/"
            className="text-sm text-slate-500 hover:text-slate-300 transition"
          >
            ← Back to SmartSpend
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Signup;