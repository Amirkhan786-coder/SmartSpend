import { useMemo } from "react";
import { useExpenses } from "../context/ExpenseContext";

function AIInsights() {
  const { expenses, loading, totalExpenses } = useExpenses();

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

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#07111f] text-white p-6 md:p-8">
        <div className="max-w-6xl mx-auto">

          <div className="animate-pulse">

            <div className="h-4 w-32 bg-slate-800 rounded mb-3" />

            <div className="h-10 w-64 bg-slate-800 rounded mb-3" />

            <div className="h-5 w-96 max-w-full bg-slate-800 rounded" />

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#07111f] text-white p-6 md:p-8">

      <div className="max-w-6xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">

          <p className="text-sm text-emerald-400 font-semibold tracking-wide">
            SMART ANALYSIS
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mt-2 text-white">
            AI Insights
          </h1>

          <p className="text-slate-400 mt-2">
            Intelligent analysis of your real spending data.
          </p>

        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {expenses.length === 0 ? (

          <div className="rounded-3xl border border-emerald-500/20 bg-[#0b1728] p-8 md:p-10">

            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-3xl mb-5">
              🤖
            </div>

            <h2 className="text-2xl font-bold text-white">
              SmartSpend AI
            </h2>

            <p className="text-slate-400 mt-3 max-w-xl leading-relaxed">
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

            <div className="rounded-3xl border border-emerald-500/20 bg-[#0b1728] p-6 md:p-8 mb-6">

              <div className="flex flex-col md:flex-row md:items-start gap-5">

                <div className="w-14 h-14 shrink-0 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-3xl">
                  🤖
                </div>

                <div>

                  <p className="text-sm text-emerald-400 font-semibold mb-1">
                    SMARTSPEND AI ANALYSIS
                  </p>

                  <h2 className="text-2xl font-bold text-white">
                    Your spending overview
                  </h2>

                  <p className="text-slate-400 mt-3 leading-relaxed">
                    {getInsightMessage()}
                  </p>

                </div>

              </div>

            </div>

            {/* =================================================
                STAT CARDS
            ================================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

              <div className="rounded-2xl border border-slate-800 bg-[#0b1728] p-5">

                <p className="text-sm text-slate-400">
                  Total Spending
                </p>

                <h3 className="text-2xl font-bold mt-2 text-white">
                  {formatCurrency(
                    totalExpenses || analysis.total
                  )}
                </h3>

              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#0b1728] p-5">

                <p className="text-sm text-slate-400">
                  Transactions
                </p>

                <h3 className="text-2xl font-bold mt-2 text-white">
                  {analysis.transactions}
                </h3>

              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#0b1728] p-5">

                <p className="text-sm text-slate-400">
                  Average Expense
                </p>

                <h3 className="text-2xl font-bold mt-2 text-white">
                  {formatCurrency(analysis.average)}
                </h3>

              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#0b1728] p-5">

                <p className="text-sm text-slate-400">
                  Highest Category
                </p>

                <h3 className="text-xl font-bold mt-2 text-white">
                  {analysis.highestCategory}
                </h3>

              </div>

            </div>

            {/* =================================================
                CATEGORY + RECOMMENDATIONS
            ================================================= */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* CATEGORY ANALYSIS */}

              <div className="rounded-3xl border border-slate-800 bg-[#0b1728] p-6">

                <div className="flex items-center justify-between mb-6">

                  <div>

                    <h2 className="text-xl font-bold text-white">
                      Spending by Category
                    </h2>

                    <p className="text-sm text-slate-400 mt-1">
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

                            <span className="font-medium text-white">
                              {category.name}
                            </span>

                          </div>

                          <div className="text-right">

                            <span className="font-semibold text-white">
                              {formatCurrency(
                                category.amount
                              )}
                            </span>

                            <span className="text-xs text-slate-400 ml-2">
                              {category.percentage.toFixed(
                                1
                              )}
                              %
                            </span>

                          </div>

                        </div>

                        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">

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

              <div className="rounded-3xl border border-slate-800 bg-[#0b1728] p-6">

                <div className="flex items-center justify-between mb-6">

                  <div>

                    <h2 className="text-xl font-bold text-white">
                      Smart Recommendations
                    </h2>

                    <p className="text-sm text-slate-400 mt-1">
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
                        className="rounded-2xl bg-[#101e31] border border-slate-800 p-4"
                      >

                        <div className="flex gap-3">

                          <div className="w-9 h-9 shrink-0 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            💡
                          </div>

                          <div>

                            <p className="font-semibold text-white">
                              {category.name}
                            </p>

                            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
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

              <div className="mt-6 rounded-3xl border border-amber-500/20 bg-[#17150d] p-6">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                  <div>

                    <p className="text-sm text-amber-400 font-semibold">
                      HIGHEST SINGLE EXPENSE
                    </p>

                    <h2 className="text-xl font-bold mt-1 text-white">
                      {analysis.highestExpense.icon || "💳"}{" "}
                      {analysis.highestExpense.title || "Expense"}
                    </h2>

                    <p className="text-sm text-slate-400 mt-1">
                      {analysis.highestExpense.category ||
                        "Other"}

                      {analysis.highestExpense.date
                        ? ` • ${new Date(
                            analysis.highestExpense.date
                          ).toLocaleDateString("en-IN")}`
                        : ""}
                    </p>

                  </div>

                  <div className="text-2xl font-bold text-white">
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

            <div className="mt-6 rounded-3xl border border-blue-500/20 bg-[#0b1728] p-6">

              <div className="flex gap-4">

                <div className="text-2xl">
                  🎯
                </div>

                <div>

                  <h3 className="font-bold text-white">
                    Smart Saving Tip
                  </h3>

                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">

                    Your largest spending category is{" "}

                    <span className="font-semibold text-emerald-400">
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