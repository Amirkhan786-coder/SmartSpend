import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useExpenses } from "../context/ExpenseContext";
import { getCurrentUser } from "../utils/auth";

function Expenses() {
  const {
    expenses = [],
    addExpense,
    deleteExpense,
    totalExpenses,
  } = useExpenses();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // =========================
  // CURRENT USER
  // =========================

  const currentUser = getCurrentUser();

  const userName =
    currentUser?.name ||
    currentUser?.username ||
    currentUser?.fullName ||
    currentUser?.email?.split("@")[0] ||
    "User";

  const userInitial =
    userName?.charAt(0)?.toUpperCase() || "U";

  // =========================
  // DEFAULT DATE
  // =========================

  const getToday = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: getToday(),
  });

  // =========================
  // FILTER EXPENSES
  // =========================

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch = String(
        expense.title || ""
      )
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        expense.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [expenses, search, category]);

  // =========================
  // FILTERED TOTAL
  // =========================

  const filteredTotal = filteredExpenses.reduce(
    (total, expense) =>
      total + Number(expense.amount || 0),
    0
  );

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // ADD EXPENSE
  // =========================

  const handleAddExpense = async (e) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.amount ||
      Number(form.amount) <= 0
    ) {
      return;
    }

    try {
      await addExpense({
        title: form.title.trim(),
        amount: Number(form.amount),
        category: form.category,
        date: form.date,
        icon: "",
      });

      setForm({
        title: "",
        amount: "",
        category: "Food",
        date: getToday(),
      });

      setShowModal(false);
    } catch (error) {
      console.error(
        "Failed to add expense:",
        error
      );
    }
  };

  // =========================
  // DELETE EXPENSE
  // =========================

  const handleDeleteExpense = async (id) => {
    if (!id) {
      console.error("Expense ID missing");
      return;
    }

    try {
      setDeletingId(id);

      console.log(
        "Deleting expense:",
        id
      );

      const result = await deleteExpense(id);

      console.log(
        "Delete result:",
        result
      );
    } catch (error) {
      console.error(
        "Delete expense failed:",
        error
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // FORMAT DATE
  // =========================

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
          NAVBAR
      ========================= */}

      <header
        className="
          h-16
          border-b
          border-slate-200
          dark:border-slate-800
          bg-white
          dark:bg-[#07111f]
          transition-colors
          duration-300
        "
      >

        <div className="h-full px-6 flex items-center justify-between">

          {/* LOGO */}

          <Link
            to="/dashboard"
            className="flex items-center"
          >
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              Smart
              <span className="text-emerald-500 dark:text-emerald-400">
                Spend
              </span>
            </span>
          </Link>

          {/* RIGHT SIDE */}

          <div className="flex items-center gap-4">

            {/* NOTIFICATION */}

            <button
              type="button"
              className="
                w-9
                h-9
                rounded-lg
                flex
                items-center
                justify-center
                text-xl
                text-slate-500
                dark:text-slate-400
                hover:bg-slate-100
                dark:hover:bg-slate-900
                transition
              "
              title="Notifications"
            >
              🔔
            </button>

            {/* USER AVATAR */}

            <div
              className="
                w-9
                h-9
                rounded-full
                bg-emerald-500
                text-slate-950
                flex
                items-center
                justify-center
                font-bold
              "
              title={userName}
            >
              {userInitial}
            </div>

          </div>

        </div>

      </header>

      <div className="flex">

        {/* =========================
            SIDEBAR
        ========================= */}

        <aside
          className="
            hidden
            md:block
            w-64
            min-h-[calc(100vh-4rem)]
            border-r
            border-slate-200
            dark:border-slate-800
            bg-white
            dark:bg-[#07111f]
            transition-colors
            duration-300
          "
        >

          <div className="p-4">

            <p
              className="
                px-3
                mb-3
                text-xs
                uppercase
                tracking-wider
                text-slate-500
                font-semibold
              "
            >
              Main Menu
            </p>

            <Link
              to="/dashboard"
              className="
                flex
                items-center
                px-3
                py-3
                rounded-xl
                text-slate-500
                dark:text-slate-400
                hover:bg-slate-100
                dark:hover:bg-slate-900
                hover:text-slate-900
                dark:hover:text-white
                transition
              "
            >
              <span>
                Dashboard
              </span>
            </Link>

            <Link
              to="/expenses"
              className="
                flex
                items-center
                px-3
                py-3
                mt-1
                rounded-xl
                bg-emerald-500/10
                text-emerald-600
                dark:text-emerald-400
              "
            >
              <span className="font-medium">
                Expenses
              </span>
            </Link>

            <Link
              to="/analytics"
              className="
                flex
                items-center
                px-3
                py-3
                mt-1
                rounded-xl
                text-slate-500
                dark:text-slate-400
                hover:bg-slate-100
                dark:hover:bg-slate-900
                hover:text-slate-900
                dark:hover:text-white
                transition
              "
            >
              <span>
                Analytics
              </span>
            </Link>

            <Link
              to="/budgets"
              className="
                flex
                items-center
                px-3
                py-3
                mt-1
                rounded-xl
                text-slate-500
                dark:text-slate-400
                hover:bg-slate-100
                dark:hover:bg-slate-900
                hover:text-slate-900
                dark:hover:text-white
                transition
              "
            >
              <span>
                Budgets
              </span>
            </Link>

            <Link
              to="/ai-insights"
              className="
                flex
                items-center
                px-3
                py-3
                mt-1
                rounded-xl
                text-slate-500
                dark:text-slate-400
                hover:bg-slate-100
                dark:hover:bg-slate-900
                hover:text-slate-900
                dark:hover:text-white
                transition
              "
            >
              <span>
                AI Insights
              </span>
            </Link>

            <div
              className="
                border-t
                border-slate-200
                dark:border-slate-800
                my-6
              "
            />

            <Link
              to="/settings"
              className="
                flex
                items-center
                px-3
                py-3
                rounded-xl
                text-slate-500
                dark:text-slate-400
                hover:bg-slate-100
                dark:hover:bg-slate-900
                hover:text-slate-900
                dark:hover:text-white
                transition
              "
            >
              <span>
                Settings
              </span>
            </Link>

            <Link
              to="/"
              className="
                flex
                items-center
                px-3
                py-3
                mt-1
                rounded-xl
                text-red-500
                dark:text-red-400
                hover:bg-red-500/10
                transition
              "
            >
              <span>
                Logout
              </span>
            </Link>

          </div>

        </aside>

        {/* =========================
            MAIN CONTENT
        ========================= */}

        <main className="flex-1 p-6 md:p-8">

          {/* PAGE HEADER */}

          <div
            className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-5
              mb-8
            "
          >

            <div>

              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                Financial Management
              </p>

              <h1
                className="
                  text-3xl
                  md:text-4xl
                  font-bold
                  mt-2
                  text-slate-900
                  dark:text-white
                "
              >
                Expenses
              </h1>

              <p className="text-slate-500 dark:text-slate-400 mt-2">
                Track and manage your spending.
              </p>

            </div>

            <button
              onClick={() =>
                setShowModal(true)
              }
              className="
                px-5
                py-3
                rounded-xl
                bg-emerald-500
                text-slate-950
                font-semibold
                hover:bg-emerald-400
                transition
              "
            >
              + Add Expense
            </button>

          </div>

          {/* =========================
              SUMMARY
          ========================= */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

            <div
              className="
                bg-white
                dark:bg-slate-900
                border
                border-slate-200
                dark:border-slate-800
                rounded-2xl
                p-5
                transition-colors
                duration-300
              "
            >

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Expenses
              </p>

              <h2 className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">
                ₹
                {Number(
                  totalExpenses || 0
                ).toLocaleString("en-IN")}
              </h2>

            </div>

            <div
              className="
                bg-white
                dark:bg-slate-900
                border
                border-slate-200
                dark:border-slate-800
                rounded-2xl
                p-5
                transition-colors
                duration-300
              "
            >

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Transactions
              </p>

              <h2 className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">
                {expenses.length}
              </h2>

            </div>

            <div
              className="
                bg-white
                dark:bg-slate-900
                border
                border-slate-200
                dark:border-slate-800
                rounded-2xl
                p-5
                transition-colors
                duration-300
              "
            >

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Current View
              </p>

              <h2 className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">
                ₹
                {filteredTotal.toLocaleString(
                  "en-IN"
                )}
              </h2>

            </div>

          </div>

          {/* =========================
              SEARCH + FILTER
          ========================= */}

          <div
            className="
              bg-white
              dark:bg-slate-900
              border
              border-slate-200
              dark:border-slate-800
              rounded-2xl
              p-5
              mb-6
              transition-colors
              duration-300
            "
          >

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <input
                type="text"
                placeholder="Search expenses..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="
                  md:col-span-2
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  bg-slate-50
                  dark:bg-slate-950
                  border
                  border-slate-300
                  dark:border-slate-700
                  text-slate-900
                  dark:text-white
                  placeholder-slate-400
                  dark:placeholder-slate-500
                  outline-none
                  focus:border-emerald-500
                "
              />

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  bg-slate-50
                  dark:bg-slate-950
                  border
                  border-slate-300
                  dark:border-slate-700
                  text-slate-700
                  dark:text-slate-300
                  outline-none
                  focus:border-emerald-500
                "
              >

                <option value="All">
                  All Categories
                </option>

                <option value="Food">
                  Food
                </option>

                <option value="Transport">
                  Transport
                </option>

                <option value="Shopping">
                  Shopping
                </option>

                <option value="Bills">
                  Bills
                </option>

                <option value="Entertainment">
                  Entertainment
                </option>

                <option value="Health">
                  Health
                </option>

                <option value="Education">
                  Education
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

          </div>

          {/* =========================
              EXPENSE LIST
          ========================= */}

          <div
            className="
              bg-white
              dark:bg-slate-900
              border
              border-slate-200
              dark:border-slate-800
              rounded-2xl
              overflow-hidden
              transition-colors
              duration-300
            "
          >

            <div className="p-6 border-b border-slate-200 dark:border-slate-800">

              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Expense History
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {filteredExpenses.length}{" "}
                transaction(s) found
              </p>

            </div>

            {filteredExpenses.length === 0 ? (

              <div className="p-12 text-center">

                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  No expenses found
                </h3>

                <p className="text-slate-500 dark:text-slate-400 mt-2">
                  Try changing your search or category
                  filter.
                </p>

              </div>

            ) : (

              <div className="divide-y divide-slate-200 dark:divide-slate-800">

                {filteredExpenses.map(
                  (expense) => (

                    <div
                      key={expense._id}
                      className="
                        p-5
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        justify-between
                        gap-4
                        hover:bg-slate-50
                        dark:hover:bg-slate-800/30
                        transition
                      "
                    >

                      <div className="flex items-center gap-4">

                        <div
                          className="
                            w-12
                            h-12
                            rounded-xl
                            bg-slate-100
                            dark:bg-slate-950
                            border
                            border-slate-200
                            dark:border-slate-800
                            flex
                            items-center
                            justify-center
                          "
                        />

                        <div>

                          <h3 className="font-medium text-slate-900 dark:text-white">
                            {expense.title}
                          </h3>

                          <div className="flex items-center gap-2 mt-1">

                            <span
                              className="
                                text-xs
                                px-2
                                py-1
                                rounded-md
                                bg-slate-100
                                dark:bg-slate-800
                                text-slate-500
                                dark:text-slate-400
                              "
                            >
                              {expense.category}
                            </span>

                            <span className="text-xs text-slate-500">
                              {formatDate(
                                expense.date
                              )}
                            </span>

                          </div>

                        </div>

                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-5">

                        <span className="font-semibold text-red-500 dark:text-red-400">
                          -₹
                          {Number(
                            expense.amount || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </span>

                        <button
                          onClick={() =>
                            handleDeleteExpense(
                              expense._id
                            )
                          }
                          disabled={
                            deletingId ===
                            expense._id
                          }
                          className="
                            px-3
                            py-2
                            rounded-lg
                            text-red-500
                            dark:text-red-400
                            border
                            border-red-500/20
                            hover:bg-red-500/10
                            transition
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                          "
                          title="Delete expense"
                        >
                          {deletingId ===
                          expense._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </main>

      </div>

      {/* =========================
          ADD EXPENSE MODAL
      ========================= */}

      {showModal && (

        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/70
            backdrop-blur-sm
            flex
            items-center
            justify-center
            px-5
          "
        >

          <div
            className="
              w-full
              max-w-md
              bg-white
              dark:bg-slate-900
              border
              border-slate-200
              dark:border-slate-800
              rounded-2xl
              p-6
              shadow-2xl
            "
          >

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Add Expense
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Add a new transaction.
                </p>

              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="
                  px-3
                  py-2
                  rounded-lg
                  text-slate-500
                  dark:text-slate-400
                  hover:bg-slate-100
                  dark:hover:bg-slate-800
                  hover:text-slate-900
                  dark:hover:text-white
                "
              >
                Close
              </button>

            </div>

            <form onSubmit={handleAddExpense}>

              {/* EXPENSE NAME */}

              <div className="mb-4">

                <label className="block text-sm text-slate-600 dark:text-slate-300 mb-2">
                  Expense Name
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Grocery Shopping"
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    bg-slate-50
                    dark:bg-slate-950
                    border
                    border-slate-300
                    dark:border-slate-700
                    text-slate-900
                    dark:text-white
                    placeholder-slate-400
                    dark:placeholder-slate-500
                    outline-none
                    focus:border-emerald-500
                  "
                />

              </div>

              {/* AMOUNT */}

              <div className="mb-4">

                <label className="block text-sm text-slate-600 dark:text-slate-300 mb-2">
                  Amount
                </label>

                <input
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  type="number"
                  min="1"
                  placeholder="Enter amount"
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    bg-slate-50
                    dark:bg-slate-950
                    border
                    border-slate-300
                    dark:border-slate-700
                    text-slate-900
                    dark:text-white
                    placeholder-slate-400
                    dark:placeholder-slate-500
                    outline-none
                    focus:border-emerald-500
                  "
                />

              </div>

              {/* CATEGORY */}

              <div className="mb-4">

                <label className="block text-sm text-slate-600 dark:text-slate-300 mb-2">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    bg-slate-50
                    dark:bg-slate-950
                    border
                    border-slate-300
                    dark:border-slate-700
                    text-slate-700
                    dark:text-slate-300
                    outline-none
                    focus:border-emerald-500
                  "
                >

                  <option value="Food">
                    Food
                  </option>

                  <option value="Transport">
                    Transport
                  </option>

                  <option value="Shopping">
                    Shopping
                  </option>

                  <option value="Bills">
                    Bills
                  </option>

                  <option value="Entertainment">
                    Entertainment
                  </option>

                  <option value="Health">
                    Health
                  </option>

                  <option value="Education">
                    Education
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              {/* DATE */}

              <div className="mb-6">

                <label className="block text-sm text-slate-600 dark:text-slate-300 mb-2">
                  Date
                </label>

                <input
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  type="date"
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    bg-slate-50
                    dark:bg-slate-950
                    border
                    border-slate-300
                    dark:border-slate-700
                    text-slate-900
                    dark:text-white
                    outline-none
                    focus:border-emerald-500
                  "
                />

              </div>

              {/* BUTTONS */}

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="
                    flex-1
                    py-3
                    rounded-xl
                    border
                    border-slate-300
                    dark:border-slate-700
                    text-slate-600
                    dark:text-slate-300
                    hover:bg-slate-100
                    dark:hover:bg-slate-800
                    transition
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                    flex-1
                    py-3
                    rounded-xl
                    bg-emerald-500
                    text-slate-950
                    font-semibold
                    hover:bg-emerald-400
                    transition
                  "
                >
                  Add Expense
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Expenses;