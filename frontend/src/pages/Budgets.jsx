import { useEffect, useMemo, useState } from "react";

import { useBudgets } from "../context/BudgetContext";
import { useExpenses } from "../context/ExpenseContext";

function Budgets() {
  const {
    budgets = [],
    addBudget,
    updateBudget,
    deleteBudget,
    totalBudget = 0,
    loading,
  } = useBudgets();

  const { expenses = [] } = useExpenses();

  // =====================================================
  // THEME
  // =====================================================

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("smartSpendTheme") !== "light"
  );

  useEffect(() => {
    const syncTheme = () => {
      setDarkMode(
        localStorage.getItem("smartSpendTheme") !== "light"
      );
    };

    syncTheme();

    window.addEventListener("storage", syncTheme);

    const interval = setInterval(syncTheme, 300);

    return () => {
      window.removeEventListener("storage", syncTheme);
      clearInterval(interval);
    };
  }, []);

  // =====================================================
  // MODAL
  // =====================================================

  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  // =====================================================
  // FORM
  // =====================================================

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    month: new Date().toISOString().slice(0, 7),
    icon: "💰",
  });

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

  const inputBg = darkMode
    ? "bg-slate-950"
    : "bg-white";

  const inputBorder = darkMode
    ? "border-slate-700"
    : "border-slate-300";

  const progressBg = darkMode
    ? "bg-slate-800"
    : "bg-slate-200";

  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  // =====================================================
  // FORMAT MONTH
  // =====================================================

  const formatMonth = (month) => {
    if (!month) return "";

    const date = new Date(`${month}-01`);

    return date.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
  };

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setFormData({
      category: "",
      amount: "",
      month: new Date().toISOString().slice(0, 7),
      icon: "💰",
    });
  };

  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const openAddModal = () => {
    setEditingBudget(null);
    resetForm();
    setShowModal(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditModal = (budget) => {
    setEditingBudget(budget);

    setFormData({
      category: budget.category || "",
      amount: budget.amount || "",
      month: budget.month || "",
      icon: budget.icon || "💰",
    });

    setShowModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    setShowModal(false);
    setEditingBudget(null);
    resetForm();
  };

  // =====================================================
  // ADD / UPDATE BUDGET
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.category.trim() ||
      !formData.amount ||
      Number(formData.amount) <= 0 ||
      !formData.month
    ) {
      return;
    }

    try {
      const budgetData = {
        category: formData.category.trim(),
        amount: Number(formData.amount),
        month: formData.month,
        icon: formData.icon,
      };

      if (editingBudget) {
        await updateBudget(
          editingBudget._id,
          budgetData
        );
      } else {
        await addBudget(budgetData);
      }

      closeModal();
    } catch (error) {
      console.error("Budget save error:", error);
      alert("Failed to save budget.");
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this budget?"
    );

    if (!confirmDelete) return;

    try {
      await deleteBudget(id);
    } catch (error) {
      console.error("Delete budget error:", error);
      alert("Failed to delete budget.");
    }
  };

  // =====================================================
  // CALCULATE SPENDING
  // =====================================================

  const getBudgetSpending = (budget) => {
    const budgetCategory = budget.category
      ?.trim()
      .toLowerCase();

    const budgetMonth = budget.month;

    return expenses
      .filter((expense) => {
        const expenseCategory = expense.category
          ?.trim()
          .toLowerCase();

        const expenseMonth = expense.date
          ? expense.date.slice(0, 7)
          : "";

        return (
          expenseCategory === budgetCategory &&
          expenseMonth === budgetMonth
        );
      })
      .reduce(
        (total, expense) =>
          total + Number(expense.amount || 0),
        0
      );
  };

  // =====================================================
  // BUDGET SUMMARY
  // =====================================================

  const budgetSummary = useMemo(() => {
    return budgets.map((budget) => {
      const spent = getBudgetSpending(budget);
      const limit = Number(budget.amount || 0);

      const percentage =
        limit > 0 ? (spent / limit) * 100 : 0;

      const remaining = limit - spent;

      return {
        ...budget,
        spent,
        limit,
        percentage,
        remaining,
      };
    });
  }, [budgets, expenses]);

  // =====================================================
  // TOTAL SPENT
  // =====================================================

  const totalSpent = useMemo(() => {
    return budgetSummary.reduce(
      (total, budget) =>
        total + Number(budget.spent || 0),
      0
    );
  }, [budgetSummary]);

  // =====================================================
  // TOTAL REMAINING
  // =====================================================

  const totalRemaining = useMemo(() => {
    return budgetSummary.reduce(
      (total, budget) =>
        total + Number(budget.remaining || 0),
      0
    );
  }, [budgetSummary]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main
      className={`min-h-[calc(100vh-4rem)] transition-colors duration-300 ${pageBg}`}
    >
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">

            <div>
              <p className="text-sm text-emerald-500 font-medium mb-2">
                Financial Management
              </p>

              <h1
                className={`text-3xl md:text-4xl font-bold tracking-tight ${cardText}`}
              >
                Budgets
              </h1>

              <p
                className={`mt-2 ${secondaryText}`}
              >
                Set and manage your monthly spending limits.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="px-5 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition"
            >
              <span className="mr-1">+</span>
              Add Budget
            </button>

          </section>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

            {/* TOTAL BUDGET */}

            <div
              className={`rounded-2xl border p-6 transition-colors duration-300 ${cardBg}`}
            >
              <p className={`text-sm ${secondaryText}`}>
                Total Budget
              </p>

              <h2
                className={`text-3xl font-bold mt-3 ${cardText}`}
              >
                {formatCurrency(totalBudget)}
              </h2>

              <p
                className={`text-sm mt-2 ${mutedText}`}
              >
                Across all categories
              </p>
            </div>

            {/* TOTAL SPENT */}

            <div
              className={`rounded-2xl border p-6 transition-colors duration-300 ${cardBg}`}
            >
              <p className={`text-sm ${secondaryText}`}>
                Total Spent
              </p>

              <h2 className="text-3xl font-bold mt-3 text-red-500">
                {formatCurrency(totalSpent)}
              </h2>

              <p
                className={`text-sm mt-2 ${mutedText}`}
              >
                From budget categories
              </p>
            </div>

            {/* REMAINING */}

            <div
              className={`rounded-2xl border p-6 transition-colors duration-300 ${cardBg}`}
            >
              <p className={`text-sm ${secondaryText}`}>
                Remaining Budget
              </p>

              <h2
                className={`text-3xl font-bold mt-3 ${
                  totalRemaining >= 0
                    ? "text-emerald-500"
                    : "text-red-500"
                }`}
              >
                {formatCurrency(
                  Math.abs(totalRemaining)
                )}
              </h2>

              <p
                className={`text-sm mt-2 ${mutedText}`}
              >
                {totalRemaining >= 0
                  ? "Available spending limit"
                  : "Amount over budget"}
              </p>
            </div>

          </section>

          {/* =================================================
              BUDGET LIST
          ================================================= */}

          {loading ? (

            <div
              className={`rounded-2xl border p-10 text-center ${cardBg}`}
            >
              <p className={secondaryText}>
                Loading budgets...
              </p>
            </div>

          ) : budgets.length === 0 ? (

            <div
              className={`rounded-2xl border p-12 text-center ${cardBg}`}
            >
              <div className="text-6xl mb-5">
                💰
              </div>

              <h2
                className={`text-xl font-semibold ${cardText}`}
              >
                No budgets yet
              </h2>

              <p
                className={`mt-2 ${secondaryText}`}
              >
                Create your first budget to control your spending.
              </p>

              <button
                type="button"
                onClick={openAddModal}
                className="mt-6 px-5 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition"
              >
                + Create Budget
              </button>
            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              {budgetSummary.map((budget) => {

                const progressWidth = Math.min(
                  budget.percentage,
                  100
                );

                const isOverspent =
                  budget.percentage >= 100;

                const isWarning =
                  budget.percentage >= 80 &&
                  budget.percentage < 100;

                return (
                  <div
                    key={budget._id}
                    className={`rounded-2xl border p-6 transition ${
                      isOverspent
                        ? "border-red-500/40"
                        : isWarning
                        ? "border-yellow-500/40"
                        : darkMode
                        ? "border-slate-800 hover:border-emerald-500/30 bg-slate-900"
                        : "border-slate-200 hover:border-emerald-500/30 bg-white"
                    }`}
                  >

                    {/* TOP */}

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-center gap-3">

                        <div
                          className={`w-12 h-12 rounded-xl border flex items-center justify-center text-2xl ${
                            darkMode
                              ? "bg-slate-950 border-slate-800"
                              : "bg-slate-50 border-slate-200"
                          }`}
                        >
                          {budget.icon || "💰"}
                        </div>

                        <div>
                          <h3
                            className={`font-semibold text-lg ${cardText}`}
                          >
                            {budget.category}
                          </h3>

                          <p className={`text-xs mt-1 ${mutedText}`}>
                            {formatMonth(budget.month)}
                          </p>
                        </div>

                      </div>

                      <span className="text-emerald-500 font-bold whitespace-nowrap">
                        {formatCurrency(budget.limit)}
                      </span>

                    </div>

                    {/* SPENDING */}

                    <div className="mt-6">

                      <div className="flex justify-between text-sm mb-2">

                        <span className={secondaryText}>
                          Spent
                        </span>

                        <span
                          className={
                            isOverspent
                              ? "text-red-500 font-semibold"
                              : cardText
                          }
                        >
                          {formatCurrency(budget.spent)}
                        </span>

                      </div>

                      <div
                        className={`h-3 rounded-full overflow-hidden ${progressBg}`}
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isOverspent
                              ? "bg-red-500"
                              : isWarning
                              ? "bg-yellow-500"
                              : "bg-emerald-500"
                          }`}
                          style={{
                            width: `${progressWidth}%`,
                          }}
                        />
                      </div>

                      <div className="flex justify-between mt-2">

                        <span className={`text-xs ${mutedText}`}>
                          {budget.percentage.toFixed(1)}% used
                        </span>

                        <span className={`text-xs ${mutedText}`}>
                          Limit {formatCurrency(budget.limit)}
                        </span>

                      </div>

                    </div>

                    {/* STATUS */}

                    <div
                      className={`mt-5 p-3 rounded-xl border ${
                        isOverspent
                          ? "bg-red-500/10 border-red-500/20"
                          : isWarning
                          ? "bg-yellow-500/10 border-yellow-500/20"
                          : "bg-emerald-500/10 border-emerald-500/20"
                      }`}
                    >

                      {isOverspent ? (

                        <p className="text-sm text-red-500 font-medium">
                          ⚠️ Over budget by{" "}
                          {formatCurrency(
                            Math.abs(budget.remaining)
                          )}
                        </p>

                      ) : isWarning ? (

                        <p className="text-sm text-yellow-500 font-medium">
                          ⚠️ You are close to your budget limit.
                        </p>

                      ) : (

                        <p className="text-sm text-emerald-500 font-medium">
                          ✓ Remaining{" "}
                          {formatCurrency(budget.remaining)}
                        </p>

                      )}

                    </div>

                    {/* ACTIONS */}

                    <div className="flex gap-3 mt-6">

                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(budget)
                        }
                        className={`flex-1 py-2.5 rounded-xl border transition ${
                          darkMode
                            ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                            : "border-slate-300 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(budget._id)
                        }
                        className="flex-1 py-2.5 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition"
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </div>
      </div>

      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {showModal && (

        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-5">

          <div
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${cardBg}`}
          >

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2
                  className={`text-xl font-bold ${cardText}`}
                >
                  {editingBudget
                    ? "Edit Budget"
                    : "Add Budget"}
                </h2>

                <p
                  className={`text-sm mt-1 ${mutedText}`}
                >
                  Set your spending limit.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className={`w-9 h-9 rounded-lg text-lg transition ${
                  darkMode
                    ? "text-slate-400 hover:bg-slate-800"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              {/* CATEGORY */}

              <div className="mb-4">

                <label
                  className={`block text-sm mb-2 ${secondaryText}`}
                >
                  Category
                </label>

                <input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Food, Transport"
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition ${inputBg} ${inputBorder} ${cardText}`}
                />

              </div>

              {/* AMOUNT */}

              <div className="mb-4">

                <label
                  className={`block text-sm mb-2 ${secondaryText}`}
                >
                  Budget Amount
                </label>

                <input
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  type="number"
                  min="1"
                  placeholder="Enter amount"
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition ${inputBg} ${inputBorder} ${cardText}`}
                />

              </div>

              {/* MONTH */}

              <div className="mb-4">

                <label
                  className={`block text-sm mb-2 ${secondaryText}`}
                >
                  Month
                </label>

                <input
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  type="month"
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition ${inputBg} ${inputBorder} ${cardText}`}
                />

              </div>

              {/* ICON */}

              <div className="mb-6">

                <label
                  className={`block text-sm mb-2 ${secondaryText}`}
                >
                  Icon
                </label>

                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition ${inputBg} ${inputBorder} ${cardText}`}
                >
                  <option value="💰">
                    💰 General
                  </option>

                  <option value="🍔">
                    🍔 Food
                  </option>

                  <option value="🚌">
                    🚌 Transport
                  </option>

                  <option value="🛍️">
                    🛍️ Shopping
                  </option>

                  <option value="🏠">
                    🏠 Housing
                  </option>

                  <option value="🎓">
                    🎓 Education
                  </option>

                  <option value="💊">
                    💊 Health
                  </option>

                  <option value="🎮">
                    🎮 Entertainment
                  </option>

                </select>

              </div>

              {/* BUTTONS */}

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={closeModal}
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
                  {editingBudget
                    ? "Update Budget"
                    : "Add Budget"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </main>
  );
}

export default Budgets;