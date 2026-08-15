import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getBudgets,
  addBudget as addBudgetAPI,
  updateBudget as updateBudgetAPI,
  deleteBudget as deleteBudgetAPI,
} from "../api";

const BudgetContext = createContext();

export function BudgetProvider({ children }) {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // LOAD BUDGETS
  // =========================

  useEffect(() => {
    const loadBudgets = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getBudgets();

        console.log("Budgets Loaded:", data);

        if (data.success) {
          setBudgets(data.budgets || []);
        } else {
          setError(data.message || "Failed to load budgets.");
        }
      } catch (error) {
        console.error("Failed to load budgets:", error);

        setError(
          "Unable to connect to backend. Make sure server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBudgets();
  }, []);

  // =========================
  // ADD BUDGET
  // =========================

  const addBudget = async (newBudget) => {
    try {
      setError("");

      const budgetData = {
        category: newBudget.category?.trim(),
        amount: Number(newBudget.amount),
        month: newBudget.month,
        icon: newBudget.icon || "💰",
      };

      if (!budgetData.category) {
        throw new Error("Budget category is required.");
      }

      if (
        !budgetData.amount ||
        budgetData.amount <= 0
      ) {
        throw new Error("Budget amount must be greater than 0.");
      }

      const data = await addBudgetAPI(budgetData);

      console.log("Add Budget Response:", data);

      if (!data.success) {
        throw new Error(
          data.message || "Failed to add budget."
        );
      }

      if (data.budget) {
        setBudgets((currentBudgets) => [
          data.budget,
          ...currentBudgets,
        ]);
      }

      return data;
    } catch (error) {
      console.error("Failed to add budget:", error);

      setError(error.message || "Failed to add budget.");

      throw error;
    }
  };

  // =========================
  // UPDATE BUDGET
  // =========================

  const updateBudget = async (id, updatedBudget) => {
    try {
      setError("");

      if (!id) {
        throw new Error("Budget ID is missing.");
      }

      const budgetData = {
        category: updatedBudget.category?.trim(),
        amount: Number(updatedBudget.amount),
        month: updatedBudget.month,
        icon: updatedBudget.icon || "💰",
      };

      if (!budgetData.category) {
        throw new Error("Budget category is required.");
      }

      if (
        !budgetData.amount ||
        budgetData.amount <= 0
      ) {
        throw new Error("Budget amount must be greater than 0.");
      }

      const data = await updateBudgetAPI(
        id,
        budgetData
      );

      console.log(
        "Update Budget Response:",
        data
      );

      if (!data.success) {
        throw new Error(
          data.message || "Failed to update budget."
        );
      }

      if (data.budget) {
        setBudgets((currentBudgets) =>
          currentBudgets.map((budget) =>
            budget._id === id
              ? data.budget
              : budget
          )
        );
      }

      return data;
    } catch (error) {
      console.error(
        "Failed to update budget:",
        error
      );

      setError(
        error.message || "Failed to update budget."
      );

      throw error;
    }
  };

  // =========================
  // DELETE BUDGET
  // =========================

  const deleteBudget = async (id) => {
    try {
      setError("");

      if (!id) {
        throw new Error("Budget ID is missing.");
      }

      const data = await deleteBudgetAPI(id);

      console.log(
        "Delete Budget Response:",
        data
      );

      if (!data.success) {
        throw new Error(
          data.message || "Failed to delete budget."
        );
      }

      setBudgets((currentBudgets) =>
        currentBudgets.filter(
          (budget) => budget._id !== id
        )
      );

      return data;
    } catch (error) {
      console.error(
        "Failed to delete budget:",
        error
      );

      setError(
        error.message || "Failed to delete budget."
      );

      throw error;
    }
  };

  // =========================
  // TOTAL BUDGET
  // =========================

  const totalBudget = useMemo(() => {
    return budgets.reduce(
      (total, budget) =>
        total + Number(budget.amount || 0),
      0
    );
  }, [budgets]);

  // =========================
  // CONTEXT
  // =========================

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        addBudget,
        updateBudget,
        deleteBudget,
        totalBudget,
        loading,
        error,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

// =========================
// CUSTOM HOOK
// =========================

export function useBudgets() {
  const context = useContext(BudgetContext);

  if (!context) {
    throw new Error(
      "useBudgets must be used inside BudgetProvider"
    );
  }

  return context;
}