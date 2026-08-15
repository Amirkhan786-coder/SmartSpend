import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================
  // HANDLE SIGNUP
  // =========================

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

    // =========================
    // VALIDATION
    // =========================

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

      const response = await fetch(
        "http://localhost:5000/api/auth/signup",
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

      // =========================
      // SAFE RESPONSE PARSING
      // =========================

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log("Signup Status:", response.status);
      console.log("Signup Response:", data);

      // =========================
      // BACKEND ERROR
      // =========================

      if (!response.ok) {
        setError(
          data.message ||
            data.error ||
            "Failed to create account."
        );
        return;
      }

      // =========================
      // SUCCESS
      // =========================
      //
      // Backend agar success:true bheje
      // ya sirf user/message bheje,
      // dono cases mein signup successful maana jayega.
      //

      setMessage(
        data.message ||
          "Account created successfully! Redirecting to login..."
      );

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setAgreeTerms(false);

      // Redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Signup Error:", error);

      setError(
        "Unable to connect to server. Make sure backend is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        {/* =========================
            LOGO
        ========================= */}

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

        {/* =========================
            SIGNUP CARD
        ========================= */}

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

          <form onSubmit={handleSignup}>

            {/* =========================
                NAME
            ========================= */}

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
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
              />
            </div>

            {/* =========================
                EMAIL
            ========================= */}

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
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
              />
            </div>

            {/* =========================
                PASSWORD
            ========================= */}

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
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>
            </div>

            {/* =========================
                CONFIRM PASSWORD
            ========================= */}

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
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
              />
            </div>

            {/* =========================
                TERMS
            ========================= */}

            <div className="flex items-start gap-2 mb-6">

              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) =>
                  setAgreeTerms(
                    e.target.checked
                  )
                }
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

            {/* =========================
                ERROR
            ========================= */}

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* =========================
                SUCCESS
            ========================= */}

            {message && (
              <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                {message}
              </div>
            )}

            {/* =========================
                CREATE ACCOUNT
            ========================= */}

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

          {/* =========================
              LOGIN
          ========================= */}

          <p className="text-center text-sm text-slate-400 mt-7">
            Already have an account?{" "}

            <Link
              to="/login"
              className="text-emerald-400 font-medium hover:text-emerald-300"
            >
              Sign in
            </Link>
          </p>

        </div>

        {/* =========================
            BACK
        ========================= */}

        <p className="text-center mt-6">

          <Link
            to="/"
            className="text-sm text-slate-500 hover:text-slate-300"
          >
            ← Back to SmartSpend
          </Link>

        </p>

      </div>
    </div>
  );
}

export default Signup;