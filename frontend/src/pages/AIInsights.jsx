import { useEffect, useMemo, useState } from "react";
import { useExpenses } from "../context/ExpenseContext";

function AIInsights() {
  const { expenses, loading, totalExpenses } = useExpenses();

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
  // ANALYSIS
  // =====================================================

  const analysis = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return {
        total: 0,
        transactions: 0,
        average: 0,
        highestCategory: "No data",
        highestCategoryAmount: 0,
        highestCategoryPercentage: 0,
        categories: [],
        highestExpense: null,
      };
    }

    const categoryTotals = {};

    expenses.forEach((expense) => {
      const category = expense.category || "Other";
      const amount = Number(expense.amount || 0);

      categoryTotals[category] =
        (categoryTotals[category] || 0) + amount;
    });

    const total = expenses.reduce(
      (sum, expense) =>
        sum + Number(expense.amount || 0),
      0
    );

    const categories = Object.entries(categoryTotals)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage:
          total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    const highestCategory = categories[0] || {
      name: "No data",
      amount: 0,
      percentage: 0,
    };

    const highestExpense = [...expenses].sort(
      (a, b) =>
        Number(b.amount || 0) -
        Number(a.amount || 0)
    )[0];

    return {
      total,
      transactions: expenses.length,
      average:
        expenses.length > 0
          ? total / expenses.length
          : 0,
      highestCategory: highestCategory.name,
      highestCategoryAmount: highestCategory.amount,
      highestCategoryPercentage:
        highestCategory.percentage,
      categories,
      highestExpense,
    };
  }, [expenses]);

  // =====================================================
  // HELPERS
  // =====================================================

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 0,
      }
    )}`;
  };

  const getInsightMessage = () => {
    if (!expenses || expenses.length === 0) {
      return "Add a few expenses to generate personalized spending insights.";
    }

    if (analysis.highestCategoryPercentage >= 50) {
      return `Your ${analysis.highestCategory} spending is taking a large share of your total expenses. Consider setting a dedicated limit for this category.`;
    }

    if (analysis.highestCategoryPercentage >= 35) {
      return `Your biggest spending area is ${analysis.highestCategory}. Keeping an eye on this category could help you save more.`;
    }

    return "Your spending is distributed across multiple categories. Continue tracking regularly to maintain better financial control.";
  };

  const getRecommendation = (category, percentage) => {
    if (percentage >= 50) {
      return `Consider reducing ${category} expenses and setting a monthly spending limit.`;
    }

    if (percentage >= 30) {
      return `Keep monitoring ${category} spending and compare it with your monthly budget.`;
    }

    return `${category} spending looks relatively controlled based on your current expense data.`;
  };

  const getCategoryIcon = (category) => {
    const name = category.toLowerCase();

    if (name.includes("food")) return "🍔";
    if (name.includes("transport")) return "🚌";
    if (name.includes("shopping")) return "🛒";
    if (name.includes("bill")) return "💡";
    if (name.includes("entertainment")) return "🎬";
    if (name.includes("health")) return "💊";
    if (name.includes("education")) return "📚";

    return "📦";
  };

  // =====================================================
  // THEME CLASSES
  // =====================================================

  const pageBg = darkMode
    ? "bg-[#07111f] text-white"
    : "bg-slate-50 text-slate-900";

  const cardBg = darkMode
    ? "bg-[#0b1728] border-slate-800"
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

  const progressBg = darkMode
    ? "bg-slate-800"
    : "bg-slate-200";

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div
        className={`min-h-[calc(100vh-4rem)] p-6 md:p-8 transition-colors duration-300 ${pageBg}`}
      >
        <div className="max-w-6xl mx-auto">

          <div className="animate-pulse">

            <div
              className={`h-4 w-32 rounded mb-3 ${
                darkMode
                  ? "bg-slate-800"
                  : "bg-slate-200"
              }`}
            />

            <div
              className={`h-10 w-64 rounded mb-3 ${
                darkMode
                  ? "bg-slate-800"
                  : "bg-slate-200"
              }`}
            />

            <div
              className={`h-5 w-96 max-w-full rounded ${
                darkMode
                  ? "bg-slate-800"
                  : "bg-slate-200"
              }`}
            />

          </div>

        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-[calc(100vh-4rem)] p-6 md:p-8 transition-colors duration-300 ${pageBg}`}
    >

      <div className="max-w-6xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">

          <p className="text-sm text-emerald-500 font-semibold tracking-wide">
            SMART ANALYSIS
          </p>

          <h1
            className={`text-3xl md:text-4xl font-bold mt-2 ${cardText}`}
          >
            AI Insights
          </h1>

          <p className={`mt-2 ${secondaryText}`}>
            Intelligent analysis of your real spending data.
          </p>

        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {expenses.length === 0 ? (

          <div
            className={`rounded-3xl border p-8 md:p-10 transition-colors duration-300 ${
              darkMode
                ? "border-emerald-500/20 bg-[#0b1728]"
                : "border-emerald-200 bg-white"
            }`}
          >

            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 ${
                darkMode
                  ? "bg-emerald-500/10"
                  : "bg-emerald-50"
              }`}
            >
              🤖
            </div>

            <h2
              className={`text-2xl font-bold ${cardText}`}
            >
              SmartSpend AI
            </h2>

            <p
              className={`mt-3 max-w-xl leading-relaxed ${secondaryText}`}
            >
              Your personalized insights will appear here after
              you add expenses. Add your spending data to see
              category analysis, spending patterns and
              recommendations.
            </p>

          </div>

        ) : (

          <>

            {/* =================================================
                AI SUMMARY
            ================================================= */}

            <div
              className={`rounded-3xl border p-6 md:p-8 mb-6 transition-colors duration-300 ${
                darkMode
                  ? "border-emerald-500/20 bg-[#0b1728]"
                  : "border-emerald-200 bg-white"
              }`}
            >

              <div className="flex flex-col md:flex-row md:items-start gap-5">

                <div
                  className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-3xl ${
                    darkMode
                      ? "bg-emerald-500/10"
                      : "bg-emerald-50"
                  }`}
                >
                  🤖
                </div>

                <div>

                  <p className="text-sm text-emerald-500 font-semibold mb-1">
                    SMARTSPEND AI ANALYSIS
                  </p>

                  <h2
                    className={`text-2xl font-bold ${cardText}`}
                  >
                    Your spending overview
                  </h2>

                  <p
                    className={`mt-3 leading-relaxed ${secondaryText}`}
                  >
                    {getInsightMessage()}
                  </p>

                </div>

              </div>

            </div>

            {/* =================================================
                STAT CARDS
            ================================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

              {/* TOTAL SPENDING */}

              <div
                className={`rounded-2xl border p-5 transition-colors duration-300 ${cardBg}`}
              >

                <p className={`text-sm ${secondaryText}`}>
                  Total Spending
                </p>

                <h3
                  className={`text-2xl font-bold mt-2 ${cardText}`}
                >
                  {formatCurrency(
                    totalExpenses || analysis.total
                  )}
                </h3>

              </div>

              {/* TRANSACTIONS */}

              <div
                className={`rounded-2xl border p-5 transition-colors duration-300 ${cardBg}`}
              >

                <p className={`text-sm ${secondaryText}`}>
                  Transactions
                </p>

                <h3
                  className={`text-2xl font-bold mt-2 ${cardText}`}
                >
                  {analysis.transactions}
                </h3>

              </div>

              {/* AVERAGE */}

              <div
                className={`rounded-2xl border p-5 transition-colors duration-300 ${cardBg}`}
              >

                <p className={`text-sm ${secondaryText}`}>
                  Average Expense
                </p>

                <h3
                  className={`text-2xl font-bold mt-2 ${cardText}`}
                >
                  {formatCurrency(analysis.average)}
                </h3>

              </div>

              {/* HIGHEST CATEGORY */}

              <div
                className={`rounded-2xl border p-5 transition-colors duration-300 ${cardBg}`}
              >

                <p className={`text-sm ${secondaryText}`}>
                  Highest Category
                </p>

                <h3
                  className={`text-xl font-bold mt-2 ${cardText}`}
                >
                  {analysis.highestCategory}
                </h3>

              </div>

            </div>

            {/* =================================================
                CATEGORY + RECOMMENDATIONS
            ================================================= */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* CATEGORY ANALYSIS */}

              <div
                className={`rounded-3xl border p-6 transition-colors duration-300 ${cardBg}`}
              >

                <div className="flex items-center justify-between mb-6">

                  <div>

                    <h2
                      className={`text-xl font-bold ${cardText}`}
                    >
                      Spending by Category
                    </h2>

                    <p
                      className={`text-sm mt-1 ${secondaryText}`}
                    >
                      Where your money is going
                    </p>

                  </div>

                  <span className="text-2xl">
                    📊
                  </span>

                </div>

                <div className="space-y-5">

                  {analysis.categories.map(
                    (category) => (

                      <div key={category.name}>

                        <div className="flex items-center justify-between mb-2">

                          <div className="flex items-center gap-2">

                            <span>
                              {getCategoryIcon(
                                category.name
                              )}
                            </span>

                            <span
                              className={`font-medium ${cardText}`}
                            >
                              {category.name}
                            </span>

                          </div>

                          <div className="text-right">

                            <span
                              className={`font-semibold ${cardText}`}
                            >
                              {formatCurrency(
                                category.amount
                              )}
                            </span>

                            <span
                              className={`text-xs ml-2 ${secondaryText}`}
                            >
                              {category.percentage.toFixed(
                                1
                              )}
                              %
                            </span>

                          </div>

                        </div>

                        <div
                          className={`h-2 rounded-full overflow-hidden ${progressBg}`}
                        >

                          <div
                            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                            style={{
                              width: `${Math.min(
                                category.percentage,
                                100
                              )}%`,
                            }}
                          />

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

              {/* RECOMMENDATIONS */}

              <div
                className={`rounded-3xl border p-6 transition-colors duration-300 ${cardBg}`}
              >

                <div className="flex items-center justify-between mb-6">

                  <div>

                    <h2
                      className={`text-xl font-bold ${cardText}`}
                    >
                      Smart Recommendations
                    </h2>

                    <p
                      className={`text-sm mt-1 ${secondaryText}`}
                    >
                      Suggestions based on your spending
                    </p>

                  </div>

                  <span className="text-2xl">
                    💡
                  </span>

                </div>

                <div className="space-y-4">

                  {analysis.categories
                    .slice(0, 4)
                    .map((category) => (

                      <div
                        key={category.name}
                        className={`rounded-2xl border p-4 transition-colors duration-300 ${
                          darkMode
                            ? "bg-[#101e31] border-slate-800"
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >

                        <div className="flex gap-3">

                          <div
                            className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${
                              darkMode
                                ? "bg-emerald-500/10"
                                : "bg-emerald-50"
                            }`}
                          >
                            💡
                          </div>

                          <div>

                            <p
                              className={`font-semibold ${cardText}`}
                            >
                              {category.name}
                            </p>

                            <p
                              className={`text-sm mt-1 leading-relaxed ${secondaryText}`}
                            >
                              {getRecommendation(
                                category.name,
                                category.percentage
                              )}
                            </p>

                          </div>

                        </div>

                      </div>

                    ))}

                </div>

              </div>

            </div>

            {/* =================================================
                HIGHEST EXPENSE
            ================================================= */}

            {analysis.highestExpense && (

              <div
                className={`mt-6 rounded-3xl border p-6 transition-colors duration-300 ${
                  darkMode
                    ? "border-amber-500/20 bg-[#17150d]"
                    : "border-amber-200 bg-amber-50"
                }`}
              >

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                  <div>

                    <p className="text-sm text-amber-500 font-semibold">
                      HIGHEST SINGLE EXPENSE
                    </p>

                    <h2
                      className={`text-xl font-bold mt-1 ${cardText}`}
                    >
                      {analysis.highestExpense.icon || "💳"}{" "}
                      {analysis.highestExpense.title || "Expense"}
                    </h2>

                    <p
                      className={`text-sm mt-1 ${secondaryText}`}
                    >
                      {analysis.highestExpense.category ||
                        "Other"}

                      {analysis.highestExpense.date
                        ? ` • ${new Date(
                            analysis.highestExpense.date
                          ).toLocaleDateString("en-IN")}`
                        : ""}
                    </p>

                  </div>

                  <div
                    className={`text-2xl font-bold ${cardText}`}
                  >
                    {formatCurrency(
                      analysis.highestExpense.amount
                    )}
                  </div>

                </div>

              </div>

            )}

            {/* =================================================
                FINAL TIP
            ================================================= */}

            <div
              className={`mt-6 rounded-3xl border p-6 transition-colors duration-300 ${
                darkMode
                  ? "border-blue-500/20 bg-[#0b1728]"
                  : "border-blue-200 bg-white"
              }`}
            >

              <div className="flex gap-4">

                <div className="text-2xl">
                  🎯
                </div>

                <div>

                  <h3
                    className={`font-bold ${cardText}`}
                  >
                    Smart Saving Tip
                  </h3>

                  <p
                    className={`text-sm mt-1 leading-relaxed ${secondaryText}`}
                  >
                    Your largest spending category is{" "}

                    <span className="font-semibold text-emerald-500">
                      {analysis.highestCategory}
                    </span>

                    . A practical starting point is to review
                    your recent transactions in this category
                    and set a realistic spending limit for the
                    next month.
                  </p>

                </div>

              </div>

            </div>

          </>
        )}

      </div>

    </div>
  );
}

export default AIInsights;