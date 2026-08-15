const API_URL = "http://localhost:5000/api";

// =====================================
// GET LOGGED-IN USER ID
// =====================================

export function getUserId() {
  // 1. Direct userId
  const directUserId = localStorage.getItem("userId");

  if (directUserId && directUserId !== "null") {
    return directUserId;
  }

  // 2. smartSpendUser
  const savedUser = localStorage.getItem("smartSpendUser");

  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);

      const userId =
        user?.id ||
        user?._id;

      if (userId) {
        const id = String(userId);

        localStorage.setItem("userId", id);

        return id;
      }
    } catch (error) {
      console.error(
        "Invalid smartSpendUser:",
        error
      );
    }
  }

  // 3. Other possible keys
  const user_id =
    localStorage.getItem("user_id");

  if (
    user_id &&
    user_id !== "null"
  ) {
    localStorage.setItem(
      "userId",
      user_id
    );

    return user_id;
  }

  // 4. Old user key
  const user =
    localStorage.getItem("user");

  if (user) {
    try {
      const parsedUser =
        JSON.parse(user);

      const userId =
        parsedUser?.id ||
        parsedUser?._id;

      if (userId) {
        const id = String(userId);

        localStorage.setItem(
          "userId",
          id
        );

        return id;
      }
    } catch (error) {
      console.error(
        "Invalid user data:",
        error
      );
    }
  }

  return null;
}

// =====================================
// REQUIRE USER ID
// =====================================

export function requireUserId() {
  const userId = getUserId();

  if (!userId) {
    throw new Error(
      "Please login first. User ID not found."
    );
  }

  return userId;
}

// =====================================
// GENERIC REQUEST
// =====================================

async function request(
  endpoint,
  options = {}
) {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      headers: {
        "Content-Type":
          "application/json",
        ...(options.headers || {}),
      },
      ...options,
    }
  );

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        `API request failed: ${response.status}`
    );
  }

  return data;
}

// =====================================
// INCOME
// =====================================

export const getIncome = async () => {
  const userId = requireUserId();

  return request(
    `/income?userId=${encodeURIComponent(
      userId
    )}`
  );
};

export const addIncome = async (
  incomeData
) => {
  const userId = requireUserId();

  return request("/income", {
    method: "POST",
    body: JSON.stringify({
      ...incomeData,
      userId,
    }),
  });
};

export const updateIncome = async (
  id,
  incomeData
) => {
  const userId = requireUserId();

  return request(`/income/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      ...incomeData,
      userId,
    }),
  });
};

export const deleteIncome = async (
  id
) => {
  const userId = requireUserId();

  return request(`/income/${id}`, {
    method: "DELETE",
    body: JSON.stringify({
      userId,
    }),
  });
};

// =====================================
// EXPENSE
// =====================================

export const getExpenses = async () => {
  const userId = requireUserId();

  return request(
    `/expenses?userId=${encodeURIComponent(
      userId
    )}`
  );
};

export const addExpense = async (
  expenseData
) => {
  const userId = requireUserId();

  return request("/expenses", {
    method: "POST",
    body: JSON.stringify({
      ...expenseData,
      userId,
    }),
  });
};

export const updateExpense = async (
  id,
  expenseData
) => {
  const userId = requireUserId();

  return request(`/expenses/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      ...expenseData,
      userId,
    }),
  });
};

export const deleteExpense = async (
  id
) => {
  const userId = requireUserId();

  return request(`/expenses/${id}`, {
    method: "DELETE",
    body: JSON.stringify({
      userId,
    }),
  });
};

// =====================================
// BUDGET
// =====================================

export const getBudgets = async () => {
  const userId = requireUserId();

  return request(
    `/budgets?userId=${encodeURIComponent(
      userId
    )}`
  );
};

export const addBudget = async (
  budgetData
) => {
  const userId = requireUserId();

  return request("/budgets", {
    method: "POST",
    body: JSON.stringify({
      ...budgetData,
      userId,
    }),
  });
};

export const updateBudget = async (
  id,
  budgetData
) => {
  const userId = requireUserId();

  return request(`/budgets/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      ...budgetData,
      userId,
    }),
  });
};

export const deleteBudget = async (
  id
) => {
  const userId = requireUserId();

  return request(`/budgets/${id}`, {
    method: "DELETE",
    body: JSON.stringify({
      userId,
    }),
  });
};

// =====================================
// SETTINGS
// =====================================

export const getSettings = async (
  userId = null
) => {
  const id =
    userId || requireUserId();

  return request(
    `/settings/${encodeURIComponent(id)}`
  );
};

export const updateSettings = async (
  userId,
  settingsData
) => {
  const id =
    userId || requireUserId();

  return request(
    `/settings/${encodeURIComponent(id)}`,
    {
      method: "PUT",

      body: JSON.stringify({
        ...settingsData,
      }),
    }
  );
};

export const deleteSettings = async (
  userId = null
) => {
  const id =
    userId || requireUserId();

  return request(
    `/settings/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );
};