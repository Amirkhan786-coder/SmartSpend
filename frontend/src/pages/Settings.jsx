import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getSettings,
  updateSettings,
} from "../api";

function Settings() {
  const navigate = useNavigate();

  const userId =
    localStorage.getItem("userId") ||
    localStorage.getItem("user_id");

  const [settings, setSettings] = useState({
    name: "",
    email: "",
    notifications: true,
    darkMode: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const developer = {
    name: "Md Amir Khan",
    role: "Full Stack Developer",
    description: "Developer & Creator of SmartSpend",
    initials: "A",
    github: "https://github.com/Amirkhan786-coder",
    linkedin:
      "https://www.linkedin.com/in/md-amir-khan-91amir35khan/",
  };

  useEffect(() => {
    const loadSettings = async () => {
      if (!userId) {
        setLoading(false);
        setMessage("User ID not found. Please login again.");
        return;
      }

      try {
        const data = await getSettings(userId);

        if (data.success && data.settings) {
          const loadedSettings = {
            name: data.settings.name || "",
            email: data.settings.email || "",
            notifications:
              data.settings.notifications ?? true,
            darkMode:
              data.settings.darkMode ?? true,
          };

          setSettings(loadedSettings);

          updateLocalUser(
            loadedSettings.name,
            loadedSettings.email
          );
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        setMessage("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [userId]);

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setSettings((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const updateLocalUser = (
    newName,
    newEmail
  ) => {
    try {
      const cleanName =
        newName?.trim() || "";

      const cleanEmail =
        newEmail?.trim() || "";

      let user = {};

      const storedUser =
        localStorage.getItem("smartSpendUser");

      if (storedUser) {
        try {
          user = JSON.parse(storedUser);
        } catch (error) {
          console.error(
            "Invalid smartSpendUser:",
            error
          );

          user = {};
        }
      }

      const updatedUser = {
        ...user,
        userId:
          userId ||
          user.userId ||
          "",
        id:
          user.id ||
          userId ||
          "",
        name: cleanName,
        email: cleanEmail,
      };

      localStorage.setItem(
        "smartSpendUser",
        JSON.stringify(updatedUser)
      );

      localStorage.setItem(
        "userName",
        cleanName
      );

      localStorage.setItem(
        "userEmail",
        cleanEmail
      );

      if (userId) {
        localStorage.setItem(
          "userId",
          userId
        );

        localStorage.setItem(
          "user_id",
          userId
        );
      }

      window.dispatchEvent(
        new CustomEvent(
          "smartSpendUserUpdated",
          {
            detail: {
              userId,
              name: cleanName,
              email: cleanEmail,
            },
          }
        )
      );
    } catch (error) {
      console.error(
        "Failed to update local user:",
        error
      );
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage(
        "User ID not found. Please login again."
      );
      return;
    }

    const cleanName =
      settings.name.trim();

    const cleanEmail =
      settings.email.trim();

    if (!cleanName) {
      setMessage(
        "Name cannot be empty."
      );
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const data =
        await updateSettings(
          userId,
          {
            ...settings,
            name: cleanName,
            email: cleanEmail,
          }
        );

      if (data.success) {
        const savedSettings =
          data.settings || {
            ...settings,
            name: cleanName,
            email: cleanEmail,
          };

        const finalSettings = {
          name:
            savedSettings.name || "",
          email:
            savedSettings.email || "",
          notifications:
            savedSettings.notifications ??
            true,
          darkMode:
            savedSettings.darkMode ??
            true,
        };

        setSettings(finalSettings);

        updateLocalUser(
          finalSettings.name,
          finalSettings.email
        );

        localStorage.setItem(
          "smartSpendTheme",
          finalSettings.darkMode
            ? "dark"
            : "light"
        );

        setMessage(
          "Settings saved successfully"
        );
      } else {
        setMessage(
          data.message ||
            "Failed to save settings."
        );
      }
    } catch (error) {
      console.error(
        "Failed to save settings:",
        error
      );

      setMessage(
        "Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("user_id");
    localStorage.removeItem("smartSpendUser");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    navigate("/login", {
      replace: true,
    });
  };

  const openGitHub = () => {
    window.open(
      developer.github,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const openLinkedIn = () => {
    window.open(
      developer.linkedin,
      "_blank",
      "noopener,noreferrer"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}
      <header className="h-16 border-b border-slate-800">

        <div className="h-full px-6 flex items-center justify-between">

          <Link
            to="/dashboard"
            className="text-xl font-bold"
          >
            Smart
            <span className="text-emerald-400">
              Spend
            </span>
          </Link>

          <div className="flex items-center gap-4">

            {/* NOTIFICATION - KEPT */}
            <button
              type="button"
              className="w-9 h-9 rounded-lg hover:bg-slate-900 transition text-lg"
              title="Notifications"
            >
              🔔
            </button>

          </div>

        </div>

      </header>

      <div className="flex">

        {/* SIDEBAR */}
        <aside className="hidden md:block w-64 min-h-[calc(100vh-4rem)] border-r border-slate-800">

          <div className="p-4">

            <p className="px-3 mb-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              Main Menu
            </p>

            <Link
              to="/dashboard"
              className="flex items-center px-3 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition"
            >
              Dashboard
            </Link>

            <Link
              to="/expenses"
              className="flex items-center px-3 py-3 mt-1 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition"
            >
              Expenses
            </Link>

            <Link
              to="/budgets"
              className="flex items-center px-3 py-3 mt-1 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition"
            >
              Budgets
            </Link>

            <Link
              to="/analytics"
              className="flex items-center px-3 py-3 mt-1 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition"
            >
              Analytics
            </Link>

            <Link
              to="/ai-insights"
              className="flex items-center px-3 py-3 mt-1 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition"
            >
              AI Insights
            </Link>

            <div className="border-t border-slate-800 my-6" />

            <p className="px-3 mb-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              Account
            </p>

            <Link
              to="/settings"
              className="flex items-center px-3 py-3 rounded-xl bg-emerald-500/10 text-emerald-400"
            >
              Settings
            </Link>

            <Link
              to="/developer"
              className="flex items-center px-3 py-3 mt-1 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition"
            >
              Developer
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-3 mt-1 rounded-xl text-red-400 hover:bg-red-500/10 transition text-left cursor-pointer"
            >
              Logout
            </button>

          </div>

        </aside>

        {/* MAIN */}
        <main className="flex-1 p-6 md:p-8">

          <div className="mb-8">

            <p className="text-sm text-emerald-400 font-medium">
              Account Management
            </p>

            <h1 className="text-3xl md:text-4xl font-bold mt-2">
              Settings
            </h1>

            <p className="text-slate-400 mt-2">
              Manage your SmartSpend account preferences.
            </p>

          </div>

          {message && (
            <div
              className={`mb-6 px-4 py-3 rounded-xl border ${
                message.includes("successfully")
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}
            >
              {message}
            </div>
          )}

          {/* SETTINGS FORM */}
          <form
            onSubmit={handleSave}
            className="max-w-3xl space-y-6"
          >

            {/* PROFILE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <div className="mb-6">

                <h2 className="text-lg font-semibold">
                  Profile
                </h2>

                <p className="text-sm text-slate-500">
                  Update your personal information.
                </p>

              </div>

              <div className="space-y-5">

                <div>

                  <label className="block text-sm text-slate-300 mb-2">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={settings.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                  />

                </div>

                <div>

                  <label className="block text-sm text-slate-300 mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={settings.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                  />

                </div>

              </div>

            </div>

            {/* PREFERENCES */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <div className="mb-6">

                <h2 className="text-lg font-semibold">
                  Preferences
                </h2>

                <p className="text-sm text-slate-500">
                  Customize your SmartSpend experience.
                </p>

              </div>

              {/* NOTIFICATIONS */}
              <div className="flex items-center justify-between py-4 border-b border-slate-800">

                <div>

                  <p className="font-medium">
                    Notifications
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    Receive financial reminders and updates.
                  </p>

                </div>

                <label className="relative inline-flex items-center cursor-pointer">

                  <input
                    type="checkbox"
                    name="notifications"
                    checked={settings.notifications}
                    onChange={handleChange}
                    className="sr-only peer"
                  />

                  <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />

                </label>

              </div>

              {/* DARK MODE */}
              <div className="flex items-center justify-between py-4">

                <div>

                  <p className="font-medium">
                    Dark Mode
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    Use the dark appearance across SmartSpend.
                  </p>

                </div>

                <label className="relative inline-flex items-center cursor-pointer">

                  <input
                    type="checkbox"
                    name="darkMode"
                    checked={settings.darkMode}
                    onChange={handleChange}
                    className="sr-only peer"
                  />

                  <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />

                </label>

              </div>

            </div>

            {/* SAVE */}
            <div className="flex justify-end">

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </form>

          {/* DEVELOPER INFORMATION */}
          <section className="max-w-3xl mt-8">

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <div className="mb-6">

                <h2 className="text-lg font-semibold">
                  Developer Information
                </h2>

                <p className="text-sm text-slate-500">
                  About the developer and creator of SmartSpend.
                </p>

              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-slate-800">

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-2xl font-bold text-slate-950">
                  {developer.initials}
                </div>

                <div>

                  <h3 className="text-xl font-bold">
                    {developer.name}
                  </h3>

                  <p className="text-emerald-400 text-sm font-medium mt-1">
                    {developer.role}
                  </p>

                  <p className="text-slate-500 text-sm mt-2">
                    {developer.description}
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

                <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">

                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                    Project
                  </p>

                  <p className="font-semibold">
                    SmartSpend
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    Personal Finance Management Platform
                  </p>

                </div>

                <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">

                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                    Tech Stack
                  </p>

                  <p className="font-semibold">
                    MERN Stack
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    React • Node.js • Express • MongoDB
                  </p>

                </div>

              </div>

              <div className="mt-6">

                <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">
                  Key Features
                </p>

                <div className="flex flex-wrap gap-2">

                  {[
                    "Expense Tracking",
                    "Income Management",
                    "Budget Management",
                    "Analytics",
                    "AI Insights",
                    "Multi-Account Data",
                  ].map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium"
                    >
                      {feature}
                    </span>
                  ))}

                </div>

              </div>

              <div className="mt-6 pt-6 border-t border-slate-800">

                <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">
                  Developer Links
                </p>

                <div className="flex flex-col sm:flex-row gap-3">

                  <button
                    type="button"
                    onClick={openGitHub}
                    className="flex items-center justify-center px-5 py-3 rounded-xl bg-slate-950 border border-slate-700 hover:border-emerald-500 hover:text-emerald-400 transition cursor-pointer"
                  >
                    GitHub
                  </button>

                  <button
                    type="button"
                    onClick={openLinkedIn}
                    className="flex items-center justify-center px-5 py-3 rounded-xl bg-slate-950 border border-slate-700 hover:border-emerald-500 hover:text-emerald-400 transition cursor-pointer"
                  >
                    LinkedIn
                  </button>

                </div>

              </div>

              <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">

                <span className="text-xs text-slate-600">
                  SmartSpend
                </span>

                <span className="text-xs text-slate-600">
                  Personal Finance Platform
                </span>

              </div>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}

export default Settings;