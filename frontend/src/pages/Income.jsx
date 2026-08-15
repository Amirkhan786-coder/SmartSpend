import { useState } from "react";
import { Link } from "react-router-dom";
import { useIncome } from "../context/IncomeContext";

const incomeIcons = {
  Salary: "💼",
  Freelance: "💻",
  Business: "🏢",
  Investment: "📈",
  Gift: "🎁",
  Other: "💵",
};

const incomeCategories = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Gift",
  "Other",
];

function Income() {
  const {
    income,
    addIncome,
    deleteIncome,
    totalIncome,
  } = useIncome();

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    source: "",
    amount: "",
    category: "Salary",
    date: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddIncome = (e) => {
    e.preventDefault();

    const amount = Number(form.amount);

    if (!form.source.trim() || !amount || amount <= 0) {
      return;
    }

    addIncome({
      source: form.source.trim(),
      amount,
      category: form.category,
      date: form.date,
      icon: incomeIcons[form.category] || "💵",
    });

    setForm({
      source: "",
      amount: "",
      category: "Salary",
      date: new Date().toISOString().split("T")[0],
    });

    setShowModal(false);
  };

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString("en-IN");
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* NAVBAR */}
      <header className="h-16 border-b border-slate-800">
        <div className="h-full px-6 flex items-center justify-between">

          <Link
            to="/dashboard"
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
              💰
            </div>

            <span className="text-xl font-bold">
              Smart
              <span className="text-emerald-400">
                Spend
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-4">

            <span className="text-xl">
              🔔
            </span>

            <div className="w-9 h-9 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              A
            </div>

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
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              🏠
              <span>Dashboard</span>
            </Link>

            <Link
              to="/income"
              className="flex items-center gap-3 px-3 py-3 mt-1 rounded-xl bg-emerald-500/10 text-emerald-400"
            >
              💵
              <span className="font-medium">
                Income
              </span>
            </Link>

            <Link
              to="/expenses"
              className="flex items-center gap-3 px-3 py-3 mt-1 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              💳
              <span>Expenses</span>
            </Link>

            <Link
              to="/analytics"
              className="flex items-center gap-3 px-3 py-3 mt-1 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              📊
              <span>Analytics</span>
            </Link>

            <Link
              to="/budgets"
              className="flex items-center gap-3 px-3 py-3 mt-1 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              💰
              <span>Budgets</span>
            </Link>

            <Link
              to="/ai-insights"
              className="flex items-center gap-3 px-3 py-3 mt-1 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              🤖
              <span>AI Insights</span>
            </Link>

            <div className="border-t border-slate-800 my-6"></div>

            <Link
              to="/settings"
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              ⚙️
              <span>Settings</span>
            </Link>

            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-3 mt-1 rounded-xl text-red-400 hover:bg-red-500/10"
            >
              🚪
              <span>Logout</span>
            </Link>

          </div>

        </aside>

        {/* MAIN */}
        <main className="flex-1 p-6 md:p-8">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

            <div>

              <p className="text-sm text-emerald-400 font-medium">
                Financial Management
              </p>

              <h1 className="text-3xl md:text-4xl font-bold mt-2">
                Income
              </h1>

              <p className="text-slate-400 mt-2">
                Track and manage your income sources.
              </p>

            </div>

            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition"
            >
              + Add Income
            </button>

          </div>

          {/* SUMMARY */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

              <p className="text-sm text-slate-400">
                Total Income
              </p>

              <h2 className="text-2xl font-bold mt-2 text-emerald-400">
                ₹{formatMoney(totalIncome)}
              </h2>

            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

              <p className="text-sm text-slate-400">
                Transactions
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {income.length}
              </h2>

            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

              <p className="text-sm text-slate-400">
                Average Income
              </p>

              <h2 className="text-2xl font-bold mt-2">
                ₹
                {formatMoney(
                  income.length
                    ? Math.round(
                        totalIncome / income.length
                      )
                    : 0
                )}
              </h2>

            </div>

          </div>

          {/* INCOME LIST */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

            <div className="p-6 border-b border-slate-800">

              <h2 className="text-lg font-semibold">
                Income History
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Your recorded income transactions.
              </p>

            </div>

            {income.length === 0 ? (

              <div className="p-12 text-center">

                <div className="text-5xl mb-4">
                  💵
                </div>

                <h3 className="text-lg font-semibold">
                  No income recorded
                </h3>

                <p className="text-slate-500 mt-2">
                  Add your first income transaction.
                </p>

                <button
                  onClick={() => setShowModal(true)}
                  className="mt-5 px-5 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold"
                >
                  + Add Income
                </button>

              </div>

            ) : (

              <div className="divide-y divide-slate-800">

                {income.map((item) => (

                  <div
                    key={item._id || item.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition"
                  >

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-xl">
                        {item.icon ||
                          incomeIcons[item.category] ||
                          "💵"}
                      </div>

                      <div>

                        <h3 className="font-medium">
                          {item.source}
                        </h3>

                        <div className="flex items-center gap-2 mt-1">

                          <span className="text-xs px-2 py-1 rounded-md bg-slate-800 text-slate-400">
                            {item.category || "Other"}
                          </span>

                          <span className="text-xs text-slate-500">
                            {formatDate(item.date)}
                          </span>

                        </div>

                      </div>

                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5">

                      <span className="font-semibold text-emerald-400">
                        +₹{formatMoney(item.amount)}
                      </span>

                      <button
                        onClick={() =>
                          deleteIncome(
                            item._id || item.id
                          )
                        }
                        className="w-9 h-9 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                        title="Delete income"
                      >
                        🗑️
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </main>

      </div>

      {/* ADD INCOME MODAL */}
      {showModal && (

        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-5">

          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-xl font-bold">
                  Add Income
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Record salary or another income source.
                </p>

              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>

            </div>

            <form onSubmit={handleAddIncome}>

              {/* SOURCE */}
              <div className="mb-4">

                <label className="block text-sm text-slate-300 mb-2">
                  Income Source
                </label>

                <input
                  name="source"
                  value={form.source}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Monthly Salary"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                />

              </div>

              {/* AMOUNT */}
              <div className="mb-4">

                <label className="block text-sm text-slate-300 mb-2">
                  Amount
                </label>

                <input
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  type="number"
                  min="1"
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                />

              </div>

              {/* CATEGORY */}
              <div className="mb-4">

                <label className="block text-sm text-slate-300 mb-2">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 outline-none focus:border-emerald-500"
                >

                  {incomeCategories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {incomeIcons[category]}{" "}
                      {category}
                    </option>
                  ))}

                </select>

              </div>

              {/* DATE */}
              <div className="mb-6">

                <label className="block text-sm text-slate-300 mb-2">
                  Date
                </label>

                <input
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  type="date"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-emerald-500"
                />

              </div>

              {/* BUTTONS */}
              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition"
                >
                  Add Income
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Income;