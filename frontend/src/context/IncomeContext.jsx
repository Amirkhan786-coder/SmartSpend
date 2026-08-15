import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getIncome,
  addIncome as addIncomeAPI,
  deleteIncome as deleteIncomeAPI,
} from "../api";

const IncomeContext = createContext();

export function IncomeProvider({ children }) {
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD INCOME FROM BACKEND
  // =========================
  useEffect(() => {
    const loadIncome = async () => {
      try {
        const data = await getIncome();

        if (data.success) {
          setIncome(data.incomes || []);
        }
      } catch (error) {
        console.error("Failed to load income:", error);
      } finally {
        setLoading(false);
      }
    };

    loadIncome();
  }, []);

  // =========================
  // ADD INCOME
  // =========================
  const addIncome = async (newIncome) => {
    try {
      const incomeData = {
        title: newIncome.title,
        amount: Number(newIncome.amount),
        source: newIncome.source,
        date: newIncome.date,
      };

      const data = await addIncomeAPI(incomeData);

      if (data.success) {
        setIncome((currentIncome) => [
          data.income,
          ...currentIncome,
        ]);
      }

      return data;
    } catch (error) {
      console.error("Failed to add income:", error);
      throw error;
    }
  };

  // =========================
  // DELETE INCOME
  // =========================
  const deleteIncome = async (id) => {
    try {
      const data = await deleteIncomeAPI(id);

      if (data.success) {
        setIncome((currentIncome) =>
          currentIncome.filter(
            (item) => item._id !== id
          )
        );
      }

      return data;
    } catch (error) {
      console.error("Failed to delete income:", error);
      throw error;
    }
  };

  // =========================
  // TOTAL INCOME
  // =========================
  const totalIncome = income.reduce(
    (total, item) =>
      total + Number(item.amount || 0),
    0
  );

  return (
    <IncomeContext.Provider
      value={{
        income,
        addIncome,
        deleteIncome,
        totalIncome,
        loading,
      }}
    >
      {children}
    </IncomeContext.Provider>
  );
}

// =========================
// CUSTOM HOOK
// =========================
export function useIncome() {
  const context = useContext(IncomeContext);

  if (!context) {
    throw new Error(
      "useIncome must be used inside IncomeProvider"
    );
  }

  return context;
}