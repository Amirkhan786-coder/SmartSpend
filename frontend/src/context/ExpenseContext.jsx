import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getExpenses,
  addExpense as addExpenseAPI,
  deleteExpense as deleteExpenseAPI,
} from "../api";

const ExpenseContext = createContext();

const categoryIcons = {
  Food: "🍔",
  Transport: "🚌",
  Shopping: "🛒",
  Bills: "💡",
  Entertainment: "🎬",
  Health: "💊",
  Education: "📚",
  Other: "📦",
};

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================
  // LOAD EXPENSES
  // =====================================

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const data = await getExpenses();

        if (data.success) {
          const expensesWithIcons = (data.expenses || []).map(
            (expense) => ({
              ...expense,
              icon:
                expense.icon ||
                categoryIcons[expense.category] ||
                "📦",
            })
          );

          setExpenses(expensesWithIcons);
        }
      } catch (error) {
        console.error("Failed to load expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, []);

  // =====================================
  // ADD EXPENSE
  // =====================================

  const addExpense = async (expense) => {
    try {
      const expenseData = {
        title: expense.title,
        amount: Number(expense.amount),
        category: expense.category,
        date: expense.date,
        icon:
          expense.icon ||
          categoryIcons[expense.category] ||
          "📦",
      };

      const data = await addExpenseAPI(expenseData);

      if (data.success && data.expense) {
        const newExpense = {
          ...data.expense,
          icon:
            data.expense.icon ||
            categoryIcons[data.expense.category] ||
            "📦",
        };

        setExpenses((currentExpenses) => [
          newExpense,
          ...currentExpenses,
        ]);
      }

      return data;
    } catch (error) {
      console.error("Failed to add expense:", error);
      throw error;
    }
  };

  // =====================================
  // DELETE EXPENSE
  // =====================================

  const deleteExpense = async (id) => {
    try {
      const data = await deleteExpenseAPI(id);

      if (data.success) {
        setExpenses((currentExpenses) =>
          currentExpenses.filter(
            (expense) =>
              String(expense._id) !== String(id)
          )
        );
      }

      return data;
    } catch (error) {
      console.error("Failed to delete expense:", error);
      throw error;
    }
  };

  // =====================================
  // CLEAR ALL EXPENSES
  // =====================================

  const clearExpenses = async () => {
    try {
      await Promise.all(
        expenses.map((expense) =>
          deleteExpenseAPI(expense._id)
        )
      );

      setExpenses([]);
    } catch (error) {
      console.error(
        "Failed to clear expenses:",
        error
      );

      throw error;
    }
  };

  // =====================================
  // TOTAL EXPENSES
  // =====================================

  const totalExpenses = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount || 0),
    0
  );

  // =====================================
  // PROVIDER
  // =====================================

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        deleteExpense,
        clearExpenses,
        totalExpenses,
        loading,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

// =====================================
// CUSTOM HOOK
// =====================================

export function useExpenses() {
  const context = useContext(ExpenseContext);

  if (!context) {
    throw new Error(
      "useExpenses must be used inside ExpenseProvider"
    );
  }

  return context;
}