import { useMemo } from "react";
import { Link } from "react-router-dom";

import { useExpenses } from "../context/ExpenseContext";
import { useIncome } from "../context/IncomeContext";
import { useBudgets } from "../context/BudgetContext";

function Analytics() {
  const { expenses = [], totalExpenses = 0 } = useExpenses();
  const { income = [], totalIncome = 0 } = useIncome();
  const { budgets = [], totalBudget = 0 } = useBudgets();

  const balance = totalIncome - totalExpenses;

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const formatMonth = (month) => {
    if (!month) return "";

    return new Date(`${month}-01`).toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
  };

  // =========================
  // CATEGORY ANALYSIS
  // =========================

  const categoryData = useMemo(() => {
    const categories = {};

    expenses.forEach((expense) => {
      const category = expense.category || "Other";

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

  const highestCategory = categoryData[0] || null;

  // =========================
  // MONTHLY ANALYSIS
  // =========================

  const monthlyData = useMemo(() => {
    const months = {};

    expenses.forEach((expense) => {
      if (!expense.date) return;

      const month = expense.date.slice(0, 7);

      months[month] =
        (months[month] || 0) +
        Number(expense.amount || 0);
    });

    return Object.entries(months)
      .map(([month, amount]) => ({
        month,
        amount,
      }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 6);
  }, [expenses]);

  const highestSpendingMonth = monthlyData[0] || null;

  const maxMonthlyAmount = useMemo(() => {
    return Math.max(
      ...monthlyData.map((item) => item.amount),
      0
    );
  }, [monthlyData]);

  // =========================
  // BUDGET ANALYSIS
  // =========================

  const budgetAnalysis = useMemo(() => {
    return budgets.map((budget) => {
      const budgetAmount = Number(budget.amount || 0);

      const spent = expenses
        .filter((expense) => {
          const expenseCategory =
            expense.category?.trim().toLowerCase();

          const budgetCategory =
            budget.category?.trim().toLowerCase();

          const expenseMonth =
            expense.date?.slice(0, 7);

          return (
            expenseCategory === budgetCategory &&
            expenseMonth === budget.month
          );
        })
        .reduce(
          (total, expense) =>
            total + Number(expense.amount || 0),
          0
        );

      const percentage =
        budgetAmount > 0
          ? (spent / budgetAmount) * 100
          : 0;

      return {
        ...budget,
        amount: budgetAmount,
        spent,
        percentage,
        remaining: budgetAmount - spent,
      };
    });
  }, [budgets, expenses]);

  const totalBudgetSpent = useMemo(() => {
    return budgetAnalysis.reduce(
      (total, budget) =>
        total + Number(budget.spent || 0),
      0
    );
  }, [budgetAnalysis]);

  const totalBudgetRemaining =
    totalBudget - totalBudgetSpent;

  const overallBudgetUsed =
    totalBudget > 0
      ? (totalBudgetSpent / totalBudget) * 100
      : 0;

  // =========================
  // SAVING RATE
  // =========================

  const savingRate =
    totalIncome > 0
      ? ((totalIncome - totalExpenses) /
          totalIncome) *
        100
      : 0;

  // =========================
  // INSIGHT
  // =========================

  const insight = useMemo(() => {
    if (expenses.length === 0 && income.length === 0) {
      return "Start adding income and expenses to receive personalized financial insights.";
    }

    if (totalIncome === 0 && totalExpenses > 0) {
      return "You have recorded expenses but no income yet. Add your income to get a more complete financial picture.";
    }

    if (balance < 0) {
      return "Your expenses are currently higher than your income. Review your highest spending categories and consider reducing unnecessary expenses.";
    }

    if (overallBudgetUsed > 100) {
      return "Your spending has exceeded the total budget. Review the categories that are over their limits.";
    }

    if (overallBudgetUsed >= 80) {
      return "You have used more than 80% of your total budget. Keep an eye on your remaining spending limit.";
    }

    if (highestCategory) {
      return `Your highest spending category is ${highestCategory.category} with ${formatCurrency(
        highestCategory.amount
      )} spent.`;
    }

    return "Your financial activity is looking healthy. Keep tracking your income and expenses regularly.";
  }, [
    expenses.length,
    income.length,
    totalIncome,
    totalExpenses,
    balance,
    overallBudgetUsed,
    highestCategory,
  ]);

  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        text-slate-900
        dark:bg-[#07111f]
        dark:text-white
        transition-colors
        duration-300
      "
    >
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="mb-8">

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

          <div>

            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              Financial Management
            </p>

            <h1 className="text-3xl md:text-4xl font-bold mt-2 text-slate-900 dark:text-white">
              Analytics
            </h1>

            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Understand your financial activity and spending patterns.
            </p>

          </div>

          <Link
            to="/expenses"
            className="
              px-5 py-3
              rounded-xl
              bg-emerald-500
              text-slate-950
              font-semibold
              hover:bg-emerald-400
              transition
              text-center
            "
          >
            + Add Expense
          </Link>

        </div>

      </div>

      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

        {/* INCOME */}

        <div
          className="
            bg-white
            dark:bg-slate-900
            border
            border-slate-200
            dark:border-slate-800
            rounded-2xl
            p-6
            transition-colors
            duration-300
          "
        >

          <div className="flex justify-between">

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Income
            </p>

            <span className="text-xl">
              📈
            </span>

          </div>

          <h2 className="text-2xl font-bold mt-3 text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalIncome)}
          </h2>

          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            All recorded income
          </p>

        </div>

        {/* EXPENSE */}

        <div
          className="
            bg-white
            dark:bg-slate-900
            border
            border-slate-200
            dark:border-slate-800
            rounded-2xl
            p-6
            transition-colors
            duration-300
          "
        >

          <div className="flex justify-between">

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Expenses
            </p>

            <span className="text-xl">
              💸
            </span>

          </div>

          <h2 className="text-2xl font-bold mt-3 text-red-500 dark:text-red-400">
            {formatCurrency(totalExpenses)}
          </h2>

          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            All recorded expenses
          </p>

        </div>

        {/* BALANCE */}

        <div
          className="
            bg-white
            dark:bg-slate-900
            border
            border-slate-200
            dark:border-slate-800
            rounded-2xl
            p-6
            transition-colors
            duration-300
          "
        >

          <div className="flex justify-between">

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Current Balance
            </p>

            <span className="text-xl">
              💰
            </span>

          </div>

          <h2
            className={`text-2xl font-bold mt-3 ${
              balance >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-500 dark:text-red-400"
            }`}
          >
            {formatCurrency(balance)}
          </h2>

          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            Income minus expenses
          </p>

        </div>

        {/* SAVING RATE */}

        <div
          className="
            bg-white
            dark:bg-slate-900
            border
            border-slate-200
            dark:border-slate-800
            rounded-2xl
            p-6
            transition-colors
            duration-300
          "
        >

          <div className="flex justify-between">

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Saving Rate
            </p>

            <span className="text-xl">
              🏦
            </span>

          </div>

          <h2
            className={`text-2xl font-bold mt-3 ${
              savingRate >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-500 dark:text-red-400"
            }`}
          >
            {savingRate.toFixed(1)}%
          </h2>

          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            Based on income and expenses
          </p>

        </div>

      </div>

      {/* =========================
          INCOME VS EXPENSE + BUDGET
      ========================= */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">

        {/* INCOME VS EXPENSE */}

        <div
          className="
            bg-white
            dark:bg-slate-900
            border
            border-slate-200
            dark:border-slate-800
            rounded-2xl
            p-6
            transition-colors
            duration-300
          "
        >

          <div className="flex justify-between items-center mb-7">

            <div>

              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Income vs Expenses
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                Overall financial comparison
              </p>

            </div>

            <span className="text-2xl">
              📊
            </span>

          </div>

          <div className="space-y-7">

            {/* INCOME */}

            <div>

              <div className="flex justify-between mb-2">

                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Income
                </span>

                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(totalIncome)}
                </span>

              </div>

              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">

                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width:
                      totalIncome > 0
                        ? "100%"
                        : "0%",
                  }}
                />

              </div>

            </div>

            {/* EXPENSE */}

            <div>

              <div className="flex justify-between mb-2">

                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Expenses
                </span>

                <span className="text-sm font-semibold text-red-500 dark:text-red-400">
                  {formatCurrency(totalExpenses)}
                </span>

              </div>

              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">

                <div
                  className="h-full bg-red-500 rounded-full transition-all"
                  style={{
                    width:
                      totalIncome > 0
                        ? `${Math.min(
                            (totalExpenses /
                              totalIncome) *
                              100,
                            100
                          )}%`
                        : totalExpenses > 0
                        ? "100%"
                        : "0%",
                  }}
                />

              </div>

            </div>

          </div>

          <div
            className={`mt-6 p-4 rounded-xl border ${
              balance >= 0
                ? "bg-emerald-500/5 border-emerald-500/20"
                : "bg-red-500/5 border-red-500/20"
            }`}
          >

            <p className="text-xs text-slate-500 uppercase tracking-wider">
              Financial Status
            </p>

            <p
              className={`text-sm font-semibold mt-2 ${
                balance >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              {balance >= 0
                ? "✓ Income is higher than expenses"
                : "⚠ Expenses are higher than income"}
            </p>

          </div>

        </div>

        {/* BUDGET */}

        <div
          className="
            bg-white
            dark:bg-slate-900
            border
            border-slate-200
            dark:border-slate-800
            rounded-2xl
            p-6
            transition-colors
            duration-300
          "
        >

          <div className="flex justify-between items-center mb-7">

            <div>

              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Budget Usage
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Current budget performance
              </p>

            </div>

            <span className="text-2xl">
              💰
            </span>

          </div>

          <div className="flex justify-between mb-2">

            <span className="text-sm text-slate-500 dark:text-slate-400">
              {formatCurrency(totalBudgetSpent)} spent
            </span>

            <span
              className={`text-sm font-semibold ${
                overallBudgetUsed > 100
                  ? "text-red-500 dark:text-red-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {overallBudgetUsed.toFixed(1)}%
            </span>

          </div>

          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">

            <div
              className={`h-full rounded-full transition-all ${
                overallBudgetUsed > 100
                  ? "bg-red-500"
                  : "bg-emerald-500"
              }`}
              style={{
                width: `${Math.min(
                  overallBudgetUsed,
                  100
                )}%`,
              }}
            />

          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">

              <p className="text-xs text-slate-500">
                Total Budget
              </p>

              <p className="font-semibold mt-1 text-slate-900 dark:text-white">
                {formatCurrency(totalBudget)}
              </p>

            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">

              <p className="text-xs text-slate-500">
                Remaining
              </p>

              <p
                className={`font-semibold mt-1 ${
                  totalBudgetRemaining >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-500 dark:text-red-400"
                }`}
              >
                {totalBudgetRemaining >= 0
                  ? formatCurrency(totalBudgetRemaining)
                  : `-${formatCurrency(
                      Math.abs(totalBudgetRemaining)
                    )}`}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =========================
          CATEGORY + INSIGHT
      ========================= */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">

        {/* CATEGORY */}

        <div
          className="
            xl:col-span-2
            bg-white
            dark:bg-slate-900
            border
            border-slate-200
            dark:border-slate-800
            rounded-2xl
            p-6
            transition-colors
            duration-300
          "
        >

          <div className="flex justify-between mb-7">

            <div>

              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Spending by Category
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Where your money is going
              </p>

            </div>

            <span className="text-2xl">
              🏷️
            </span>

          </div>

          {categoryData.length === 0 ? (

            <div className="py-12 text-center">

              <div className="text-5xl mb-4">
                📊
              </div>

              <p className="text-slate-500 dark:text-slate-400">
                No spending data available.
              </p>

              <Link
                to="/expenses"
                className="inline-block mt-4 text-sm text-emerald-600 dark:text-emerald-400"
              >
                Add your first expense →
              </Link>

            </div>

          ) : (

            <div className="space-y-6">

              {categoryData.map((item) => {

                const percentage =
                  totalExpenses > 0
                    ? (item.amount /
                        totalExpenses) *
                      100
                    : 0;

                return (

                  <div key={item.category}>

                    <div className="flex justify-between mb-2">

                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {item.category}
                      </span>

                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(item.amount)}
                      </span>

                    </div>

                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                    <div className="flex justify-between mt-1">

                      <p className="text-xs text-slate-500">
                        {percentage.toFixed(1)}%
                      </p>

                      {item.category ===
                        highestCategory?.category && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400">
                          Highest
                        </span>
                      )}

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* INSIGHT */}

        <div
          className="
            bg-emerald-50
            dark:bg-gradient-to-br
            dark:from-emerald-500/10
            dark:to-slate-900
            border
            border-emerald-200
            dark:border-emerald-500/20
            rounded-2xl
            p-6
            transition-colors
            duration-300
          "
        >

          <div className="flex items-center gap-3 mb-6">

            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-2xl">
              🤖
            </div>

            <div>

              <h2 className="font-semibold text-slate-900 dark:text-white">
                Smart Insight
              </h2>

              <p className="text-xs text-slate-500">
                SmartSpend analysis
              </p>

            </div>

          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {insight}
          </p>

          {highestCategory && (

            <div className="mt-5 p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">

              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Highest Category
              </p>

              <p className="text-lg font-semibold mt-2 text-emerald-600 dark:text-emerald-400">
                {highestCategory.category}
              </p>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {formatCurrency(highestCategory.amount)}
              </p>

            </div>
          )}

          {highestSpendingMonth && (

            <div className="mt-3 p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">

              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Recent Highest Month
              </p>

              <p className="text-sm font-semibold mt-2 text-slate-900 dark:text-white">
                {formatMonth(highestSpendingMonth.month)}
              </p>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {formatCurrency(highestSpendingMonth.amount)}
              </p>

            </div>
          )}

        </div>

      </div>

      {/* =========================
          MONTHLY SPENDING
      ========================= */}

      <div
        className="
          bg-white
          dark:bg-slate-900
          border
          border-slate-200
          dark:border-slate-800
          rounded-2xl
          p-6
          mb-6
          transition-colors
          duration-300
        "
      >

        <div className="flex justify-between mb-7">

          <div>

            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Monthly Spending
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Recent expense activity
            </p>

          </div>

          <span className="text-2xl">
            📅
          </span>

        </div>

        {monthlyData.length === 0 ? (

          <div className="text-center py-10">

            <div className="text-5xl mb-3">
              📅
            </div>

            <p className="text-slate-500 dark:text-slate-400">
              No monthly data available.
            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {monthlyData.map((item) => {

              const percentage =
                maxMonthlyAmount > 0
                  ? (item.amount /
                      maxMonthlyAmount) *
                    100
                  : 0;

              return (

                <div key={item.month}>

                  <div className="flex justify-between mb-2">

                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {formatMonth(item.month)}
                    </span>

                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(item.amount)}
                    </span>

                  </div>

                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
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

      {/* =========================
          BUDGET PERFORMANCE
      ========================= */}

      <div
        className="
          bg-white
          dark:bg-slate-900
          border
          border-slate-200
          dark:border-slate-800
          rounded-2xl
          p-6
          transition-colors
          duration-300
        "
      >

        <div className="flex justify-between mb-6">

          <div>

            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Budget Performance
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Category-wise budget tracking
            </p>

          </div>

          <Link
            to="/budgets"
            className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-500"
          >
            Manage Budgets →
          </Link>

        </div>

        {budgetAnalysis.length === 0 ? (

          <div className="py-10 text-center">

            <div className="text-5xl mb-4">
              💰
            </div>

            <p className="text-slate-500 dark:text-slate-400">
              No budgets created yet.
            </p>

            <Link
              to="/budgets"
              className="inline-block mt-4 text-sm text-emerald-600 dark:text-emerald-400"
            >
              Create a budget →
            </Link>

          </div>

        ) : (

          <div className="space-y-5">

            {budgetAnalysis.map((budget) => (

              <div
                key={budget._id}
                className="
                  p-5
                  rounded-xl
                  bg-slate-50
                  dark:bg-slate-950
                  border
                  border-slate-200
                  dark:border-slate-800
                  transition-colors
                  duration-300
                "
              >

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">

                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-xl">
                      {budget.icon || "💰"}
                    </div>

                    <div>

                      <p className="font-semibold text-slate-900 dark:text-white">
                        {budget.category}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {formatMonth(budget.month)}
                      </p>

                    </div>

                  </div>

                  <div className="text-right">

                    <p
                      className={`font-semibold ${
                        budget.percentage > 100
                          ? "text-red-500 dark:text-red-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {budget.percentage.toFixed(1)}%
                    </p>

                    <p className="text-xs text-slate-500">
                      used
                    </p>

                  </div>

                </div>

                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">

                  <div
                    className={
                      budget.percentage > 100
                        ? "h-full bg-red-500 rounded-full"
                        : budget.percentage >= 80
                        ? "h-full bg-yellow-500 rounded-full"
                        : "h-full bg-emerald-500 rounded-full"
                    }
                    style={{
                      width: `${Math.min(
                        budget.percentage,
                        100
                      )}%`,
                    }}
                  />

                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-3 text-xs">

                  <span className="text-slate-500">
                    Spent{" "}
                    {formatCurrency(budget.spent)}
                    {" / "}
                    {formatCurrency(budget.amount)}
                  </span>

                  <span
                    className={
                      budget.remaining >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-500 dark:text-red-400"
                    }
                  >
                    {budget.remaining >= 0
                      ? `✓ Remaining ${formatCurrency(
                          budget.remaining
                        )}`
                      : `⚠ Over ${formatCurrency(
                          Math.abs(
                            budget.remaining
                          )
                        )}`}
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Analytics;