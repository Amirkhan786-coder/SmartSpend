import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// =========================
// PUBLIC PAGES
// =========================
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// =========================
// PROTECTED PAGES
// =========================
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Budgets from "./pages/Budgets";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import AIInsights from "./pages/AIInsights";
import Developer from "./pages/Developer";

// =========================
// COMPONENTS
// =========================
import DashboardLayout from "./components/DashboardLayout";

// =========================
// CONTEXT PROVIDERS
// =========================
import { ExpenseProvider } from "./context/ExpenseContext";
import { IncomeProvider } from "./context/IncomeContext";
import { BudgetProvider } from "./context/BudgetContext";

// =========================
// PROTECTED ROUTE
// =========================
import ProtectedRoute from "./utils/ProtectedRoute";


// =====================================================
// PROTECTED LAYOUT
// =====================================================

function ProtectedLayout() {
  return (
    <IncomeProvider>
      <ExpenseProvider>
        <BudgetProvider>

          <DashboardLayout>

            <Routes>

              {/* DASHBOARD */}
              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              {/* EXPENSES */}
              <Route
                path="/expenses"
                element={<Expenses />}
              />

              {/* BUDGETS */}
              <Route
                path="/budgets"
                element={<Budgets />}
              />

              {/* ANALYTICS */}
              <Route
                path="/analytics"
                element={<Analytics />}
              />

              {/* SETTINGS */}
              <Route
                path="/settings"
                element={<Settings />}
              />

              {/* AI INSIGHTS */}
              <Route
                path="/ai-insights"
                element={<AIInsights />}
              />

              {/* DEVELOPER */}
              <Route
                path="/developer"
                element={<Developer />}
              />

              {/* UNKNOWN PROTECTED ROUTE */}
              <Route
                path="*"
                element={
                  <Navigate
                    to="/dashboard"
                    replace
                  />
                }
              />

            </Routes>

          </DashboardLayout>

        </BudgetProvider>
      </ExpenseProvider>
    </IncomeProvider>
  );
}


// =====================================================
// APP
// =====================================================

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Keep /register working too */}
        <Route
          path="/register"
          element={<Signup />}
        />


        {/* =========================
            PROTECTED ROUTES
        ========================= */}

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        />


        {/* =========================
            FALLBACK
        ========================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;

