import { useMemo, useState } from "react";
import { useBudgets } from "../context/BudgetContext";
import { useExpenses } from "../context/ExpenseContext";

function Budgets() {
  const {
    budgets,
    addBudget,
    updateBudget,
    deleteBudget,
    totalBudget,
    loading,
  } = useBudgets();

  const { expenses } = useExpenses();

  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    month: new Date().toISOString().slice(0, 7),
    icon: "💰",
  });

  // =========================
  // FORMAT CURRENCY
  // =========================

  const formatCurrency = (amount) => {
    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  // =========================
  // FORMAT MONTH
  // =========================

  const formatMonth = (month) => {
    if (!month) return "";

    const date = new Date(`${month}-01`);

    return date.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
  };

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // OPEN ADD MODAL
  // =========================

  const openAddModal = () => {
    setEditingBudget(null);

    setFormData({
      category: "",
      amount: "",
      month: new Date().toISOString().slice(0, 7),
      icon: "💰",
    });

    setShowModal(true);
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================

  const openEditModal = (budget) => {
    setEditingBudget(budget);

    setFormData({
      category: budget.category,
      amount: budget.amount,
      month: budget.month,
      icon: budget.icon || "💰",
    });

    setShowModal(true);
  };

  // =========================
  // ADD / UPDATE
  // =========================

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
      if (editingBudget) {
        await updateBudget(editingBudget._id, formData);
      } else {
        await addBudget(formData);
      }

      setShowModal(false);
      setEditingBudget(null);

      setFormData({
        category: "",
        amount: "",
        month: new Date().toISOString().slice(0, 7),
        icon: "💰",
      });
    } catch (error) {
      console.error("Budget save error:", error);
      alert("Failed to save budget.");
    }
  };

  // =========================
  // DELETE
  // =========================

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

  // =========================
  // CALCULATE SPENDING
  // =========================

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

  // =========================
  // BUDGET SUMMARY
  // =========================

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

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}

      <header className="h-16 border-b border-slate-800">
        <div className="h-full px-6 flex items-center justify-between">

          <div className="flex items-center gap-2">

            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
              💰
            </div>

            <span className="text-xl font-bold">
              Smart
              <span className="text-emerald-400">
                Spend
              </span>
            </span>

          </div>

          <div className="flex items-center gap-4">

            <button className="w-9 h-9 rounded-lg hover:bg-slate-900">
              🔔
            </button>

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

            <a
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              🏠 Dashboard
            </a>

            <a
              href="/expenses"
              className="flex items-center gap-3 px-3 py-3 mt-1 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              💳 Expenses
            </a>

            <a
              href="/analytics"
              className="flex items-center gap-3 px-3 py-3 mt-1 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              📊 Analytics
            </a>

            <a
              href="/budgets"
              className="flex items-center gap-3 px-3 py-3 mt-1 rounded-xl bg-emerald-500/10 text-emerald-400"
            >
              💰 Budgets
            </a>

            <a
              href="/ai-insights"
              className="flex items-center gap-3 px-3 py-3 mt-1 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              🤖 AI Insights
            </a>

            <div className="border-t border-slate-800 my-6" />

            <a
              href="/settings"
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              ⚙️ Settings
            </a>

            <a
              href="/"
              className="flex items-center gap-3 px-3 py-3 mt-1 rounded-xl text-red-400 hover:bg-red-500/10"
            >
              🚪 Logout
            </a>

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
                Budgets
              </h1>

              <p className="text-slate-400 mt-2">
                Set and manage your monthly spending limits.
              </p>

            </div>

            <button
              onClick={openAddModal}
              className="px-5 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition"
            >
              + Add Budget
            </button>

          </div>

          {/* TOTAL BUDGET */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <p className="text-sm text-slate-400">
                Total Budget
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {formatCurrency(totalBudget)}
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Across all categories
              </p>

            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <p className="text-sm text-slate-400">
                Total Spent
              </p>

              <h2 className="text-3xl font-bold mt-2 text-red-400">
                {formatCurrency(
                  budgetSummary.reduce(
                    (total, budget) =>
                      total + budget.spent,
                    0
                  )
                )}
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                From budget categories
              </p>

            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <p className="text-sm text-slate-400">
                Remaining Budget
              </p>

              <h2 className="text-3xl font-bold mt-2 text-emerald-400">
                {formatCurrency(
                  budgetSummary.reduce(
                    (total, budget) =>
                      total + budget.remaining,
                    0
                  )
                )}
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Available spending limit
              </p>

            </div>

          </div>

          {/* BUDGET LIST */}

          {loading ? (

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
              <p className="text-slate-400">
                Loading budgets...
              </p>
            </div>

          ) : budgets.length === 0 ? (

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">

              <div className="text-6xl mb-5">
                💰
              </div>

              <h2 className="text-xl font-semibold">
                No budgets yet
              </h2>

              <p className="text-slate-500 mt-2">
                Create your first budget to control your spending.
              </p>

              <button
                onClick={openAddModal}
                className="mt-6 px-5 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400"
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
                    className={`bg-slate-900 border rounded-2xl p-6 transition ${
                      isOverspent
                        ? "border-red-500/40"
                        : isWarning
                        ? "border-yellow-500/40"
                        : "border-slate-800 hover:border-emerald-500/30"
                    }`}
                  >

                    {/* TOP */}

                    <div className="flex items-start justify-between">

                      <div className="flex items-center gap-3">

                        <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-2xl">
                          {budget.icon || "💰"}
                        </div>

                        <div>

                          <h3 className="font-semibold text-lg">
                            {budget.category}
                          </h3>

                          <p className="text-xs text-slate-500 mt-1">
                            {formatMonth(budget.month)}
                          </p>

                        </div>

                      </div>

                      <span className="text-emerald-400 font-bold">
                        {formatCurrency(budget.limit)}
                      </span>

                    </div>

                    {/* SPENDING */}

                    <div className="mt-6">

                      <div className="flex justify-between text-sm mb-2">

                        <span className="text-slate-400">
                          Spent
                        </span>

                        <span
                          className={
                            isOverspent
                              ? "text-red-400 font-semibold"
                              : "text-slate-300"
                          }
                        >
                          {formatCurrency(budget.spent)}
                        </span>

                      </div>

                      <div className="h-3 bg-slate-800 rounded-full overflow-hidden">

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

                        <span className="text-xs text-slate-500">
                          {budget.percentage.toFixed(1)}% used
                        </span>

                        <span className="text-xs text-slate-500">
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

                        <p className="text-sm text-red-400 font-medium">
                          ⚠️ Over budget by{" "}
                          {formatCurrency(
                            Math.abs(budget.remaining)
                          )}
                        </p>

                      ) : isWarning ? (

                        <p className="text-sm text-yellow-400 font-medium">
                          ⚠️ You are close to your budget limit.
                        </p>

                      ) : (

                        <p className="text-sm text-emerald-400 font-medium">
                          ✓ Remaining{" "}
                          {formatCurrency(budget.remaining)}
                        </p>

                      )}

                    </div>

                    {/* ACTIONS */}

                    <div className="flex gap-3 mt-6">

                      <button
                        onClick={() =>
                          openEditModal(budget)
                        }
                        className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(budget._id)
                        }
                        className="flex-1 py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10"
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </main>

      </div>

      {/* ADD / EDIT MODAL */}

      {showModal && (

        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-5">

          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-xl font-bold">
                  {editingBudget
                    ? "Edit Budget"
                    : "Add Budget"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Set your spending limit.
                </p>

              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="w-9 h-9 rounded-lg text-slate-400 hover:bg-slate-800"
              >
                ✕
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="mb-4">

                <label className="block text-sm text-slate-300 mb-2">
                  Category
                </label>

                <input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Food, Transport"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                />

              </div>

              <div className="mb-4">

                <label className="block text-sm text-slate-300 mb-2">
                  Budget Amount
                </label>

                <input
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  type="number"
                  min="1"
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                />

              </div>

              <div className="mb-4">

                <label className="block text-sm text-slate-300 mb-2">
                  Month
                </label>

                <input
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  type="month"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-emerald-500"
                />

              </div>

              <div className="mb-6">

                <label className="block text-sm text-slate-300 mb-2">
                  Icon
                </label>

                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 outline-none focus:border-emerald-500"
                >
                  <option value="💰">💰 General</option>
                  <option value="🍔">🍔 Food</option>
                  <option value="🚌">🚌 Transport</option>
                  <option value="🛍️">🛍️ Shopping</option>
                  <option value="🏠">🏠 Housing</option>
                  <option value="🎓">🎓 Education</option>
                  <option value="💊">💊 Health</option>
                  <option value="🎮">🎮 Entertainment</option>
                </select>

              </div>

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400"
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

    </div>
  );
}

export default Budgets;

