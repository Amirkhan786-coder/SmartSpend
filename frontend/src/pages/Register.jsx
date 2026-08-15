import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const {
      name,
      email,
      password,
      confirmPassword,
    } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
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

      const data = await response.json();

      console.log("Signup Response:", data);

      if (!response.ok || !data.success) {
        setError(
          data.message || "Failed to create account."
        );
        return;
      }

      // Save registered user locally
      localStorage.setItem(
        "smartspend_user",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "smartspend_registered",
        "true"
      );

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Signup Error:", error);

      setError(
        "Unable to connect to server. Make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-5 py-10">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">

          <Link
            to="/"
            className="inline-flex items-center gap-2"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center text-xl">
              💰
            </div>

            <span className="text-2xl font-bold">
              Smart
              <span className="text-emerald-400">
                Spend
              </span>
            </span>
          </Link>

          <h1 className="text-3xl font-bold mt-8">
            Create Account
          </h1>

          <p className="text-slate-400 mt-2">
            Start managing your money smarter.
          </p>

        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">

          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div className="mb-5">

              <label className="block text-sm text-slate-300 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                autoComplete="name"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
              />

            </div>

            {/* Email */}
            <div className="mb-5">

              <label className="block text-sm text-slate-300 mb-2">
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

            {/* Password */}
            <div className="mb-5">

              <label className="block text-sm text-slate-300 mb-2">
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
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>

              </div>

            </div>

            {/* Confirm Password */}
            <div className="mb-5">

              <label className="block text-sm text-slate-300 mb-2">
                Confirm Password
              </label>

              <div className="relative">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                ✅ {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          {/* Login */}
          <div className="mt-6 text-center">

            <p className="text-sm text-slate-500">
              Already have an account?
            </p>

            <Link
              to="/"
              className="inline-block mt-2 text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Login here →
            </Link>

          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-6">
          Your account is securely managed by SmartSpend.
        </p>

      </div>

    </div>
  );
}

export default Register;