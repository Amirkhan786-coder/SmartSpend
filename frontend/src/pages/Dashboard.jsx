import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useExpenses } from "../context/ExpenseContext";
import { useIncome } from "../context/IncomeContext";
import { getCurrentUser } from "../utils/auth";

function Dashboard() {
  const { expenses, totalExpenses } = useExpenses();

  const {
    income,
    addIncome,
    deleteIncome,
    totalIncome,
  } = useIncome();

  const currentUser = getCurrentUser();

  const [darkMode, setDarkMode] = useState(
    () =>
      localStorage.getItem("smartSpendTheme") !== "light"
  );

  const [showIncomeModal, setShowIncomeModal] =
    useState(false);

  const [showIncomeList, setShowIncomeList] =
    useState(false);

  const [userName, setUserName] = useState(
    currentUser?.name || "User"
  );

  // =====================================================
  // THEME SYNC
  // =====================================================

  useEffect(() => {
    const syncTheme = () => {
      setDarkMode(
        localStorage.getItem("smartSpendTheme") !== "light"
      );
    };

    syncTheme();

    window.addEventListener("storage", syncTheme);

    const interval = setInterval(syncTheme, 200);

    return () => {
      window.removeEventListener("storage", syncTheme);
      clearInterval(interval);
    };
  }, []);

  // =====================================================
  // USER SETTINGS
  // =====================================================

  useEffect(() => {
    const fetchUserSettings = async () => {
      const userId = localStorage.getItem("userId");

      // If no user ID, use logged-in user's stored name
      if (!userId) {
        setUserName(currentUser?.name || "User");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/settings/${encodeURIComponent(
            userId
          )}`
        );

        const data = await response.json();

        if (
          response.ok &&
          data.success &&
          data.settings
        ) {
          setUserName(
            data.settings.name ||
              currentUser?.name ||
              "User"
          );
        } else {
          setUserName(
            currentUser?.name || "User"
          );
        }
      } catch (error) {
        console.error(
          "Failed to fetch user settings:",
          error
        );

        setUserName(
          currentUser?.name || "User"
        );
      }
    };

    fetchUserSettings();
  }, [currentUser?.name]);

  // =====================================================
  // INCOME FORM
  // =====================================================

  const [incomeForm, setIncomeForm] = useState({
    title: "",
    amount: "",
    source: "Salary",
    date: new Date()
      .toISOString()
      .split("T")[0],
  });

  // =====================================================
  // CALCULATIONS
  // =====================================================

  const balance = totalIncome - totalExpenses;

  const remainingPercentage =
    totalIncome > 0
      ? Math.max(
          0,
          Math.min(
            100,
            (balance / totalIncome) * 100
          )
        )
      : 0;

  // =====================================================
  // RECENT EXPENSES
  // =====================================================

  const recentExpenses = useMemo(() => {
    return expenses.slice(0, 5);
  }, [expenses]);

  // =====================================================
  // CATEGORY DATA
  // =====================================================

  const categoryData = useMemo(() => {
    const categories = {};

    expenses.forEach((expense) => {
      const category =
        expense.category || "Other";

      categories[category] =
        (categories[category] || 0) +
        Number(expense.amount || 0);
    });

    return Object.entries(categories)
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  const highestCategory = categoryData[0];

  // =====================================================
  // HELPERS
  // =====================================================

  const formatCurrency = (amount) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getCategoryIcon = (category) => {
    const value = String(
      category || ""
    ).toLowerCase();

    if (value.includes("food")) return "🍔";
    if (value.includes("education")) return "📚";
    if (value.includes("shopping")) return "🛒";
    if (value.includes("transport")) return "🚌";
    if (value.includes("travel")) return "🚌";
    if (value.includes("health")) return "💊";
    if (value.includes("bill")) return "💡";
    if (value.includes("entertainment"))
      return "🎬";

    return "📦";
  };

  // =====================================================
  // INCOME FORM CHANGE
  // =====================================================

  const handleIncomeChange = (e) => {
    const { name, value } = e.target;

    setIncomeForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =====================================================
  // ADD INCOME
  // =====================================================

  const handleAddIncome = async (e) => {
    e.preventDefault();

    if (
      !incomeForm.title.trim() ||
      !incomeForm.amount ||
      Number(incomeForm.amount) <= 0 ||
      !incomeForm.source ||
      !incomeForm.date
    ) {
      return;
    }

    try {
      const result = await addIncome({
        title: incomeForm.title.trim(),
        amount: Number(incomeForm.amount),
        source: incomeForm.source,
        date: incomeForm.date,
      });

      if (result?.success) {
        setIncomeForm({
          title: "",
          amount: "",
          source: "Salary",
          date: new Date()
            .toISOString()
            .split("T")[0],
        });

        setShowIncomeModal(false);
      }
    } catch (error) {
      console.error(
        "Add income failed:",
        error
      );
    }
  };

  // =====================================================
  // DELETE INCOME
  // =====================================================

  const handleDeleteIncome = async (id) => {
    if (!id) return;

    try {
      await deleteIncome(id);
    } catch (error) {
      console.error(
        "Delete income failed:",
        error
      );
    }
  };

  // =====================================================
  // THEME CLASSES
  // =====================================================

  const pageBg = darkMode
    ? "bg-[#07111f] text-white"
    : "bg-slate-50 text-slate-900";

  const cardBg = darkMode
    ? "bg-slate-900 border-slate-800"
    : "bg-white border-slate-200";

  const cardText = darkMode
    ? "text-white"
    : "text-slate-900";

  const secondaryText = darkMode
    ? "text-slate-400"
    : "text-slate-600";

  const mutedText = darkMode
    ? "text-slate-500"
    : "text-slate-500";

  const subtleBg = darkMode
    ? "bg-slate-800"
    : "bg-slate-100";

  const progressBg = darkMode
    ? "bg-slate-800"
    : "bg-slate-200";

  const divider = darkMode
    ? "border-slate-800"
    : "border-slate-200";

  const inputBg = darkMode
    ? "bg-slate-950"
    : "bg-white";

  const inputBorder = darkMode
    ? "border-slate-700"
    : "border-slate-300";

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main
      className={`min-h-[calc(100vh-4rem)] transition-colors duration-300 ${pageBg}`}
    >
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}

          <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-500">
                  Financial Overview
                </p>
              </div>

              <h1
                className={`text-3xl sm:text-4xl font-bold tracking-tight ${cardText}`}
              >
                Good evening{" "}
                <span className="text-emerald-500">
                  {userName}
                </span>{" "}
                👋
              </h1>

              <p
                className={`mt-2 ${secondaryText}`}
              >
                Here's what's happening with your money today.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  setShowIncomeModal(true)
                }
                className={`px-4 py-3 rounded-xl border transition font-medium ${
                  darkMode
                    ? "border-slate-700 bg-slate-900 text-white hover:border-emerald-500/50 hover:bg-slate-800"
                    : "border-slate-200 bg-white text-slate-900 hover:border-emerald-500/50 hover:bg-slate-50"
                }`}
              >
                <span className="text-emerald-500">
                  +
                </span>{" "}
                Add Income
              </button>

              <Link
                to="/expenses"
                className="px-4 py-3 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition font-semibold"
              >
                + Add Expense
              </Link>
            </div>
          </section>

          {/* SUMMARY CARDS */}

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

            {/* BALANCE */}

            <div
              className={`relative overflow-hidden rounded-2xl border p-6 transition-colors duration-300 ${
                darkMode
                  ? "border-emerald-500/20 bg-gradient-to-br from-emerald-500/15 via-slate-900 to-slate-900"
                  : "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white"
              }`}
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      💰
                    </div>

                    <p
                      className={`text-sm ${secondaryText}`}
                    >
                      Available Balance
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-emerald-500">
                    {Math.round(
                      remainingPercentage
                    )}
                    %
                  </span>
                </div>

                <h2
                  className={`text-3xl font-bold mt-5 ${cardText}`}
                >
                  {formatCurrency(balance)}
                </h2>

                <div className="mt-5">
                  <div className="flex justify-between text-xs mb-2">
                    <span className={mutedText}>
                      Income remaining
                    </span>

                    <span className={secondaryText}>
                      {Math.round(
                        remainingPercentage
                      )}
                      %
                    </span>
                  </div>

                  <div
                    className={`h-2 rounded-full overflow-hidden ${progressBg}`}
                  >
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                      style={{
                        width: `${remainingPercentage}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* INCOME */}

            <div
              className={`rounded-2xl border p-6 hover:border-emerald-500/20 transition ${cardBg}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    📈
                  </div>

                  <p
                    className={`text-sm ${secondaryText}`}
                  >
                    Total Income
                  </p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-lg ${
                    darkMode
                      ? "bg-slate-800 text-slate-500"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  This month
                </span>
              </div>

              <h2
                className={`text-3xl font-bold mt-5 ${cardText}`}
              >
                {formatCurrency(totalIncome)}
              </h2>

              <button
                type="button"
                onClick={() =>
                  setShowIncomeList(true)
                }
                className="text-sm text-emerald-500 hover:text-emerald-400 mt-4 transition"
              >
                View income →
              </button>
            </div>

            {/* EXPENSE */}

            <div
              className={`rounded-2xl border p-6 hover:border-red-500/20 transition ${cardBg}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                    💸
                  </div>

                  <p
                    className={`text-sm ${secondaryText}`}
                  >
                    Total Expenses
                  </p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-lg ${
                    darkMode
                      ? "bg-slate-800 text-slate-500"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  This month
                </span>
              </div>

              <h2
                className={`text-3xl font-bold mt-5 ${cardText}`}
              >
                {formatCurrency(totalExpenses)}
              </h2>

              <Link
                to="/expenses"
                className="inline-block text-sm text-red-500 hover:text-red-400 mt-4 transition"
              >
                Manage expenses →
              </Link>
            </div>
          </section>

          {/* SPENDING + AI INSIGHT */}

          <section className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-6">

            {/* SPENDING OVERVIEW */}

            <div
              className={`xl:col-span-3 rounded-2xl border overflow-hidden ${cardBg}`}
            >
              <div
                className={`p-6 border-b flex items-center justify-between ${divider}`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      📊
                    </div>

                    <h2
                      className={`font-semibold ${cardText}`}
                    >
                      Spending Overview
                    </h2>
                  </div>

                  <p
                    className={`text-xs mt-2 ${mutedText}`}
                  >
                    Categories · Where your money is going
                  </p>
                </div>

                <Link
                  to="/analytics"
                  className="text-sm text-emerald-500 hover:text-emerald-400"
                >
                  Analytics →
                </Link>
              </div>

              <div className="p-6">
                {categoryData.length === 0 ? (
                  <div className="py-10 text-center">
                    <div className="text-4xl mb-3">
                      📊
                    </div>

                    <p className={mutedText}>
                      No spending data yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-7">
                    {categoryData
                      .slice(0, 5)
                      .map((item) => {
                        const percentage =
                          totalExpenses > 0
                            ? (item.amount /
                                totalExpenses) *
                              100
                            : 0;

                        const icon =
                          getCategoryIcon(
                            item.category
                          );

                        return (
                          <div
                            key={item.category}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${subtleBg}`}
                                >
                                  {icon}
                                </div>

                                <div>
                                  <p
                                    className={`text-sm font-medium ${cardText}`}
                                  >
                                    {item.category}
                                  </p>

                                  <p
                                    className={`text-xs ${mutedText}`}
                                  >
                                    {percentage.toFixed(
                                      1
                                    )}
                                    % of total
                                  </p>
                                </div>
                              </div>

                              <p
                                className={`font-semibold ${cardText}`}
                              >
                                {formatCurrency(
                                  item.amount
                                )}
                              </p>
                            </div>

                            <div
                              className={`h-2.5 rounded-full overflow-hidden ${progressBg}`}
                            >
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>

            {/* AI INSIGHT */}

            <div
              className={`xl:col-span-2 relative overflow-hidden rounded-2xl border transition-colors duration-300 ${
                darkMode
                  ? "border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-slate-900 to-slate-900"
                  : "border-purple-200 bg-gradient-to-br from-purple-50 via-white to-white"
              }`}
            >
              <div className="absolute -right-16 -top-16 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />

              <div className="relative p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center text-xl">
                      🤖
                    </div>

                    <div>
                      <p
                        className={`font-semibold ${cardText}`}
                      >
                        AI Insight
                      </p>

                      <p
                        className={`text-xs ${mutedText}`}
                      >
                        Personalized analysis
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                    Smart
                  </span>
                </div>

                {highestCategory ? (
                  <>
                    <div
                      className={`p-4 rounded-xl border transition ${
                        darkMode
                          ? "bg-slate-950/70 border-slate-800"
                          : "bg-white border-purple-100"
                      }`}
                    >
                      <p
                        className={`text-xs uppercase tracking-wider ${mutedText}`}
                      >
                        🎯 Highest spending
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {getCategoryIcon(
                              highestCategory.category
                            )}
                          </span>

                          <div>
                            <p
                              className={`font-semibold ${cardText}`}
                            >
                              {
                                highestCategory.category
                              }
                            </p>

                            <p
                              className={`text-xs ${mutedText}`}
                            >
                              Most spent category
                            </p>
                          </div>
                        </div>

                        <p className="font-bold text-emerald-500">
                          {formatCurrency(
                            highestCategory.amount
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span>💡</span>

                        <p
                          className={`text-xs font-semibold uppercase tracking-wider ${secondaryText}`}
                        >
                          Recommendation
                        </p>
                      </div>

                      <p
                        className={`text-sm leading-relaxed ${secondaryText}`}
                      >
                        Consider setting a budget for this category and reviewing these transactions regularly.
                      </p>
                    </div>

                    <Link
                      to="/ai-insights"
                      className="inline-flex items-center mt-5 text-sm text-emerald-500 hover:text-emerald-400"
                    >
                      Get detailed insights →
                    </Link>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <div className="text-4xl mb-3">
                      🤖
                    </div>

                    <p
                      className={`text-sm ${mutedText}`}
                    >
                      Add expenses to receive personalized insights.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* RECENT TRANSACTIONS */}

          <section
            className={`rounded-2xl border overflow-hidden mb-6 ${cardBg}`}
          >
            <div
              className={`p-6 border-b flex items-center justify-between ${divider}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${subtleBg}`}
                >
                  🧾
                </div>

                <div>
                  <h2
                    className={`font-semibold ${cardText}`}
                  >
                    Recent Transactions
                  </h2>

                  <p
                    className={`text-xs mt-1 ${mutedText}`}
                  >
                    Latest spending activity
                  </p>
                </div>
              </div>

              <Link
                to="/expenses"
                className="text-sm text-emerald-500 hover:text-emerald-400"
              >
                View All →
              </Link>
            </div>

            {recentExpenses.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-4xl mb-3">
                  🧾
                </div>

                <p className={mutedText}>
                  No transactions yet.
                </p>
              </div>
            ) : (
              <div
                className={`divide-y ${
                  darkMode
                    ? "divide-slate-800"
                    : "divide-slate-200"
                }`}
              >
                {recentExpenses.map((expense) => {
                  const icon =
                    expense.icon ||
                    getCategoryIcon(
                      expense.category
                    );

                  return (
                    <div
                      key={
                        expense._id ||
                        expense.id
                      }
                      className={`px-6 py-4 flex items-center justify-between transition ${
                        darkMode
                          ? "hover:bg-slate-800/30"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className={`w-11 h-11 shrink-0 rounded-xl border flex items-center justify-center text-lg ${
                            darkMode
                              ? "bg-slate-950 border-slate-800"
                              : "bg-slate-100 border-slate-200"
                          }`}
                        >
                          {icon}
                        </div>

                        <div className="min-w-0">
                          <p
                            className={`font-medium truncate ${cardText}`}
                          >
                            {expense.title}
                          </p>

                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-xs ${mutedText}`}
                            >
                              {expense.category}
                            </span>

                            <span
                              className={
                                darkMode
                                  ? "text-slate-700"
                                  : "text-slate-300"
                              }
                            >
                              •
                            </span>

                            <span
                              className={`text-xs ${mutedText}`}
                            >
                              {formatDate(
                                expense.date
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right ml-4">
                        <p className="font-semibold text-red-500">
                          -
                          {formatCurrency(
                            expense.amount
                          )}
                        </p>

                        <p
                          className={`text-[10px] uppercase tracking-wider mt-1 ${mutedText}`}
                        >
                          Expense
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* QUICK ACTIONS */}

          <section>
            <div className="mb-4">
              <h2
                className={`text-lg font-semibold ${cardText}`}
              >
                Quick Actions
              </h2>

              <p
                className={`text-sm mt-1 ${mutedText}`}
              >
                Manage your finances faster
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* ADD INCOME */}

              <button
                type="button"
                onClick={() =>
                  setShowIncomeModal(true)
                }
                className={`group text-left rounded-2xl border p-5 transition ${
                  darkMode
                    ? "border-slate-800 bg-slate-900 hover:border-emerald-500/30 hover:bg-emerald-500/5"
                    : "border-slate-200 bg-white hover:border-emerald-500/30 hover:bg-emerald-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-xl">
                    💵
                  </div>

                  <span className="text-slate-400 group-hover:text-emerald-500 transition">
                    →
                  </span>
                </div>

                <h3
                  className={`font-semibold mt-5 ${cardText}`}
                >
                  Add Income
                </h3>

                <p
                  className={`text-sm mt-1 ${mutedText}`}
                >
                  Record salary or other income.
                </p>

                <p className="text-sm text-emerald-500 mt-4">
                  Add now →
                </p>
              </button>

              {/* EXPENSES */}

              <Link
                to="/expenses"
                className={`group rounded-2xl border p-5 transition ${
                  darkMode
                    ? "border-slate-800 bg-slate-900 hover:border-red-500/30 hover:bg-red-500/5"
                    : "border-slate-200 bg-white hover:border-red-500/30 hover:bg-red-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center text-xl">
                    💳
                  </div>

                  <span className="text-slate-400 group-hover:text-red-500 transition">
                    →
                  </span>
                </div>

                <h3
                  className={`font-semibold mt-5 ${cardText}`}
                >
                  Manage Expenses
                </h3>

                <p
                  className={`text-sm mt-1 ${mutedText}`}
                >
                  Add and manage transactions.
                </p>

                <p className="text-sm text-red-500 mt-4">
                  Open expenses →
                </p>
              </Link>

              {/* ANALYTICS */}

              <Link
                to="/analytics"
                className={`group rounded-2xl border p-5 transition ${
                  darkMode
                    ? "border-slate-800 bg-slate-900 hover:border-blue-500/30 hover:bg-blue-500/5"
                    : "border-slate-200 bg-white hover:border-blue-500/30 hover:bg-blue-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-xl">
                    📊
                  </div>

                  <span className="text-slate-400 group-hover:text-blue-500 transition">
                    →
                  </span>
                </div>

                <h3
                  className={`font-semibold mt-5 ${cardText}`}
                >
                  View Analytics
                </h3>

                <p
                  className={`text-sm mt-1 ${mutedText}`}
                >
                  Understand your spending.
                </p>

                <p className="text-sm text-blue-500 mt-4">
                  Explore analytics →
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* ADD INCOME MODAL */}

      {showIncomeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-2xl border shadow-2xl ${cardBg}`}
          >
            <div
              className={`p-6 border-b flex items-center justify-between ${divider}`}
            >
              <div>
                <h2
                  className={`text-xl font-bold ${cardText}`}
                >
                  Add Income
                </h2>

                <p
                  className={`text-sm mt-1 ${mutedText}`}
                >
                  Record a new income source.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowIncomeModal(false)
                }
                className={`w-9 h-9 rounded-lg transition ${
                  darkMode
                    ? "text-slate-400 hover:bg-slate-800"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleAddIncome}
              className="p-6"
            >
              <div className="mb-4">
                <label
                  className={`block text-sm mb-2 ${secondaryText}`}
                >
                  Income Name
                </label>

                <input
                  name="title"
                  value={incomeForm.title}
                  onChange={handleIncomeChange}
                  type="text"
                  placeholder="e.g. Freelance Payment"
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition ${inputBg} ${inputBorder} ${cardText}`}
                />
              </div>

              <div className="mb-4">
                <label
                  className={`block text-sm mb-2 ${secondaryText}`}
                >
                  Amount
                </label>

                <input
                  name="amount"
                  value={incomeForm.amount}
                  onChange={handleIncomeChange}
                  type="number"
                  min="1"
                  placeholder="Enter amount"
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition ${inputBg} ${inputBorder} ${cardText}`}
                />
              </div>

              <div className="mb-4">
                <label
                  className={`block text-sm mb-2 ${secondaryText}`}
                >
                  Source
                </label>

                <select
                  name="source"
                  value={incomeForm.source}
                  onChange={handleIncomeChange}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition ${inputBg} ${inputBorder} ${cardText}`}
                >
                  <option>Salary</option>
                  <option>Freelance</option>
                  <option>Business</option>
                  <option>Investment</option>
                  <option>Gift</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="mb-6">
                <label
                  className={`block text-sm mb-2 ${secondaryText}`}
                >
                  Date
                </label>

                <input
                  name="date"
                  value={incomeForm.date}
                  onChange={handleIncomeChange}
                  type="date"
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition ${inputBg} ${inputBorder} ${cardText}`}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowIncomeModal(false)
                  }
                  className={`flex-1 py-3 rounded-xl border transition ${
                    darkMode
                      ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                      : "border-slate-300 text-slate-700 hover:bg-slate-100"
                  }`}
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

      {/* INCOME HISTORY MODAL */}

      {showIncomeList && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`w-full max-w-lg rounded-2xl border shadow-2xl ${cardBg}`}
          >
            <div
              className={`p-6 border-b flex items-center justify-between ${divider}`}
            >
              <div>
                <h2
                  className={`text-xl font-bold ${cardText}`}
                >
                  Income History
                </h2>

                <p
                  className={`text-sm mt-1 ${mutedText}`}
                >
                  Total:{" "}
                  {formatCurrency(totalIncome)}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowIncomeList(false)
                }
                className={`w-9 h-9 rounded-lg transition ${
                  darkMode
                    ? "text-slate-400 hover:bg-slate-800"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="max-h-96 overflow-y-auto space-y-3">
                {income.length === 0 ? (
                  <p
                    className={`text-center py-8 ${mutedText}`}
                  >
                    No income records.
                  </p>
                ) : (
                  income.map((item) => (
                    <div
                      key={item._id}
                      className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                        darkMode
                          ? "bg-slate-950 border-slate-800"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div>
                        <p
                          className={`font-medium ${cardText}`}
                        >
                          {item.title}
                        </p>

                        <p
                          className={`text-xs mt-1 ${mutedText}`}
                        >
                          {item.source}
                          {" • "}
                          {formatDate(
                            item.date
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-emerald-500">
                          +
                          {formatCurrency(
                            item.amount
                          )}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteIncome(
                              item._id
                            )
                          }
                          className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition"
                          title="Delete income"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowIncomeList(false);
                  setShowIncomeModal(true);
                }}
                className="w-full mt-5 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition"
              >
                + Add Another Income
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Dashboard;