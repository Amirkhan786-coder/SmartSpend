import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout, getCurrentUser } from "../utils/auth";

function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentUser = getCurrentUser();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("smartSpendTheme") !== "light";
  });

  const [userName, setUserName] = useState(
    currentUser?.name || "User"
  );

  // =========================
  // THEME
  // =========================

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", darkMode);
    root.classList.toggle("light", !darkMode);

    localStorage.setItem(
      "smartSpendTheme",
      darkMode ? "dark" : "light"
    );

    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("light-mode", !darkMode);
  }, [darkMode]);

  // =========================
  // USER NAME
  // =========================

  useEffect(() => {
    setUserName(currentUser?.name || "User");
  }, [currentUser?.name]);

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  // =========================
  // MAIN MENU
  // =========================

  const menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
    },
    {
      path: "/expenses",
      label: "Expenses",
    },
    {
      path: "/budgets",
      label: "Budgets",
    },
    {
      path: "/analytics",
      label: "Analytics",
    },
    {
      path: "/ai-insights",
      label: "AI Insights",
    },
  ];

  // =========================
  // ACCOUNT MENU
  // =========================

  const accountItems = [
    {
      path: "/settings",
      label: "Settings",
    },
    {
      path: "/developer",
      label: "About Developer",
    },
  ];

  // =========================
  // ACTIVE ROUTE
  // =========================

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#07111f] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* =========================
          HEADER
      ========================= */}

      <header
        className={`fixed top-0 left-0 right-0 z-50 h-16 border-b backdrop-blur-xl ${
          darkMode
            ? "bg-[#07111f]/90 border-slate-800"
            : "bg-white/90 border-slate-200"
        }`}
      >
        <div className="h-full px-4 md:px-6 flex items-center justify-between">

          {/* BRAND */}

          <Link
            to="/dashboard"
            className="flex items-center"
          >
            <div>
              <h1 className="text-lg font-bold leading-none">
                Smart
                <span className="text-emerald-500">
                  Spend
                </span>
              </h1>

              <p
                className={`text-[10px] uppercase tracking-[0.18em] mt-1 ${
                  darkMode
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                Personal Finance
              </p>
            </div>
          </Link>

          {/* RIGHT SIDE */}

          <div className="flex items-center gap-3">

            {/* THEME */}

            <button
              type="button"
              onClick={() =>
                setDarkMode((value) => !value)
              }
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition ${
                darkMode
                  ? "bg-slate-900 border-slate-700 hover:border-emerald-500"
                  : "bg-slate-100 border-slate-200 hover:border-emerald-500"
              }`}
              title={
                darkMode
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"
              }
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* NOTIFICATION */}

            <button
              type="button"
              className={`hidden sm:flex w-10 h-10 rounded-xl border items-center justify-center transition ${
                darkMode
                  ? "bg-slate-900 border-slate-700 hover:border-emerald-500"
                  : "bg-slate-100 border-slate-200 hover:border-emerald-500"
              }`}
              title="Notifications"
            >
              🔔
            </button>

            {/* USER */}

            <div className="flex items-center gap-3">

              <div className="hidden md:block text-right">

                <p className="text-sm font-semibold">
                  {userName}
                </p>

                <p
                  className={`text-xs ${
                    darkMode
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  Personal Account
                </p>

              </div>

              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 flex items-center justify-center font-bold">
                {userName?.charAt(0)?.toUpperCase() || "U"}
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside
        className={`fixed top-16 left-0 bottom-0 z-40 hidden md:flex w-64 flex-col border-r ${
          darkMode
            ? "bg-[#091525] border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >

        <div className="flex-1 overflow-y-auto p-4">

          {/* MAIN MENU */}

          <p
            className={`px-3 mb-3 text-[11px] uppercase tracking-[0.16em] font-semibold ${
              darkMode
                ? "text-slate-600"
                : "text-slate-400"
            }`}
          >
            Main Menu
          </p>

          <nav className="space-y-1">

            {menuItems.map((item) => {
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center px-3 py-3 rounded-xl transition-all ${
                    active
                      ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10"
                      : darkMode
                      ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span className="font-medium text-sm">
                    {item.label}
                  </span>

                  {active && (
                    <span className="ml-auto text-xs">
                      ●
                    </span>
                  )}
                </Link>
              );
            })}

          </nav>

          {/* DIVIDER */}

          <div
            className={`my-6 border-t ${
              darkMode
                ? "border-slate-800"
                : "border-slate-200"
            }`}
          />

          {/* ACCOUNT */}

          <p
            className={`px-3 mb-3 text-[11px] uppercase tracking-[0.16em] font-semibold ${
              darkMode
                ? "text-slate-600"
                : "text-slate-400"
            }`}
          >
            Account
          </p>

          <nav className="space-y-1">

            {accountItems.map((item) => {
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-3 rounded-xl transition ${
                    active
                      ? "bg-emerald-500/10 text-emerald-500"
                      : darkMode
                      ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="font-medium text-sm">
                    {item.label}
                  </span>
                </Link>
              );
            })}

            {/* LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              className={`w-full flex items-center px-3 py-3 rounded-xl transition text-left text-sm font-medium ${
                darkMode
                  ? "text-red-400 hover:bg-red-500/10"
                  : "text-red-500 hover:bg-red-50"
              }`}
            >
              Logout
            </button>

          </nav>

        </div>

      </aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="pt-16 md:pl-64">

        <div className="min-h-[calc(100vh-4rem)]">
          {children}
        </div>

      </main>

    </div>
  );
}

export default DashboardLayout;