export const setAuthCookie = async (token: string, uid: string) => {
  const res = await fetch("/api/set-cookie", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, uid }),
  });

  if (!res.ok) {
    throw new Error("Failed to set auth cookie");
  }

  return res.json();
};

export async function clearAuthCookie() {
  try {
    const res = await fetch("/api/logout", {
      method: "POST",
      credentials: "include", // important to send cookies
    });

    if (!res.ok) {
      throw new Error("Failed to clear cookies");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error clearing auth cookies:", error);
    throw error;
  }
}
