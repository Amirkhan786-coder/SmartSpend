import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// =====================================
// PRODUCTION BACKEND API
// =====================================

const API_URL =
  "https://smartspend-backend-b8h9.onrender.com/api";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
  // HANDLE LOGIN
  // =====================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    // =====================================
    // VALIDATION
    // =====================================

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const loginURL = `${API_URL}/auth/login`;

      console.log("LOGIN API:", loginURL);

      const response = await fetch(loginURL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      // =====================================
      // SAFE RESPONSE PARSING
      // =====================================

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log("LOGIN STATUS:", response.status);
      console.log("LOGIN RESPONSE:", data);

      // =====================================
      // BACKEND ERROR
      // =====================================

      if (!response.ok) {
        setError(
          data.message ||
            data.error ||
            `Login failed (${response.status}).`
        );

        return;
      }

      // =====================================
      // SUCCESS CHECK
      // =====================================

      if (!data.success) {
        setError(
          data.message ||
            "Invalid email or password."
        );

        return;
      }

      // =====================================
      // GET USER
      // =====================================

      const user = data.user;

      if (!user) {
        setError(
          "Login successful but user data was not received."
        );

        return;
      }

      // =====================================
      // GET USER ID
      // =====================================

      const userId = String(
        user.id ||
          user._id ||
          ""
      );

      if (!userId) {
        console.error("USER ID MISSING:", user);

        setError(
          "Login successful but User ID is missing."
        );

        return;
      }

      console.log("USER ID:", userId);

      // =====================================
      // SAVE USER ID
      // =====================================

      localStorage.setItem(
        "userId",
        userId
      );

      // =====================================
      // SAVE USER OBJECT
      // =====================================

      localStorage.setItem(
        "smartSpendUser",
        JSON.stringify({
          ...user,
          id: userId,
        })
      );

      // =====================================
      // SAVE USER NAME
      // =====================================

      localStorage.setItem(
        "userName",
        user.name || ""
      );

      // =====================================
      // SAVE USER EMAIL
      // =====================================

      localStorage.setItem(
        "userEmail",
        user.email || ""
      );

      // =====================================
      // BACKWARD COMPATIBILITY
      // =====================================

      localStorage.setItem(
        "user_id",
        userId
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          id: userId,
        })
      );

      // =====================================
      // VERIFY LOCAL STORAGE
      // =====================================

      console.log(
        "SAVED userId:",
        localStorage.getItem("userId")
      );

      console.log(
        "SAVED smartSpendUser:",
        localStorage.getItem("smartSpendUser")
      );

      console.log(
        "SAVED userName:",
        localStorage.getItem("userName")
      );

      // =====================================
      // GO TO DASHBOARD
      // =====================================

      navigate("/dashboard");

    } catch (error) {
      console.error("LOGIN ERROR:", error);

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
            LOGIN CARD
        ===================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

          {/* HEADING */}

          <div className="mb-8">

            <h1 className="text-3xl font-bold text-white">
              Welcome Back
            </h1>

            <p className="text-slate-400 mt-2">
              Sign in to continue to your SmartSpend account.
            </p>

          </div>

          {/* =====================================
              LOGIN FORM
          ===================================== */}

          <form onSubmit={handleLogin}>

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
                  placeholder="Enter your password"
                  autoComplete="current-password"
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

            {/* =====================================
                ERROR
            ===================================== */}

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* =====================================
                SIGN IN BUTTON
            ===================================== */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>

          </form>

          {/* =====================================
              SIGNUP
          ===================================== */}

          <p className="text-center text-sm text-slate-400 mt-7">

            Don't have an account?{" "}

            <Link
              to="/signup"
              className="text-emerald-400 font-medium hover:text-emerald-300 transition"
            >
              Create account
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

export default Login;