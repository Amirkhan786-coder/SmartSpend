import { Link, useNavigate } from "react-router-dom";

function Developer() {
  const navigate = useNavigate();

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
              className="flex items-center px-3 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition"
            >
              Settings
            </Link>

            <Link
              to="/developer"
              className="flex items-center px-3 py-3 mt-1 rounded-xl bg-emerald-500/10 text-emerald-400"
            >
              <span className="font-medium">
                Developer
              </span>
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

          <div className="max-w-4xl">

            {/* PAGE HEADER */}
            <div className="mb-8">

              <p className="text-sm text-emerald-400 font-medium">
                SmartSpend
              </p>

              <h1 className="text-3xl md:text-4xl font-bold mt-2">
                Developer
              </h1>

              <p className="text-slate-400 mt-2">
                About the developer behind SmartSpend.
              </p>

            </div>

            {/* DEVELOPER PROFILE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">

              <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-8 border-b border-slate-800">

                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-3xl font-bold text-slate-950 shadow-lg">
                  AK
                </div>

                <div>

                  <h2 className="text-2xl md:text-3xl font-bold">
                    Md Amir Khan
                  </h2>

                  <p className="text-emerald-400 font-medium mt-2">
                    Full Stack Developer
                  </p>

                  <p className="text-slate-400 mt-2">
                    B.Tech — Computer Science & Engineering
                  </p>

                  <p className="text-slate-500 text-sm mt-1">
                    Shobhit Deemed to be University
                  </p>

                </div>

              </div>

              {/* ABOUT */}
              <div className="mt-8">

                <h3 className="text-lg font-semibold">
                  About the Developer
                </h3>

                <p className="text-slate-400 leading-7 mt-3">
                  I am Md Amir Khan, a Computer Science &
                  Engineering student and Full Stack Developer
                  focused on building practical, modern and
                  user-friendly technology solutions.
                </p>

                <p className="text-slate-400 leading-7 mt-3">
                  SmartSpend is a personal finance management
                  platform developed to help users track
                  expenses, manage income, set budgets and
                  understand their financial activity.
                </p>

              </div>

              {/* SKILLS */}
              <div className="mt-8">

                <h3 className="text-lg font-semibold mb-4">
                  Technical Skills
                </h3>

                <div className="flex flex-wrap gap-2">

                  {[
                    "C",
                    "C++",
                    "Java",
                    "Python",
                    "JavaScript",
                    "React",
                    "Node.js",
                    "Express",
                    "MongoDB",
                    "SQL",
                    "Git",
                    "GitHub",
                    "AI / ML",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}

                </div>

              </div>

              {/* SMARTSPEND */}
              <div className="mt-8">

                <h3 className="text-lg font-semibold mb-4">
                  SmartSpend
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="rounded-xl bg-slate-950 border border-slate-800 p-5">

                    <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                      Project
                    </p>

                    <p className="font-semibold text-lg">
                      SmartSpend
                    </p>

                    <p className="text-sm text-slate-500 mt-2">
                      Personal Finance Management Platform
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-950 border border-slate-800 p-5">

                    <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                      Technology
                    </p>

                    <p className="font-semibold text-lg">
                      MERN Stack
                    </p>

                    <p className="text-sm text-slate-500 mt-2">
                      React • Node.js • Express • MongoDB
                    </p>

                  </div>

                </div>

              </div>

              {/* FEATURES */}
              <div className="mt-8">

                <h3 className="text-lg font-semibold mb-4">
                  SmartSpend Features
                </h3>

                <div className="flex flex-wrap gap-2">

                  {[
                    "Expense Tracking",
                    "Income Management",
                    "Budget Management",
                    "Financial Analytics",
                    "AI Insights",
                    "Multi-Account Data",
                  ].map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-sm"
                    >
                      {feature}
                    </span>
                  ))}

                </div>

              </div>

              {/* LINKS */}
              <div className="mt-8 pt-8 border-t border-slate-800">

                <h3 className="text-lg font-semibold mb-4">
                  Developer Links
                </h3>

                <div className="flex flex-col sm:flex-row gap-3">

                  <a
                    href="https://github.com/Amirkhan786-coder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-5 py-3 rounded-xl bg-slate-950 border border-slate-700 hover:border-emerald-500 hover:text-emerald-400 transition cursor-pointer"
                  >
                    GitHub
                  </a>

                  <a
                    href="https://www.linkedin.com/in/md-amir-khan-91amir35khan/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-5 py-3 rounded-xl bg-slate-950 border border-slate-700 hover:border-emerald-500 hover:text-emerald-400 transition cursor-pointer"
                  >
                    LinkedIn
                  </a>

                </div>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Developer;