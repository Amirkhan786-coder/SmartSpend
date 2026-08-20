import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log("LOGIN STATUS:", response.status);
      console.log("LOGIN RESPONSE:", data);

      if (!response.ok || !data.success) {
        setError(
          data.message || "Invalid email or password."
        );
        return;
      }

      // =====================================
      // GET USER
      // =====================================

      const user = data.user;

      if (!user) {
        setError("User data was not received.");
        return;
      }

      const userId = String(
        user.id || user._id || ""
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
      // SAVE USER DATA
      // =====================================

      localStorage.setItem(
        "userId",
        userId
      );

      localStorage.setItem(
        "smartSpendUser",
        JSON.stringify({
          ...user,
          id: userId,
        })
      );

      localStorage.setItem(
        "userName",
        user.name || ""
      );

      localStorage.setItem(
        "userEmail",
        user.email || ""
      );

      // =====================================
      // VERIFY
      // =====================================

      console.log(
        "SAVED userId:",
        localStorage.getItem("userId")
      );

      console.log(
        "SAVED smartSpendUser:",
        localStorage.getItem(
          "smartSpendUser"
        )
      );

      // =====================================
      // DASHBOARD
      // =====================================

      navigate("/dashboard");

    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      setError(
        "Backend connection failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-md">

        {/* LOGO */}

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

        {/* LOGIN CARD */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

          <h1 className="text-3xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="text-slate-400 mt-2 mb-8">
            Sign in to continue to your SmartSpend account.
          </p>

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
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
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
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* SIGN IN */}

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

          {/* SIGNUP */}

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

        {/* BACK */}

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