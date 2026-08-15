export function logout() {
  localStorage.removeItem("userId");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user");
  localStorage.removeItem("smartSpendUser");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("smartSpendRemember");
}

export function getCurrentUser() {
  const userId = localStorage.getItem("userId");
  const userData = localStorage.getItem("smartSpendUser");

  if (!userId || !userData) {
    return null;
  }

  try {
    const user = JSON.parse(userData);

    if (!user?.id || String(user.id) !== String(userId)) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return Boolean(getCurrentUser());
}