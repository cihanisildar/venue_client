export const logout = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/auth/logout", {
      method: "POST",
      credentials: "include", // Important for cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Logout failed");
    }

    // Clear any client-side state here
    // For example:
    // - Clear Redux store
    // store.dispatch(clearUserState());
    
    // - Clear local storage if you have any auth-related data
    // localStorage.removeItem('user-preferences');
    
    // - Clear any other client-side state
    // sessionStorage.clear();

    // Optionally redirect to login page
    // window.location.href = '/login';
    
    return await response.json();
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};